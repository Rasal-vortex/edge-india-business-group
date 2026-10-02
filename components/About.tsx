'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, ChevronUp, Shield, Handshake, Globe, TrendingUp } from 'lucide-react';
import { BRAND_ASSETS } from './data';

interface AboutProps {
  onLearnMore?: () => void;
}

export default function About({ onLearnMore }: AboutProps) {
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);

  const togglePillar = (index: number) => {
    setExpandedPillar(expandedPillar === index ? null : index);
  };

  return (
    <section className="w-full bg-[#eff4ff]/60 py-16 lg:py-24 border-b border-slate-200/80" id="about">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-1 bg-[#bb0013] rounded-full" />
            <span className="text-[11px] font-extrabold text-[#002069] tracking-widest uppercase">
              WHO WE ARE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0b1c30] tracking-tight">
            Business. Community. Growth.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Edge India Business Group brings forward-looking business pioneers together through meaningful institutional relationships, bilateral collaboration, shared intelligence, and actionable expansion pipelines.
          </p>
        </div>

        {/* Two-Column Executive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Visual Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative h-full min-h-[380px] rounded-xl overflow-hidden shadow-md bg-white p-2.5 border border-slate-200 flex flex-col justify-between">
              <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden">
                <Image
                  fill
                  className="object-cover"
                  alt="Diverse group of prominent Indian businesswomen and businessmen engaging in high-level executive networking and thought leadership summit."
                  src={BRAND_ASSETS.aboutConference}
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#002069]/20 mix-blend-multiply" />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded text-xs text-slate-700">
                  <p className="font-bold text-[#002069]">National Leadership Summit</p>
                  <p className="text-[11px] text-slate-500">Cross-industry convening of 350+ founders & MDs</p>
                </div>
              </div>

              {/* Dual Color Geometric Accent Line */}
              <div className="flex items-center w-full h-2 mt-2.5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-[#12358f]" />
                <div className="w-1/3 h-full bg-[#bb0013]" />
              </div>
            </div>
          </div>

          {/* Narrative Column with 3 Numbered Blocks */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* Pillar 01 */}
            <div 
              onClick={() => togglePillar(1)}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80 border-t-2 border-t-[#002069] transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl sm:text-3xl text-[#bb0013] font-black shrink-0">
                  01
                </span>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl text-[#002069] font-bold">
                      Meaningful Connections
                    </h3>
                    <span className="text-slate-400">
                      {expandedPillar === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Fostering trusted, high-trust alliances across premier Indian industrial and technology corridors—linking established family offices, tech unicorns, and mid-market innovators from Mumbai to Bengaluru, Delhi NCR to Hyderabad.
                  </p>

                  {expandedPillar === 1 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 animate-fade-in">
                      <p>• Verified peer network with zero unsolicited commercial solicitation.</p>
                      <p>• Private quarterly bilateral exchanges between manufacturing titans and software unicorns.</p>
                      <p>• Regional secretariats active in Mumbai, Bengaluru, Delhi NCR, and Hyderabad.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pillar 02 */}
            <div 
              onClick={() => togglePillar(2)}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80 border-t-2 border-t-[#bb0013] transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl sm:text-3xl text-[#bb0013] font-black shrink-0">
                  02
                </span>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl text-[#002069] font-bold">
                      Collaborative Growth
                    </h3>
                    <span className="text-slate-400">
                      {expandedPillar === 2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Facilitating cross-sector operational masterminds, peer-level strategic governance reviews, and co-investment syndicates that multiply capacity and de-risk market expansion for member organizations.
                  </p>

                  {expandedPillar === 2 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 animate-fade-in">
                      <p>• Cross-sector syndicate underwriting framework for clean-tech and industrial capex.</p>
                      <p>• Shared supply chain intelligence countering global geopolitical and shipping friction.</p>
                      <p>• Independent governance and audit advisory for pre-IPO preparedness.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pillar 03 */}
            <div 
              onClick={() => togglePillar(3)}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80 border-t-2 border-t-[#002069] transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl sm:text-3xl text-[#bb0013] font-black shrink-0">
                  03
                </span>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl text-[#002069] font-bold">
                      Shared Opportunities
                    </h3>
                    <span className="text-slate-400">
                      {expandedPillar === 3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Securing preferential access to overseas trade delegations, apex regulatory dialogues, proprietary early-stage investment pipelines, and high-impact institutional joint ventures.
                  </p>

                  {expandedPillar === 3 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 animate-fade-in">
                      <p>• Official representation on ministerial economic delegations to GCC, EMEA, and ASEAN.</p>
                      <p>• Access to proprietary pre-screened deal room evaluating ₹1,200 Cr in active pipeline.</p>
                      <p>• Fast-track institutional partnerships with leading public infrastructure concessions.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
