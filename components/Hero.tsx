'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Award, Building2, TrendingUp, Sparkles, X } from 'lucide-react';
import { BRAND_ASSETS } from './data';

interface HeroProps {
  onMeetMembers: () => void;
  onExploreGallery: () => void;
  onOpenConnect: () => void;
}

export default function Hero({ onMeetMembers, onExploreGallery, onOpenConnect }: HeroProps) {
  const [showDialogueModal, setShowDialogueModal] = useState(false);

  return (
    <section id="home" className="relative w-full overflow-hidden bg-white pt-24 md:pt-28 pb-12 lg:pb-16 border-b border-slate-100">
      {/* Background Ambient Geometric Watermark Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-7/12 h-full opacity-10 pointer-events-none hidden lg:block">
        <svg className="w-full h-full text-[#002069]" fill="none" stroke="currentColor" viewBox="0 0 600 600">
          <polygon points="300,50 550,500 50,500" strokeDasharray="6 6" strokeWidth="1.5" />
          <polygon points="300,120 480,480 120,480" strokeWidth="2" />
          <line strokeWidth="1" x1="300" x2="300" y1="50" y2="550" />
          <circle cx="300" cy="300" r="180" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eff4ff] rounded border border-blue-100 w-fit">
              <span className="w-2 h-2 rounded-xs bg-[#bb0013]" />
              <span className="text-[11px] font-extrabold tracking-widest text-[#002069] uppercase">
                EDGE INDIA BUSINESS GROUP
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0b1c30] tracking-tight leading-[1.12]">
              Building Connections.{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#12358f] relative inline-block">
                Creating Opportunities.
                <span className="absolute bottom-1 left-0 w-full h-[5px] bg-[#bb0013]/25 -z-10" />
              </span>
            </h1>

            <div className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-wider uppercase">
              <span className="text-[#002069]">Business</span>
              <span className="text-[#bb0013]">•</span>
              <span className="text-[#002069]">Community</span>
              <span className="text-[#bb0013]">•</span>
              <span className="text-[#bb0013]">Growth</span>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              A high-governance convening ecosystem bringing ambitious Indian industry leaders, institutional founders, and strategic decision-makers together to connect, collaborate, exchange ideas, and create enduring enterprise scale.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onMeetMembers}
                className="group relative inline-flex items-center justify-center px-6 py-3.5 bg-[#12358f] text-white text-sm font-bold rounded shadow-sm hover:bg-[#002069] transition-all overflow-hidden"
              >
                <span className="relative z-10 font-bold flex items-center gap-2">
                  Meet Our Members
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#bb0013]" />
              </button>

              <button
                onClick={onExploreGallery}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-[#12358f] text-sm font-bold rounded border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Explore Gallery
              </button>
            </div>

            {/* Micro Metric Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 mt-2 max-w-lg">
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-[#002069] tracking-tight">500+</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Active C-Suite
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-[#bb0013] tracking-tight">18+</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Sectors
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-[#002069] tracking-tight">₹1,200 Cr</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Syndicate Flow
                </p>
              </div>
            </div>
          </div>

          {/* Featured Split Photography (Boardroom Preview) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div 
              onClick={() => setShowDialogueModal(true)}
              className="group relative rounded-xl overflow-hidden shadow-xl bg-slate-50 p-2 border border-slate-200 cursor-pointer"
            >
              <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-lg overflow-hidden">
                <Image
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Senior Indian corporate leaders, founders, and executives collaborating around a polished walnut boardroom conference table in a modern Mumbai high-rise overlooking the Arabian sea."
                  src={BRAND_ASSETS.boardroomHero}
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002069]/90 via-[#002069]/30 to-transparent" />

                {/* Bottom Card Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border-l-4 border-[#bb0013] group-hover:bg-white transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold text-[#bb0013] uppercase tracking-widest">
                      Strategic Partnership Outlook
                    </p>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#bb0013] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-base sm:text-lg font-bold text-[#002069] leading-tight mt-0.5">
                    National Executive Dialogue Series
                  </p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    Convening corporate leaders across infrastructure, capital, and technology ecosystems.
                  </p>
                </div>
              </div>

              {/* Decorative Accent Tab */}
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-red-500/10 rounded-br-none rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#bb0013]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Dialogue Briefing Modal */}
      {showDialogueModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDialogueModal(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#002069] px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#bb0013]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2.5 bg-[#bb0013] rounded-xs" />
                <h3 className="text-base font-bold">National Executive Dialogue Series</h3>
              </div>
              <button
                onClick={() => setShowDialogueModal(false)}
                className="p-1 rounded text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="relative h-44 rounded-lg overflow-hidden border border-slate-200">
                <Image
                  src={BRAND_ASSETS.boardroomHero}
                  alt="Boardroom"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#bb0013]">
                  High-Level Briefing Note
                </span>
                <h4 className="text-lg font-bold text-[#002069] mt-0.5">
                  Strategic Partnership Outlook • 2026–2027
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600">
                  The National Executive Dialogue Series brings together select managing directors, family office leaders, and policy heads every alternate month in Mumbai and New Delhi. Sessions are Chatham House Rule compliant, addressing infrastructure funding syndicates, global trade corridors, and domestic market consolidation.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <p className="font-bold text-[#002069]">Upcoming Session:</p>
                <p>• Theme: Cross-Border Industrial Corridor Financing (India-GCC-EMEA)</p>
                <p>• Venue: Nariman Point Executive Suite, Mumbai</p>
                <p>• Seats: Strictly limited to 28 C-Suite delegates</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setShowDialogueModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDialogueModal(false);
                    onOpenConnect();
                  }}
                  className="px-5 py-2 bg-[#12358f] hover:bg-[#002069] text-white font-bold rounded"
                >
                  Request Delegation Seat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
