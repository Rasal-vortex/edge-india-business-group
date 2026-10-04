'use client';

import React from 'react';
import Image from 'next/image';
import { X, MapPin, Users, Award, ArrowRight } from 'lucide-react';
import { GalleryItem } from './data';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onInquire: (item: GalleryItem) => void;
}

export default function LightboxModal({ item, onClose, onInquire }: LightboxModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors border border-white/20"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Container */}
        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] bg-slate-900 shrink-0 overflow-hidden">
          <Image
            src={item.image}
            alt={`Illustrative image for ${item.title}`}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Overlay Tag & Title */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <span className="inline-block px-2.5 py-0.5 bg-[#bb0013] text-white text-[11px] font-bold uppercase tracking-wider rounded mb-2">
              {item.tag}
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Modal Info Bar */}
        <div className="p-5 sm:p-6 bg-white overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            {item.location ? <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-[#bb0013] shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Location / format</p>
                <p className="text-slate-500">{item.location}</p>
              </div>
            </div> : null}
            {item.participants ? <div className="flex items-center gap-2 text-slate-700">
              <Users className="w-4 h-4 text-[#12358f] shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Community</p>
                <p className="text-slate-500 truncate">{item.participants}</p>
              </div>
            </div> : null}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002069] mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#bb0013]" />
              About this activity
            </h4>
            <div className="space-y-1.5">
              {item.keyTakeaways.map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12358f] mt-1 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Illustrative image; this is not a photograph of a specific chapter event.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onInquire(item);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12358f] hover:bg-[#002069] text-white text-xs font-bold rounded transition-colors"
              >
                Contact the chapter
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
