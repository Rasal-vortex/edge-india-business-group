'use client';

import { useRef, useState, type FocusEvent, type PointerEvent } from 'react';
import { ArrowRight, ArrowUpRight, Building2, Link as LinkIcon, Mail } from 'lucide-react';
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
  const suppressReturnFocusFlip = useRef(false);
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
      className="group h-[320px] w-full cursor-pointer [perspective:1100px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12358f] sm:h-[340px]"
      style={reduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }}
      onPointerEnter={(event) => {
        lastPointerType.current = event.pointerType;
        if (event.pointerType !== 'touch') setHovered(true);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={() => {
        if (suppressReturnFocusFlip.current) {
          suppressReturnFocusFlip.current = false;
          return;
        }
        setFocused(true);
      }}
      onBlurCapture={handleBlur}
      onClick={() => {
        if (lastPointerType.current === 'touch') {
          if (touchFlipped) {
            setTouchFlipped(false);
            setFocused(false);
            suppressReturnFocusFlip.current = true;
            onSelect(member);
          } else {
            setTouchFlipped(true);
          }
        } else {
          setHovered(false);
          setFocused(false);
          setTouchFlipped(false);
          suppressReturnFocusFlip.current = true;
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
          <span className="pointer-events-none absolute left-4 top-4 max-w-[65%] truncate rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm sm:text-xs">{member.role}</span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col px-5 pb-6 pt-20 text-left sm:px-6 sm:pb-7">
            <h3 className="line-clamp-2 text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-3xl">{member.name}</h3>
            {member.company ? <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-white/75 sm:text-base"><Building2 aria-hidden="true" className="h-4 w-4 shrink-0" />{member.company}</p> : null}
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white shadow-sm backdrop-blur-sm sm:h-10 sm:w-10">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </section>

        <section
          aria-hidden={!flipped}
          inert={!flipped}
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className={`${faceClass} border-[#dce8fb] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_58%,#f0f6ff_100%)] p-4 sm:p-5`}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-[#dce9ff]/75" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-64 -rotate-12 rounded-[45%] border-[18px] border-[#e7f2ff]/90" />
          <div className="relative z-10 mb-3 flex shrink-0 items-start justify-between gap-3 border-b border-[#dce5f2] pb-3">
            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#c90020] sm:text-[10px]">Member details</p>
              <h3 className="mt-1 line-clamp-1 text-base font-extrabold tracking-tight text-[#09265f] sm:text-lg">{member.name}</h3>
              <p className="mt-0.5 line-clamp-1 text-xs font-medium text-[#596a85] sm:text-sm">{member.role}{member.company ? ` · ${member.company}` : ''}</p>
            </div>
          </div>

          <div className="relative z-10 min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5 sm:space-y-3.5">
            {categoryLabel ? <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#63728a]">Category</span>
              <span className="inline-flex max-w-full truncate rounded-full bg-[#eaf1ff] px-3 py-1 text-[10px] font-bold text-[#1646ad] ring-1 ring-inset ring-[#d9e6ff] sm:text-[11px]">{categoryLabel}</span>
            </div> : null}
            {member.sector ? <p className="-mt-1 truncate text-[10px] font-medium text-[#64748b]">Industry · {member.sector}</p> : null}
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#63728a] sm:text-[10px]">About</p>
              <p className="mt-1 line-clamp-3 text-[11px] leading-[1.55] text-[#263d61] sm:text-xs">{profileText || 'More profile information has not been added yet.'}</p>
              {member.location ? <p className="mt-1 truncate text-[10px] font-semibold text-[#64748b]">{member.location}</p> : null}
            </div>
            {(member.website || member.email) ? <div className="grid grid-cols-2 gap-2 border-t border-[#e0e8f4] pt-2.5">
              {member.website ? <a href={/^https?:\/\//i.test(member.website) ? member.website : `https://${member.website}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="flex min-w-0 items-center gap-2 rounded-lg bg-white/75 px-2 py-2 text-[#1746aa] ring-1 ring-inset ring-[#e6edf8] transition-colors hover:bg-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf3ff] text-[#1646ad]"><LinkIcon className="h-3.5 w-3.5" /></span>
                <span className="min-w-0"><span className="block text-[8px] font-extrabold uppercase tracking-wider text-[#6b7890]">Website</span><span className="block truncate text-[10px] font-semibold">{member.website.replace(/^https?:\/\//i, '').replace(/\/$/, '')}</span></span>
              </a> : null}
              {member.email ? <a href={`mailto:${member.email}`} onClick={(event) => event.stopPropagation()} className="flex min-w-0 items-center gap-2 rounded-lg bg-white/75 px-2 py-2 text-[#1746aa] ring-1 ring-inset ring-[#e6edf8] transition-colors hover:bg-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf3ff] text-[#1646ad]"><Mail className="h-3.5 w-3.5" /></span>
                <span className="min-w-0"><span className="block text-[8px] font-extrabold uppercase tracking-wider text-[#6b7890]">Email</span><span className="block truncate text-[10px] font-semibold">{member.email}</span></span>
              </a> : null}
            </div> : null}
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(member); }} className="relative z-10 mt-3 flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#092b78] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_18px_-10px_rgba(9,43,120,0.7)] transition-colors hover:bg-[#123c99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]">
            View Full Profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </section>
      </motion.div>
    </motion.article>
  );
}
