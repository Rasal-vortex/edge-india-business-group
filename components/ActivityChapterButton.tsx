'use client';

import Link from 'next/link';
import type { MouseEventHandler } from 'react';

interface ActivityChapterButtonProps {
  name: string;
  slug: string;
  selected: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function Sparkle({ className }: { className: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 0c1.2 6.1 4 8.8 12 12-8 3.2-10.8 5.9-12 12C10.8 17.9 8 15.2 0 12 8 8.8 10.8 6.1 12 0Z" /></svg>;
}

const sparkles = [
  'left-[18%] top-1/2 group-hover:left-[-5px] group-hover:top-[-7px] text-[#bb0013]',
  'left-[38%] top-1/2 group-hover:left-[24%] group-hover:top-[-9px] text-[#12358f]',
  'left-[58%] top-1/2 group-hover:left-[76%] group-hover:top-[calc(100%+1px)] text-[#bb0013]',
  'left-[78%] top-1/2 group-hover:left-[calc(100%-2px)] group-hover:top-[18%] text-[#12358f]',
];

const content = (name: string) => <>
  {sparkles.map((position, index) => <Sparkle key={position} className={`pointer-events-none absolute z-0 h-2 w-2 scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.05,0.83,0.43,0.96)] group-hover:scale-100 group-hover:opacity-100 ${position} ${index % 2 ? 'delay-75' : ''}`} />)}
  <span className="relative z-10">{name}</span>
</>;

const className = (selected: boolean) => `group relative isolate inline-flex min-h-10 items-center justify-center overflow-visible rounded-full border px-4 text-xs font-bold transition-all duration-300 ease-in-out active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f] ${selected
  ? 'border-[#12358f] bg-[#12358f] text-white shadow-sm'
  : 'border-[#12358f]/15 bg-white/90 text-[#34466a] hover:border-[#12358f] hover:bg-[#12358f] hover:text-white hover:shadow-[0_0_20px_rgba(18,53,143,0.24)]'
}`;

export default function ActivityChapterButton({ name, slug, selected, href, onClick }: ActivityChapterButtonProps) {
  if (href) {
    return <Link href={href} aria-current={selected ? 'page' : undefined} className={className(selected)}>{content(name)}</Link>;
  }

  return <button type="button" data-chapter-slug={slug} aria-pressed={selected} onClick={onClick} className={className(selected)}>{content(name)}</button>;
}
