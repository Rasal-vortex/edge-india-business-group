'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDownUp, ArrowLeft, Building2, Check, ChevronDown, CirclePlus, FileText, LayoutDashboard, LogOut, Pencil, Search, Trash2, Users, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import type { MemberRow } from '@/lib/members';
import RouteTransitionLoader from '@/components/ui/RouteTransitionLoader';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_SOURCE_PHOTO_BYTES = 5 * 1024 * 1024;
const SUPPORTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
type SaveStage = 'compressing' | 'uploading' | 'saving' | null;

interface AdminMember {
  id: string;
  name: string;
  company: string;
  designation: string | null;
  category: string | null;
  bio: string | null;
  image: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  display_order: number;
}
type MemberFormValues = Omit<AdminMember, 'id'>;
const fromRow = (row: MemberRow): AdminMember => ({
  id: row.id,
  name: row.name,
  company: row.company,
  designation: row.designation,
  category: row.category,
  bio: row.bio,
  image: row.image_url,
  website: row.website,
  email: row.email,
  phone: row.phone,
  is_active: row.is_active,
  display_order: row.display_order,
});
const photoPath = (url: string | null) => {
  const marker = '/storage/v1/object/public/member-photos/';
  const index = url?.indexOf(marker) ?? -1;
  return index < 0 || !url ? null : decodeURIComponent(url.slice(index + marker.length));
};

const optionalValue = (value: FormDataEntryValue | null) => {
  const clean = String(value ?? '').trim();
  return clean || null;
};

