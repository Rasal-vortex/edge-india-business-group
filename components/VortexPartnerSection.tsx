'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Aurora from './Aurora';

const VORTEX_LOGO_SRC = '/compony-logos/vortex-logo-vertical.png';
const VORTEX_SERVICES_URL = 'https://www.vortexglobaltechnologies.in/#services';

export default function VortexPartnerSection() {
  const reduceMotion = useReducedMotion();
  const [swapVortexButton, setSwapVortexButton] = React.useState(false);
  const vortexLabelRef = React.useRef<HTMLSpanElement>(null);
  const [vortexLabelWidth, setVortexLabelWidth] = React.useState(0);
  const enter = { opacity: 1, y: 0 };
  const initial = reduceMotion ? false : { opacity: 0, y: 18 };

  React.useEffect(() => {
    const label = vortexLabelRef.current;
    if (!label) return;
    const updateWidth = () => setVortexLabelWidth(label.getBoundingClientRect().width);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="vortex-partner"
      aria-labelledby="vortex-partner-heading"
      className="relative isolate min-h-[100svh] w-full overflow-hidden border-b border-slate-200/80"
    >
      <Aurora colorStops={['#582c9f', '#c07acb', '#29245f']} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-center px-4 py-14 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <motion.div
          initial={initial}
          whileInView={enter}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <div className="mb-3 inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#002069]">
              Technology Partner
            </span>
          </div>

          <motion.h2
            id="vortex-partner-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, ease: 'easeOut' }}
            className="text-3xl font-extrabold leading-tight tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[44px]"
          >
            Powered by AI.
            <br />
            <span className="text-[#12358f]">Built for Growth.</span>
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.14, ease: 'easeOut' }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Vortex Global Technologies works across AI, software, automation, and emerging technology. As Edge India’s technology partner, Vortex supports the digital experience behind the community.
          </motion.p>

          <motion.a
            href={VORTEX_SERVICES_URL}
            target="_blank"
            rel="noreferrer"
            onHoverStart={() => setSwapVortexButton(true)}
            onHoverEnd={() => setSwapVortexButton(false)}
            onFocus={() => setSwapVortexButton(true)}
            onBlur={() => setSwapVortexButton(false)}
            className={`group mt-7 inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-white py-2 text-sm font-bold text-[#001438] shadow-sm transition-[padding,transform] duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${swapVortexButton ? 'pl-2 pr-6' : 'pl-6 pr-2'}`}
          >
            <motion.span
              ref={vortexLabelRef}
              animate={{ x: swapVortexButton ? 56 : 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="inline-block whitespace-nowrap"
            >
              Explore Vortex
            </motion.span>
            <motion.span
              animate={{ x: swapVortexButton ? -(vortexLabelWidth + 16) : 0, rotate: swapVortexButton ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#001438] text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={initial}
          whileInView={enter}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
          className="relative mx-auto flex min-h-[260px] w-full max-w-[680px] items-center justify-center sm:min-h-[380px]"
        >
          <Image
            src={VORTEX_LOGO_SRC}
            alt="Vortex Global Technologies logo"
            width={760}
            height={760}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 680px, 760px"
            className="h-auto w-[min(92vw,760px)] object-contain"
          />
        </motion.div>
        </div>

      </div>
    </section>
  );
}
