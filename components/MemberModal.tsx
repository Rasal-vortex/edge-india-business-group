'use client';

import React, { useEffect, useRef } from 'react';
import { X, ArrowRight, MapPin, Calendar, Award, Briefcase } from 'lucide-react';
import { Member } from './data';

interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
  onRequestIntro: (member: Member) => void;
}

export default function MemberModal({ member, onClose, onRequestIntro }: MemberModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!member) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [member]);

  if (!member) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div 
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-modal-title"
        tabIndex={-1}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#002069] via-[#12358f] to-[#bb0013]" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative flex w-24 h-24 items-center justify-center rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-slate-100">
              {member.image ? <img
                src={member.image}
                alt={`Portrait of ${member.name}`}
                className="object-cover"
              /> : <span aria-hidden="true" className="text-2xl font-extrabold text-[#12358f]/40">{member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>}
              <span className="absolute bottom-1 right-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#002069] text-white rounded z-10">
                {member.badge}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-[#bb0013]" />
                <span className="text-[11px] font-bold text-[#bb0013] uppercase tracking-widest">
                  Member Profile
                </span>
              </div>
              <h3 id="member-modal-title" className="text-2xl font-bold text-[#002069] tracking-tight mt-0.5">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-[#bb0013]">{member.role}</p>
              {member.company ? <p className="mt-1 text-sm font-semibold text-slate-700">{member.company}</p> : null}

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-2">
                {member.sector ? <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {member.sector}
                </span> : null}
                {member.location ? <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {member.location}
                </span> : null}
                {member.tenure ? <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {member.tenure}
                </span> : null}
                {member.website ? <a className="text-[#12358f] hover:underline" href={member.website} target="_blank" rel="noreferrer">Website</a> : null}
                {member.email ? <a className="text-[#12358f] hover:underline" href={`mailto:${member.email}`}>Email</a> : null}
                {member.phone ? <a className="text-[#12358f] hover:underline" href={`tel:${member.phone}`}>Call</a> : null}
              </div>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#002069] mb-2">
              About
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">{member.fullBio || member.description || 'No biography has been added yet.'}</p>
          </div>

          {member.keyInitiatives.length > 0 ? <div className="p-4 bg-[#f8f9ff] rounded-lg border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#002069] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#bb0013]" />
              Community interests
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {member.keyInitiatives.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12358f] mt-1 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div> : null}

          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Contact the Manjeri chapter to ask about this member.
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRequestIntro(member);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#12358f] hover:bg-[#002069] text-white text-sm font-semibold rounded shadow-sm transition-all"
              >
                Ask About This Member
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
