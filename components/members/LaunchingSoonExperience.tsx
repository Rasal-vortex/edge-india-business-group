"use client";

import { motion, useReducedMotion } from "motion/react";

export default function LaunchingSoonExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="launching-soon-heading"
      className="relative isolate overflow-hidden rounded-2xl border border-[#dce5f2] bg-[linear-gradient(135deg,#ffffff_0%,#f8f9ff_58%,#eff4ff_100%)] px-6 py-12 shadow-[0_24px_70px_-42px_rgba(0,32,105,0.34)] sm:px-10 sm:py-14 lg:px-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#dce9ff]/55 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-[#e8efff]/70 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1fr_0.9fr] md:gap-8">
        <div className="relative z-10 mx-auto max-w-xl text-center md:mx-0 md:text-left">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
            className="inline-flex items-center gap-2"
          >
            <span aria-hidden="true" className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#002069]">
              Something new is coming
            </span>
          </motion.div>

          <motion.h3
            id="launching-soon-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.08, ease: "easeOut" }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#002069] sm:text-4xl lg:text-[42px]"
          >
            Launching Soon
          </motion.h3>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
            className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base md:mx-0"
          >
            A new space for business connections, collaboration and growth.
          </motion.p>

          <motion.a
            href="#contact"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#12358f] px-7 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_-12px_rgba(0,32,105,0.65)] transition-colors hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
          >
            Stay Connected
            <span aria-hidden="true" className="ml-2 text-base">↗</span>
          </motion.a>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto h-64 w-full max-w-[440px] [perspective:900px] sm:h-72"
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 440 290" fill="none">
            <path d="M78 172 169 91l111 93 78-82M169 91l25 132 86-39M78 172l116 51 86-39" stroke="#12358f" strokeOpacity=".16" strokeWidth="1.5" />
            <circle cx="78" cy="172" r="3" fill="#bb0013" fillOpacity=".8" />
            <circle cx="169" cy="91" r="3" fill="#12358f" fillOpacity=".4" />
            <circle cx="280" cy="184" r="3" fill="#12358f" fillOpacity=".4" />
            <circle cx="358" cy="102" r="3" fill="#bb0013" fillOpacity=".7" />
          </svg>

          <motion.div
            className="absolute left-[12%] top-[42%] h-24 w-24 rounded-full border border-white/80 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.98),rgba(220,233,255,0.78)_38%,rgba(18,53,143,0.24)_100%)] shadow-[inset_-8px_-10px_20px_rgba(0,32,105,0.12),0_24px_40px_-20px_rgba(0,32,105,0.42)] backdrop-blur-sm sm:h-28 sm:w-28"
            animate={reduceMotion ? undefined : { y: [0, -12, 0], x: [0, 3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute left-[22%] top-[18%] h-5 w-9 rotate-[-35deg] rounded-full bg-white/75 blur-[2px]" />
            <span className="absolute bottom-[18%] right-[15%] h-2 w-2 rounded-full bg-[#bb0013]/75 shadow-[0_0_10px_rgba(187,0,19,0.35)]" />
          </motion.div>

          <motion.div
            className="absolute right-[15%] top-[12%] h-[88px] w-[88px] [transform-style:preserve-3d] sm:h-24 sm:w-24"
            animate={reduceMotion ? undefined : { y: [0, 10, 0], rotateY: [0, 18, 0], rotateX: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(198,216,255,0.65)_45%,rgba(18,53,143,0.18))] shadow-[inset_-8px_-10px_18px_rgba(0,32,105,0.12),0_24px_40px_-18px_rgba(0,32,105,0.35)] backdrop-blur-md">
              <span className="absolute left-2 top-2 h-7 w-12 rotate-[-35deg] rounded-full bg-white/70 blur-[5px]" />
              <span className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#bb0013] shadow-[0_0_12px_rgba(187,0,19,0.4)]" />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[8%] right-[27%] h-[62px] w-[62px] rotate-12 rounded-[14px] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(220,233,255,0.72)_48%,rgba(18,53,143,0.2))] shadow-[inset_-6px_-8px_14px_rgba(0,32,105,0.1),0_18px_32px_-18px_rgba(0,32,105,0.4)] backdrop-blur-md"
            animate={reduceMotion ? undefined : { y: [0, -9, 0], rotate: [12, 4, 12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <span className="absolute left-2 top-2 h-5 w-8 rotate-[-35deg] rounded-full bg-white/75 blur-[4px]" />
          </motion.div>

          <motion.div
            className="absolute right-[4%] top-[56%] h-12 w-12 rounded-full border border-white/90 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.98),rgba(220,233,255,0.8)_42%,rgba(18,53,143,0.22))] shadow-[inset_-5px_-6px_12px_rgba(0,32,105,0.12),0_18px_30px_-16px_rgba(0,32,105,0.42)]"
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        </div>
      </div>
    </section>
  );
}
