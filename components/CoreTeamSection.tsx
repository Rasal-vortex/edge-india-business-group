"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, Users, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { Member } from "./data";
import MemberCard from "@/components/members/MemberCard";
import CommunityMemberCard from "@/components/members/CommunityMemberCard";
import { createClient } from "@/lib/supabase/client";
import {
  sortPublicMembersByPriorityAndPin,
  toPublicMember,
  type ChapterOption,
  type MemberRow,
} from "@/lib/members";
import LiquidLoader from "@/components/ui/LiquidLoader";

type MemberFilter = "all" | string;

interface MembersProps {
  members?: Member[];
  directory?: boolean;
  variant?: "core" | "community";
  onSelectMember: (member: Member) => void;
}

export default function CoreTeamSection({
  members: initialMembers,
  directory = false,
  variant = "core",
  onSelectMember,
}: MembersProps) {
  const isCoreSection = !directory && variant === "core";
  const limitHomeCommunity = !directory && variant === "community";
  const sortedInitialMembers = useMemo(
    () =>
      initialMembers
        ? sortPublicMembersByPriorityAndPin(
            initialMembers.filter(
              (member) => Boolean(member.isInsideCoreMember) === isCoreSection,
            ),
          )
        : [],
    [initialMembers, isCoreSection],
  );
  const [members, setMembers] = useState<Member[]>(() =>
    limitHomeCommunity
      ? sortedInitialMembers.slice(0, 8)
      : sortedInitialMembers,
  );
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [memberCount, setMemberCount] = useState(sortedInitialMembers.length);
  const [loading, setLoading] = useState(initialMembers === undefined);
  const [loadError, setLoadError] = useState("");
  const [activeFilter, setActiveFilter] = useState<MemberFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pauseCarousel, setPauseCarousel] = useState(false);
  const reduceMotion = useReducedMotion();
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  useEffect(() => {
    if (initialMembers !== undefined) return;

    let cancelled = false;
    const loadMembers = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const supabase = createClient();
        const priorities = ["high", "medium", "low"] as const;
        const memberResultsPromise = Promise.all(
          priorities.map(async (priority) => {
            let query = supabase
              .from("members")
              .select("*", { count: "exact" })
              .eq("is_active", true)
              .eq("is_inside_core_member", isCoreSection)
              .eq("priority", priority);

            if (directory && activeFilter !== "all") {
              query = query.eq("chapter_id", activeFilter);
            }

            const orderedQuery = query
              .order("is_pinned", { ascending: false })
              .order("created_at", { ascending: false })
              .order("id", { ascending: true });

            return limitHomeCommunity ? orderedQuery.limit(8) : orderedQuery;
          }),
        );

        const chaptersPromise = directory
          ? supabase
              .from("chapters")
              .select("id,name,is_active")
              .eq("is_active", true)
              .order("name", { ascending: true })
          : Promise.resolve(null);
        const [results, chapterResult] = await Promise.all([
          memberResultsPromise,
          chaptersPromise,
        ]);

        const failedResult = results.find(({ error }) => error);
        if (failedResult?.error) throw failedResult.error;
        if (chapterResult?.error) throw chapterResult.error;

        const totalCount = results.reduce(
          (total, result) => total + (result.count ?? 0),
          0,
        );
        const rows = results.flatMap(
          (result) => (result.data ?? []) as MemberRow[],
        );
        if (!cancelled) {
          if (chapterResult)
            setChapters((chapterResult.data ?? []) as ChapterOption[]);
          setMemberCount(totalCount);
          setMembers(rows.map(toPublicMember));
        }
      } catch {
        if (!cancelled)
          setLoadError(
            "We could not load the member directory right now. Please try again later.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadMembers();
    return () => {
      cancelled = true;
    };
  }, [
    activeFilter,
    directory,
    initialMembers,
    isCoreSection,
    limitHomeCommunity,
  ]);

  const sectionMembers = useMemo(() => {
    if (initialMembers === undefined) return members;
    return directory && activeFilter !== "all"
      ? sortedInitialMembers.filter(
          (member) => member.chapterId === activeFilter,
        )
      : sortedInitialMembers;
  }, [activeFilter, directory, initialMembers, members, sortedInitialMembers]);

  const filteredMembers = useMemo(
    () =>
      sectionMembers.filter((member) => {
        const matchesSearch =
          !normalizedQuery ||
          member.name.toLocaleLowerCase().includes(normalizedQuery) ||
          (member.company ?? "").toLocaleLowerCase().includes(normalizedQuery);
        return matchesSearch;
      }),
    [sectionMembers, normalizedQuery],
  );

  const displayedMembers = directory
    ? filteredMembers
    : variant === "community"
      ? filteredMembers.slice(0, 8)
      : filteredMembers;

  return (
    <section
      id={directory || variant === "core" ? "members" : "community"}
      className={`w-full border-b border-slate-200 py-16 lg:py-24 ${variant === "community" && !directory ? "bg-[#eff4ff]" : "bg-white"}`}
    >
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">
        {directory ? (
          <Link
            href="/#members"
            className="mb-8 inline-flex min-h-10 items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#12358f] shadow-sm transition-colors hover:border-[#12358f] hover:bg-[#f8f9ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to main Members section
          </Link>
        ) : null}

        <div className="mb-8 flex flex-col items-center gap-6 text-center lg:mb-10">
          <div className="flex max-w-3xl flex-col items-center gap-2">
            <div className="inline-flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="h-1 w-2.5 rounded-full bg-[#bb0013]"
              />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002069]">
                Core Team
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[40px]">
              {directory || variant === "community"
                ? "Meet Our Members Across All Chapters"
                : "Meet the Core Team"}
            </h2>
            {/* {!directory ? (
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#bb0013]/20 bg-[#fff4f3] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#a40011]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#bb0013]"
                />
                {variant === "core" ? "Core team" : "Our members"}
              </span>
            ) : null} */}
          </div>
        </div>

        {directory ? (
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="relative w-full max-w-xl">
              <label htmlFor="member-search" className="sr-only">
                Search members or companies
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="member-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search members or companies..."
                className="min-h-12 w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#12358f] focus:ring-2 focus:ring-[#12358f]/15"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div
              className="-mx-1 w-full overflow-x-auto px-1 pb-1"
              role="group"
              aria-label="Filter members by chapter"
            >
              <div className="mx-auto flex w-max min-w-full items-center justify-center gap-2">
                {[
                  { id: "all", label: "All Members" },
                  ...chapters.map((chapter) => ({
                    id: chapter.id,
                    label: chapter.name,
                  })),
                ].map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f] ${
                        isActive
                          ? "border-[#002069] bg-[#002069] text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#12358f]/40 hover:text-[#002069]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-52 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-12 text-center">
            <LiquidLoader />
          </div>
        ) : loadError ? (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 py-12 text-center"
            role="alert"
          >
            <p className="text-sm font-semibold text-rose-800">{loadError}</p>
          </div>
        ) : sectionMembers.length === 0 &&
          !(directory && activeFilter !== "all") ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <Users
              aria-hidden="true"
              className="mx-auto mb-2 h-8 w-8 text-slate-400"
            />
            <p className="text-sm font-semibold text-slate-700">
              Member profiles are being added.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Contact the chapter to ask about membership or a guest invitation.
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <Users
              aria-hidden="true"
              className="mx-auto mb-2 h-8 w-8 text-slate-400"
            />
            <p className="text-base font-bold text-slate-800">
              No members found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another name, company, or chapter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-4 rounded px-3 py-2 text-sm font-bold text-[#12358f] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {directory || variant === "community" ? (
              <>
                <div className="mb-4 flex justify-center text-center text-xs text-slate-500">
                  <p aria-live="polite">
                    {directory ? filteredMembers.length : memberCount}{" "}
                    {(directory ? filteredMembers.length : memberCount) === 1
                      ? "member"
                      : "members"}
                  </p>
                </div>
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                  {displayedMembers.map((member, index) => (
                    <CommunityMemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      reduceMotion={reduceMotion}
                      onSelect={onSelectMember}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div
                className={`member-marquee ${displayedMembers.length < 4 ? "member-marquee-static" : ""}`}
                role="region"
                aria-label="Scrolling member profiles"
                onMouseEnter={() => setPauseCarousel(true)}
                onMouseLeave={() => setPauseCarousel(false)}
                onFocusCapture={() => setPauseCarousel(true)}
                onBlurCapture={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget as Node | null,
                    )
                  ) {
                    setPauseCarousel(false);
                  }
                }}
              >
                {displayedMembers.length < 4 ? (
                  <div className="member-marquee-group">
                    {displayedMembers.map((member, index) => (
                      <div className="member-marquee-card" key={member.id}>
                        <MemberCard
                          member={member}
                          index={index}
                          reduceMotion={reduceMotion}
                          onSelect={onSelectMember}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="member-marquee-track"
                    style={{
                      animationDuration: `${Math.max(24, displayedMembers.length * 3.25)}s`,
                      animationPlayState:
                        pauseCarousel || reduceMotion === true
                          ? "paused"
                          : "running",
                    }}
                  >
                    <div className="member-marquee-group">
                      {displayedMembers.map((member, index) => (
                        <div className="member-marquee-card" key={member.id}>
                          <MemberCard
                            member={member}
                            index={index}
                            reduceMotion={reduceMotion}
                            onSelect={onSelectMember}
                          />
                        </div>
                      ))}
                    </div>
                    <div
                      className="member-marquee-group"
                      aria-hidden="true"
                      inert
                    >
                      {displayedMembers.map((member, index) => (
                        <div
                          className="member-marquee-card"
                          key={`copy-${member.id}`}
                        >
                          <MemberCard
                            member={member}
                            index={index}
                            reduceMotion={reduceMotion}
                            onSelect={onSelectMember}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!directory && variant === "community" ? (
              <div className="mt-9 flex justify-center">
                <Link
                  href="/members"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#12358f] px-7 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
                >
                  View more members{" "}
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
