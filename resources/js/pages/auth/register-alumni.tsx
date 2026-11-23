import React, { useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';

const STEPS = [
    { title: 'Sign up', text: 'Name, email and a secure password.' },
    { title: 'Your profile', text: 'College, roll number, career and contact details.' },
    { title: 'Verification', text: 'Confirmed by your college batch representative.' },
];

const inputBase =
    'h-12 w-full rounded-xl border bg-[#FCFBF8] px-3.5 text-[15px] text-[#0B1220] transition-all duration-200 placeholder:text-[#0B1220]/30 focus:bg-white focus:outline-none focus:ring-4';
const inputOk = 'border-[#0B1220]/10 hover:border-[#0B1220]/20 focus:border-[#9A7B3F] focus:ring-[#C9A55C]/15';
const inputErr = 'border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-500/10';

function Field({ label, error, children, className = '' }: {
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-[13px] font-medium text-[#0B1220]/80">{label}</span>
            {children}
            {error && <span className="mt-1.5 block text-[12.5px] text-red-600">{error}</span>}
        </label>
    );
}

export default function RegisterAlumni() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const err = errors as Partial<Record<keyof typeof data, string>>;
    const cls = (key: keyof typeof data) => `${inputBase} ${err[key] ? inputErr : inputOk}`;

    const passwordStrength = useMemo(() => {
        const p = data.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (p.length >= 12) s++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
        if (/\d/.test(p) || /[^A-Za-z0-9]/.test(p)) s++;
        return s;
    }, [data.password]);

    const passwordsMismatch = data.password_confirmation.length > 0 && data.password !== data.password_confirmation;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register-alumni', {
            preserveScroll: true,
            onError: () => {
                requestAnimationFrame(() => {
                    document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            },
        });
    };

    return (
        <>
            <Head title="Apply for Membership — ccIntake97" />

            <div className="min-h-screen bg-[#F5F1E8] font-sans text-[#0B1220] antialiased selection:bg-[#C9A55C] selection:text-[#0B1220] lg:grid lg:grid-cols-[5fr_7fr]">
                <aside className="relative isolate overflow-hidden bg-[#070B14] text-[#F7F3EA] lg:sticky lg:top-0 lg:h-screen">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-48 -right-48 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.18),transparent_62%)]" />
                        <div className="absolute -bottom-56 -left-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(123,17,19,0.22),transparent_65%)]" />
                    </div>

                    <div className="flex h-full flex-col px-6 py-7 sm:px-10 lg:px-14 lg:py-12">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <BrandMark className="h-11 w-auto shrink-0" />
                                <span className="font-brand text-xl font-semibold tracking-[0.02em]">
                                    ccIntake<span className="text-[#C9A55C] [font-variant-numeric:lining-nums]">97</span>
                                </span>
                            </Link>
                            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#F7F3EA]/50 transition-colors hover:text-[#F7F3EA]">
                                <ArrowLeft className="h-3.5 w-3.5" /> Back
                            </Link>
                        </div>

                        <div className="flex flex-1 flex-col justify-center py-12 lg:py-0">
                            <p className="text-[11px] font-medium tracking-[0.28em] text-[#D9BF85] uppercase">Class of 1997</p>
                            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.04] font-medium tracking-[-0.015em] sm:text-5xl lg:text-[3.75rem]">
                                Take your place
                                <br />
                                <span className="bg-gradient-to-r from-[#F1DFB0] via-[#C9A55C] to-[#E8D5A3] bg-clip-text font-normal text-transparent">on the roll.</span>
                            </h1>
                            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#F7F3EA]/50">
                                For cadets who entered a Bangladesh Cadet College in 1997.
                            </p>

                            <ol className="mt-14 hidden max-w-sm lg:block">
                                {STEPS.map((s, i) => (
                                    <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0">
                                        {i < STEPS.length - 1 && <span className="absolute top-7 left-[11px] h-[calc(100%-1.75rem)] w-px bg-[#F7F3EA]/10" />}
                                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${i === 0 ? 'bg-[#C9A55C] text-[#0B1220]' : 'border border-[#F7F3EA]/15 text-[#F7F3EA]/45'}`}>
                                            {i + 1}
                                        </span>
                                        <div>
                                            <div className={`text-[14px] font-medium ${i === 0 ? 'text-[#F7F3EA]' : 'text-[#F7F3EA]/65'}`}>{s.title}</div>
                                            <div className="mt-0.5 text-[13px] text-[#F7F3EA]/40">{s.text}</div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <p className="hidden text-[11px] tracking-[0.3em] text-[#F7F3EA]/25 uppercase lg:block">Fidelitas et Disciplina</p>
                    </div>
                </aside>

                <main className="flex items-center justify-center px-3 py-10 sm:px-6 lg:min-h-screen lg:py-16">
                    <div className="w-full max-w-[500px]">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="font-serif text-[2.25rem] leading-tight font-medium text-[#0B1220]">Create your account</h2>
                            <p className="mt-2 text-[15px] text-[#4A4F5C]">
                                Already a member?{' '}
                                <Link href="/login" className="font-medium text-[#0B1220] underline decoration-[#9A7B3F]/40 underline-offset-4 hover:decoration-[#9A7B3F]">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 rounded-[1.75rem] bg-white px-4 py-6 shadow-[0_40px_80px_-48px_rgba(11,18,32,0.35)] ring-1 ring-[#0B1220]/[0.05] sm:px-5 sm:py-7"
                        >
                            <Field label="Full name" error={err.name}>
                                <input data-error={!!err.name} required autoComplete="name" placeholder="Enter your full name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={cls('name')} />
                            </Field>

                            <Field label="Email" error={err.email}>
                                <input data-error={!!err.email} required type="email" autoComplete="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={cls('email')} />
                            </Field>

                            <Field label="Password" error={err.password}>
                                <div className="relative">
                                    <input
                                        data-error={!!err.password}
                                        required
                                        minLength={8}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`${cls('password')} pr-11`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-[#0B1220]/35 transition-colors hover:text-[#0B1220]"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </Field>

                            <Field label="Confirm password" error={err.password_confirmation || (passwordsMismatch ? 'Passwords don’t match.' : undefined)}>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`${inputBase} ${passwordsMismatch || err.password_confirmation ? inputErr : inputOk}`}
                                />
                            </Field>

                            {data.password && (
                                <div className="-mt-1 flex items-center gap-3">
                                    <div className="flex flex-1 gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <span
                                                key={i}
                                                className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                                                    i < passwordStrength ? (passwordStrength <= 1 ? 'bg-red-400' : passwordStrength === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-[#0B1220]/[0.07]'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="w-12 text-right text-[11px] text-[#0B1220]/40">{['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="group !mt-8 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#0B1220] text-[15px] font-medium text-[#F7F3EA] transition-all duration-300 hover:bg-[#1A2438] hover:shadow-[0_16px_32px_-16px_rgba(11,18,32,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8D5A3]/30 border-t-[#E8D5A3]" />
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="h-4 w-4 text-[#E8D5A3] transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[12.5px] leading-relaxed text-[#0B1220]/45">
                                After sign-in, open <strong className="font-medium text-[#0B1220]/60">My Profile</strong> to add college, roll number, phone, and career details.
                            </p>
                        </form>

                        <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#0B1220]/40">
                            <Lock className="h-3 w-3" />
                            Your details are private and visible only to verified batchmates.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}