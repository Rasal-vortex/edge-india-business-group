import { redirect } from 'next/navigation';
import MemberFormRouteClient from '../MemberFormRouteClient';
import { createClient } from '@/lib/supabase/server';
import type { ChapterOption } from '@/lib/members';

export const dynamic = 'force-dynamic';

export default async function AdminNewMemberPage() {
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

  const [{ data }, { data: chapters }] = await Promise.all([
    supabase.from('members').select('designation,category'),
    supabase.from('chapters').select('id,name,is_active').eq('is_active', true).order('name'),
  ]);
  const rows = data ?? [];
  const designationOptions = [...new Set(rows.map((row) => row.designation).filter((value): value is string => Boolean(value)))].sort();
  const categoryOptions = [...new Set(rows.map((row) => row.category).filter((value): value is string => Boolean(value)))].sort();

  return <MemberFormRouteClient initialMember={null} designationOptions={designationOptions} categoryOptions={categoryOptions} chapterOptions={(chapters ?? []) as ChapterOption[]} />;
}
