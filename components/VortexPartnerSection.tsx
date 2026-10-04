'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const VORTEX_LOGO_SRC = '/compony-logos/vortex-logo-vertical.png';
const VORTEX_URL = 'https://www.vortexglobaltechnologies.in/';

export default function VortexPartnerSection() {
  const reduceMotion = useReducedMotion();
  const enter = { opacity: 1, y: 0 };
  const initial = reduceMotion ? false : { opacity: 0, y: 18 };

  return (
    <section
      id="vortex-partner"
      aria-labelledby="vortex-partner-heading"
      className="relative isolate min-h-[100svh] w-full overflow-hidden border-b border-slate-200/80"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#f7f9fe]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 78% 24%, rgba(18,53,143,0.08), transparent 28%), radial-gradient(circle at 18% 78%, rgba(187,0,19,0.035), transparent 25%), linear-gradient(rgba(18,53,143,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(18,53,143,0.025) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-center px-4 py-14 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
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

          <h2
            id="vortex-partner-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[44px]"
          >
            Powered by Technology.
            <br />
            <span className="text-[#12358f]">Built for Growth.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Vortex Technology Hub provides the technology, digital infrastructure, and technical support that powers the Edge India Business Group experience.
          </p>

          <a
            href={VORTEX_URL}
            target="_blank"
            rel="noreferrer"
            className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded bg-[#12358f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
          >
            Explore Vortex
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <motion.div
          initial={initial}
          whileInView={enter}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
          className="relative mx-auto flex min-h-[230px] w-full max-w-[540px] items-center justify-center overflow-hidden rounded-2xl border border-[#d8e3f5] bg-[#eff4ff]/75 p-5 sm:min-h-[320px] sm:p-10"
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full text-[#12358f]/20"
            viewBox="0 0 560 360"
            fill="none"
          >
            <path d="M0 180H115L160 135H225M560 180H445L400 225H335" stroke="currentColor" strokeWidth="1.5" />
            <path d="M280 0V85M280 275V360M0 72H75L115 112M560 288H485L445 248" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="115" cy="180" r="4" fill="#bb0013" />
            <circle cx="445" cy="180" r="4" fill="#12358f" />
            <circle cx="280" cy="85" r="3" fill="#12358f" />
            <circle cx="280" cy="275" r="3" fill="#bb0013" />
            <circle cx="75" cy="72" r="3" fill="#12358f" />
            <circle cx="485" cy="288" r="3" fill="#bb0013" />
            <circle cx="280" cy="180" r="112" stroke="currentColor" strokeDasharray="3 8" />
            <circle cx="280" cy="180" r="148" stroke="currentColor" strokeDasharray="1 10" />
          </svg>

          <div className="relative z-10 flex min-h-40 w-full max-w-[330px] flex-col items-center justify-center rounded-xl border border-white/90 bg-white/90 px-5 py-7 text-center shadow-[0_16px_50px_rgba(0,32,105,0.10)] backdrop-blur-sm sm:min-h-44">
            <div className="relative h-20 w-full max-w-[260px]">
              <Image
                src={VORTEX_LOGO_SRC}
                alt="Vortex Global Technologies logo"
                fill
                sizes="260px"
                className="object-contain"
              />
            </div>
            <span className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#bb0013]">
              Technology Partner
            </span>
            <span className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#002069]">
              Edge India Business Group
            </span>
          </div>
        </motion.div>
        </div>

        <motion.div
          initial={initial}
          whileInView={enter}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            ['Technology', 'The technical foundation behind the Edge India platform.'],
            ['Digital Infrastructure', 'The systems supporting the website and digital experience.'],
            ['Technical Support', 'Technical support for the Edge India digital experience.'],
            ['Digital Experience', 'A connected digital touchpoint for the Edge India community.'],
          ].map(([title, description], index) => (
            <div key={title} className="rounded-xl border border-white/90 bg-white/75 p-5 shadow-[0_8px_28px_rgba(0,32,105,0.045)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${index % 2 === 0 ? 'bg-[#12358f]' : 'bg-[#bb0013]'}`} />
                <h3 className="text-sm font-extrabold text-[#002069]">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
