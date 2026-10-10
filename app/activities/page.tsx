import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ActivitiesShell from './ActivitiesShell';
import ActivityCards, { type ActivityGalleryItem } from '@/components/ActivityCards';
import ActivityChapterButton from '@/components/ActivityChapterButton';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Activities | EDGE India Business Group',
  description: 'Browse EDGE India community activities by chapter.',
};

const PAGE_SIZE = 12;
type SearchParams = Promise<{ chapter?: string | string[]; page?: string | string[] }>;
type Chapter = { id: string; name: string; slug: string };
const preferredChapterOrder = ['manjeri', 'kondotty', 'calicut', 'wayanad'];

function sortChapters(chapters: Chapter[]) {
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

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(chapter: string, page: number) {
  const query = new URLSearchParams({ chapter });
  if (page > 1) query.set('page', String(page));
  return `/activities?${query.toString()}`;
}

export default async function ActivitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedSlug = single(params.chapter) ?? 'all';
  const requestedPage = Math.max(1, Number.parseInt(single(params.page) ?? '1', 10) || 1);
  const supabase = await createClient();
  const { data: chaptersData, error: chaptersError } = await supabase
    .from('chapters')
    .select('id,name,slug')
    .eq('is_active', true)
    .order('name', { ascending: true });
  const chapters = sortChapters((chaptersData ?? []) as Chapter[]);
  const matchedChapter = requestedSlug === 'all' ? null : chapters.find((chapter) => chapter.slug === requestedSlug) ?? null;
  const invalidChapter = requestedSlug !== 'all' && !matchedChapter;
  const selectedSlug = matchedChapter?.slug ?? 'all';
  const from = (requestedPage - 1) * PAGE_SIZE;

  let query = supabase
    .from('gallery_items')
    .select('id,image_url,instagram_url,alt_text,display_order,created_at', { count: 'exact' })
    .eq('is_published', true);
  if (matchedChapter) query = query.eq('chapter_id', matchedChapter.id);
  const { data, error: itemsError, count } = await query
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
    .order('id', { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  if (!invalidChapter && requestedPage > totalPages) redirect(pageHref(selectedSlug, totalPages));
  const items = (data ?? []) as ActivityGalleryItem[];

  return <ActivitiesShell>
    <main className="min-h-[70vh] bg-[#f8f9ff] pb-16 pt-28 text-[#0b1c30] sm:pt-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
        <div className="mb-5">
          <Link href="/#gallery" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#12358f]/15 bg-white/80 px-4 text-sm font-semibold text-[#12358f] transition hover:border-[#12358f]/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]">
            <span aria-hidden="true">←</span> Back to activities
          </Link>
        </div>
        <header className="mx-auto mb-9 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2"><span aria-hidden="true" className="h-1 w-2.5 rounded-full bg-[#bb0013]" /><span className="text-[11px] font-extrabold uppercase tracking-widest text-[#002069]">ACTIVITIES</span></div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Community activities</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Browse activities, meetings, and learning sessions by chapter.</p>
        </header>

        {chaptersError ? <p role="status" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">Chapter filters are temporarily unavailable.</p> : null}
        {invalidChapter ? <p role="status" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">That chapter is unavailable. Showing all activities.</p> : null}

        <nav aria-label="Filter activities by chapter" className="mb-8 flex flex-wrap justify-center gap-2">
          {[{ name: 'All Chapters', slug: 'all' }, ...chapters].map((chapter) => <ActivityChapterButton key={chapter.slug} name={chapter.name} slug={chapter.slug} selected={selectedSlug === chapter.slug} href={pageHref(chapter.slug, 1)} />)}
        </nav>

        <div className="mb-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <h2 className="text-lg font-bold text-[#19345f]">{matchedChapter ? `${matchedChapter.name} activities` : 'All chapter activities'}</h2>
          <p className="text-xs text-slate-500">{totalItems} {totalItems === 1 ? 'activity' : 'activities'}</p>
        </div>

        {itemsError ? <p role="alert" className="py-16 text-center text-sm text-slate-600">Activities could not be loaded right now. Please try again.</p>
          : items.length ? <ActivityCards items={items} />
            : <p className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-600">{matchedChapter ? 'No activities available for this chapter yet.' : 'No activities are available yet.'}</p>}

        {totalPages > 1 ? <nav aria-label="Activity pages" className="mt-9 flex items-center justify-center gap-3">
          {requestedPage > 1 ? <Link href={pageHref(selectedSlug, requestedPage - 1)} className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#12358f] hover:border-[#12358f]/40">Previous</Link> : null}
          <span className="text-xs font-semibold text-slate-500">Page {requestedPage} of {totalPages}</span>
          {requestedPage < totalPages ? <Link href={pageHref(selectedSlug, requestedPage + 1)} className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#12358f] hover:border-[#12358f]/40">Next</Link> : null}
        </nav> : null}
      </div>
    </main>
  </ActivitiesShell>;
}
