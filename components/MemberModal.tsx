'use client';

import React from 'react';
import Image from 'next/image';
import { X, ArrowRight, MapPin, Calendar, Award, Briefcase, Mail } from 'lucide-react';
import { Member } from './data';

interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
  onRequestIntro: (member: Member) => void;
}

export default function MemberModal({ member, onClose, onRequestIntro }: MemberModalProps) {
  if (!member) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#002069] via-[#12358f] to-[#bb0013]" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-slate-200">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                sizes="96px"
              />
              <span className="absolute bottom-1 right-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#002069] text-white rounded z-10">
                {member.badge}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-[#bb0013]" />
                <span className="text-[11px] font-bold text-[#bb0013] uppercase tracking-widest">
                  Leadership Dossier
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#002069] tracking-tight mt-0.5">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-[#bb0013]">{member.role}</p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {member.sector}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {member.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {member.tenure}
                </span>
              </div>
            </div>
          </div>

          <button
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
              Executive Biography & Mandate
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {member.fullBio}
            </p>
          </div>

          <div className="p-4 bg-[#f8f9ff] rounded-lg border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#002069] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#bb0013]" />
              Strategic Initiatives & Working Groups
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {member.keyInitiatives.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12358f] mt-1 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Direct access restricted to verified institutional members.
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
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
                Request Bilateral Introduction
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
