'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { BRAND_ASSETS } from './data';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenConnect: () => void;
}

export default function Footer({ onNavigate, onOpenConnect }: FooterProps) {
  return (
    <footer className="w-full border-t-2 border-[#bb0013] bg-[#002069] text-white">
      <div className="mx-auto max-w-[1280px] px-4 pt-14 pb-8 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-8 border-b border-blue-400/20 pb-10 md:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-3 md:col-span-5">
            <button onClick={() => onNavigate('home')} aria-label="EDGE India home" className="relative h-12 w-56 rounded bg-white p-1">
              <Image src={BRAND_ASSETS.logo} alt="EDGE India Business Group" fill sizes="224px" className="object-contain" />
            </button>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#dce1ff]">Business | Community | Growth</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-300 sm:text-sm">
              A business community in Manjeri, Kerala, connecting entrepreneurs, professionals, and business leaders to learn, collaborate, and grow.
            </p>
            </div>

          <div className="flex flex-col gap-3 md:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#dce1ff]">Explore</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Home', 'home'], ['About', 'about'], ['Members', 'members'], ['Gallery', 'gallery'],
              ].map(([label, id]) => (
                <button key={id} onClick={() => onNavigate(id)} className="text-left text-slate-300 transition-colors hover:text-white">{label}</button>
              ))}
              <button onClick={onOpenConnect} className="text-left text-slate-300 transition-colors hover:text-white">Contact</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:col-span-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#dce1ff]">Contact the chapter</span>
            <a href="tel:+919995430724" className="flex items-center gap-2 text-xs text-slate-300 transition-colors hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-[#bb0013]" />+91 99954 30724
            </a>
            <a href="tel:+917594944211" className="flex items-center gap-2 text-xs text-slate-300 transition-colors hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-[#bb0013]" />+91 75949 44211
            </a>
            <a href="https://www.instagram.com/edg.eindia/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-300 transition-colors hover:text-white">
              <Instagram className="h-4 w-4 shrink-0 text-[#dce1ff]" />@edg.eindia
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="h-4 w-4 shrink-0 text-[#bb0013]" />Manjeri, Kerala, India
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} EDGE India Business Group.</p>
        </div>
      </div>
    </footer>
  );
}
