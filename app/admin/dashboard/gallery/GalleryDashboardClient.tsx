'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowUp, Check, Images, LoaderCircle, LogOut, Plus, Trash2, Upload, Users, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import RouteTransitionLoader from '@/components/ui/RouteTransitionLoader';

const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export interface GalleryRow {
  id: string;
  image_url: string | null;
  image_path: string | null;
  instagram_url: string | null;
  alt_text: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  chapter_id: string | null;
}

interface ChapterRow {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DraftRow {
  key: string;
  id?: string;
  file?: File;
  preview: string;
  imageUrl: string;
  imagePath: string;
  altText: string;
  instagramUrl: string;
  isPublished: boolean;
  chapterId: string;
}

function normalizeInstagramUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' || !/^(www\.)?instagram\.com$/i.test(url.hostname) || !/^\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) return undefined;
    return `https://www.instagram.com${url.pathname.replace(/\/$/, '')}/`;
  } catch {
    return undefined;
  }
}

function publicPathFromUrl(url: string | null) {
  const marker = '/storage/v1/object/public/gallery-photos/';
  const index = url?.indexOf(marker) ?? -1;
  return index < 0 || !url ? null : decodeURIComponent(url.slice(index + marker.length));
}

function cleanDraft(row: DraftRow) {
  if (row.preview.startsWith('blob:')) URL.revokeObjectURL(row.preview);
}

