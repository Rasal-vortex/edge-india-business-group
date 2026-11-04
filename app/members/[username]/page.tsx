import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { slugifyMemberName, type MemberRow } from "@/lib/members";

type MemberProfileFields = Pick<
  MemberRow,
  | "username"
  | "name"
  | "company"
  | "designation"
  | "category"
  | "image_url"
  | "company_logo_url"
>;

const MEMBER_PROFILE_FIELDS =
  "username, name, company, designation, category, image_url, company_logo_url";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: matchedData, error } = await supabase
    .from("members")
    .select(MEMBER_PROFILE_FIELDS)
    .eq("username", username)
    .eq("is_active", true)
    .maybeSingle();

  let member = matchedData as MemberProfileFields | null;
  if (error || !member) {
    const fallback = await supabase
      .from("members")
      .select(MEMBER_PROFILE_FIELDS)
      .eq("is_active", true);
    if (fallback.error) notFound();
    member =
      (fallback.data as MemberProfileFields[]).find(
        (row) => (row.username || slugifyMemberName(row.name)) === username,
      ) ?? null;
  }
  if (!member) notFound();

  const category = member.category?.trim();
  const designation = member.designation?.trim() || "Designation not provided";
  const designationWithCompany = member.company?.trim()
    ? `${designation} of ${member.company.trim()}`
    : designation;

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1000px] flex-col px-4 py-6 md:px-8 md:py-10">
        <Link
          href="/members"
          className="mb-6 inline-flex min-h-10 w-fit items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#12358f] shadow-sm transition-colors hover:border-[#12358f] hover:bg-[#f8f9ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Members directory
        </Link>

        <article className="overflow-hidden rounded-2xl border border-slate-200 border-t-2 border-t-[#bb0013] bg-white shadow-sm">
          <div className="grid md:grid-cols-[minmax(240px,0.8fr)_1.2fr]">
            <section
              aria-labelledby="member-photo-label"
              className="flex flex-col items-center justify-center bg-[#eff4ff] p-6 sm:p-8"
            >
              <div className="flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {member.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={member.image_url}
                    alt={`${member.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-extrabold text-[#12358f]/45">
                    {member.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </section>

            <div className="flex flex-col justify-center gap-8 p-6 sm:p-8 lg:p-10">
              <section aria-labelledby="member-name">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1
                      id="member-name"
                      className="mt-2 break-words text-3xl font-extrabold tracking-tight text-[#002069] sm:text-4xl"
                    >
                      {member.name}
                    </h1>
                    <p className="mt-3 text-lg font-semibold text-slate-600">
                      {designationWithCompany}
                    </p>
                  </div>
                  {member.company_logo_url ? (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:h-20 sm:w-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.company_logo_url}
                        alt={`${member.company || "Company"} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="mt-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Category
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#0b1c30]">
                    {category || "Category not provided"}
                  </p>
                </div>
              </section>

            </div>
          </div>
          <footer className="grid grid-cols-[7fr_3fr] border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
            <div className="flex min-w-0 flex-col items-center justify-center gap-1">
              <span className="text-center text-xs font-semibold italic text-[#102b61]">
                A proud member of
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/compony-logos/edege-india-logo-png-file.png"
                alt="EDGE INDIA"
                className="h-16 max-w-[92%] object-contain sm:h-20"
              />
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center gap-1 border-l border-slate-200">
              <span className="text-center text-xs font-semibold italic text-[#102b61]">
                Technology Partner
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/compony-logos/vortex-global-technologies-wide.png"
                alt="Vortex Global Technologies"
                className="h-10 max-w-[86%] object-contain sm:h-12"
              />
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
