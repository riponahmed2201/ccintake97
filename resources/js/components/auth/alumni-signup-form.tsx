import React, { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const inputBase =
    'h-11 w-full rounded-xl border bg-[#F8FAFC] px-3.5 text-[15px] text-[#091324] transition-all duration-200 placeholder:text-[#091324]/35 focus:bg-white focus:outline-none focus:ring-4';
const inputOk = 'border-[#091324]/12 hover:border-[#091324]/25 focus:border-[#5E121D] focus:ring-[#450D15]/15';
const inputErr = 'border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-500/10';

function Field({ label, error, children, className = '' }: {
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.16em] text-[#091324]/60 uppercase">{label}</span>
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
                    <Link href="/login" className="font-medium text-[#0B1220] underline decoration-[#5E121D]/40 underline-offset-4">
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
                disabled={processing || passwordsMismatch}
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#450D15] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#5E121D] hover:shadow-[0_12px_28px_-10px_rgba(94, 18, 29,0.55)] disabled:cursor-not-allowed disabled:opacity-65"
            >
                {processing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                    <>
                        Create account
                        <ArrowRight className="h-4 w-4 text-white/90 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                )}
            </button>

            {compact && (
                <div className="space-y-2 pt-1 text-center">
                    <p className="text-[12px] leading-relaxed text-[#091324]/50">
                        College and roll number can be added after you sign in.
                    </p>
                    <p className="text-[13px] text-[#4A4F5C]">
                        Already a member?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-[#091324] underline decoration-[#450D15]/60 underline-offset-4 hover:text-[#5E121D]"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            )}
        </form>
    );
}