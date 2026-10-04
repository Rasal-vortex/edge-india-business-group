'use client';

import { ArrowUpRight } from 'lucide-react';
import LanyardCtaVisual from '@/components/LanyardCtaVisual';

export default function CTA() {
  const whatsappMessage = encodeURIComponent('Hi, I’m interested in joining the EDGE India community. Could you share the membership details?');
  const whatsappUrl = `https://wa.me/919995430724?text=${whatsappMessage}`;

  return (
    <section className="relative w-full overflow-hidden border-t-2 border-[#bb0013] bg-[#eff4ff]/70 py-12 text-[#0b1c30] sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-12">
        <div className="grid items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-12 lg:py-10">
          <div className="flex min-w-0 items-center justify-center">
            <LanyardCtaVisual />
          </div>

          <div className="flex flex-col items-start py-2 text-left sm:py-4 lg:py-8">
            <div className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-2.5 rounded-full bg-[#bb0013]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#002069]">Join the Community</span>
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-[#002069] sm:text-4xl lg:text-[48px]">
              Interested in the EDGE India community?
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Contact the Manjeri chapter to ask about membership or a guest invitation.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded bg-[#12358f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002069] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]"
            >
              Ask About Membership
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <p className="mt-5 text-xs font-semibold tracking-wide text-slate-500">Membership <span className="px-1 text-[#bb0013]">•</span> Networking <span className="px-1 text-[#bb0013]">•</span> Collaboration</p>
            <div className="mt-8 border-t border-slate-200 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#12358f]">Manjeri, Kerala</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
