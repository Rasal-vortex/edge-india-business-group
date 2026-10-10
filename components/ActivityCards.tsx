'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface ActivityGalleryItem {
  id: string;
  image_url: string | null;
  instagram_url: string | null;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

function instagramEmbedUrl(url: string) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/$/, '');
  return `https://www.instagram.com${path}/embed`;
}

export default function ActivityCards({ items }: { items: ActivityGalleryItem[] }) {
  const [selected, setSelected] = useState<ActivityGalleryItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  return <>
    <div aria-label="Community activity gallery" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {items.map((item, index) => {
        if (item.image_url) return <article key={item.id} className="group relative h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(0,32,105,0.09)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,32,105,0.16)]">
          <img src={item.image_url} alt={item.alt_text ?? ''} loading="lazy" className="h-full w-full object-cover" />
          {item.instagram_url ? <button type="button" onClick={() => setSelected(item)} aria-label="Open the related Instagram post or Reel" className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-slate-950/35 via-transparent to-transparent p-4"><span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#002069]">Play on Instagram ↗</span></button> : null}
        </article>;
        if (!item.instagram_url) return null;
        return <article key={item.id} className="h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(0,32,105,0.09)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,32,105,0.16)]">
          <iframe src={instagramEmbedUrl(item.instagram_url)} title={`Instagram community video ${index + 1}`} loading="lazy" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen className="block h-full min-h-[400px] w-full overflow-hidden border-0 bg-white" />
        </article>;
      })}
    </div>

    {selected?.instagram_url ? <div role="presentation" className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section role="dialog" aria-modal="true" aria-label="Instagram community post" className="relative h-[min(82vh,760px)] w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button type="button" onClick={() => setSelected(null)} aria-label="Close Instagram post" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow"><X className="h-5 w-5" /></button>
        <iframe src={instagramEmbedUrl(selected.instagram_url)} title="Instagram community video" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" />
      </section>
    </div> : null}
  </>;
}
