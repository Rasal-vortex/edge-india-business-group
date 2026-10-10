'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function ActivitiesShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const navigateToSection = (id: string) => router.push(`/#${id}`);
  const openContact = () => router.push('/#contact');

  return <>
    <Navbar activeSection="gallery" forceGlass onNavigate={navigateToSection} onOpenConnect={openContact} />
    {children}
    <Footer onNavigate={navigateToSection} onOpenConnect={openContact} />
    <ChatbotWidget />
  </>;
}
