'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { GalleryItem, GALLERY_DATA } from './data';

interface GalleryProps {
  onSelectItem: (item: GalleryItem) => void;
}

export default function Gallery({ onSelectItem }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'meetings' | 'community'>('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'events', label: 'Events' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'community', label: 'Community' },
  ] as const;

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return GALLERY_DATA;
    return GALLERY_DATA.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <section className="w-full bg-[#eff4ff]/60 py-16 lg:py-24 border-b border-slate-200" id="gallery">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-1 bg-[#bb0013] rounded-full" />
              <span className="text-[11px] font-extrabold text-[#002069] tracking-widest uppercase">
              ACTIVITIES
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0b1c30] tracking-tight">
              Ways our community connects, learns, and grows.
            </h2>

            <p className="text-base text-slate-600">
              Explore the meeting formats, learning sessions, and local business activities described by the Manjeri chapter.
            </p>
          </div>

          {/* Filter System */}
          <div className="flex items-center gap-2 border-b border-slate-300/80 pb-1 self-start md:self-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm px-3 py-1 font-semibold transition-all relative ${
                    isActive
                      ? 'text-[#002069] font-bold'
                      : 'text-slate-500 hover:text-[#002069]'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-[#bb0013]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Illustrative imagery for documented activity formats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px]">
          {filteredItems.map((item) => {
            const isLarge = item.id === 'ai-business-automation';
            const isTall = item.id === 'business-acceleration';
            const isWide = item.id === 'local-launch-support';

            const spanClass = 
              activeTab === 'all'
                ? isLarge
                  ? 'sm:col-span-2 sm:row-span-2'
                  : isTall
                  ? 'sm:row-span-2'
                  : isWide
                  ? 'sm:col-span-2'
                  : ''
                : '';

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl bg-slate-900 cursor-pointer border border-slate-200 transition-all duration-300 ${spanClass}`}
              >
                <Image
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={`Illustrative image for ${item.title}`}
                  src={item.image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#002069]/90 via-[#002069]/30 to-transparent opacity-75 group-hover:opacity-95 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider mb-1 ${
                      item.category === 'events'
                        ? 'bg-[#bb0013] text-white'
                        : item.category === 'meetings'
                        ? 'bg-[#12358f] text-white'
                        : 'bg-white/20 backdrop-blur-sm text-white'
                    }`}
                  >
                    {item.tag}
                  </span>

                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-bold text-white tracking-tight ${
                        isLarge ? 'text-xl sm:text-2xl mt-1' : 'text-base sm:text-lg'
                      }`}
                    >
                      {item.title}
                    </h4>

                    {isWide && (
                      <span className="p-1 rounded-full bg-white/20 text-white group-hover:bg-[#bb0013] transition-colors">
                        <Eye className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {(isLarge || isTall) && (
                    <p className="text-xs text-blue-100/90 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
