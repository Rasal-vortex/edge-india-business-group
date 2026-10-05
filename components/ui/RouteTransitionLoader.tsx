'use client';

import LiquidLoader from '@/components/ui/LiquidLoader';

export default function RouteTransitionLoader({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/45 p-6 backdrop-blur-md" role="presentation">
      <div className="rounded-2xl border border-white/70 bg-white/75 px-8 py-7 shadow-[0_20px_70px_rgba(10,35,85,0.16)]">
        <LiquidLoader message={message} />
      </div>
    </div>
  );
}
