'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Members from '@/components/Members';
import Gallery from '@/components/Gallery';
import VortexPartnerSection from '@/components/VortexPartnerSection';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ConnectModal from '@/components/ConnectModal';
import MemberModal from '@/components/MemberModal';
import { Member } from '@/components/data';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const navigationTargetRef = useRef<string | null>(null);

  // Modals state
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectPrefillSubject, setConnectPrefillSubject] = useState('');
  const [connectPrefillContext, setConnectPrefillContext] = useState('');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Let the section nearest the viewport's reading line control the active nav item.
  useEffect(() => {
    const sectionIds = ['home', 'about', 'members', 'gallery', 'contact'];
    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const pendingTarget = navigationTargetRef.current;
        if (pendingTarget) {
          const targetEntry = entries.find(
            (entry) => entry.target.id === pendingTarget && entry.isIntersecting,
          );
          if (!targetEntry) return;

          navigationTargetRef.current = null;
          setActiveSection(pendingTarget);
          return;
        }

        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aRect = a.target.getBoundingClientRect();
            const bRect = b.target.getBoundingClientRect();
            const readingLine = window.innerHeight * 0.45;
            const aDistance = Math.abs(aRect.top + aRect.height / 2 - readingLine);
            const bDistance = Math.abs(bRect.top + bRect.height / 2 - readingLine);
            return aDistance - bDistance;
          });

        if (visibleSections[0]) setActiveSection(visibleSections[0].target.id);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const readingLineTop = window.innerHeight * 0.35;
      const readingLineBottom = window.innerHeight * 0.55;
      const alreadyAtTarget = rect.top <= readingLineBottom && rect.bottom >= readingLineTop;
      navigationTargetRef.current = alreadyAtTarget ? null : sectionId;
      element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigationTargetRef.current = null;
    if (sectionId === 'contact') openConnect('Membership Inquiry', 'General Partnership Contact');
  };

  const openConnect = (subject = 'Membership Inquiry', context = '') => {
    setConnectPrefillSubject(subject);
    setConnectPrefillContext(context);
    setIsConnectOpen(true);
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
      {/* Primary Sticky Top Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConnect={() => openConnect('Membership Inquiry', 'Contact the Manjeri chapter')}
      />

      {/* Main Page Flow */}
      <main className="flex-1 w-full">
        {/* 1. Hero Section */}
        <div id="home">
          <Hero
            onMeetMembers={() => handleNavigate('members')}
          />
        </div>

        {/* 2. Who We Are / About Section */}
        <About />

        {/* 3. Community / Members Section */}
        <Members
          onSelectMember={handleMemberSelect}
        />

        {/* 4. Moments / Gallery Section */}
        <Gallery />

        {/* 5. Technology Partner */}
        <VortexPartnerSection />

        {/* 5. Invitation to Partner / CTA Section */}
        <div id="contact">
          <CTA />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConnect={() => openConnect('Membership Inquiry', 'Contact the Manjeri chapter')}
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
      />

    </div>
  );
}
