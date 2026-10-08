'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const EDGE_MARK = '/compony-logos/edge-india-mark.png';

function AdminDotMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !container || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let startTime = performance.now();
    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; alpha: number }[] = [];
    const routes = [
      { from: [0.18, 0.36], to: [0.42, 0.22], delay: 0, duration: 3.2 },
      { from: [0.42, 0.22], to: [0.68, 0.37], delay: 1.3, duration: 3.5 },
      { from: [0.25, 0.67], to: [0.51, 0.48], delay: 0.7, duration: 3.6 },
      { from: [0.68, 0.37], to: [0.82, 0.63], delay: 2.2, duration: 3.1 },
    ];

    const inMapShape = (x: number, y: number) =>
      ((x > 0.08 && x < 0.31) && (y > 0.18 && y < 0.42)) ||
      ((x > 0.19 && x < 0.33) && (y > 0.4 && y < 0.77)) ||
      ((x > 0.36 && x < 0.55) && (y > 0.2 && y < 0.4)) ||
      ((x > 0.4 && x < 0.58) && (y > 0.39 && y < 0.7)) ||
      ((x > 0.54 && x < 0.86) && (y > 0.18 && y < 0.52)) ||
      ((x > 0.73 && x < 0.88) && (y > 0.58 && y < 0.76));

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const gap = 11;
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          if (inMapShape(x / width, y / height)) {
            const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
            if (seed > 0.25) dots.push({ x, y, alpha: 0.18 + seed * 0.3 });
          }
        }
      }
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      for (const dot of dots) {
        context.beginPath();
        context.arc(dot.x, dot.y, 1.15, 0, Math.PI * 2);
        context.fillStyle = `rgba(18, 53, 143, ${dot.alpha})`;
        context.fill();
      }

      const elapsed = ((now - startTime) / 1000) % 12;
      for (const route of routes) {
        const progress = Math.max(0, Math.min(1, (elapsed - route.delay) / route.duration));
        if (elapsed < route.delay) continue;
        const sx = route.from[0] * width;
        const sy = route.from[1] * height;
        const ex = route.to[0] * width;
        const ey = route.to[1] * height;
        const x = sx + (ex - sx) * progress;
        const y = sy + (ey - sy) * progress;
        context.beginPath();
        context.moveTo(sx, sy);
        context.lineTo(x, y);
        context.strokeStyle = 'rgba(18, 53, 143, 0.3)';
        context.lineWidth = 1.2;
        context.stroke();
        context.beginPath();
        context.arc(x, y, 2.5, 0, Math.PI * 2);
        context.fillStyle = '#c8102e';
        context.fill();
        context.beginPath();
        context.arc(x, y, 6, 0, Math.PI * 2);
        context.fillStyle = 'rgba(200, 16, 46, 0.12)';
        context.fill();
      }
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    draw(performance.now());
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

export default function AdminSignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('');
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: String(formData.get('email') ?? '').trim(),
        password: String(formData.get('password') ?? ''),
      });
      if (error || !data.user) throw error ?? new Error('Unable to sign in.');

      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error('This account is not assigned as an Edge India administrator.');
      }

      router.replace('/admin/dashboard');
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Sign-in failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5fa] px-4 py-8 text-[#0b1c30] sm:px-8 lg:py-12">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#dfe5f0] bg-white shadow-[0_24px_80px_rgba(11,28,48,0.12)] md:min-h-[610px] md:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-[#eef3ff] md:flex md:flex-col md:justify-between md:p-10 lg:p-14">
          <AdminDotMap />
          <div className="relative z-10">
            <Link href="/" aria-label="Edge India home" className="inline-flex h-12 w-12 items-center justify-center">
              <Image src={EDGE_MARK} alt="Edge India" width={48} height={52} className="h-12 w-auto object-contain" priority />
            </Link>
            <div className="mt-16 max-w-sm">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#c8102e]">Edge India Business Group</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#08245d] lg:text-5xl">A considered space for people shaping business.</h2>
              <p className="mt-5 max-w-sm text-base leading-7 text-[#526582]">Manage the member directory and keep community information current.</p>
            </div>
          </div>
          <p className="relative z-10 text-xs font-semibold tracking-wide text-[#526582]">EDGE INDIA BUSINESS GROUP · ADMINISTRATION</p>
        </aside>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <Link href="/" aria-label="Edge India home" className="mb-8 inline-flex h-12 w-12 items-center justify-center md:hidden">
              <Image src={EDGE_MARK} alt="Edge India" width={48} height={52} className="h-12 w-auto object-contain" priority />
            </Link>
            <div className="mb-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf1fa] text-[#12358f]">
                <LockKeyhole aria-hidden="true" className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#c8102e]">Administrator access</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b1c30]">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-[#65758f]">Sign in to manage the Edge India member directory.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-[#263a59]">Email</label>
                <input id="admin-email" name="email" type="email" autoComplete="username" required placeholder="Enter your admin email" className="min-h-12 w-full rounded-lg border border-[#dbe3ef] bg-white px-4 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#91a0b8] focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10" />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-[#263a59]">Password</label>
                <div className="relative">
                  <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" className="min-h-12 w-full rounded-lg border border-[#dbe3ef] bg-white px-4 pr-12 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#91a0b8] focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#91a0b8] transition hover:text-[#12358f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]">
                    {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {notice ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-800">{notice}</p> : null}

              <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#12358f] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#1e49b4] disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12358f]">
                {isSubmitting ? 'Signing in…' : 'Sign in'} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>

            <Link href="/" className="mt-7 block text-center text-sm font-semibold text-[#526582] transition hover:text-[#12358f]">Return to Edge India website</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
