'use client';

import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'motion/react';

export interface TimedIntroHeroProps {
  heading: ReactNode | ((visible: boolean) => ReactNode);
  description: string;
  backgroundSrc: string;
  delayMs?: number;
  blurPx?: number;
  children?: ReactNode;
}

export default function TimedIntroHero({
  heading,
  description,
  backgroundSrc,
  delayMs = 600,
  blurPx = 3,
  children,
}: TimedIntroHeroProps) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const initialDelayMs = useRef(delayMs);
  const contentIsVisible = revealed || reduceMotion === true;

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true);
      return;
    }

    const timer = window.setTimeout(() => setRevealed(true), initialDelayMs.current);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const headingVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const textTransition = (delay = 0) => ({
    duration: reduceMotion ? 0 : 0.6,
    ease: 'easeOut' as const,
    delay: reduceMotion ? 0 : delay,
  });

  return (
    <section className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#001438] px-5 py-24 text-center text-white sm:px-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4"
        initial={false}
        animate={{ filter: revealed && !reduceMotion ? `blur(${blurPx}px)` : 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: 'easeOut' }}
      >
        <Image
          src={backgroundSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#001438]/25" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
        <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-white">
          {typeof heading === 'function' ? heading(contentIsVisible) : heading}
        </h1>

        <motion.p
          variants={headingVariants}
          initial="hidden"
          animate={contentIsVisible ? 'visible' : 'hidden'}
          transition={textTransition(0.15)}
          className="mt-5 max-w-[42rem] text-base leading-relaxed text-blue-50/85 sm:mt-6 sm:text-lg"
        >
          {description}
        </motion.p>

        {children ? (
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={contentIsVisible ? 'visible' : 'hidden'}
            transition={textTransition(0.3)}
            className="mt-8 flex w-full flex-col items-center justify-center gap-3 min-[520px]:flex-row"
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
