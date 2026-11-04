import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { slugifyMemberName, type MemberRow } from '@/lib/members';
import VisitingCardModal from '@/components/members/VisitingCardModal';

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-[#f8f9ff] p-4">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-800">{value?.trim() || 'Not provided'}</dd>
    </div>
  );
}

function AdminSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#002069]">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl font-extrabold tracking-tight text-[#002069]">{title}</h2>
      {children}
    </section>
  );
}

export const dynamic = 'force-dynamic';

export default async function AdminMemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data, error } = await supabase.from('members').select('*').eq('id', id).maybeSingle();
  if (error || !data) notFound();

  const member = data as MemberRow;
  const username = member.username || slugifyMemberName(member.name);
  const profileHref = `/members/${username}`;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-[#0b1c30] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#12358f] hover:bg-[#f8f9ff]">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to members
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href={profileHref} target="_blank" className="inline-flex min-h-10 items-center gap-2 rounded border border-[#12358f] bg-white px-4 py-2 text-sm font-bold text-[#12358f] hover:bg-[#eff4ff]">
              <ExternalLink aria-hidden="true" className="h-4 w-4" /> Public profile
            </Link>
            <VisitingCardModal
              member={{
                username,
                name: member.name,
                designation: member.designation || 'Member',
                phone: member.phone,
                email: member.email,
                personalInstagram: member.personal_instagram_url,
                image: member.image_url,
                company: member.company,
                companyLogo: member.company_logo_url,
              }}
            />
            <Link href={`/admin/dashboard/members/${member.id}/edit`} className="inline-flex min-h-10 items-center gap-2 rounded bg-[#12358f] px-4 py-2 text-sm font-bold text-white hover:bg-[#002069]">
              <Pencil aria-hidden="true" className="h-4 w-4" /> Edit member
            </Link>
          </div>
        </div>

        <header className="mb-6 rounded-2xl border border-slate-200 border-t-2 border-t-[#bb0013] bg-white p-5 shadow-sm sm:p-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#c8102e]">Member details</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#002069]">{member.name}</h1>
          <p className="mt-1 text-base font-semibold text-slate-600">{member.company}</p>
        </header>

        <div className="space-y-5">
          <AdminSection id="admin-basic-information" eyebrow="Identity" title="Basic information">
            <div className="mt-5 grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#eff4ff]">
                {member.image_url ? <img src={member.image_url} alt={`${member.name} profile`} className="h-full w-full object-cover" /> : <span className="text-3xl font-extrabold text-[#12358f]/50">{member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>}
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail label="Owner name" value={member.name} />
                <Detail label="Username" value={username} />
                <Detail label="Company name" value={member.company} />
                <div className="rounded-lg border border-slate-200 bg-[#f8f9ff] p-4 sm:col-span-2">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Company logo</dt>
                  {member.company_logo_url ? <img src={member.company_logo_url} alt={`${member.company} logo`} className="mt-2 max-h-16 max-w-52 object-contain object-left" /> : <dd className="mt-1 text-sm text-slate-600">Not provided</dd>}
                </div>
              </dl>
            </div>
          </AdminSection>

          <AdminSection id="admin-professional-details" eyebrow="Work profile" title="Professional details">
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Priority" value={member.priority} />
              <Detail label="Level" value={member.level} />
              <Detail label="Inside Core Member" value={member.is_inside_core_member ? 'Yes' : 'No'} />
              <Detail label="Designation" value={member.designation} />
              <Detail label="Category" value={member.category} />
              <div className="rounded-lg border border-slate-200 bg-[#f8f9ff] p-4 sm:col-span-2 lg:col-span-3">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Short bio</dt>
                <dd className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{member.bio?.trim() || 'Not provided'}</dd>
              </div>
            </dl>
          </AdminSection>

          <AdminSection id="admin-contact-information" eyebrow="Personal contact" title="Contact information">
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <Detail label="Phone number" value={member.phone} />
              <Detail label="Email" value={member.email} />
              <Detail label="Personal Instagram" value={member.personal_instagram_url} />
            </dl>
          </AdminSection>

          <AdminSection id="admin-company-details" eyebrow="Company" title="Company details">
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <Detail label="Office number" value={member.office_phone} />
              <Detail label="Company Instagram" value={member.company_instagram_url} />
              <Detail label="Website" value={member.website} />
              <Detail label="Google Maps place ID, link, or address" value={member.map_url} />
            </dl>
          </AdminSection>
        </div>
      </div>
    </main>
  );
}
