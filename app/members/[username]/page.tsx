import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, Instagram, Mail, MapPin, Phone, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { toPublicMember, type MemberRow } from '@/lib/members';

function instagramHref(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return null;
  return /^https?:\/\//i.test(clean) ? clean : `https://www.instagram.com/${clean.replace(/^@/, '')}/`;
}

function mapDetails(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return null;

  let directionsUrl = '';
  let query = clean;
  try {
    const parsed = new URL(clean);
    const isGoogleMaps = /(^|\.)google\.[^/]+$/.test(parsed.hostname) || /(^|\.)maps\.app\.goo\.gl$/.test(parsed.hostname) || parsed.hostname === 'goo.gl';
    if (parsed.protocol !== 'https:' || !isGoogleMaps) return null;
    directionsUrl = clean;
    if (parsed.pathname.includes('/maps/embed')) return { embedUrl: clean, directionsUrl };
    query = parsed.searchParams.get('q') || parsed.searchParams.get('query') || parsed.pathname.match(/\/maps\/place\/([^/]+)/)?.[1] || parsed.pathname.match(/@(-?[\d.]+,-?[\d.]+)/)?.[1] || clean;
    query = decodeURIComponent(query.replaceAll('+', ' '));
    if (/^ChI[A-Za-z0-9_-]{10,}$/.test(query)) query = `place_id:${query}`;
  } catch {
    if (/^ChI[A-Za-z0-9_-]{10,}$/.test(clean)) {
      query = `place_id:${clean}`;
      directionsUrl = `https://www.google.com/maps/dir/?api=1&destination_place_id=${encodeURIComponent(clean)}`;
    } else {
      directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean)}`;
    }
  }

  return {
    embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`,
    directionsUrl: directionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  };
}

function contactCardHref(member: ReturnType<typeof toPublicMember>) {
  const escapeVcard = (value: string) => value.replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVcard(member.name)}`,
    `ORG:${escapeVcard(member.company ?? '')}`,
    `TITLE:${escapeVcard(member.role)}`,
    member.phone ? `TEL;TYPE=CELL:${escapeVcard(member.phone)}` : '',
    member.email ? `EMAIL:${escapeVcard(member.email)}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\r\n');
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
}

export default async function MemberProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from('members').select('*').eq('username', username).eq('is_active', true).maybeSingle();
  if (error || !data) notFound();

  const member = toPublicMember(data as MemberRow);
  const map = mapDetails(member.mapUrl);
  const personalInstagram = instagramHref(member.personalInstagram);
  const companyInstagram = instagramHref(member.companyInstagram);

  return (
    <main className="min-h-screen bg-[#080c12] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        <Link href="/members" className="mb-6 inline-flex w-fit items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Members directory
        </Link>

        <section aria-labelledby="member-company-name" className="rounded-2xl border border-slate-800 bg-[#101721] p-5 sm:p-8">
          <div className="mb-7 flex min-h-16 items-center">
            {member.companyLogo ? <img src={member.companyLogo} alt={`${member.company ?? 'Company'} logo`} className="max-h-16 max-w-52 object-contain object-left" /> : <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-[#151e2a] text-slate-400"><Building2 aria-hidden="true" className="h-6 w-6" /></div>}
          </div>
          <h1 id="member-company-name" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{member.company || 'Company profile'}</h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-[#151e2a]">
              {member.image ? <img src={member.image} alt={`Portrait of ${member.name}`} className="h-full w-full object-cover" /> : <span className="text-4xl font-bold text-slate-500">{member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Founder / Company representative</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{member.name}</h2>
              <p className="mt-1 text-base text-slate-300">{member.role}</p>
              {member.description ? <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">{member.description}</p> : null}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {member.phone ? <a href={`tel:${member.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500"><Phone aria-hidden="true" className="h-4 w-4" /> Call {member.phone}</a> : null}
            {member.phone ? <a href={contactCardHref(member)} download={`${member.name.replace(/[^a-z0-9]+/gi, '-')}.vcf`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-600 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"><Smartphone aria-hidden="true" className="h-4 w-4" /> Add to contact</a> : null}
            {member.email ? <a href={`mailto:${member.email}`} className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 hover:border-slate-600"><Mail aria-hidden="true" className="h-4 w-4 shrink-0" />{member.email}</a> : null}
            {personalInstagram ? <a href={personalInstagram} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 hover:border-slate-600"><Instagram aria-hidden="true" className="h-4 w-4 shrink-0" />Personal Instagram</a> : null}
          </div>
        </section>

        <section aria-labelledby="company-details-title" className="mt-6 rounded-2xl border border-slate-800 bg-[#101721] p-5 sm:p-8">
          <h2 id="company-details-title" className="text-xl font-bold text-white">Company Details</h2>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-300">
            {member.officePhone ? <a href={`tel:${member.officePhone}`} className="inline-flex items-center gap-2 hover:text-white"><Phone aria-hidden="true" className="h-4 w-4 text-slate-400" />Office: {member.officePhone}</a> : null}
            {companyInstagram ? <a href={companyInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Instagram aria-hidden="true" className="h-4 w-4 text-slate-400" />Company Instagram</a> : null}
            {member.website ? <a href={/^https?:\/\//i.test(member.website) ? member.website : `https://${member.website}`} target="_blank" rel="noreferrer" className="text-slate-300 underline underline-offset-4 hover:text-white">Company website</a> : null}
          </div>
          {map ? <div className="mt-6 overflow-hidden rounded-xl border border-slate-700">
            <iframe title={`Map to ${member.company || member.name}`} src={map.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full border-0 sm:h-96" allowFullScreen />
            <div className="flex items-center justify-between gap-4 border-t border-slate-700 bg-[#0c121b] px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm text-slate-300"><MapPin aria-hidden="true" className="h-4 w-4" />Company location</p>
              <a href={map.directionsUrl} target="_blank" rel="noreferrer" className="rounded-md border border-slate-600 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Directions</a>
            </div>
          </div> : <p className="mt-5 rounded-lg border border-dashed border-slate-700 p-5 text-sm text-slate-500">Company map details have not been added.</p>}
        </section>

        <footer className="mt-auto flex flex-col items-center gap-3 pt-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">An Initiative from Vortex AI&amp;Tech Solution</p>
          <img src="/vortex-ai-tech-solutions-logo.png" alt="Vortex AI and Tech Solutions" className="h-auto w-48 object-contain" />
        </footer>
      </div>
    </main>
  );
}
