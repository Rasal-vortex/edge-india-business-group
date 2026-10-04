'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import TimedIntroHero from '@/components/TimedIntroHero';
import BlurText from '@/components/BlurText';

interface HeroProps {
  onMeetMembers: () => void;
}

export default function Hero({ onMeetMembers }: HeroProps) {
  const [swapMembersButton, setSwapMembersButton] = React.useState(false);
  const membersLabelRef = React.useRef<HTMLSpanElement>(null);
  const [membersLabelWidth, setMembersLabelWidth] = React.useState(0);

  React.useEffect(() => {
    const label = membersLabelRef.current;
    if (!label) return;
    const updateWidth = () => setMembersLabelWidth(label.getBoundingClientRect().width);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  return (
    <TimedIntroHero
      heading={(visible) => (
        <BlurText
          text="Building Connections. Creating Opportunities."
          delay={110}
          animateBy="words"
          direction="bottom"
          stepDuration={0.35}
          play={visible}
          lineBreakBefore={2}
          renderWord={(word) =>
            word === 'Opportunities.' ? (
              <span className="font-serif font-normal italic">{word}</span>
            ) : (
              word
            )
          }
        />
      )}
      description="A community connecting people, ideas, and opportunities through business, collaboration, and growth."
      backgroundSrc="/pexels-silverkblack-36712857.jpg"
    >
      <motion.button
        onClick={onMeetMembers}
        onHoverStart={() => setSwapMembersButton(true)}
        onHoverEnd={() => setSwapMembersButton(false)}
        onFocus={() => setSwapMembersButton(true)}
        onBlur={() => setSwapMembersButton(false)}
        className={`group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-white py-2 text-sm font-bold text-[#001438] shadow-sm transition-[padding,transform] duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${swapMembersButton ? 'pl-2 pr-6' : 'pl-6 pr-2'}`}
      >
        <motion.span
          ref={membersLabelRef}
          animate={{ x: swapMembersButton ? 56 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="inline-block whitespace-nowrap"
        >
          Explore Our Members
        </motion.span>
        <motion.span
          animate={{ x: swapMembersButton ? -(membersLabelWidth + 16) : 0, rotate: swapMembersButton ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#001438] text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </TimedIntroHero>
  );
}
