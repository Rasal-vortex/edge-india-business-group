'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import type { MemberRow } from '@/lib/members';
import { fromRow, MemberFormPage, photoPath, type AdminMember, type MemberFormValues, type SaveStage } from '../MembersDashboardClient';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export default function MemberFormRouteClient({
  initialMember,
  designationOptions,
  categoryOptions,
}: {
  initialMember: MemberRow | null;
  designationOptions: string[];
  categoryOptions: string[];
}) {
  const router = useRouter();
  const [saveStage, setSaveStage] = useState<SaveStage>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const member: AdminMember | null = initialMember ? fromRow(initialMember) : null;
  const isSaving = saveStage !== null;

  const saveMember = async (values: MemberFormValues, photoFile?: File, logoFile?: File) => {
    setSaveStage(photoFile || logoFile ? 'compressing' : 'saving');
    setCompressionProgress(0);
    const supabase = createClient();
    let uploadedPath: string | null = null;
    let uploadedLogoPath: string | null = null;
    let imageUrl = values.image;
    let companyLogoUrl = values.company_logo_url;
    try {
      const uploadMemberImage = async (file: File, kind: 'photo' | 'logo') => {
        let uploadFile = file;
        try {
          uploadFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            initialQuality: 0.82,
            useWebWorker: true,
            libURL: new URL('/vendor/browser-image-compression.js', window.location.origin).toString(),
            onProgress: (progress) => setCompressionProgress(progress),
          });
        } catch {
          if (file.size > MAX_UPLOAD_BYTES) {
            throw new Error(`This ${kind} could not be compressed. Choose a JPEG, PNG, WebP, or AVIF image under 5 MB.`);
          }
        }
        if (uploadFile.size > MAX_UPLOAD_BYTES) {
          throw new Error(`The compressed ${kind} is still larger than 5 MB. Choose a smaller image.`);
        }
        const extensionByType: Record<string, string> = {
          'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif',
        };
        const extension = extensionByType[uploadFile.type];
        if (!extension) throw new Error(`Unsupported ${kind} format. Use JPEG, PNG, WebP, or AVIF.`);
        setSaveStage('uploading');
        const path = `${kind === 'logo' ? 'company-logos/' : 'member-photos/'}${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('member-photos').upload(path, uploadFile, { contentType: uploadFile.type });
        if (uploadError) throw uploadError;
        return { path, url: supabase.storage.from('member-photos').getPublicUrl(path).data.publicUrl };
      };
      if (photoFile) {
        const uploaded = await uploadMemberImage(photoFile, 'photo');
        uploadedPath = uploaded.path;
        imageUrl = uploaded.url;
      }
      if (logoFile) {
        const uploaded = await uploadMemberImage(logoFile, 'logo');
        uploadedLogoPath = uploaded.path;
        companyLogoUrl = uploaded.url;
      }

      setSaveStage('saving');
      const payload = {
        name: values.name,
        username: values.username,
        company: values.company,
        designation: values.designation,
        category: values.category,
        bio: values.bio,
        image_url: imageUrl,
        website: values.website,
        email: values.email,
        phone: values.phone,
        company_logo_url: companyLogoUrl,
        personal_instagram_url: values.personal_instagram_url,
        company_instagram_url: values.company_instagram_url,
        office_phone: values.office_phone,
        map_url: values.map_url,
        is_active: values.is_active,
        display_order: values.display_order,
        level: values.level,
      };
      const request = member
        ? supabase.from('members').update(payload).eq('id', member.id).select('*').single()
        : supabase.from('members').insert(payload).select('*').single();
      const { data, error } = await request;
      if (error || !data) {
        if (error?.code === '23505') throw new Error('That username is already in use. Choose another username.');
        throw error ?? new Error('The member could not be saved.');
      }

      const oldPhoto = photoPath(member?.image ?? null);
      if (oldPhoto && member?.image !== imageUrl) await supabase.storage.from('member-photos').remove([oldPhoto]);
      const oldLogo = photoPath(member?.company_logo_url ?? null);
      if (oldLogo && member?.company_logo_url !== companyLogoUrl) await supabase.storage.from('member-photos').remove([oldLogo]);
      router.replace('/admin/dashboard');
      router.refresh();
    } catch (error) {
      if (uploadedPath) await supabase.storage.from('member-photos').remove([uploadedPath]);
      if (uploadedLogoPath) await supabase.storage.from('member-photos').remove([uploadedLogoPath]);
      throw error;
    } finally {
      setSaveStage(null);
      setCompressionProgress(0);
    }
  };

  return (
    <MemberFormPage
      member={member}
      designationOptions={designationOptions}
      categoryOptions={categoryOptions}
      onClose={() => router.push('/admin/dashboard')}
      onSave={saveMember}
      isSaving={isSaving}
      saveStage={saveStage}
      compressionProgress={compressionProgress}
    />
  );
}
