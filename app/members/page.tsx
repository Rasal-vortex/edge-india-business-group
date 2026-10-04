'use client';

import { useState } from 'react';
import ConnectModal from '@/components/ConnectModal';
import MemberModal from '@/components/MemberModal';
import Members from '@/components/Members';
import Navbar from '@/components/Navbar';
import type { Member } from '@/components/data';

export default function MembersDirectoryPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [connectContext, setConnectContext] = useState('');
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const openConnect = (context: string) => {
    setConnectContext(context);
    setIsConnectOpen(true);
  };

  const requestIntroduction = (member: Member) => {
    setSelectedMember(null);
    openConnect(`Ask the chapter about connecting with ${member.name}`);
  };

  const navigateToSection = (sectionId: string) => {
    if (sectionId === 'members') {
      document.getElementById('members')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.assign(sectionId === 'home' ? '/' : `/#${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#0b1c30]">
      <Navbar
        activeSection="members"
        forceGlass
        onNavigate={navigateToSection}
        onOpenConnect={() => openConnect('Contact the Manjeri chapter')}
      />
      <main className="w-full pt-24">
        <Members
          directory
          onSelectMember={setSelectedMember}
        />
      </main>

      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onRequestIntro={requestIntroduction}
      />
      <ConnectModal
        key={connectContext}
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        prefillSubject="Membership Inquiry"
        prefillContext={connectContext}
      />
    </div>
  );
}
