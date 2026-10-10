import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GalleryDashboardClient, { type GalleryRow } from './GalleryDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/admin');

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (adminError || !admin) redirect('/admin');

  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id,name,slug,is_active,created_at,updated_at')
    .order('name', { ascending: true });

  return <GalleryDashboardClient initialItems={(data ?? []) as GalleryRow[]} initialLoadError={error?.message ?? ''} initialChapters={chapters ?? []} chaptersLoadError={chaptersError?.message ?? ''} />;
}
