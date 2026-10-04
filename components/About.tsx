'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BRAND_ASSETS } from './data';

export default function About() {
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
            EDGE India Manjeri connects entrepreneurs, professionals, and business leaders in a local community focused on trusted relationships, collaboration, learning, and growth.
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
                  alt="Illustrative image representing a business networking gathering."
                  src={BRAND_ASSETS.aboutConference}
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#002069]/20 mix-blend-multiply" />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded text-xs text-slate-700">
                  <p className="font-bold text-[#002069]">EDGE India Manjeri</p>
                  <p className="text-[11px] text-slate-500">Illustrative image · Business, community, growth</p>
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
                      Trusted Networking
                    </h3>
                    <span className="text-slate-400">
                      {expandedPillar === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Building trusted business relationships among entrepreneurs, professionals, and business leaders in Manjeri.
                  </p>

                  {expandedPillar === 1 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 animate-fade-in">
                      <p>• A local space to meet and build business connections.</p>
                      <p>• Opportunities to find reliable partners and collaborate.</p>
                      <p>• Community based in Manjeri, Kerala.</p>
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
                      Learning Through Meetings
                    </h3>
                    <span className="text-slate-400">
                      {expandedPillar === 2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Meetups, training sessions, and expert talks give local business people opportunities to share knowledge and learn from one another.
                  </p>

                  {expandedPillar === 2 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 animate-fade-in">
                      <p>• Business Evolution Meetings and Business Acceleration sessions.</p>
                      <p>• Learner’s Meetings on practical business topics.</p>
                      <p>• AI sessions featuring Sainudheen Kaderi, co-founder of Coyot AI.</p>
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
                      Local Collaboration & Growth
                    </h3>
                    <span className="text-slate-400">
                      {expandedPillar === 3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    The chapter encourages collaboration and helps bring attention to new ventures in the regional business community.
                  </p>

                  {expandedPillar === 3 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 animate-fade-in">
                      <p>• Meetings can be held in person or online through Google Meet.</p>
                      <p>• The community supports local business initiatives.</p>
                      <p>• The profile records support for the Nashadz E-Commerce stock-launching ceremony.</p>
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
