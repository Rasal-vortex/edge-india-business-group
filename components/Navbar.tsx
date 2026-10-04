'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Menu, X, ArrowRight } from 'lucide-react';
import { BRAND_ASSETS } from './data';
import GooeyNav from '@/components/ui/GooeyNav';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConnect: () => void;
  forceGlass?: boolean;
}

export default function Navbar({
  activeSection,
  onNavigate,
  onOpenConnect,
  forceGlass = false,
}: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openingAdmin, setOpeningAdmin] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(forceGlass);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(forceGlass || window.scrollY > 24);

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, [forceGlass]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'members', label: 'Members' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];
  const activeNavIndex = Math.max(0, navLinks.findIndex((link) => link.id === activeSection));

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleAdminAccess = async () => {
    setOpeningAdmin(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin');
        return;
      }

      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      router.push(!error && admin ? '/admin/dashboard' : '/admin');
    } catch {
      router.push('/admin');
    } finally {
      setOpeningAdmin(false);
    }
  };

  return (
    <header
      className={`fixed z-40 border transition-all duration-300 ${
        hasScrolled
          ? 'left-1/2 right-auto top-3 w-[calc(100%-2rem)] max-w-[1360px] -translate-x-1/2 rounded-2xl border-white/30 bg-white/15 backdrop-blur-xl shadow-[0_10px_32px_rgba(20,25,45,0.12)] ring-1 ring-white/15'
          : 'left-0 right-0 top-0 w-full translate-x-0 rounded-none border-transparent bg-transparent backdrop-blur-0 shadow-none ring-0'
      }`}
    >
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
          <div className={`hidden flex-col border-l pl-3 transition-colors duration-300 sm:flex ${hasScrolled ? 'border-slate-300' : 'border-white/25'}`}>
            <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${hasScrolled ? 'text-[#002069]' : 'text-white'}`}>
              Edge India
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${hasScrolled ? 'text-slate-500' : 'text-white/75'}`}>
              Business Group
            </span>
          </div>
        </div>

        {/* Desktop Nav Zone */}
        <div className="hidden md:block">
          <GooeyNav
            items={navLinks.map((link) => ({
              label: link.label,
              href: `#${link.id}`,
              sectionId: link.id,
            }))}
            activeIndex={activeNavIndex}
            onActiveChange={(index) => handleLinkClick(navLinks[index].id)}
            scrolled={hasScrolled}
            particleCount={6}
          />
        </div>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-3">


          <button
            onClick={handleAdminAccess}
            disabled={openingAdmin}
            aria-busy={openingAdmin}
            className="w-8 h-8 rounded-full bg-[#002069] flex items-center justify-center shrink-0 text-white hover:bg-[#12358f] transition-colors"
            title="Admin dashboard or sign in"
            aria-label="Open admin dashboard or sign in"
          >
            <User className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded p-1.5 transition-colors duration-300 md:hidden ${hasScrolled ? 'text-slate-700 hover:text-[#002069]' : 'text-white hover:text-white/80'}`}
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
                void handleAdminAccess();
              }}
              disabled={openingAdmin}
              className="w-full py-2 text-xs font-semibold text-[#12358f] border border-[#12358f]/20 rounded text-center disabled:opacity-60"
            >
              {openingAdmin ? 'Opening admin…' : 'Admin dashboard / sign in'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConnect();
              }}
              className="w-full py-2.5 bg-[#12358f] text-white text-xs font-bold rounded text-center"
            >
              Connect With Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
