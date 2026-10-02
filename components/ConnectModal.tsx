'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Building2, Send, ArrowRight, ShieldCheck, Mail, Phone } from 'lucide-react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillSubject?: string;
  prefillContext?: string;
}

export default function ConnectModal({
  isOpen,
  onClose,
  prefillSubject = '',
  prefillContext = '',
}: ConnectModalProps) {
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [engagementType, setEngagementType] = useState(
    prefillSubject || 'Membership Inquiry'
  );
  const [message, setMessage] = useState(
    prefillContext ? `Regarding ${prefillContext}: ` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setRefId(`EIBG-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 700);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setTitle('');
    setOrganization('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#002069] px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#bb0013]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#bb0013] rounded-xs" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Executive Partnership Office</h3>
              <p className="text-xs text-slate-300">Edge India Business Group Secretariat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inquiry Authenticated</span>
              <h4 className="text-2xl font-bold text-[#002069] mt-1">Partnership Dossier Logged</h4>
              <p className="text-sm text-slate-600 max-w-md mt-2">
                Thank you, <strong className="text-slate-900">{fullName}</strong>. Your confidential briefing request has been assigned to the Office of the Secretariat under registration code:
              </p>

              <div className="my-4 px-4 py-2 bg-slate-100 rounded border border-slate-200 font-mono font-bold text-[#002069] text-base">
                {refId}
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-lg border border-slate-200 text-left w-full text-xs text-slate-600 space-y-1.5 mb-6">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-[#12358f]" />
                  <span>Institutional Protocol Timeline:</span>
                </div>
                <p>• Secretariat review of corporate credentials within 24 business hours.</p>
                <p>• Direct outreach via executive office phone or encrypted email channel.</p>
                <p>• Placement on privileged briefing digest for national bilateral roundtables.</p>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#12358f] text-white text-sm font-semibold rounded-lg hover:bg-[#002069] transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 mb-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engage directly with the steering committee and founding directors. Submissions are reviewed under strict institutional confidentiality guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Executive Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Executive Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Managing Director / Group CEO"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enterprise / Conglomerate *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Apex Industrial Group"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Engagement Track *
                  </label>
                  <select
                    value={engagementType}
                    onChange={(e) => setEngagementType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900"
                  >
                    <option value="Membership Inquiry">C-Suite Membership Nomination</option>
                    <option value="Bilateral Trade Delegation">Bilateral Trade & Export Delegation</option>
                    <option value="Syndicate Co-Investment">Deal Flow & Syndicate Participation</option>
                    <option value="Advisory Introduction">Advisory Board Consultation</option>
                    <option value="Summit Partnership">National Summit Partnership</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="executive@enterprise.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Contact / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Strategic Agenda / Key Mandate
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your enterprise mandate, sector interest, or areas for mutual institutional collaboration..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f] text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Protected by Institutional Governance Code
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#12358f] hover:bg-[#002069] text-white font-semibold text-sm rounded shadow-sm transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>Transmitting...</>
                    ) : (
                      <>
                        Submit Briefing
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