export default function GalleryDashboardClient({ initialItems, initialLoadError, initialChapters, chaptersLoadError }: { initialItems: GalleryRow[]; initialLoadError: string; initialChapters: ChapterRow[]; chaptersLoadError: string }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialItems);
  const [chapters, setChapters] = useState(initialChapters);
  const [chapterName, setChapterName] = useState('');
  const [chapterNames, setChapterNames] = useState<Record<string, string>>({});
  const [savingChapter, setSavingChapter] = useState(false);
  const [updatingChapterId, setUpdatingChapterId] = useState('');
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [assigningItemId, setAssigningItemId] = useState('');
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<GalleryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteChapter, setConfirmDeleteChapter] = useState<ChapterRow | null>(null);
  const [deletingChapterId, setDeletingChapterId] = useState('');
  const [returning, setReturning] = useState(false);
  const [switchingToMembers, setSwitchingToMembers] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  const saveChapter = async () => {
    const name = chapterName.trim();
    if (!name) { showToast('Enter a chapter name first.'); return; }
    if (chapters.some((chapter) => chapter.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showToast('A chapter with this name already exists.'); return;
    }
    const baseSlug = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!baseSlug) { showToast('Use a chapter name that includes letters or numbers.'); return; }
    const usedSlugs = new Set(chapters.map((chapter) => chapter.slug));
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) { slug = `${baseSlug}-${suffix}`; suffix += 1; }

    setSavingChapter(true);
    const { data, error: insertError } = await createClient().from('chapters').insert({ name, slug, is_active: true }).select('id,name,slug,is_active,created_at,updated_at').single();
    if (insertError || !data) {
      showToast(insertError?.code === '23505' ? 'A chapter with this name or URL already exists.' : `Could not add chapter: ${insertError?.message ?? 'Unknown error.'}`);
    } else {
      setChapters((current) => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
      setChapterName('');
      showToast('Chapter added.');
    }
    setSavingChapter(false);
  };

  const updateChapter = async (chapter: ChapterRow, values: Partial<Pick<ChapterRow, 'name' | 'is_active'>>) => {
    const name = (values.name ?? chapterNames[chapter.id] ?? chapter.name).trim();
    if (!name) { showToast('Chapter name cannot be blank.'); return; }
    if (chapters.some((entry) => entry.id !== chapter.id && entry.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showToast('A chapter with this name already exists.'); return;
    }
    setUpdatingChapterId(chapter.id);
    const { data, error: updateError } = await createClient().from('chapters').update({ name, ...(values.is_active === undefined ? {} : { is_active: values.is_active }) }).eq('id', chapter.id).select('id,name,slug,is_active,created_at,updated_at').single();
    if (updateError || !data) showToast(updateError?.code === '23505' ? 'A chapter with this name already exists.' : `Could not update chapter: ${updateError?.message ?? 'Unknown error.'}`);
    else {
      setChapters((current) => current.map((entry) => entry.id === chapter.id ? data : entry).sort((a, b) => a.name.localeCompare(b.name)));
      setChapterNames((current) => { const next = { ...current }; delete next[chapter.id]; return next; });
      showToast(values.is_active === undefined ? 'Chapter name updated.' : values.is_active ? 'Chapter activated.' : 'Chapter deactivated.');
    }
    setUpdatingChapterId('');
  };

  const deleteChapter = async () => {
    if (!confirmDeleteChapter || deletingChapterId) return;
    const chapter = confirmDeleteChapter;
    if (items.some((item) => item.chapter_id === chapter.id)) {
      setConfirmDeleteChapter(null);
      showToast('Reassign or delete this chapter’s gallery items before deleting it. You can deactivate the chapter to keep its items.');
      return;
    }

    setDeletingChapterId(chapter.id);
    const { error: deleteError } = await createClient().from('chapters').delete().eq('id', chapter.id);
    if (deleteError) {
      showToast(`Could not delete chapter: ${deleteError.message}`);
    } else {
      setChapters((current) => current.filter((entry) => entry.id !== chapter.id));
      setChapterNames((current) => { const next = { ...current }; delete next[chapter.id]; return next; });
      showToast('Chapter deleted.');
    }
    setDeletingChapterId('');
    setConfirmDeleteChapter(null);
  };

  const assignChapter = async (item: GalleryRow) => {
    const chapterId = assignments[item.id];
    if (!chapterId || !chapters.some((chapter) => chapter.id === chapterId && chapter.is_active)) {
      showToast('Choose an active chapter before saving.'); return;
    }
    setAssigningItemId(item.id);
    const { error: updateError } = await createClient().from('gallery_items').update({ chapter_id: chapterId }).eq('id', item.id);
    if (updateError) showToast(`Could not assign this gallery item: ${updateError.message}`);
    else {
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, chapter_id: chapterId } : entry));
      setAssignments((current) => { const next = { ...current }; delete next[item.id]; return next; });
      showToast('Gallery item assigned to its chapter.');
    }
    setAssigningItemId('');
  };

  const startAdd = () => {
    setError('');
    setDrafts([]);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    drafts.forEach(cleanDraft);
    setDrafts([]);
    setError('');
    setProgress('');
    setIsFormOpen(false);
  };

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    const accepted: DraftRow[] = [];
    const rejected: string[] = [];
    files.forEach((file) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) rejected.push(`${file.name}: use JPEG, PNG, WebP, or AVIF.`);
      else if (file.size > MAX_SOURCE_BYTES) rejected.push(`${file.name}: the maximum source size is 5 MB.`);
      else accepted.push({ key: crypto.randomUUID(), file, preview: URL.createObjectURL(file), imageUrl: '', imagePath: '', altText: '', instagramUrl: '', isPublished: true, chapterId: '' });
    });
    if (rejected.length) setError(rejected.join(' '));
    setDrafts((current) => [...current, ...accepted]);
  };

  const replaceDraftImage = (key: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_SOURCE_BYTES) {
      setError('Choose a JPEG, PNG, WebP, or AVIF image up to 5 MB.');
      return;
    }
    setError('');
    setDrafts((current) => current.map((draft) => {
      if (draft.key !== key) return draft;
      cleanDraft(draft);
      return { ...draft, file, preview: URL.createObjectURL(file) };
    }));
  };

  const addInstagramOnly = () => setDrafts((current) => [...current, {
    key: crypto.randomUUID(), preview: '', imageUrl: '', imagePath: '', altText: '', instagramUrl: '', isPublished: true, chapterId: '',
  }]);

  const updateDraft = (key: string, values: Partial<DraftRow>) => setDrafts((current) => current.map((draft) => draft.key === key ? { ...draft, ...values } : draft));
  const removeDraft = (key: string) => setDrafts((current) => {
    const removed = current.find((draft) => draft.key === key);
    if (removed) cleanDraft(removed);
    return current.filter((draft) => draft.key !== key);
  });

  const editItem = (item: GalleryRow) => {
    setError('');
    setDrafts([{
      key: crypto.randomUUID(), id: item.id, preview: item.image_url ?? '', imageUrl: item.image_url ?? '',
      imagePath: item.image_path ?? publicPathFromUrl(item.image_url) ?? '', altText: item.alt_text ?? '',
      instagramUrl: item.instagram_url ?? '', isPublished: item.is_published, chapterId: item.chapter_id ?? '',
    }]);
    setIsFormOpen(true);
  };

  const saveDrafts = async () => {
    setError('');
    if (!drafts.length) { setError('Add at least one image or Instagram post.'); return; }
    const normalized = drafts.map((draft) => ({ draft, instagramUrl: normalizeInstagramUrl(draft.instagramUrl) }));
    if (normalized.some(({ draft, instagramUrl }) => !draft.file && !draft.imageUrl && !instagramUrl)) {
      setError('Each item needs an image or an Instagram post/Reel URL.'); return;
    }
    if (normalized.some(({ instagramUrl }) => instagramUrl === undefined)) {
      setError('Enter a valid Instagram post, Reel, or IGTV URL.'); return;
    }
    if (normalized.some(({ draft }) => !draft.chapterId || !chapters.some((chapter) => chapter.id === draft.chapterId && chapter.is_active))) {
      setError('Select an active chapter/location for every gallery item before saving.'); return;
    }
    setBusy(true);
    const supabase = createClient();
    const newStoragePaths: string[] = [];
    try {
      const prepared: Array<{ draft: DraftRow; imageUrl: string | null; imagePath: string | null; instagramUrl: string | null }> = [];
      for (let index = 0; index < normalized.length; index += 1) {
        const { draft, instagramUrl } = normalized[index];
        let imageUrl = draft.imageUrl || null;
        let imagePath = draft.imagePath || null;
        if (draft.file) {
          setProgress(`Compressing image ${index + 1} of ${normalized.length}…`);
          const compressed = await imageCompression(draft.file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            initialQuality: 0.82,
            useWebWorker: true,
            libURL: new URL('/vendor/browser-image-compression.js', window.location.origin).toString(),
            onProgress: (percent) => setProgress(`Compressing image ${index + 1} of ${normalized.length}… ${Math.round(percent)}%`),
          });
          const extensionByType: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
          const contentType = compressed.type || draft.file.type;
          const extension = extensionByType[contentType] ?? 'jpg';
          const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${extension}`;
          setProgress(`Uploading image ${index + 1} of ${normalized.length}…`);
          const { error: uploadError } = await supabase.storage.from('gallery-photos').upload(path, compressed, { contentType, cacheControl: '31536000', upsert: false });
          if (uploadError) throw uploadError;
          newStoragePaths.push(path);
          imagePath = path;
          imageUrl = supabase.storage.from('gallery-photos').getPublicUrl(path).data.publicUrl;
        }
        prepared.push({ draft, imageUrl, imagePath, instagramUrl: instagramUrl ?? null });
      }

      setProgress('Saving gallery items…');
      const existing = prepared.filter(({ draft }) => draft.id);
      const additions = prepared.filter(({ draft }) => !draft.id);
      for (const entry of existing) {
        const { draft, ...values } = entry;
        const { error: updateError } = await supabase.from('gallery_items').update({
          image_url: values.imageUrl,
          image_path: values.imagePath,
          instagram_url: values.instagramUrl,
          alt_text: draft.altText.trim() || null,
          is_published: draft.isPublished,
          chapter_id: draft.chapterId,
        }).eq('id', draft.id!);
        if (updateError) throw updateError;
        if (draft.imagePath && draft.imagePath !== values.imagePath) await supabase.storage.from('gallery-photos').remove([draft.imagePath]);
      }
      if (additions.length) {
        const nextOrder = items.reduce((max, item) => Math.max(max, item.display_order), -1) + 1;
        const rows = additions.map(({ draft, imageUrl, imagePath, instagramUrl }, index) => ({
          image_url: imageUrl,
          image_path: imagePath,
          instagram_url: instagramUrl,
          alt_text: draft.altText.trim() || null,
          is_published: draft.isPublished,
          chapter_id: draft.chapterId,
          display_order: nextOrder + index,
        }));
        const { error: insertError } = await supabase.from('gallery_items').insert(rows);
        if (insertError) throw insertError;
      }
      const { data, error: reloadError } = await supabase.from('gallery_items').select('*').order('display_order').order('created_at');
      if (!reloadError && data) setItems(data as GalleryRow[]);
      closeForm();
      showToast(existing.length ? 'Gallery item updated.' : `${additions.length} gallery ${additions.length === 1 ? 'item' : 'items'} saved.`);
    } catch (caught) {
      if (newStoragePaths.length) await supabase.storage.from('gallery-photos').remove(newStoragePaths);
      setError(caught instanceof Error ? caught.message : 'Could not save the gallery items. Please try again.');
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  const togglePublished = async (item: GalleryRow) => {
    const next = !item.is_published;
    const { error: updateError } = await createClient().from('gallery_items').update({ is_published: next }).eq('id', item.id);
    if (updateError) { showToast(`Could not update publishing: ${updateError.message}`); return; }
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_published: next } : entry));
    showToast(next ? 'Gallery item published.' : 'Gallery item hidden from the website.');
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= items.length) return;
    const first = items[index];
    const second = items[otherIndex];
    const supabase = createClient();
    const { error: firstError } = await supabase.from('gallery_items').update({ display_order: second.display_order }).eq('id', first.id);
    const { error: secondError } = await supabase.from('gallery_items').update({ display_order: first.display_order }).eq('id', second.id);
    if (firstError || secondError) { showToast('Could not reorder the gallery. Please try again.'); return; }
    const reordered = [...items];
    [reordered[index], reordered[otherIndex]] = [reordered[otherIndex], reordered[index]];
    setItems(reordered);
  };

  const deleteItem = async () => {
    if (!confirmDelete || isDeleting) return;
    const item = confirmDelete;
    setIsDeleting(true);
    const supabase = createClient();
    try {
      const { error: deleteError } = await supabase.from('gallery_items').delete().eq('id', item.id);
      if (deleteError) { showToast(`Could not delete this item: ${deleteError.message}`); return; }
      if (item.image_path) await supabase.storage.from('gallery-photos').remove([item.image_path]);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setConfirmDelete(null);
      showToast('Gallery item deleted.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.replace('/admin');
    router.refresh();
  };

  const inputClass = 'min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10';
  const activeChapters = chapters.filter((chapter) => chapter.is_active);
  const unassignedItems = items.filter((item) => !item.chapter_id);
  const chapterNameFor = (chapterId: string | null) => chapters.find((chapter) => chapter.id === chapterId)?.name ?? 'Unassigned';

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0b1c30]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-[76px] items-center border-b border-slate-100 px-6"><Link href="/" aria-label="Edge India home"><Image src="/compony-logos/edege-india-logo-png-file.png" alt="Edge India Business Group" width={190} height={48} className="h-9 w-auto object-contain object-left" /></Link></div>
        <div className="px-4 pt-7"><p className="px-3 pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Workspace</p><div className="space-y-1">
          <Link href="/admin/dashboard" onClick={(event) => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setSwitchingToMembers(true); }} className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-[#12358f]"><Users aria-hidden="true" className="h-4 w-4" />Members</Link>
          <Link href="/admin/dashboard/gallery" aria-current="page" className="flex min-h-11 items-center gap-3 rounded-md border-l-[3px] border-[#bb0013] bg-[#12358f]/[0.07] px-3 text-sm font-bold text-[#002069]"><Images aria-hidden="true" className="h-4 w-4" />Gallery</Link>
        </div></div>
        <div className="mt-auto border-t border-slate-100 p-4"><button type="button" onClick={handleSignOut} className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#12358f]"><LogOut aria-hidden="true" className="h-4 w-4" />Sign out</button></div>
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-10">
          <div className="min-w-0"><div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400"><span>Admin</span><span>/</span><span className="text-[#12358f]">Gallery</span></div><h1 className="mt-0.5 truncate text-sm font-extrabold text-[#002069] sm:text-base">Gallery management</h1></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3"><Link href="/admin/dashboard" aria-label="Members" onClick={(event) => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setSwitchingToMembers(true); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-[#12358f]/40 hover:text-[#12358f]"><Users aria-hidden="true" className="h-3.5 w-3.5" /><span className="hidden sm:inline">Members</span></Link><button type="button" onClick={handleSignOut} aria-label="Sign out" className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-[#12358f]/40 hover:text-[#12358f]"><LogOut aria-hidden="true" className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sign out</span></button><Link href="/" aria-label="Website" onClick={(event) => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setReturning(true); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-[#12358f]/40 hover:text-[#12358f]"><ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /><span className="hidden sm:inline">Website</span></Link></div>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          {initialLoadError ? <div role="alert" className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs leading-5 text-rose-800">Could not load gallery items: {initialLoadError}</div> : null}
          {chaptersLoadError ? <div role="alert" className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs leading-5 text-rose-800">Could not load chapters: {chaptersLoadError}</div> : null}

          <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-5"><h2 className="text-sm font-extrabold text-[#002069]">Chapter management</h2><p className="mt-1 text-xs text-slate-500">Add and manage locations used to organize activities. Deactivating keeps gallery items; chapters with assigned items must be reassigned or emptied before deletion.</p></div>
            <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
              <label className="sr-only" htmlFor="new-chapter-name">New chapter name</label>
              <input id="new-chapter-name" className={`${inputClass} sm:max-w-sm`} value={chapterName} onChange={(event) => setChapterName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void saveChapter(); } }} placeholder="New chapter name" />
              <button type="button" onClick={() => void saveChapter()} disabled={savingChapter} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#12358f] px-4 text-xs font-bold text-white hover:bg-[#002069] disabled:opacity-50">{savingChapter ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Plus aria-hidden="true" className="h-4 w-4" />}Add chapter</button>
            </div>
            {chapters.length ? <ul className="divide-y divide-slate-100">
              {chapters.map((chapter) => {
                const chapterItemCount = items.filter((item) => item.chapter_id === chapter.id).length;
                const editedName = chapterNames[chapter.id] ?? chapter.name;
                return <li key={chapter.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5">
                  <div className="min-w-0 flex-1"><label className="sr-only" htmlFor={`chapter-name-${chapter.id}`}>Chapter name</label><input id={`chapter-name-${chapter.id}`} value={editedName} onChange={(event) => setChapterNames((current) => ({ ...current, [chapter.id]: event.target.value }))} className="min-h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-200 focus:border-[#12358f] focus:bg-white sm:max-w-xs" /><p className="px-2 text-[11px] text-slate-400">/{chapter.slug} · {chapterItemCount} {chapterItemCount === 1 ? 'gallery item' : 'gallery items'}</p></div>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${chapter.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{chapter.is_active ? 'Active' : 'Inactive'}</span>
                  {editedName.trim() !== chapter.name ? <button type="button" onClick={() => void updateChapter(chapter, { name: editedName })} disabled={updatingChapterId === chapter.id} className="min-h-9 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-[#12358f]/40 hover:text-[#12358f] disabled:opacity-50">{updatingChapterId === chapter.id ? 'Saving…' : 'Save name'}</button> : null}
                  <button type="button" onClick={() => void updateChapter(chapter, { is_active: !chapter.is_active })} disabled={updatingChapterId === chapter.id} className="min-h-9 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-[#12358f]/40 hover:text-[#12358f] disabled:opacity-50">{chapter.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button type="button" onClick={() => setConfirmDeleteChapter(chapter)} disabled={chapterItemCount > 0 || deletingChapterId === chapter.id} title={chapterItemCount > 0 ? 'Reassign or delete its gallery items before deleting this chapter.' : 'Delete chapter'} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-rose-100 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 aria-hidden="true" className="h-3.5 w-3.5" />{deletingChapterId === chapter.id ? 'Deleting…' : 'Delete'}</button>
                </li>;
              })}
            </ul> : <p className="px-5 py-6 text-center text-xs text-slate-500">No chapters found.</p>}
          </section>

          {unassignedItems.length > 0 ? <section className="mb-6 overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
            <div className="border-b border-amber-100 bg-amber-50/70 px-4 py-4 sm:px-5"><h2 className="text-sm font-extrabold text-[#002069]">Gallery items needing a chapter <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-[11px] text-amber-800">{unassignedItems.length}</span></h2><p className="mt-1 text-xs text-slate-600">Assign each existing item to the correct location. Select the chapter based on your knowledge; no location is preselected.</p></div>
            {unassignedItems.length ? <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">{unassignedItems.map((item) => {
              const instagramPreview = (() => { try { if (!item.instagram_url) return null; const url = new URL(item.instagram_url); return `https://www.instagram.com${url.pathname.replace(/\/$/, '')}/embed`; } catch { return null; } })();
              return <article key={item.id} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="relative aspect-[4/3] bg-slate-100">{item.image_url ? <img src={item.image_url} alt={item.alt_text ?? 'Unassigned gallery item'} className="h-full w-full object-cover" /> : instagramPreview ? <iframe src={instagramPreview} title="Unassigned Instagram activity preview" loading="lazy" scrolling="no" className="h-full w-full border-0 bg-white" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">Preview unavailable</div>}</div>
                <div className="space-y-3 p-4"><p className="truncate text-xs font-bold text-[#002069]">{item.alt_text || (item.instagram_url ? 'Instagram post or Reel' : 'Gallery photo')}</p><label className="block"><span className="mb-1 block text-[11px] font-bold text-slate-600">Correct chapter</span><select aria-label={`Choose chapter for ${item.alt_text || 'gallery item'}`} value={assignments[item.id] ?? ''} onChange={(event) => setAssignments((current) => ({ ...current, [item.id]: event.target.value }))} className={inputClass}><option value="">Select a chapter</option>{activeChapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.name}</option>)}</select></label><button type="button" onClick={() => void assignChapter(item)} disabled={!assignments[item.id] || assigningItemId === item.id} className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-md bg-[#12358f] px-3 text-xs font-bold text-white hover:bg-[#002069] disabled:cursor-not-allowed disabled:opacity-45">{assigningItemId === item.id ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Check aria-hidden="true" className="h-4 w-4" />}Save chapter assignment</button></div>
              </article>;
            })}</div> : <p className="px-5 py-8 text-center text-xs text-slate-500">All existing gallery items have a chapter.</p>}
          </section> : null}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h3 className="text-sm font-extrabold text-[#002069]">Website gallery</h3><p className="mt-1 text-xs text-slate-500">{items.length} {items.length === 1 ? 'item' : 'items'} · photos are compressed before upload</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => router.refresh()} className="min-h-9 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-[#12358f]/40 hover:text-[#12358f]">Refresh</button><button type="button" onClick={startAdd} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#12358f] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#002069]"><Plus aria-hidden="true" className="h-4 w-4" />Add gallery items</button></div></div>
            {items.length ? <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">{items.map((item, index) => <article key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] bg-slate-100">{item.image_url ? <img src={item.image_url} alt={item.alt_text ?? ''} className="h-full w-full object-cover" /> : item.instagram_url ? <iframe src={`${new URL(item.instagram_url).origin}${new URL(item.instagram_url).pathname.replace(/\/$/, '')}/embed`} title="Instagram item preview" loading="lazy" scrolling="no" className="h-full w-full border-0 bg-white" /> : null}<span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{item.is_published ? 'Published' : 'Hidden'}</span></div>
              <div className="p-4"><p className="truncate text-xs font-bold text-[#002069]">{item.alt_text || (item.image_url ? 'Gallery photo' : 'Instagram post or Reel')}</p><p className="mt-1 truncate text-[11px] text-slate-400">{item.instagram_url ?? 'No Instagram link'}</p><p className="mt-2 text-[11px] font-semibold text-[#526582]">Chapter: {chapterNameFor(item.chapter_id)}</p><div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={() => void togglePublished(item)} className="min-h-8 rounded-md border border-slate-200 px-2.5 text-[11px] font-bold text-slate-600 hover:border-[#12358f]/40 hover:text-[#12358f]">{item.is_published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => editItem(item)} className="min-h-8 rounded-md border border-slate-200 px-2.5 text-[11px] font-bold text-slate-600 hover:border-[#12358f]/40 hover:text-[#12358f]">Edit</button><button type="button" onClick={() => void moveItem(index, -1)} disabled={index === 0} aria-label="Move item up" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-[#12358f] disabled:opacity-40"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" onClick={() => void moveItem(index, 1)} disabled={index === items.length - 1} aria-label="Move item down" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-[#12358f] disabled:opacity-40"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setConfirmDelete(item)} aria-label="Delete gallery item" className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border border-rose-100 text-rose-500 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button></div></div>
            </article>)}</div> : <div className="px-5 py-16 text-center"><Images aria-hidden="true" className="mx-auto h-8 w-8 text-slate-300" /><h4 className="mt-3 text-sm font-bold text-slate-700">Your gallery is empty</h4><p className="mt-1 text-xs text-slate-500">Upload several photos at once or add an Instagram post/Reel link.</p><button type="button" onClick={startAdd} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#12358f] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002069]"><Plus aria-hidden="true" className="h-4 w-4" />Add your first gallery item</button></div>}
          </section>
        </main>
      </div>

      {isFormOpen ? <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/45 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) closeForm(); }}><section role="dialog" aria-modal="true" aria-labelledby="gallery-form-title" className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7"><div><h2 id="gallery-form-title" className="text-lg font-extrabold text-[#002069]">{drafts.some((draft) => draft.id) ? 'Edit gallery item' : 'Add gallery items'}</h2><p className="mt-1 text-xs text-slate-500">Select multiple photos. Each photo becomes its own gallery item.</p></div><button type="button" onClick={closeForm} disabled={busy} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => fileInput.current?.click()} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#12358f]/30 bg-[#12358f]/[0.03] px-4 text-center text-sm font-bold text-[#12358f] hover:bg-[#12358f]/[0.07]"><Upload aria-hidden="true" className="h-5 w-5" />{drafts.some((draft) => draft.id) ? 'Replace image' : 'Choose images from your computer'}<span className="text-[11px] font-medium text-slate-500">{drafts.some((draft) => draft.id) ? 'JPEG, PNG, WebP, or AVIF · max 5 MB' : 'Select multiple · up to 5 MB each'}</span></button><button type="button" onClick={addInstagramOnly} disabled={drafts.some((draft) => draft.id)} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 text-center text-sm font-bold text-slate-700 hover:border-[#12358f]/40 hover:bg-slate-50 disabled:opacity-50"><Plus aria-hidden="true" className="h-5 w-5" />Add Instagram post or Reel<span className="text-[11px] font-medium text-slate-500">Create a link-only gallery item</span></button><input ref={fileInput} type="file" multiple={!drafts.some((draft) => draft.id)} accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={drafts.some((draft) => draft.id) ? (event) => replaceDraftImage(drafts[0].key, event) : selectFiles} /></div>
          {error ? <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-700">{error}</p> : null}
          {drafts.map((draft, index) => {
            const existingChapter = chapters.find((chapter) => chapter.id === draft.chapterId);
            const chapterOptions = [...activeChapters, ...(existingChapter && !existingChapter.is_active ? [existingChapter] : [])];
            return <article key={draft.key} className="overflow-hidden rounded-lg border border-slate-200"><div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3"><p className="text-xs font-bold text-[#002069]">{draft.id ? 'Editing existing item' : `Gallery item ${index + 1}`}</p><button type="button" onClick={() => removeDraft(draft.key)} disabled={busy || !!draft.id} aria-label="Remove this item" className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"><X className="h-4 w-4" /></button></div><div className="grid gap-4 p-4 sm:grid-cols-[130px_1fr]">{draft.preview ? <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100 sm:aspect-auto sm:min-h-[130px]">{draft.preview.includes('instagram.com') ? <div className="flex h-full items-center justify-center p-3 text-center text-xs text-slate-500">Existing image</div> : <img src={draft.preview} alt="Selected gallery preview" className="absolute inset-0 h-full w-full object-cover" />}{draft.file ? <span className="absolute inset-x-1 bottom-1 truncate rounded bg-black/65 px-1.5 py-1 text-[9px] text-white">{draft.file.name}</span> : null}</div> : <div className="flex min-h-20 items-center justify-center rounded-md bg-slate-50 text-xs text-slate-400 sm:min-h-[130px]">Instagram only</div>}<div className="space-y-3"><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">Image description <span className="font-normal text-slate-400">(optional)</span></span><input className={inputClass} value={draft.altText} onChange={(event) => updateDraft(draft.key, { altText: event.target.value })} placeholder="Describe the photo for accessibility" /></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">Instagram post or Reel URL <span className="font-normal text-slate-400">(optional)</span></span><input className={inputClass} type="url" value={draft.instagramUrl} onChange={(event) => updateDraft(draft.key, { instagramUrl: event.target.value })} placeholder="https://www.instagram.com/reel/..." /></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">Chapter / Location <span className="text-rose-600">*</span></span><select required value={draft.chapterId} onChange={(event) => updateDraft(draft.key, { chapterId: event.target.value })} className={inputClass}><option value="">Select a chapter</option>{chapterOptions.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.name}{chapter.is_active ? '' : ' (inactive — reassign)'}</option>)}</select>{existingChapter && !existingChapter.is_active ? <span className="mt-1 block text-[11px] text-amber-700">This chapter is inactive. Choose an active chapter to save.</span> : null}</label><label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={draft.isPublished} onChange={(event) => updateDraft(draft.key, { isPublished: event.target.checked })} className="h-4 w-4 accent-[#12358f]" />Publish this item on the website</label>{!draft.id && !draft.preview ? <p className="text-[11px] text-slate-400">Enter an Instagram URL above to make this item ready to save.</p> : null}</div></div></article>;
          })}
          {progress ? <div role="status" className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2.5 text-xs font-semibold text-[#12358f]"><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />{progress}</div> : null}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-7"><button type="button" onClick={closeForm} disabled={busy} className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="button" onClick={() => void saveDrafts()} disabled={busy || drafts.length === 0} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#12358f] px-4 text-sm font-bold text-white hover:bg-[#002069] disabled:opacity-50">{busy ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Check aria-hidden="true" className="h-4 w-4" />}{busy ? 'Saving…' : 'Save gallery items'}</button></div>
      </section></div> : null}

      {confirmDelete ? <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (!isDeleting && event.target === event.currentTarget) setConfirmDelete(null); }}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-gallery-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 aria-hidden="true" className="h-5 w-5" /></div><h2 id="delete-gallery-title" className="mt-4 text-lg font-extrabold text-[#002069]">Delete this gallery item?</h2><p className="mt-2 text-sm leading-6 text-slate-500">It will be removed from the website and its uploaded image will be deleted.</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={isDeleting} onClick={() => setConfirmDelete(null)} className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="button" disabled={isDeleting} onClick={() => void deleteItem()} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-70">{isDeleting ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />Deleting…</> : 'Delete item'}</button></div></section></div> : null}
      {confirmDeleteChapter ? <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (!deletingChapterId && event.target === event.currentTarget) setConfirmDeleteChapter(null); }}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-chapter-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 aria-hidden="true" className="h-5 w-5" /></div><h2 id="delete-chapter-title" className="mt-4 text-lg font-extrabold text-[#002069]">Delete {confirmDeleteChapter.name}?</h2><p className="mt-2 text-sm leading-6 text-slate-500">This permanently removes the chapter. It can only be deleted when no gallery items are assigned to it.</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={deletingChapterId === confirmDeleteChapter.id} onClick={() => setConfirmDeleteChapter(null)} className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="button" disabled={deletingChapterId === confirmDeleteChapter.id} onClick={() => void deleteChapter()} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-70">{deletingChapterId === confirmDeleteChapter.id ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />Deleting…</> : 'Delete chapter'}</button></div></section></div> : null}
      {toast ? <div role="status" className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-2 rounded-lg bg-[#002069] px-4 py-3 text-xs font-semibold text-white shadow-xl"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-300" />{toast}</div> : null}
      {switchingToMembers ? <RouteTransitionLoader message="Opening the member directory…" /> : null}
      {returning ? <RouteTransitionLoader message="Returning to the Edge India website…" /> : null}
    </div>
  );
}
