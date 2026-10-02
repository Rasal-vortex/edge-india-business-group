'use client';

import React from 'react';
import { Mail, Share2, Globe, Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenConnect: () => void;
  onOpenProspectus: () => void;
}

export default function Footer({
  onNavigate,
  onOpenConnect,
  onOpenProspectus,
}: FooterProps) {
  return (
    <footer className="w-full bg-[#002069] text-white relative border-t-2 border-[#bb0013]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start pb-12 border-b border-blue-400/20">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl text-white tracking-tight font-extrabold">
                EDGE INDIA
              </span>
              <span className="px-2 py-0.5 bg-[#bb0013] text-white text-[11px] font-extrabold rounded tracking-wider">
                GROUP
              </span>
            </div>

            <p className="text-[11px] font-extrabold text-[#dce1ff] tracking-widest uppercase mt-0.5">
              Business | Community | Growth
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-2 leading-relaxed">
              Convening premier Indian enterprises, institutional investors, and strategic policy leadership to champion national enterprise expansion.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenProspectus}
                className="text-xs font-semibold text-[#dce1ff] hover:text-white underline underline-offset-4 flex items-center gap-1"
              >
                Review Institutional Governance Charter 2026
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-[#dce1ff] tracking-wider uppercase">
              Corporate Directory
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('home')}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => onNavigate('members')}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                Members
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={onOpenConnect}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                Contact
              </button>
              <button
                onClick={onOpenProspectus}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={onOpenProspectus}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                Terms
              </button>
            </div>
          </div>

          {/* Communications & Network */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-bold text-[#dce1ff] tracking-wider uppercase">
              Communications & Network
            </span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <div 
                onClick={onOpenConnect}
                className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4 text-[#bb0013] shrink-0" />
                <span>executive@edgeindia.org</span>
              </div>
              <div 
                onClick={onOpenConnect}
                className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#dce1ff] shrink-0" />
                <span>LinkedIn / Institutional Network</span>
              </div>
              <div 
                onClick={onOpenConnect}
                className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <Globe className="w-4 h-4 text-[#bb0013] shrink-0" />
                <span>Global Indian Delegations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Edge India Business Group. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-[#dce1ff] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#bb0013]" />
              Institutional Governance Standard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
