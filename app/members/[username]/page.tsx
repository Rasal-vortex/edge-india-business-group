import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  slugifyMemberName,
  toPublicMember,
  type MemberRow,
} from "@/lib/members";

function instagramHref(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return null;
  return /^https?:\/\//i.test(clean)
    ? clean
    : `https://www.instagram.com/${clean.replace(/^@/, "")}/`;
}

function mapDetails(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return null;

  let directionsUrl = "";
  let query = clean;
  try {
    const parsed = new URL(clean);
    const isGoogleMaps =
      /(^|\.)google\.[^/]+$/.test(parsed.hostname) ||
      /(^|\.)maps\.app\.goo\.gl$/.test(parsed.hostname) ||
      parsed.hostname === "goo.gl";
    if (parsed.protocol !== "https:" || !isGoogleMaps) return null;
    directionsUrl = clean;
    if (parsed.pathname.includes("/maps/embed"))
      return { embedUrl: clean, directionsUrl };
    query =
      parsed.searchParams.get("q") ||
      parsed.searchParams.get("query") ||
      parsed.pathname.match(/\/maps\/place\/([^/]+)/)?.[1] ||
      parsed.pathname.match(/@(-?[\d.]+,-?[\d.]+)/)?.[1] ||
      clean;
    query = decodeURIComponent(query.replaceAll("+", " "));
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
    directionsUrl:
      directionsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  };
}

