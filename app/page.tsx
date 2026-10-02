'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Members from '@/components/Members';
import Gallery from '@/components/Gallery';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ConnectModal from '@/components/ConnectModal';
import MemberModal from '@/components/MemberModal';
import LightboxModal from '@/components/LightboxModal';
import ProspectusModal from '@/components/ProspectusModal';
import ExecutivePortalModal from '@/components/ExecutivePortalModal';
import { Member, GalleryItem } from '@/components/data';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');

  // Modals state
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectPrefillSubject, setConnectPrefillSubject] = useState('');
  const [connectPrefillContext, setConnectPrefillContext] = useState('');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [isProspectusOpen, setIsProspectusOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // Scroll spy to highlight active nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'members', 'gallery'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'contact') {
      openConnect('Membership Inquiry', 'General Partnership Contact');
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openConnect = (subject = 'Membership Inquiry', context = '') => {
    setConnectPrefillSubject(subject);
    setConnectPrefillContext(context);
    setIsConnectOpen(true);
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
  };

  const handleGallerySelect = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
  };

  const handleRequestIntro = (member: Member) => {
    openConnect('Advisory Introduction', `Bilateral introduction with ${member.name} (${member.role}, ${member.sector})`);
  };

  const handleGalleryInquiry = (item: GalleryItem) => {
    openConnect('Summit Partnership', `Inquiry regarding the ${item.title} (${item.tag} session at ${item.location})`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
      {/* Primary Sticky Top Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConnect={() => openConnect('Membership Inquiry', 'Executive Inbound Contact')}
        onOpenPortal={() => setIsPortalOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1 w-full">
        {/* 1. Hero Section */}
        <Hero
          onMeetMembers={() => handleNavigate('members')}
          onExploreGallery={() => handleNavigate('gallery')}
          onOpenConnect={() => openConnect('Membership Inquiry', 'General Inbound Request')}
        />

        {/* 2. Who We Are / About Section */}
        <About
          onLearnMore={() => setIsProspectusOpen(true)}
        />

        {/* 3. Community / Members Section */}
        <Members
          onSelectMember={handleMemberSelect}
          onNominateMember={() => openConnect('Membership Inquiry', 'Executive Fellowship Nomination')}
        />

        {/* 4. Moments / Gallery Section */}
        <Gallery
          onSelectItem={handleGallerySelect}
        />

        {/* 5. Invitation to Partner / CTA Section */}
        <CTA
          onOpenConnect={() => openConnect('Membership Inquiry', 'Executive Partnership Office')}
          onOpenProspectus={() => setIsProspectusOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConnect={() => openConnect('Membership Inquiry', 'Footer Secretariat Contact')}
        onOpenProspectus={() => setIsProspectusOpen(true)}
      />

      {/* Modals & Dialogs */}
      <ConnectModal
        key={`${connectPrefillSubject}-${connectPrefillContext}`}
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        prefillSubject={connectPrefillSubject}
        prefillContext={connectPrefillContext}
      />

      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onRequestIntro={handleRequestIntro}
      />

      <LightboxModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
        onInquire={handleGalleryInquiry}
      />

      <ProspectusModal
        isOpen={isProspectusOpen}
        onClose={() => setIsProspectusOpen(false)}
        onRequestMembership={() => {
          setIsProspectusOpen(false);
          openConnect('Membership Inquiry', 'Prospectus Review Referral');
        }}
      />

      <ExecutivePortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onInquire={() => {
          setIsPortalOpen(false);
          openConnect('Membership Inquiry', 'Corporate Fellowship Nomination');
        }}
      />
    </div>
  );
}
