"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowRight, Building2, Link as LinkIcon, Mail, MapPin } from "lucide-react";
import { motion } from "motion/react";
import type { Member } from "@/components/data";

interface CommunityMemberCardProps {
  member: Member;
  index: number;
  reduceMotion: boolean | null;
  onSelect: (member: Member) => void;
}

export default function CommunityMemberCard({
  member,
  index,
  reduceMotion,
  onSelect,
}: CommunityMemberCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [touchFlipped, setTouchFlipped] = useState(false);
  const lastPointerType = useRef("mouse");
  const category = member.categories[0];
  const profileText = member.fullBio || member.description;

  const handlePointerLeave = () => {
    if (lastPointerType.current !== "touch") setFlipped(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (flipped) onSelect(member);
    else setFlipped(true);
  };

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`${flipped ? "Member details for" : "Show details for"} ${member.name}`}
      aria-pressed={flipped}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : (index % 8) * 0.035 }}
      className="h-[340px] w-full cursor-pointer [perspective:1000px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12358f]"
      onPointerEnter={(event: PointerEvent<HTMLElement>) => {
        lastPointerType.current = event.pointerType;
        if (event.pointerType !== "touch") setFlipped(true);
      }}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setFlipped(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null) && lastPointerType.current !== "touch") {
          setFlipped(false);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (lastPointerType.current === "touch") {
          if (touchFlipped) {
            setTouchFlipped(false);
            setFlipped(false);
            onSelect(member);
          } else {
            setTouchFlipped(true);
            setFlipped(true);
          }
          return;
        }
        onSelect(member);
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full rounded-xl"
      >
        <section
          aria-hidden={flipped}
          inert={flipped}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 border-t-2 border-t-[#bb0013] bg-white text-left shadow-sm"
        >
          <div className="relative h-48 shrink-0 overflow-hidden bg-[#eff4ff]">
            {member.image ? (
              <img src={member.image} alt={`Portrait of ${member.name}`} className="h-full w-full object-cover" />
            ) : (
              <div aria-hidden="true" className="flex h-full items-center justify-center text-5xl font-extrabold text-[#12358f]/40">
                {member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
            {category ? (
              <span className="mb-2 inline-flex w-fit max-w-full truncate rounded-full bg-[#eff4ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#12358f]">
                {category}
              </span>
            ) : null}
            <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-[#002069]">{member.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-semibold text-slate-600">
              <Building2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#bb0013]" />
              {member.company || member.role}
            </p>
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#12358f]">
              <span>View member details</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </div>
          </div>
        </section>

        <section
          aria-hidden={!flipped}
          inert={!flipped}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 border-t-2 border-t-[#bb0013] bg-white p-4 text-left shadow-sm sm:p-5"
        >
          <div className="flex shrink-0 items-start gap-3 border-b border-slate-100 pb-3">
            {member.companyLogo ? (
              <img src={member.companyLogo} alt={`${member.company || "Company"} logo`} className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white p-1 object-contain" />
            ) : (
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff] text-[#12358f]">
                <Building2 className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-base font-extrabold text-[#002069]">{member.name}</h3>
              <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-600">{member.role}{member.company ? ` · ${member.company}` : ""}</p>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3">
            {category ? <p className="w-fit rounded-full border border-[#dce5f2] bg-[#f8f9ff] px-3 py-1 text-[10px] font-bold text-[#12358f]">{category}</p> : null}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#bb0013]">About</p>
              <p className="mt-1 line-clamp-4 text-xs leading-5 text-slate-600">{profileText || "More profile information has not been added yet."}</p>
            </div>
            {member.location ? <p className="flex items-center gap-2 text-xs font-semibold text-slate-600"><MapPin aria-hidden="true" className="h-3.5 w-3.5 text-[#bb0013]" />{member.location}</p> : null}
            <div className="grid grid-cols-2 gap-2">
              {member.website ? (
                <a href={/^https?:\/\//i.test(member.website) ? member.website : `https://${member.website}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8f9ff] p-2 text-[10px] font-bold text-[#12358f] hover:border-[#12358f]/40">
                  <LinkIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /><span className="truncate">Website</span>
                </a>
              ) : null}
              {member.email ? (
                <a href={`mailto:${member.email}`} onClick={(event) => event.stopPropagation()} className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8f9ff] p-2 text-[10px] font-bold text-[#12358f] hover:border-[#12358f]/40">
                  <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /><span className="truncate">Email</span>
                </a>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); onSelect(member); }}
            className="mt-2 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#12358f] px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
          >
            View full profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </section>
      </motion.div>
    </motion.article>
  );
}