function contactCardHref(member: ReturnType<typeof toPublicMember>) {
  const escapeVcard = (value: string) =>
    value
      .replaceAll("\\", "\\\\")
      .replaceAll(";", "\\;")
      .replaceAll(",", "\\,")
      .replaceAll("\n", "\\n");
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcard(member.name)}`,
    `ORG:${escapeVcard(member.company ?? "")}`,
    `TITLE:${escapeVcard(member.role)}`,
    member.phone ? `TEL;TYPE=CELL:${escapeVcard(member.phone)}` : "",
    member.email ? `EMAIL:${escapeVcard(member.email)}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: matchedData, error } = await supabase
    .from("members")
    .select("*")
    .eq("username", username)
    .eq("is_active", true)
    .maybeSingle();
  let data = matchedData;
  if (error || !data) {
    const fallback = await supabase
      .from("members")
      .select("*")
      .eq("is_active", true);
    if (fallback.error) notFound();
    data =
      (fallback.data as MemberRow[]).find(
        (row) => (row.username || slugifyMemberName(row.name)) === username,
      ) ?? null;
  }
  if (!data) notFound();

  const member = toPublicMember(data as MemberRow);
  const map = mapDetails(member.mapUrl);
  const personalInstagram = instagramHref(member.personalInstagram);
  const companyInstagram = instagramHref(member.companyInstagram);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 py-6 md:px-8 lg:px-12 lg:py-10">
        <Link
          href="/members"
          className="mb-6 inline-flex min-h-10 w-fit items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#12358f] shadow-sm transition-colors hover:border-[#12358f] hover:bg-[#f8f9ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Members directory
        </Link>

        <section
          aria-labelledby="member-company-name"
          className="overflow-hidden rounded-2xl border border-slate-200 border-t-2 border-t-[#bb0013] bg-white p-5 shadow-sm sm:p-8 lg:p-12"
        >
          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1 w-2.5 rounded-full bg-[#bb0013]"
            />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#002069]">
              Member profile
            </span>
          </div>
          <div className="mb-7 flex min-h-16 items-center">
            {member.companyLogo ? (
              <img
                src={member.companyLogo}
                alt={`${member.company ?? "Company"} logo`}
                className="max-h-16 max-w-52 object-contain object-left"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-[#eff4ff] text-[#12358f]">
                <Building2 aria-hidden="true" className="h-6 w-6" />
              </div>
            )}
          </div>
          <h1
            id="member-company-name"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#002069] sm:text-4xl lg:text-[40px]"
          >
            {member.company || "Company profile"}
          </h1>

          <div className="mt-8 grid gap-6 rounded-xl border border-slate-200 bg-[#f8f9ff] p-4 sm:grid-cols-[180px_1fr] sm:items-center sm:p-6">
            <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#eff4ff]">
              {member.image ? (
                <img
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-extrabold text-[#12358f]/45">
                  {member.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#12358f]">
                Owner / CEO / Authorized representative
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0b1c30] sm:text-3xl">
                {member.name}
              </h2>
              <p className="mt-1 text-base font-semibold text-slate-600">
                {member.role}
              </p>
              {member.description ? (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {member.description}
                </p>
              ) : null}
              <div
                className="mt-5 flex flex-wrap gap-2"
                aria-label="Member details"
              >
                {member.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[#dce5f2] bg-white px-3 py-1 text-xs font-bold text-[#1646ad]"
                  >
                    {category}
                  </span>
                ))}
                {member.level ? (
                  <span className="rounded-full border border-[#dce5f2] bg-white px-3 py-1 text-xs font-bold text-[#1646ad]">
                    Level: {member.level}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {member.phone ? (
              <a
                href={`tel:${member.phone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#12358f] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
              >
                <Phone aria-hidden="true" className="h-4 w-4" /> Call{" "}
                {member.phone}
              </a>
            ) : null}
            {member.phone ? (
              <a
                href={contactCardHref(member)}
                download={`${member.name.replace(/[^a-z0-9]+/gi, "-")}.vcf`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded border border-[#12358f] bg-white px-4 py-3 text-sm font-bold text-[#12358f] shadow-sm transition-colors hover:bg-[#eff4ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
              >
                <Smartphone aria-hidden="true" className="h-4 w-4" /> Add to
                contact
              </a>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex min-h-12 items-center gap-3 rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-[#12358f]/40 hover:text-[#002069]"
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                {member.email}
              </a>
            ) : null}
            {personalInstagram ? (
              <a
                href={personalInstagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-3 rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-[#12358f]/40 hover:text-[#002069]"
              >
                <Instagram aria-hidden="true" className="h-4 w-4 shrink-0" />
                Personal Instagram
              </a>
            ) : null}
          </div>
        </section>

        <section
          aria-labelledby="company-details-title"
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
        >
          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1 w-2.5 rounded-full bg-[#bb0013]"
            />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#002069]">
              Company
            </span>
          </div>
          <h2
            id="company-details-title"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#002069]"
          >
            Company Details
          </h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
            {member.officePhone ? (
              <a
                href={`tel:${member.officePhone}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8f9ff] px-4 py-3 font-semibold transition-colors hover:border-[#12358f]/40 hover:text-[#002069]"
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-[#12358f]" />
                Office: {member.officePhone}
              </a>
            ) : null}
            {companyInstagram ? (
              <a
                href={companyInstagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8f9ff] px-4 py-3 font-semibold transition-colors hover:border-[#12358f]/40 hover:text-[#002069]"
              >
                <Instagram
                  aria-hidden="true"
                  className="h-4 w-4 text-[#12358f]"
                />
                Company Instagram
              </a>
            ) : null}
            {member.website ? (
              <a
                href={
                  /^https?:\/\//i.test(member.website)
                    ? member.website
                    : `https://${member.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-[#f8f9ff] px-4 py-3 font-semibold underline-offset-4 transition-colors hover:border-[#12358f]/40 hover:text-[#002069] hover:underline"
              >
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-[#12358f]"
                />
                Company website
              </a>
            ) : null}
          </div>
          {map ? (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <iframe
                title={`Map to ${member.company || member.name}`}
                src={map.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0 sm:h-96"
                allowFullScreen
              />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-[#f8f9ff] px-4 py-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin
                    aria-hidden="true"
                    className="h-4 w-4 text-[#bb0013]"
                  />
                  Company location
                </p>
                <a
                  href={map.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded bg-[#12358f] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002069]"
                >
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  Directions
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-[#f8f9ff] p-5 text-sm text-slate-500">
              Company map details have not been added.
            </p>
          )}
        </section>

        <footer className="mt-10 border-t-2 border-[#bb0013] bg-[#002069] text-white">
          <div className="flex flex-col items-start gap-6 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <div className="relative h-10 w-48 rounded bg-white p-1">
                <Image
                  src="/compony-logos/edege-india-logo-png-file.png"
                  alt="EDGE India Business Group"
                  fill
                  sizes="192px"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-[11px] font-extrabold uppercase tracking-widest text-[#dce1ff]">
                Business | Community | Growth
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end sm:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dce1ff]">
                An Initiative from Vortex AI&amp;Tech Solution
              </p>
              <img
                src="/vortex-ai-tech-solutions-logo.png"
                alt="Vortex AI and Tech Solutions"
                className="h-auto w-40 rounded bg-white p-1 object-contain"
              />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
