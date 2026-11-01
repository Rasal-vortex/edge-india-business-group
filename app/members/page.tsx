'use client';

import ChatbotWidget from '@/components/ChatbotWidget';
import ConnectModal from '@/components/ConnectModal';
import Members from '@/components/Members';
import Navbar from '@/components/Navbar';

export default function MembersDirectoryPage() {
  const [connectContext, setConnectContext] = useState('');
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const openConnect = (context: string) => {
    setConnectContext(context);
    setIsConnectOpen(true);
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
          onSelectMember={(member) => window.location.assign(`/members/${member.username}`)}
        />
      </main>

      <ConnectModal
        key={connectContext}
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        prefillSubject="Membership Inquiry"
        prefillContext={connectContext}
      />
      <ChatbotWidget />
    </div>
  );
}
