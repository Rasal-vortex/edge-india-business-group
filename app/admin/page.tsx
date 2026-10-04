'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const EDGE_LOGO = '/compony-logos/edege-india-logo-png-file.png';

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6fb] px-4 py-12 text-[#0b1c30]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#002069] via-[#12358f] to-[#bb0013]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#12358f]/[0.06] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-28 h-[30rem] w-[30rem] rounded-full bg-[#bb0013]/[0.04] blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(11,28,48,0.12)] md:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#061c4b] p-10 text-white md:flex lg:p-14">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(52,91,172,0.48),transparent_40%),linear-gradient(145deg,#061c4b_0%,#001438_65%,#07112b_100%)]" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-12 -right-4 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative z-10">
            <Link href="/" aria-label="Edge India home" className="inline-flex rounded bg-white px-3 py-2">
              <Image src={EDGE_LOGO} alt="Edge India Business Group" width={220} height={52} className="h-10 w-auto object-contain" priority />
            </Link>
          </div>
          <div className="relative z-10 max-w-md pb-10">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d31b35]" />
              Administration
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] lg:text-[46px]">A considered space for the people shaping business.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/75">Manage the Edge India member directory with care and keep the community information current.</p>
          </div>
          <p className="relative z-10 text-[11px] font-medium tracking-wide text-blue-100/55">EDGE INDIA BUSINESS GROUP · ADMINISTRATION</p>
        </section>

        <section className="flex min-h-[620px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 self-start text-xs font-bold text-slate-500 transition hover:text-[#12358f] md:hidden">
            <Image src={EDGE_LOGO} alt="Edge India Business Group" width={185} height={44} className="h-8 w-auto object-contain" priority />
          </Link>
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#12358f]/[0.08] text-[#12358f]">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#bb0013]">Administrator access</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b1c30]">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage the Edge India member directory.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-bold text-slate-700">Official email</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" required placeholder="Enter your admin email" className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3.5 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#12358f] focus:ring-4 focus:ring-[#12358f]/10" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-[#12358f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12358f]">
                  {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {notice ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-800">{notice}</p> : null}

            <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#12358f] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002069] disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0013]">
              {isSubmitting ? 'Signing in…' : 'Sign in'} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />Securely authenticated with Supabase.</p>
          <Link href="/" className="mt-8 self-center text-xs font-bold text-slate-500 transition hover:text-[#12358f]">Return to Edge India website</Link>
        </section>
      </div>
    </main>
  );
}
