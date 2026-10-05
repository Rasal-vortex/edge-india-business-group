'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Search, Users, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import type { Member } from './data';
import MemberCard from '@/components/members/MemberCard';
import { createClient } from '@/lib/supabase/client';
import { toPublicMember, type MemberRow } from '@/lib/members';
import LiquidLoader from '@/components/ui/LiquidLoader';

type MemberFilter = 'all' | string;

interface MembersProps {
  members?: Member[];
  directory?: boolean;
  onSelectMember: (member: Member) => void;
}

export default function Members({ members: initialMembers, directory = false, onSelectMember }: MembersProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers ?? []);
  const [loading, setLoading] = useState(initialMembers === undefined);
  const [loadError, setLoadError] = useState('');
  const [activeFilter, setActiveFilter] = useState<MemberFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const reduceMotion = useReducedMotion();
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  useEffect(() => {
    if (initialMembers !== undefined) {
      setMembers(initialMembers);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadMembers = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });
        if (error) throw error;
        if (!cancelled) setMembers((data as MemberRow[]).map(toPublicMember));
      } catch {
        if (!cancelled) setLoadError('We could not load the member directory right now. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadMembers();
    return () => { cancelled = true; };
  }, [initialMembers]);

  const categoryFilters = useMemo(() => Array.from(new Set(members.flatMap((member) => member.categories)))
    .filter(Boolean)
    .map((category) => ({ id: category, label: category })), [members]);

  const filteredMembers = useMemo(() => members.filter((member) => {
    const matchesCategory = activeFilter === 'all' || member.categories.includes(activeFilter);
    const matchesSearch = !normalizedQuery ||
      member.name.toLocaleLowerCase().includes(normalizedQuery) ||
      (member.company ?? '').toLocaleLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  }), [activeFilter, members, normalizedQuery]);

  const hasActiveSearchOrFilter = normalizedQuery.length > 0 || activeFilter !== 'all';
  const displayedMembers = directory || hasActiveSearchOrFilter
    ? filteredMembers
    : filteredMembers.slice(0, 8);
  const hasMoreMembers = filteredMembers.length > 8;

  return (
    <section id="members" className="w-full border-b border-slate-200 bg-white py-16 lg:py-24">
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
              <span aria-hidden="true" className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002069]">
                Our Community
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[40px]">
              Meet the people behind Edge India Business Group
            </h2>
          
          </div>


        </div>

        {directory ? <div className="mb-6 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-xl">
            <label htmlFor="member-search" className="sr-only">Search members or companies</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="-mx-1 w-full overflow-x-auto px-1 pb-1" role="group" aria-label="Filter members by category">
            <div className="mx-auto flex w-max min-w-full items-center justify-center gap-2">
              {[{ id: 'all', label: 'All Members' }, ...categoryFilters].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f] ${
                      isActive
                        ? 'border-[#002069] bg-[#002069] text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#12358f]/40 hover:text-[#002069]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div> : null}

        {loading ? (
          <div className="flex min-h-52 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-12 text-center">
            <LiquidLoader />
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 py-12 text-center" role="alert">
            <p className="text-sm font-semibold text-rose-800">{loadError}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <Users aria-hidden="true" className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Member profiles are being added.</p>
            <p className="mt-1 text-sm text-slate-500">Contact the chapter to ask about membership or a guest invitation.</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <Users aria-hidden="true" className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <p className="text-base font-bold text-slate-800">No members found</p>
            <p className="mt-1 text-sm text-slate-500">Try another name or company.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 rounded px-3 py-2 text-sm font-bold text-[#12358f] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-center gap-4 text-center text-xs text-slate-500">
              <p aria-live="polite">
                {hasActiveSearchOrFilter || directory
                  ? `${filteredMembers.length} ${filteredMembers.length === 1 ? 'member' : 'members'}`
                  : `Showing ${displayedMembers.length} of ${filteredMembers.length} members`}
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {displayedMembers.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  reduceMotion={reduceMotion}
                  onSelect={onSelectMember}
                />
              ))}
            </div>

            {hasMoreMembers && !hasActiveSearchOrFilter && !directory ? (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/members"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-[#12358f] bg-white px-6 py-3 text-sm font-bold text-[#12358f] shadow-sm transition-colors hover:bg-[#12358f] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
                >
                  View All Members
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </>
        )}

      </div>
    </section>
  );
}
