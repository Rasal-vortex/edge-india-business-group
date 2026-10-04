'use client';

import { useRef, useState, type FocusEvent, type PointerEvent } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { Member } from '@/components/data';

interface MemberCardProps {
  member: Member;
  index: number;
  reduceMotion: boolean | null;
  onSelect: (member: Member) => void;
}

export default function MemberCard({ member, index, reduceMotion, onSelect }: MemberCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchFlipped, setTouchFlipped] = useState(false);
  const lastPointerType = useRef('mouse');
  const tiltXValue = useMotionValue(0);
  const tiltYValue = useMotionValue(0);
  const tiltX = useSpring(tiltXValue, { stiffness: 240, damping: 24, mass: 0.6 });
  const tiltY = useSpring(tiltYValue, { stiffness: 240, damping: 24, mass: 0.6 });
  const categoryLabel = member.categories[0];
  const flipped = hovered || focused || touchFlipped;
  const profileText = member.fullBio || member.description;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    lastPointerType.current = event.pointerType;
    if (reduceMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    tiltX.set((0.5 - y) * 50);
    tiltY.set((x - 0.5) * 50);
  };
  const handlePointerLeave = () => {
    setHovered(false);
    if (lastPointerType.current !== 'touch') setTouchFlipped(false);
    tiltX.set(0);
    tiltY.set(0);
  };
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  };

  const faceClass = 'absolute inset-0 flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm';
  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`${flipped ? 'Member details for' : 'Show details for'} ${member.name}`}
      aria-pressed={flipped}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4, boxShadow: '0 20px 35px -14px rgba(0, 32, 105, 0.42)' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : (index % 8) * 0.035, ease: 'easeOut' }}
      className="group h-[360px] w-full cursor-pointer [perspective:1100px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12358f] sm:h-[380px]"
      style={reduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }}
      onPointerEnter={(event) => {
        lastPointerType.current = event.pointerType;
        if (event.pointerType !== 'touch') setHovered(true);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
      onClick={() => {
        if (lastPointerType.current === 'touch') {
          if (touchFlipped) onSelect(member);
          else setTouchFlipped(true);
        } else {
          onSelect(member);
        }
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full rounded-xl"
      >
        <section
          aria-hidden={flipped}
          inert={flipped}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className={`${faceClass} bg-[#071a3a]`}
        >
          {member.image ? (
            <img src={member.image} alt={`Portrait of ${member.name}`} className={`absolute inset-0 h-full w-full object-cover ${reduceMotion ? '' : 'transition-transform duration-500 ease-out group-hover:scale-[1.02]'}`} />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#eff4ff] text-6xl font-extrabold tracking-tight text-[#12358f]/35">
              {member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001438]/95 via-[#001438]/25 to-transparent" />
          {categoryLabel ? <span className="pointer-events-none absolute left-4 top-4 max-w-[65%] truncate rounded bg-[#002069]/90 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">{categoryLabel}</span> : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col px-5 pb-6 pt-20 text-left sm:px-6 sm:pb-7">
            <h3 className="line-clamp-2 text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-4xl">{member.name}</h3>
            <p className="mt-2 line-clamp-1 text-lg font-bold text-white/90">{member.role}</p>
            <p className="mt-1 line-clamp-1 text-base font-semibold text-white/75">{member.company}</p>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white shadow-sm backdrop-blur-sm sm:h-12 sm:w-12">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </section>

        <section
          aria-hidden={!flipped}
          inert={!flipped}
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className={`${faceClass} p-5`}
        >
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#bb0013]">Member details</p>
              <h3 className="mt-1 line-clamp-1 text-lg font-extrabold text-[#002069]">{member.name}</h3>
              <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-600">{member.role}{member.company ? ` · ${member.company}` : ''}</p>
            </div>
            <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0 text-[#12358f]" />
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
            {categoryLabel ? <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</p>
              <span className="mt-1 inline-flex rounded-full bg-[#12358f]/[0.08] px-2.5 py-1 text-[11px] font-bold text-[#12358f]">{categoryLabel}</span>
            </div> : null}
            {member.sector ? <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Industry</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{member.sector}</p>
            </div> : null}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{profileText || 'More profile information has not been added yet.'}</p>
            </div>
            {member.location ? <p className="text-xs text-slate-600">{member.location}</p> : null}
          </div>

        </section>
      </motion.div>
    </motion.article>
  );
}
