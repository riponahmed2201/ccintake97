import React, { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

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

export function AlumniSignupForm({
    compact = false,
    onSuccess,
}: {
    compact?: boolean;
    onSuccess?: () => void;
}) {
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
            onSuccess: () => onSuccess?.(),
            onError: () => {
                requestAnimationFrame(() => {
                    document.querySelector('[data-signup-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!compact && (
                <p className="text-[14px] text-[#4A4F5C]">
                    Already a member?{' '}
                    <Link href="/login" className="font-medium text-[#0B1220] underline decoration-[#9A7B3F]/40 underline-offset-4">
                        Sign in
                    </Link>
                </p>
            )}

            <Field label="Full name" error={err.name}>
                <input
                    data-signup-error={!!err.name}
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={cls('name')}
                />
            </Field>

            <Field label="Email" error={err.email}>
                <input
                    data-signup-error={!!err.email}
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={cls('email')}
                />
            </Field>

            <Field label="Password" error={err.password}>
                <div className="relative">
                    <input
                        data-signup-error={!!err.password}
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
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-[#0B1220]/35 hover:text-[#0B1220]"
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
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B1220] text-[15px] font-medium text-[#F7F3EA] transition-all hover:bg-[#1A2438] disabled:opacity-70"
            >
                {processing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8D5A3]/30 border-t-[#E8D5A3]" />
                ) : (
                    <>
                        Create account
                        <ArrowRight className="h-4 w-4 text-[#E8D5A3] transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </button>

            <p className="text-center text-[12px] leading-relaxed text-[#0B1220]/45">
                Add college, roll number and career details from{' '}
                <Link href="/register-alumni" className="underline decoration-[#9A7B3F]/40">
                    the full registration page
                </Link>{' '}
                if you prefer.
            </p>
        </form>
    );
}