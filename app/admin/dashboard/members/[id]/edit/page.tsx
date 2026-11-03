import { notFound, redirect } from 'next/navigation';
import MemberFormRouteClient from '../../MemberFormRouteClient';
import type { ChapterOption, MemberRow } from '@/lib/members';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminEditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const [{ data: member, error: memberError }, { data: rows }, { data: chapters }] = await Promise.all([
    supabase.from('members').select('*').eq('id', id).maybeSingle(),
    supabase.from('members').select('designation,category'),
    supabase.from('chapters').select('id,name,is_active').order('name'),
  ]);
  if (memberError || !member) notFound();

  const options = rows ?? [];
  const designationOptions = [...new Set(options.map((row) => row.designation).filter((value): value is string => Boolean(value)))].sort();
  const categoryOptions = [...new Set(options.map((row) => row.category).filter((value): value is string => Boolean(value)))].sort();

  return <MemberFormRouteClient initialMember={member as MemberRow} designationOptions={designationOptions} categoryOptions={categoryOptions} chapterOptions={(chapters ?? []) as ChapterOption[]} />;
}
