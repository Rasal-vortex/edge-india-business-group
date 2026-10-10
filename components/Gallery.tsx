'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { createClient } from '@/lib/supabase/client';
import ActivityCards, { type ActivityGalleryItem } from '@/components/ActivityCards';
import ActivityChapterButton from '@/components/ActivityChapterButton';
import RouteTransitionLoader from '@/components/ui/RouteTransitionLoader';

interface ActivityChapter {
  id: string;
  name: string;
  slug: string;
}

const preferredChapterOrder = ['manjeri', 'kondotty', 'calicut', 'wayanad'];

function sortChapters(chapters: ActivityChapter[]) {
  return [...chapters].sort((a, b) => {
    const aIndex = preferredChapterOrder.indexOf(a.name.trim().toLowerCase());
    const bIndex = preferredChapterOrder.indexOf(b.name.trim().toLowerCase());
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.name.localeCompare(b.name);
  });
}

export default function Gallery() {
  const reduceMotion = useReducedMotion();
  const [chapters, setChapters] = useState<ActivityChapter[]>([]);
  const [chaptersLoaded, setChaptersLoaded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('all');
  const [items, setItems] = useState<ActivityGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [chapterError, setChapterError] = useState('');
  const [openingActivities, setOpeningActivities] = useState(false);

  useEffect(() => {
    let active = true;
    void createClient().from('chapters').select('id,name,slug').eq('is_active', true).order('name', { ascending: true }).then(({ data, error }) => {
      if (!active) return;
      if (error) setChapterError(error.message);
      else setChapters(sortChapters((data ?? []) as ActivityChapter[]));
      setChaptersLoaded(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!chaptersLoaded) return;
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setLoadError('');
      const chapter = selectedSlug === 'all' ? null : chapters.find((entry) => entry.slug === selectedSlug);
      if (selectedSlug !== 'all' && !chapter) {
        setItems([]);
        setIsLoading(false);
        return;
      }
      let query = createClient().from('gallery_items').select('id,image_url,instagram_url,alt_text,display_order,created_at').eq('is_published', true);
      if (chapter) query = query.eq('chapter_id', chapter.id);
      const { data, error } = await query.order('display_order', { ascending: true }).order('created_at', { ascending: true }).order('id', { ascending: true }).limit(4);
      if (!active) return;
      if (error) setLoadError(error.message);
      else setItems((data ?? []) as ActivityGalleryItem[]);
      setIsLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [chaptersLoaded, chapters, selectedSlug]);

  const selectedChapter = chapters.find((chapter) => chapter.slug === selectedSlug);
  const viewAllHref = `/activities?chapter=${encodeURIComponent(selectedSlug)}`;

  return <section className="w-full border-b border-slate-200 bg-[#eff4ff]/60 py-16 lg:py-24" id="gallery">
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
      <div className="mb-8 flex justify-center text-center">
        <motion.div className="flex max-w-3xl flex-col items-center gap-2" initial={reduceMotion ? 'visible' : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}>
          <motion.div className="inline-flex items-center gap-2" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
            <span className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002069]">ACTIVITIES</span>
          </motion.div>
          <motion.h2 className="text-3xl font-extrabold tracking-tight text-[#0b1c30] sm:text-4xl lg:text-[40px]" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
            Ways our community connects, learns, and grows.
          </motion.h2>
          <motion.p className="text-base text-slate-600" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' } } }}>
            Explore meetings, learning sessions, and community activities by chapter.
          </motion.p>
        </motion.div>
      </div>

      {chapterError ? <p role="status" className="mb-4 text-center text-xs text-amber-800">Chapter filters are temporarily unavailable.</p> : null}
      <div role="group" aria-label="Filter activities by chapter" className="mb-7 flex flex-wrap justify-center gap-2">
        {[{ name: 'All Chapters', slug: 'all' }, ...chapters].map((chapter) => <ActivityChapterButton key={chapter.slug} name={chapter.name} slug={chapter.slug} selected={selectedSlug === chapter.slug} onClick={() => setSelectedSlug(chapter.slug)} />)}
      </div>

      {isLoading ? <div aria-label="Loading activities" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[400px] animate-pulse rounded-2xl bg-white/70" />)}</div>
        : loadError ? <p role="alert" className="py-10 text-center text-sm text-slate-500">Activities are temporarily unavailable. Please try again soon.</p>
          : items.length ? <ActivityCards items={items} />
            : <p className="py-10 text-center text-sm text-slate-500">{selectedChapter ? 'No activities available for this chapter yet.' : 'New community activities will appear here soon.'}</p>}

      <div className="mt-8 flex justify-center">
        <Link href={viewAllHref} onClick={(event) => {
          if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setOpeningActivities(true);
        }} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#12358f]/20 bg-white px-6 text-sm font-bold text-[#12358f] shadow-sm transition hover:border-[#12358f] hover:bg-[#12358f] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]">View all activities <span aria-hidden="true" className="ml-2">→</span></Link>
      </div>
    </div>
    {openingActivities ? <RouteTransitionLoader message="Opening all activities…" /> : null}
  </section>;
}
