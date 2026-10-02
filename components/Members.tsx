'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Search, Users, Filter, X } from 'lucide-react';
import { Member, MEMBERS_DATA } from './data';

interface MembersProps {
  onSelectMember: (member: Member) => void;
  onNominateMember: () => void;
}

export default function Members({ onSelectMember, onNominateMember }: MembersProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'advisory' | 'founding' | 'regional'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Leaders' },
    { id: 'advisory', label: 'Advisory Board' },
    { id: 'founding', label: 'Founding Members' },
    { id: 'regional', label: 'Regional Chapters' },
  ] as const;

  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter((member) => {
      const matchesCategory =
        activeFilter === 'all' || member.categories.includes(activeFilter);
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="w-full bg-white py-16 lg:py-24 border-b border-slate-200" id="members">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-1 bg-[#bb0013] rounded-full" />
              <span className="text-[11px] font-extrabold text-[#002069] tracking-widest uppercase">
                OUR COMMUNITY
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0b1c30] tracking-tight">
              Meet the people behind Edge India Business Group
            </h2>

            <p className="text-base text-slate-600">
              Distinguished leaders, founders, and industry champions shaping India&apos;s economic frontier.
            </p>
          </div>

          {/* Filter System & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#002069] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#002069]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leaders..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#12358f]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4-Card Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden border border-slate-200 cursor-pointer"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#12358f] group-hover:bg-[#bb0013] transition-colors" />

              <div>
                <div className="w-full h-64 rounded-lg overflow-hidden bg-slate-100 mb-4 relative">
                  <Image
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={member.name}
                    src={member.image}
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#002069]/90 text-white text-[10px] font-extrabold uppercase rounded tracking-wider shadow-sm z-10">
                    {member.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#002069] group-hover:text-[#bb0013] transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-[#bb0013] font-semibold mt-0.5">
                  {member.role}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {member.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {member.sector}
                </span>
                <span className="p-1 rounded text-[#002069] group-hover:text-[#bb0013] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No leaders match your search criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or clearing the search text.</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#12358f] font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Member Directory Invitation Strip */}
        <div className="mt-12 p-4 sm:p-6 bg-[#f8f9ff] rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#12358f]/10 text-[#12358f] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#002069]">
                Are you an industry leader or institutional founder?
              </h4>
              <p className="text-xs text-slate-600">
                Nominations for the 2026–2027 Executive Fellowship cohort are currently undergoing vetting by the Membership Committee.
              </p>
            </div>
          </div>

          <button
            onClick={onNominateMember}
            className="whitespace-nowrap px-5 py-2.5 bg-white border border-[#12358f] text-[#12358f] text-xs font-bold rounded hover:bg-[#12358f] hover:text-white transition-all shadow-sm"
          >
            Submit Corporate Nomination
          </button>
        </div>
      </div>
    </section>
  );
}