function MemberFormDialog({
  member,
  designationOptions,
  categoryOptions,
  onClose,
  onSave,
  isSaving,
  saveStage,
  compressionProgress,
}: {
  member: AdminMember | null;
  designationOptions: string[];
  categoryOptions: string[];
  onClose: () => void;
  onSave: (values: MemberFormValues, photoFile?: File) => Promise<void>;
  isSaving: boolean;
  saveStage: SaveStage;
  compressionProgress: number;
}) {
  const [error, setError] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState(member?.image ?? '');
  const [uploadPreview, setUploadPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedFileName, setSelectedFileName] = useState('');
  const [removeCurrentUpload, setRemoveCurrentUpload] = useState(false);

  useEffect(() => () => {
    if (uploadPreview.startsWith('blob:')) URL.revokeObjectURL(uploadPreview);
  }, [uploadPreview]);

  const changeImageMode = (mode: 'url' | 'upload') => {
    setImageMode(mode);
    if (mode === 'url') {
      setImageUrl(member?.image ?? '');
      setSelectedFileName('');
      if (uploadPreview.startsWith('blob:')) URL.revokeObjectURL(uploadPreview);
      setUploadPreview('');
      setSelectedFile(undefined);
    } else {
      setImageUrl('');
      setUploadPreview(member?.image ?? '');
      setSelectedFile(undefined);
    }
    setRemoveCurrentUpload(false);
  };

  const chooseImage = (file?: File) => {
    if (!file) return;
    setError('');
    if (!SUPPORTED_PHOTO_TYPES.includes(file.type)) {
      setError('Choose a JPEG, PNG, WebP, or AVIF image.');
      return;
    }
    if (file.size > MAX_SOURCE_PHOTO_BYTES) {
      setError('Choose an image up to 5 MB.');
      return;
    }
    if (uploadPreview.startsWith('blob:')) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setRemoveCurrentUpload(false);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    if (!name || !company) {
      setError('Name and company are required.');
      return;
    }
    if (selectedFile && (!SUPPORTED_PHOTO_TYPES.includes(selectedFile.type) || selectedFile.size > MAX_SOURCE_PHOTO_BYTES)) {
      setError('Choose a supported image up to 5 MB.');
      return;
    }
    const image = imageMode === 'url'
      ? optionalValue(imageUrl)
      : (removeCurrentUpload ? null : member?.image ?? null);
    await onSave({
      name,
      company,
      designation: optionalValue(data.get('designation')),
      category: optionalValue(data.get('category')),
      bio: optionalValue(data.get('bio')),
      image,
      website: optionalValue(data.get('website')),
      email: optionalValue(data.get('email')),
      phone: optionalValue(data.get('phone')),
      is_active: member?.is_active ?? true,
      display_order: member?.display_order ?? 0,
    }, imageMode === 'upload' ? selectedFile : undefined);
  };

  const inputClass = 'min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10';
  const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700';

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/45 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="member-form-title" className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#bb0013]">Member directory</p>
            <h2 id="member-form-title" className="mt-1 text-xl font-extrabold text-[#002069]">{member ? 'Edit member' : 'Add a member'}</h2>
            <p className="mt-1 text-xs text-slate-500">Name and company are the only required fields.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="grid flex-1 gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8">
            <div><label className={labelClass} htmlFor="member-name">Name <span className="text-[#bb0013]">*</span></label><input autoFocus id="member-name" name="name" required defaultValue={member?.name ?? ''} className={inputClass} placeholder="Full name" /></div>
            <div><label className={labelClass} htmlFor="member-company">Company <span className="text-[#bb0013]">*</span></label><input id="member-company" name="company" required defaultValue={member?.company ?? ''} className={inputClass} placeholder="Company or organization" /></div>
            <div><label className={labelClass} htmlFor="member-designation">Designation</label><input id="member-designation" name="designation" list="member-designation-options" defaultValue={member?.designation ?? ''} className={inputClass} placeholder="Type or choose a designation" /><datalist id="member-designation-options">{designationOptions.map((designation) => <option key={designation} value={designation} />)}</datalist><p className="mt-1 text-[10px] text-slate-400">Saved designations appear here for next time.</p></div>
            <div><label className={labelClass} htmlFor="member-category">Category</label><input id="member-category" name="category" list="member-category-options" defaultValue={member?.category ?? ''} className={inputClass} placeholder="Type or choose a category" /><datalist id="member-category-options">{categoryOptions.map((category) => <option key={category} value={category} />)}</datalist><p className="mt-1 text-[10px] text-slate-400">Saved categories appear here for next time.</p></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="member-bio">Bio</label><textarea id="member-bio" name="bio" rows={4} defaultValue={member?.bio ?? ''} className={`${inputClass} resize-y`} placeholder="A short professional introduction" /></div>
            <fieldset className="sm:col-span-2">
              <legend className={labelClass}>Member photo <span className="font-normal text-slate-400">(optional, choose one source)</span></legend>
              <div className="mb-3 inline-flex rounded-md border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Choose photo source">
                <button type="button" aria-pressed={imageMode === 'url'} onClick={() => changeImageMode('url')} className={`min-h-8 rounded px-3 text-xs font-bold transition ${imageMode === 'url' ? 'bg-white text-[#12358f] shadow-sm' : 'text-slate-500 hover:text-[#12358f]'}`}>Photo URL</button>
                <button type="button" aria-pressed={imageMode === 'upload'} onClick={() => changeImageMode('upload')} className={`min-h-8 rounded px-3 text-xs font-bold transition ${imageMode === 'upload' ? 'bg-white text-[#12358f] shadow-sm' : 'text-slate-500 hover:text-[#12358f]'}`}>Upload from computer</button>
              </div>
              {imageMode === 'url' ? (
                <input id="member-image-url" type="text" inputMode="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={inputClass} placeholder="https://example.com/photo.jpg" />
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                  <label htmlFor="member-image-file" className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-3 py-4 text-center transition hover:bg-white focus-within:outline focus-within:outline-2 focus-within:outline-[#12358f]">
                  {uploadPreview ? <img src={uploadPreview} alt="Selected member photo preview" className="mb-2 h-24 w-24 rounded-lg border border-slate-200 object-cover" /> : <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#12358f]/[0.08] text-xl text-[#12358f]">+</span>}
                    <span className="text-xs font-bold text-[#12358f]">{selectedFileName || (uploadPreview ? 'Current uploaded photo' : 'Choose a photo from your computer')}</span>
                    <span className="text-[10px] text-slate-400">JPEG, PNG, WebP or AVIF · up to 5 MB; optimized to about 1 MB / 1600 px before upload.</span>
                    <input id="member-image-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => chooseImage(event.target.files?.[0])} />
                  </label>
                  {uploadPreview ? <button type="button" onClick={() => { if (uploadPreview.startsWith('blob:')) URL.revokeObjectURL(uploadPreview); setUploadPreview(''); setSelectedFile(undefined); setSelectedFileName(''); setRemoveCurrentUpload(true); }} className="mt-2 text-xs font-bold text-rose-600 hover:underline">Remove photo</button> : null}
                </div>
              )}
            </fieldset>
            <div><label className={labelClass} htmlFor="member-website">Website</label><input id="member-website" name="website" type="url" defaultValue={member?.website ?? ''} className={inputClass} placeholder="https://company.com" /></div>
            <div><label className={labelClass} htmlFor="member-email">Email</label><input id="member-email" name="email" type="email" defaultValue={member?.email ?? ''} className={inputClass} placeholder="name@company.com" /></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="member-phone">Phone</label><input id="member-phone" name="phone" type="tel" defaultValue={member?.phone ?? ''} className={inputClass} placeholder="Optional contact number" /></div>
            {error ? <p role="alert" className="sm:col-span-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p> : null}
          </div>
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-8">
            {saveStage ? <div className="mb-3" role="status" aria-live="polite">
              <p className="text-xs font-semibold text-slate-600">{saveStage === 'compressing' ? `Compressing photo… ${Math.round(compressionProgress)}%` : saveStage === 'uploading' ? 'Uploading photo…' : 'Saving member…'}</p>
              {saveStage === 'compressing' ? <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#12358f] transition-[width] duration-150" style={{ width: `${compressionProgress}%` }} /></div> : null}
            </div> : null}
            <div className="flex items-center justify-end gap-3">
              <button type="button" disabled={isSaving} onClick={onClose} className="min-h-10 rounded-md px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]">Cancel</button>
              <button type="submit" disabled={isSaving} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#12358f] px-5 text-sm font-bold text-white transition hover:bg-[#002069] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"><Check aria-hidden="true" className="h-4 w-4" />{saveStage === 'compressing' ? `Compressing… ${Math.round(compressionProgress)}%` : saveStage === 'uploading' ? 'Uploading photo…' : saveStage === 'saving' ? 'Saving member…' : member ? 'Save changes' : 'Add member'}</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AdminMembersDashboard({ initialMembers, initialLoadError }: { initialMembers: MemberRow[]; initialLoadError: string }) {
  const router = useRouter();
  const [members, setMembers] = useState(() => initialMembers.map(fromRow));
  const designationOptions = useMemo(() => [...new Set(members.map((member) => member.designation).filter((value): value is string => Boolean(value)))].sort(), [members]);
  const categoryOptions = useMemo(() => [...new Set(members.map((member) => member.category).filter((value): value is string => Boolean(value)))].sort(), [members]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All categories');
  const [formMember, setFormMember] = useState<AdminMember | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteMember, setDeleteMember] = useState<AdminMember | null>(null);
  const [toast, setToast] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [saveStage, setSaveStage] = useState<SaveStage>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [returningToWebsite, setReturningToWebsite] = useState(false);
  const isSaving = saveStage !== null;

  const shownMembers = useMemo(() => {
    const cleanQuery = query.trim().toLocaleLowerCase();
    const filtered = members.filter((member) => {
      const matchesQuery = !cleanQuery || member.name.toLocaleLowerCase().includes(cleanQuery) || member.company.toLocaleLowerCase().includes(cleanQuery);
      const matchesCategory = filter === 'All categories' || member.category === filter;
      return matchesQuery && matchesCategory;
    });
    return sortNewestFirst ? filtered : [...filtered].reverse();
  }, [filter, members, query, sortNewestFirst]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.replace('/admin');
    router.refresh();
  };

  const saveMember = async (values: MemberFormValues, photoFile?: File) => {
    setSaveStage(photoFile ? 'compressing' : 'saving');
    setCompressionProgress(0);
    const supabase = createClient();
    let uploadedPath: string | null = null;
    let imageUrl = values.image;
    let compressionSkipped = false;
    try {
      if (photoFile) {
        let uploadFile = photoFile;
        try {
          uploadFile = await imageCompression(photoFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            initialQuality: 0.82,
            useWebWorker: true,
            libURL: new URL('/vendor/browser-image-compression.js', window.location.origin).toString(),
            onProgress: (progress) => setCompressionProgress(progress),
          });
        } catch {
          if (photoFile.size > MAX_UPLOAD_BYTES) {
            throw new Error('This image could not be compressed. Try a JPEG, PNG, or WebP photo under 5 MB.');
          }
          compressionSkipped = true;
        }
        if (uploadFile.size > MAX_UPLOAD_BYTES) {
          throw new Error('The compressed image is still larger than 5 MB. Please choose a smaller photo.');
        }
        const extensionByType: Record<string, string> = {
          'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif',
        };
        const extension = extensionByType[uploadFile.type];
        if (!extension) throw new Error('The compressed image format is not supported. Please use JPEG, PNG, WebP, or AVIF.');
        setSaveStage('uploading');
        uploadedPath = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('member-photos').upload(uploadedPath, uploadFile, { contentType: uploadFile.type });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from('member-photos').getPublicUrl(uploadedPath).data.publicUrl;
      }

      setSaveStage('saving');
      const fields = values;
      const payload = {
        name: fields.name,
        company: fields.company,
        designation: fields.designation,
        category: fields.category,
        bio: fields.bio,
        image_url: imageUrl,
        website: fields.website,
        email: fields.email,
        phone: fields.phone,
        is_active: fields.is_active,
        display_order: fields.display_order,
      };
      const request = formMember
        ? supabase.from('members').update(payload).eq('id', formMember.id).select('*').single()
        : supabase.from('members').insert(payload).select('*').single();
      const { data, error } = await request;
      if (error || !data) throw error ?? new Error('The member could not be saved.');

      const savedMember = fromRow(data as MemberRow);
      setMembers((current) => formMember
        ? current.map((member) => member.id === formMember.id ? savedMember : member)
        : [savedMember, ...current]);

      const oldPhoto = photoPath(formMember?.image ?? null);
      if (oldPhoto && formMember?.image !== imageUrl) {
        await supabase.storage.from('member-photos').remove([oldPhoto]);
      }
      notify(photoFile
        ? compressionSkipped
          ? (formMember ? 'Member updated; original photo uploaded.' : 'Member added; original photo uploaded.')
          : (formMember ? 'Member updated with compressed photo.' : 'Member added with compressed photo.')
        : (formMember ? 'Member updated.' : 'Member added.'));
      setIsFormOpen(false);
      setFormMember(null);
    } catch (error) {
      if (uploadedPath) await supabase.storage.from('member-photos').remove([uploadedPath]);
      notify(error instanceof Error ? error.message : 'The member could not be saved. Please try again.');
    } finally {
      setSaveStage(null);
      setCompressionProgress(0);
    }
  };

  const confirmDelete = async () => {
    if (!deleteMember) return;
    const supabase = createClient();
    const { error } = await supabase.from('members').delete().eq('id', deleteMember.id);
    if (error) {
      notify(error.message);
      return;
    }
    setMembers((current) => current.filter((member) => member.id !== deleteMember.id));
    const oldPhoto = photoPath(deleteMember.image);
    if (oldPhoto) await supabase.storage.from('member-photos').remove([oldPhoto]);
    notify('Member removed.');
    setDeleteMember(null);
  };

  const openEdit = (member: AdminMember) => {
    setFormMember(member);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setFormMember(null);
    setIsFormOpen(true);
  };

  const getInitials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0b1c30]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
          <Link href="/" aria-label="Edge India home"><Image src="/compony-logos/edege-india-logo-png-file.png" alt="Edge India Business Group" width={190} height={48} className="h-9 w-auto object-contain object-left" /></Link>
        </div>
        <div className="px-4 pt-7">
          <p className="px-3 pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <div className="space-y-1">
            <div className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-500"><LayoutDashboard aria-hidden="true" className="h-4 w-4" />Overview</div>
            <div aria-current="page" className="flex min-h-11 items-center gap-3 rounded-md border-l-[3px] border-[#bb0013] bg-[#12358f]/[0.07] px-3 text-sm font-bold text-[#002069]"><Users aria-hidden="true" className="h-4 w-4" />Members <span className="ml-auto rounded bg-white px-2 py-0.5 text-[10px] text-[#12358f]">{members.length}</span></div>
            <div className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-400"><FileText aria-hidden="true" className="h-4 w-4" />Activity <span className="ml-auto text-[9px] uppercase tracking-wide">Later</span></div>
          </div>
        </div>
        <div className="mt-auto border-t border-slate-100 p-4">
          <button type="button" onClick={handleSignOut} className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#12358f]"><LogOut aria-hidden="true" className="h-4 w-4" />Sign out</button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400"><span>Admin</span><span>/</span><span className="text-[#12358f]">Members</span></div>
            <h1 className="mt-0.5 truncate text-sm font-extrabold text-[#002069] sm:text-base">Member directory</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={handleSignOut} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-[#12358f]/40 hover:text-[#12358f]"><LogOut aria-hidden="true" className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sign out</span></button>
            <Link href="/" onClick={(event) => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setReturningToWebsite(true); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-[#12358f]/40 hover:text-[#12358f]"><ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /><span className="hidden sm:inline">Website</span></Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#bb0013]">Edge India Business Group</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0b1c30] sm:text-3xl">Members</h2>
              <p className="mt-1 text-sm text-slate-500">Review and manage member directory profiles.</p>
            </div>
            <button type="button" onClick={openAdd} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-md bg-[#12358f] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013] sm:self-auto"><CirclePlus aria-hidden="true" className="h-4 w-4" />Add member</button>
          </div>

          {initialLoadError ? <div role="alert" className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs leading-5 text-rose-800">Could not load saved members: {initialLoadError}</div> : null}

          <section aria-label="Member directory summary" className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total profiles</p><p className="mt-2 text-2xl font-extrabold text-[#002069]">{members.length}</p><p className="mt-1 text-[11px] text-slate-500">Saved member records</p></div>
            {categoryOptions.map((category) => <div key={category} className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"><p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">{category}</p><p className="mt-2 text-2xl font-extrabold text-[#002069]">{members.filter((member) => member.category === category).length}</p><p className="mt-1 text-[11px] text-slate-500">Profiles in category</p></div>)}
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div><h3 className="text-sm font-extrabold text-[#002069]">All members</h3><p className="mt-1 text-xs text-slate-500">{shownMembers.length} matching {shownMembers.length === 1 ? 'profile' : 'profiles'}</p></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="relative block sm:w-64"><span className="sr-only">Search members by name or company</span><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or company" className="min-h-10 w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10" /></label>
                <label className="relative block sm:w-48"><span className="sr-only">Filter by category</span><select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-10 w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-semibold text-slate-600 outline-none transition focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10"><option>All categories</option>{categoryOptions.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /></label>
              </div>
            </div>

            {shownMembers.length === 0 ? (
              <div className="px-5 py-16 text-center"><Users aria-hidden="true" className="mx-auto h-8 w-8 text-slate-300" /><h4 className="mt-3 text-sm font-bold text-slate-700">No members found</h4><p className="mt-1 text-xs text-slate-500">Try a different name, company, or category.</p></div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3.5">Member <button type="button" onClick={() => setSortNewestFirst((value) => !value)} aria-label="Toggle sort order" className="ml-1 inline-flex align-middle text-slate-400 hover:text-[#12358f]"><ArrowDownUp className="h-3 w-3" /></button></th><th className="px-4 py-3.5">Company</th><th className="px-4 py-3.5">Designation</th><th className="px-4 py-3.5">Category</th><th className="px-4 py-3.5">Contact</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {shownMembers.map((member) => <tr key={member.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#12358f]/[0.08] text-xs font-extrabold text-[#12358f]">{member.image ? <img src={member.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : getInitials(member.name)}</div><div className="min-w-0"><p className="truncate text-xs font-bold text-[#002069]">{member.name}</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{member.email ?? 'No email added'}</p></div></div></td><td className="max-w-52 truncate px-4 py-3.5 text-xs font-semibold text-slate-700">{member.company}</td><td className="max-w-44 truncate px-4 py-3.5 text-xs text-slate-600">{member.designation ?? '—'}</td><td className="px-4 py-3.5">{member.category ? <span className="whitespace-nowrap rounded-full bg-[#12358f]/[0.07] px-2.5 py-1 text-[10px] font-bold text-[#12358f]">{member.category}</span> : <span className="text-xs text-slate-400">—</span>}</td><td className="px-4 py-3.5 text-xs text-slate-600">{member.phone ?? '—'}</td><td className="px-5 py-3.5"><div className="flex justify-end gap-1"><button type="button" onClick={() => openEdit(member)} aria-label={`Edit ${member.name}`} className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition hover:bg-blue-50 hover:text-[#12358f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setDeleteMember(member)} aria-label={`Delete ${member.name}`} className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-slate-100 lg:hidden">
                  {shownMembers.map((member) => <article key={member.id} className="flex items-start gap-3 p-4"><div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#12358f]/[0.08] text-xs font-extrabold text-[#12358f]">{member.image ? <img src={member.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : getInitials(member.name)}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h4 className="truncate text-xs font-extrabold text-[#002069]">{member.name}</h4><p className="mt-0.5 truncate text-[11px] font-semibold text-slate-600">{member.company}</p></div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => openEdit(member)} aria-label={`Edit ${member.name}`} className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-blue-50 hover:text-[#12358f]"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setDeleteMember(member)} aria-label={`Delete ${member.name}`} className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></div><div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">{member.designation ? <span>{member.designation}</span> : null}{member.category ? <span className="rounded-full bg-[#12358f]/[0.07] px-2 py-0.5 font-bold text-[#12358f]">{member.category}</span> : null}</div></div></article>)}
                </div>
              </>
            )}

          </section>
        </main>
      </div>

      {toast ? <div role="status" className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-2 rounded-lg bg-[#002069] px-4 py-3 text-xs font-semibold text-white shadow-xl"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-300" />{toast}</div> : null}
      {isFormOpen ? <MemberFormDialog key={formMember?.id ?? 'new-member'} member={formMember} designationOptions={designationOptions} categoryOptions={categoryOptions} onClose={() => { setIsFormOpen(false); setFormMember(null); }} onSave={saveMember} isSaving={isSaving} saveStage={saveStage} compressionProgress={compressionProgress} /> : null}
      {deleteMember ? <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteMember(null); }}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 aria-hidden="true" className="h-5 w-5" /></div><h2 id="delete-title" className="mt-4 text-lg font-extrabold text-[#002069]">Delete this member?</h2><p id="delete-description" className="mt-2 text-sm leading-6 text-slate-500">Permanently remove <strong className="text-slate-700">{deleteMember.name}</strong> from the member directory?</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteMember(null)} className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button type="button" onClick={confirmDelete} className="min-h-10 rounded-md bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700">Delete member</button></div></section></div> : null}
      {returningToWebsite ? <RouteTransitionLoader message="Returning to the Edge India website…" /> : null}
    </div>
  );
}
