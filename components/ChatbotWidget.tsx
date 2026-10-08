'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, AudioLines, Bot, LoaderCircle, Mail, Mic, MicOff, Phone, Send, Trash2, X } from 'lucide-react';
import { Modality } from '@google/genai';
import type { LiveServerMessage, Session } from '@google/genai';
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb';

type ChatMember = {
  id: string;
  name: string;
  company: string;
  designation: string | null;
  category: string | null;
  bio: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  members?: ChatMember[];
  sources?: Array<{ id: string; title: string; href: string }>;
};

const STORAGE_KEY = 'edge-india-chat-history-v1';
const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi! I’m the Edge India Chatbot. Ask me about the community or find a member or company.',
};

function safeWebsite(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const [chatMode, setChatMode] = useState<'text' | 'voice'>('text');
  const [isSending, setIsSending] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'listening' | 'error'>('idle');
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [voiceError, setVoiceError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef<Session | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackTimeRef = useRef(0);
  const voiceTranscriptRef = useRef('');
  const messagesRef = useRef(messages);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.content === 'string' && (item.role === 'user' || item.role === 'assistant'))) {
          setMessages(parsed.slice(-25));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHasLoadedHistory(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedHistory) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-25)));
    } catch {
      // Chat remains usable if the browser blocks local storage.
    }
  }, [hasLoadedHistory, messages]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [isOpen, messages, isSending]);

  const clearConversation = () => setMessages([welcomeMessage]);

  const stopVoice = () => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    sessionRef.current?.close();
    sessionRef.current = null;
    const audioContext = audioContextRef.current;
    audioContextRef.current = null;
    if (audioContext && audioContext.state !== 'closed') void audioContext.close();
    playbackTimeRef.current = 0;
    setVoiceLevel(0);
    setVoiceStatus('idle');
  };

  useEffect(() => () => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    sessionRef.current?.close();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') void audioContextRef.current.close();
  }, []);

  const handleVoiceMessage = async (message: LiveServerMessage) => {
    const session = sessionRef.current;
    if (message.serverContent?.interrupted) playbackTimeRef.current = 0;

    for (const part of message.serverContent?.modelTurn?.parts ?? []) {
      const audio = part.inlineData;
      if (!audio?.data || !audio.mimeType?.startsWith('audio/pcm')) continue;
      const context = audioContextRef.current;
      if (!context) continue;
      const sampleRate = Number(audio.mimeType.match(/rate=(\d+)/)?.[1] ?? 24000);
      const binary = atob(audio.data);
      const sampleCount = Math.floor(binary.length / 2);
      const buffer = context.createBuffer(1, sampleCount, sampleRate);
      const channel = buffer.getChannelData(0);
      const view = new DataView(Uint8Array.from(binary, (char) => char.charCodeAt(0)).buffer);
      for (let index = 0; index < sampleCount; index += 1) channel[index] = view.getInt16(index * 2, true) / 32768;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      const startAt = Math.max(context.currentTime, playbackTimeRef.current);
      source.start(startAt);
      playbackTimeRef.current = startAt + buffer.duration;
    }

    const inputText = message.serverContent?.inputTranscription?.text?.trim();
    if (inputText) voiceTranscriptRef.current = inputText;

    const calls = message.toolCall?.functionCalls ?? [];
    if (calls.length && session) {
      for (const call of calls) {
        if (call.name !== 'search_edge_india') {
          session.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { error: 'Unsupported tool.' } } });
          continue;
        }
        const query = typeof call.args?.query === 'string' ? call.args.query.trim() : voiceTranscriptRef.current;
        if (!query) {
          session.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { error: 'No question was recognized. Ask the visitor to repeat it.' } } });
          continue;
        }

        setMessages((current) => [...current.filter((item) => item.id !== 'welcome'), { id: crypto.randomUUID(), role: 'user', content: voiceTranscriptRef.current || query }]);
        voiceTranscriptRef.current = '';
        try {
          const previousMessages = messagesRef.current.filter((item) => item.id !== 'welcome').slice(-8);
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: query,
              history: previousMessages.map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', content: item.content })),
            }),
          });
          const payload = await response.json() as { answer?: string; members?: ChatMember[]; sources?: ChatMessage['sources']; error?: string };
          if (!response.ok) throw new Error(payload.error || 'Could not retrieve current Edge India information.');
          const answer = payload.answer || 'I could not find that information in the current public data.';
          const members = Array.isArray(payload.members) ? payload.members : [];
          const sources = Array.isArray(payload.sources) ? payload.sources : [];
          setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: answer, members, sources }]);
          session.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { output: { answer, members, sources } } } });
        } catch (error) {
          const explanation = error instanceof Error ? error.message : 'Could not retrieve current public information.';
          session.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { error: explanation } } });
        }
      }
    }
  };

  const startVoice = async () => {
    if (voiceStatus === 'connecting' || voiceStatus === 'listening') { stopVoice(); return; }
    setVoiceError('');
    setVoiceStatus('connecting');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone access is not available in this browser.');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      streamRef.current = stream;
      const tokenResponse = await fetch('/api/chat/voice-token', { method: 'POST' });
      const tokenPayload = await tokenResponse.json() as { token?: string; model?: string; error?: string };
      if (!tokenResponse.ok || !tokenPayload.token || !tokenPayload.model) throw new Error(tokenPayload.error || 'Could not start voice chat.');
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: tokenPayload.token, httpOptions: { apiVersion: 'v1alpha' } });
      const session = await ai.live.connect({
        model: tokenPayload.model,
        config: { responseModalities: [Modality.AUDIO] },
        callbacks: {
          onmessage: (message) => { void handleVoiceMessage(message); },
          onerror: () => { setVoiceError('Voice chat disconnected. Please try again.'); stopVoice(); setVoiceStatus('error'); },
          onclose: () => { if (sessionRef.current) { stopVoice(); setVoiceStatus('idle'); } },
        },
      });
      sessionRef.current = session;
      const context = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = context;
      await context.resume();
      const micSource = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(2048, 1, 1);
      sourceRef.current = micSource;
      processorRef.current = processor;
      processor.onaudioprocess = (event) => {
        const activeSession = sessionRef.current;
        if (!activeSession) return;
        const input = event.inputBuffer.getChannelData(0);
        const pcm = new ArrayBuffer(input.length * 2);
        const view = new DataView(pcm);
        let energy = 0;
        for (let index = 0; index < input.length; index += 1) {
          const sample = Math.max(-1, Math.min(1, input[index]));
          energy += sample * sample;
          view.setInt16(index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        }
        setVoiceLevel(Math.min(1, Math.sqrt(energy / input.length) * 5));
        const bytes = new Uint8Array(pcm);
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
        activeSession.sendRealtimeInput({ audio: { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' } });
      };
      micSource.connect(processor);
      processor.connect(context.destination);
      setVoiceStatus('listening');
    } catch (error) {
      stopVoice();
      setVoiceStatus('error');
      setVoiceError(error instanceof Error ? error.message : 'Could not start voice chat.');
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content };
    const previousMessages = messages.filter((message) => message.id !== 'welcome').slice(-8);
    setMessages((current) => [...current.filter((message) => message.id !== 'welcome'), userMessage]);
    setDraft('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: previousMessages.map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', content: message.content })),
        }),
      });
      const payload = await response.json() as { answer?: string; members?: ChatMember[]; sources?: ChatMessage['sources']; error?: string };
      if (!response.ok) throw new Error(payload.error || 'The assistant couldn’t reply. Please try again.');
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: payload.answer || 'I could not find that information in the current public data.',
        members: Array.isArray(payload.members) ? payload.members : [],
        sources: Array.isArray(payload.sources) ? payload.sources : [],
      }]);
    } catch (error) {
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'The assistant is temporarily unavailable. Please try again.',
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={isOpen ? 'fixed inset-y-0 right-0 z-[80] w-[min(420px,100vw)]' : 'fixed bottom-5 right-5 z-[80] sm:bottom-7 sm:right-7'}>
      {isOpen ? (
        <section aria-label="Edge India Chatbot" className="flex h-dvh w-full flex-col overflow-hidden rounded-none border border-r-0 border-blue-500/60 bg-white shadow-[-16px_0_55px_rgba(1,17,62,0.24)]">
          <header className="relative flex shrink-0 items-center justify-between overflow-hidden border-b border-blue-500/50 bg-[linear-gradient(112deg,#071642_0%,#09266f_60%,#0d3d9c_100%)] px-4 py-3 text-white sm:px-5 sm:py-4">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-32 h-64 w-2/3 rotate-12 rounded-[50%] bg-blue-500/15 blur-2xl" />
            <div className="relative flex min-w-0 items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-[#09245f]/60 shadow-[0_0_28px_rgba(37,99,235,0.25)] sm:h-12 sm:w-12"><Bot aria-hidden="true" className="h-6 w-6" /></span>
              <div className="min-w-0"><h2 className="truncate text-base font-extrabold tracking-tight sm:text-lg">Edge India Chatbot</h2><p className="mt-0.5 text-xs font-medium text-blue-100/85 sm:text-sm">Built by Vortex</p></div>
            </div>
            <div className="relative flex shrink-0 items-center gap-2 sm:gap-4">
              <button type="button" onClick={clearConversation} aria-label="Clear conversation" title="Clear conversation" className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 transition hover:bg-white/10 hover:text-white sm:h-12 sm:w-12"><Trash2 aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" /></button>
              <button type="button" onClick={() => { stopVoice(); setIsOpen(false); }} aria-label="Close chatbot" className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 transition hover:bg-white/10 hover:text-white sm:h-12 sm:w-12"><X aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" /></button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f9fbff_57%,#f2f6ff_100%)]">
            {chatMode === 'text' ? <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' ? <span className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white text-[#09245f] shadow-[0_4px_12px_rgba(11,28,48,0.08)]"><Bot aria-hidden="true" className="h-4 w-4" /></span> : null}
                  <div className={`max-w-[92%] rounded-[18px] px-3 py-2.5 text-[13px] leading-5 shadow-[0_5px_16px_rgba(19,49,102,0.07)] sm:px-4 sm:py-3 sm:text-sm sm:leading-6 ${message.role === 'user' ? 'rounded-br-md bg-[#12358f] text-white' : 'border border-slate-100 bg-white/95 text-[#172b50]'}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.members?.length ? (
                      <div className="mt-4 space-y-3">
                        {message.members.map((member) => {
                          const website = safeWebsite(member.website);
                          return (
                            <article key={member.id} className="rounded-2xl border border-slate-200 bg-[#f8faff] p-4 text-sm text-[#0b1c30]">
                              <h3 className="font-extrabold text-[#002069]">{member.company}</h3>
                              <p className="mt-0.5 text-xs font-semibold text-slate-700">{member.name}{member.designation ? ` · ${member.designation}` : ''}</p>
                              {member.category ? <span className="mt-2 inline-flex rounded-full bg-[#12358f]/[0.08] px-2.5 py-1 text-[11px] font-bold text-[#12358f]">{member.category}</span> : null}
                              {member.bio ? <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{member.bio}</p> : null}
                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                                {website ? <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#12358f] hover:underline">Visit website <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></a> : null}
                                {member.phone ? <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#12358f] hover:underline"><Phone aria-hidden="true" className="h-3.5 w-3.5" />{member.phone}</a> : null}
                                {member.email ? <a href={`mailto:${encodeURIComponent(member.email)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#12358f] hover:underline"><Mail aria-hidden="true" className="h-3.5 w-3.5" />Email</a> : null}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    ) : null}
                    {message.sources?.length ? <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">{message.sources.map((source) => <a key={source.id} href={source.href} className="inline-flex max-w-full items-center rounded-full bg-[#12358f]/[0.07] px-3 py-1.5 text-xs font-bold text-[#12358f] transition hover:bg-[#12358f]/[0.13]">{source.title}</a>)}</div> : null}
                  </div>
                </div>
              ))}
              {isSending ? <div className="flex items-center gap-2" role="status" aria-label="Assistant is responding">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white text-[#09245f] shadow-[0_4px_12px_rgba(11,28,48,0.08)]"><Bot className="h-4 w-4" /></span>
                <span className="flex items-center gap-1 rounded-[18px] rounded-bl-md border border-slate-100 bg-white px-4 py-3 shadow-[0_5px_16px_rgba(19,49,102,0.07)]">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#12358f] [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#12358f] [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#12358f]" />
                </span>
              </div> : null}
            </div> : <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-5 py-6">
              <div className="h-36 w-36 shrink-0 -translate-x-11 -translate-y-10 sm:h-40 sm:w-40"><VoicePoweredOrb active={voiceStatus === 'listening'} voiceLevel={voiceLevel} /></div>
              <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white/90 p-1.5 shadow-[0_8px_24px_rgba(40,69,130,0.1)]">
                <button type="button" onClick={() => void startVoice()} disabled={voiceStatus === 'connecting'} aria-label={voiceStatus === 'listening' ? 'Stop microphone' : 'Start microphone'} className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:scale-[1.03] disabled:opacity-50 ${voiceStatus === 'listening' ? 'bg-rose-600 text-white shadow-[0_8px_24px_rgba(225,29,72,0.32)]' : 'bg-[#12358f] text-white'}`}>
                  {voiceStatus === 'connecting' ? <LoaderCircle aria-hidden="true" className="h-6 w-6 animate-spin" /> : voiceStatus === 'listening' ? <MicOff aria-hidden="true" className="h-6 w-6" /> : <Mic aria-hidden="true" className="h-6 w-6" />}
                </button>
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4fb] text-[#233c71]">
                  <AudioLines className="h-5 w-5 transition-transform duration-150" style={{ transform: `scaleY(${0.7 + voiceLevel * 0.8})` }} />
                </span>
                <button type="button" onClick={stopVoice} disabled={voiceStatus !== 'listening'} aria-label="End voice chat" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4fb] text-[#536485] transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-45"><X aria-hidden="true" className="h-5 w-5" /></button>
              </div>
              <p className="-mt-2 text-center text-xs font-medium text-slate-500" role="status" aria-live="polite">
                {voiceStatus === 'listening' ? 'Microphone is on — you can speak now.' : voiceStatus === 'connecting' ? 'Connecting to your microphone…' : 'Tap the microphone, then speak.'}
              </p>
              <button type="button" onClick={() => { stopVoice(); setChatMode('text'); }} className="rounded-full px-4 py-2 text-sm font-semibold text-[#12358f] transition hover:bg-blue-50">Switch to text chat</button>
            </div>}
          </div>

          {voiceError ? <p role="alert" className="shrink-0 bg-white px-5 pb-1 text-center text-xs text-rose-600 sm:px-8">{voiceError}</p> : null}
          {chatMode === 'text' ? <form onSubmit={sendMessage} className="shrink-0 bg-white p-3 pt-1 sm:p-3 sm:pt-1">
            <label className="sr-only" htmlFor="edge-chat-input">Ask Edge India Chatbot</label>
            <div className="flex items-center gap-1.5 rounded-[20px] border border-slate-200 bg-white p-1.5 pl-3 shadow-[0_5px_18px_rgba(35,65,125,0.07)] transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 sm:gap-2">
              <textarea ref={inputRef} id="edge-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} onFocus={() => setChatMode('text')} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={1200} placeholder="Ask about Edge India…" className="max-h-24 min-h-9 flex-1 resize-y border-0 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
              <button type="button" onClick={() => { setChatMode('voice'); void startVoice(); }} disabled={voiceStatus === 'connecting'} aria-label={voiceStatus === 'listening' ? 'Return to voice chat' : 'Start voice chat'} title="Voice chat" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition disabled:cursor-wait disabled:opacity-50 sm:h-10 sm:w-10 ${voiceStatus === 'listening' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-[#ed174c] text-white hover:bg-[#d70e40]'}`}>
                {voiceStatus === 'connecting' ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : voiceStatus === 'listening' ? <MicOff aria-hidden="true" className="h-4 w-4" /> : <Mic aria-hidden="true" className="h-4 w-4" />}
              </button>
              <button type="submit" disabled={!draft.trim() || isSending} aria-label="Send message" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5575ec] text-white transition hover:bg-[#3f62dc] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"><Send aria-hidden="true" className="h-4 w-4" /></button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400">Answers use current public Edge India information.</p>
          </form> : null}
        </section>
      ) : (
        <button type="button" onClick={() => setIsOpen(true)} aria-label="Open Edge Support Bot" title="Edge Support Bot" className="group flex h-14 items-center gap-2.5 rounded-full border border-[#002069]/10 bg-white px-4 text-sm font-extrabold text-[#002069] shadow-[0_10px_32px_rgba(0,32,105,0.2)] transition hover:-translate-y-0.5 hover:bg-[#f4f7ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#12358f]/20">
          <i aria-hidden="true" className="fa-brands fa-rocketchat fa-float text-[22px]" />
          <span>Edge Support Bot</span>
        </button>
      )}
    </div>
  );
}
