'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface GalleryItem {
  id: string;
  image_url: string | null;
  instagram_url: string | null;
  alt_text: string | null;
  display_order: number;
}

function instagramEmbedUrl(url: string) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/$/, '');
  return `https://www.instagram.com${path}/embed`;
}

export default function Gallery() {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('gallery_items')
          .select('id,image_url,instagram_url,alt_text,display_order')
          .eq('is_published', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (active) setItems((data ?? []) as GalleryItem[]);
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  return (
    <section className="w-full border-b border-slate-200 bg-[#eff4ff]/60 py-16 lg:py-24" id="gallery">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
        <div className="mb-10 flex justify-center text-center">
          <motion.div
            className="flex max-w-3xl flex-col items-center gap-2"
            initial={reduceMotion ? 'visible' : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}
          >
            <motion.div className="inline-flex items-center gap-2" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
              <span className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002069]">ACTIVITIES</span>
            </motion.div>
            <motion.h2 className="text-3xl font-extrabold tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[40px]" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
              Ways our community connects, learns, and grows.
            </motion.h2>
            <motion.p className="text-base text-slate-600" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
              Explore the meeting formats, learning sessions, and local business activities described by the Manjeri chapter.
            </motion.p>
          </motion.div>
        </div>

        {isLoading ? (
          <div aria-label="Loading gallery" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className={`h-[400px] animate-pulse rounded-2xl bg-white/70 ${index >= 4 ? 'hidden sm:block' : ''}`} />)}
          </div>
        ) : loadError ? (
          <p role="status" className="py-10 text-center text-sm text-slate-500">The gallery is temporarily unavailable. Please try again soon.</p>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">New community activities will appear here soon.</p>
        ) : (
          <div aria-label="Community activity gallery" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {items.map((item, index) => {
              const hiddenOnMobile = index >= 5 ? 'hidden sm:block' : '';
              if (item.image_url) {
                return (
                  <article key={item.id} className={`group relative h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(0,32,105,0.09)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,32,105,0.16)] ${hiddenOnMobile}`}>
                    <img src={item.image_url} alt={item.alt_text ?? ''} loading="lazy" className="h-full w-full object-cover" />
                    {item.instagram_url ? <button type="button" onClick={() => setSelected(item)} aria-label="Open the related Instagram post or Reel" className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-slate-950/35 via-transparent to-transparent p-4"><span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#002069]">Play on Instagram ↗</span></button> : null}
                  </article>
                );
              }
              if (!item.instagram_url) return null;
              return (
                <article key={item.id} className={`h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(0,32,105,0.09)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,32,105,0.16)] ${hiddenOnMobile}`}>
                  <iframe src={instagramEmbedUrl(item.instagram_url)} title={`Instagram community video ${index + 1}`} loading="lazy" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen className="block h-full min-h-[400px] w-full overflow-hidden border-0 bg-white" />
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selected?.instagram_url ? (
        <div role="presentation" className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section role="dialog" aria-modal="true" aria-label="Instagram community post" className="relative h-[min(82vh,760px)] w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <button type="button" onClick={() => setSelected(null)} aria-label="Close Instagram post" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow"><X className="h-5 w-5" /></button>
            <iframe src={instagramEmbedUrl(selected.instagram_url)} title="Instagram community video" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" />
          </section>
        </div>
      ) : null}
    </section>
  );
}
