'use client';

const bars = Array.from({ length: 7 }, (_, index) => index);

export default function LiquidLoader({ message = 'Loading community profiles…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite" aria-label={message}>
      <div aria-hidden="true" className="liquid-loader flex h-16 items-end gap-2 px-4">
        {bars.map((bar) => (
          <span key={bar} className="liquid-loader__bar" style={{ animationDelay: `${bar * 90}ms` }} />
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-700">{message}</span>
    </div>
  );
}
