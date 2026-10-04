'use client';

import React from 'react';
import { Instagram, MapPin, Phone, X } from 'lucide-react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillSubject?: string;
  prefillContext?: string;
}

export default function ConnectModal({ isOpen, onClose, prefillSubject, prefillContext }: ConnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="chapter-contact-title" className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-[#bb0013] bg-[#002069] px-6 py-4 text-white">
          <div>
            <h2 id="chapter-contact-title" className="text-lg font-bold">Contact EDGE India Manjeri</h2>
            <p className="text-xs text-blue-100">Membership and guest-invitation enquiries</p>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="rounded p-1 text-blue-100 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 p-6">
          {prefillSubject || prefillContext ? <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">{prefillSubject}{prefillSubject && prefillContext ? ' · ' : ''}{prefillContext}</p> : null}
          <p className="text-sm leading-relaxed text-slate-600">Reach the Manjeri chapter directly using one of its listed contact channels.</p>
          <div className="space-y-3">
            <a href="tel:+919995430724" className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-[#002069] transition-colors hover:border-[#12358f] hover:bg-[#f8f9ff]"><Phone className="h-4 w-4 text-[#bb0013]" />+91 99954 30724</a>
            <a href="tel:+917594944211" className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-[#002069] transition-colors hover:border-[#12358f] hover:bg-[#f8f9ff]"><Phone className="h-4 w-4 text-[#bb0013]" />+91 75949 44211</a>
            <a href="https://www.instagram.com/edg.eindia/" target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-[#002069] transition-colors hover:border-[#12358f] hover:bg-[#f8f9ff]"><Instagram className="h-4 w-4 text-[#12358f]" />@edg.eindia</a>
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-4 w-4 text-[#bb0013]" />Manjeri, Kerala, India</p>
          <button onClick={onClose} className="w-full rounded bg-[#12358f] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002069]">Close</button>
        </div>
      </section>
    </div>
  );
}
