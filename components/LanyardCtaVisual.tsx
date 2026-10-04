'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const PhysicsLanyard = dynamic(() => import('@/components/Lanyard'), {
  ssr: false,
  loading: () => null,
});

export default function LanyardCtaVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const markReady = useCallback(() => setIsReady(true), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { rootMargin: '180px 0px', threshold: 0.02 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto h-[340px] w-full max-w-[520px] sm:h-[410px] lg:h-[460px]" aria-label="EDGE India membership card display">
      {isInView ? (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <PhysicsLanyard
            position={[0, 0, 12]}
            gravity={[0, -40, 0]}
            frontImage="/id-card-image/EDGE-India-Membership-front.png"
            backImage="/id-card-image/EDGE-India-Membership-front.png"
            imageFit="contain"
            lanyardWidth={0.82}
            active={isInView}
            onReady={markReady}
          />
        </div>
      ) : null}
    </div>
  );
}
