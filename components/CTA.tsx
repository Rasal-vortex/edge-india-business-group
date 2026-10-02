'use client';

import React from 'react';
import { ArrowRight, Download, FileText } from 'lucide-react';

interface CTAProps {
  onOpenConnect: () => void;
  onOpenProspectus: () => void;
}

export default function CTA({ onOpenConnect, onOpenProspectus }: CTAProps) {
  return (
    <section className="w-full bg-[#12358f] text-white relative overflow-hidden py-16 lg:py-24 border-t-2 border-[#bb0013]">
      {/* Abstract Geometric Monogram Grid Watermark */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <svg
          className="w-[800px] h-[800px] text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 400 400"
        >
          <path d="M50 100 H350 M50 200 H250 M50 300 H350" strokeWidth="6" />
          <path d="M50 50 V350" strokeWidth="8" />
          <path d="M250 50 L350 200 L250 350" strokeDasharray="10 10" strokeWidth="4" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 text-center flex flex-col items-center">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#002069] rounded mb-4 border border-blue-400/20">
          <span className="w-2 h-2 rounded-xs bg-[#bb0013]" />
          <span className="text-[11px] font-extrabold text-[#dce1ff] tracking-widest uppercase">
            INVITATION TO PARTNER
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white max-w-3xl leading-[1.12]">
          Let&apos;s build something meaningful together.
        </h2>

        <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mt-4 leading-relaxed">
          Connect with Edge India Business Group and become part of an authoritative community built around authentic relationships, high-conviction ideas, and strategic opportunities.
        </p>

        {/* Action Triggers */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onOpenConnect}
            className="group inline-flex items-center justify-center px-8 py-4 bg-white text-[#002069] text-base font-bold rounded shadow-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span className="font-bold flex items-center gap-2 text-[#002069]">
              Get In Touch
              <ArrowRight className="w-5 h-5 text-[#bb0013] group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>

          <button
            onClick={onOpenProspectus}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-sm font-semibold rounded border border-white/30 hover:bg-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-300" />
            Download Executive Prospectus
          </button>
        </div>

        {/* Quick Institutional Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-blue-400/20 w-full max-w-4xl text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              500+
            </span>
            <span className="text-xs font-bold text-[#dce1ff] uppercase tracking-wider mt-1">
              Active Executives
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ffdad6] tracking-tight">
              18+
            </span>
            <span className="text-xs font-bold text-[#dce1ff] uppercase tracking-wider mt-1">
              Industry Verticals
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ₹1,200 Cr+
            </span>
            <span className="text-xs font-bold text-[#dce1ff] uppercase tracking-wider mt-1">
              Collaborative Deal Flow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
