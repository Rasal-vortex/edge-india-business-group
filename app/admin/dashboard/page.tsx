import { redirect } from 'next/navigation';
import AdminMembersDashboard from './MembersDashboardClient';
import { createClient } from '@/lib/supabase/server';
import type { MemberRow } from '@/lib/members';

export default async function AdminMembersPage() {
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
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AdminMembersDashboard
      initialMembers={(data ?? []) as MemberRow[]}
      initialLoadError={error?.message ?? ''}
    />
  );
}
