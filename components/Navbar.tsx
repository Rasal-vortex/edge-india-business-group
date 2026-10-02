'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Menu, X, ArrowRight } from 'lucide-react';
import { BRAND_ASSETS } from './data';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConnect: () => void;
  onOpenPortal: () => void;
}

export default function Navbar({
  activeSection,
  onNavigate,
  onOpenConnect,
  onOpenPortal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'members', label: 'Members' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="h-20 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand / Logo Zone */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative h-8 md:h-9 w-40 sm:w-44">
            <Image
              alt="Edge India Business Group Logo"
              src={BRAND_ASSETS.logo}
              fill
              className="object-contain object-left transition-transform group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col border-l border-slate-300 pl-3">
            <span className="text-xs font-bold text-[#002069] tracking-wider uppercase">
              Edge India
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Business Group
            </span>
          </div>
        </div>

        {/* Desktop Nav Zone */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm font-semibold transition-colors duration-150 relative py-1 ${
                  isActive
                    ? 'text-[#002069] font-bold'
                    : 'text-slate-600 hover:text-[#002069]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#bb0013]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConnect}
            className="relative inline-flex items-center justify-center px-4 py-2 bg-[#12358f] text-white text-xs font-bold rounded shadow-sm border-b-2 border-[#bb0013] hover:bg-[#002069] transition-all cursor-pointer"
          >
            Connect With Us
          </button>

          <button
            onClick={onOpenPortal}
            className="w-8 h-8 rounded-full bg-[#002069] flex items-center justify-center shrink-0 text-white hover:bg-[#12358f] transition-colors"
            title="Executive Member Portal"
            aria-label="Executive Portal"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-700 hover:text-[#002069] rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 animate-fade-in shadow-xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left py-2 px-3 rounded text-sm font-bold flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-100 text-[#002069] border-l-4 border-[#bb0013]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConnect();
              }}
              className="w-full py-2.5 bg-[#12358f] text-white text-xs font-bold rounded text-center"
            >
              Connect With Us
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded text-center"
            >
              Executive Member Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
