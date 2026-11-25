import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import type { AuthUser } from '@/types';

interface ForbiddenPageProps {
    status?: number;
    message?: string;
}

function ForbiddenIllustration() {
    return (
        <svg className="mx-auto mb-6 block w-full max-w-[260px]" viewBox="0 0 340 230" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <ellipse cx="170" cy="196" rx="115" ry="14" fill="#F1F6FF" />
            <circle cx="170" cy="112" r="88" fill="#F8FAFC" stroke="#F1F1F4" strokeWidth="1.5" />
            <circle cx="170" cy="112" r="68" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="5 5" />

            <rect x="38" y="72" width="76" height="54" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="56" cy="90" r="8" fill="#F1F6FF" />
            <rect x="70" y="85" width="32" height="5" rx="2.5" fill="#CBD5E1" />
            <rect x="70" y="94" width="22" height="4" rx="2" fill="#E2E8F0" />
            <rect x="48" y="108" width="54" height="6" rx="3" fill="#F1F5F9" />

            <rect x="228" y="64" width="72" height="36" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="244" cy="82" r="5" fill="#1B84FF" fillOpacity="0.16" />
            <circle cx="244" cy="82" r="2.5" fill="#1B84FF" />
            <text x="255" y="86" fill="#071437" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" letterSpacing="0.04em">
                403
            </text>

            <path d="M170 38L222 57V107C222 141.5 199.5 170 170 182C140.5 170 118 141.5 118 107V57L170 38Z" fill="#071437" />
            <path d="M170 44L216 61V107C216 138 196 164 170 175.5C144 164 124 138 124 107V61L170 44Z" fill="url(#shield-grad)" stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="1.5" />

            <rect x="148" y="102" width="44" height="34" rx="8" fill="#FFFFFF" />
            <path d="M157 102V92C157 84.8203 162.82 79 170 79C177.18 79 183 84.8203 183 92V102" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="170" cy="117" r="4" fill="#1B84FF" />
            <path d="M170 121V127" stroke="#1B84FF" strokeWidth="3" strokeLinecap="round" />

            <path d="M95 44L97.2 49.8L103 52L97.2 54.2L95 60L92.8 54.2L87 52L92.8 49.8L95 44Z" fill="#1B84FF" fillOpacity="0.45" />
            <circle cx="256" cy="142" r="4" fill="#D4AF37" fillOpacity="0.6" />
            <circle cx="84" cy="154" r="3" fill="#CBD5E1" />

            <defs>
                <linearGradient id="shield-grad" x1="170" y1="44" x2="170" y2="175.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#13295C" />
                    <stop offset="1" stopColor="#071437" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function ForbiddenPage({ message }: ForbiddenPageProps) {
    const page = usePage();
    const auth = (page.props as { auth?: { user?: AuthUser } }).auth?.user;

    const content = (
        <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-[480px] text-center">
                <ForbiddenIllustration />

                <div className="text-[11.5px] font-bold tracking-[0.14em] text-[#1B84FF] uppercase">
                    403 · Access Restricted
                </div>

                <h1 className="mt-2.5 text-[24px] font-bold tracking-tight text-[#071437]">
                    Verification Required
                </h1>

                <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-relaxed text-[#4B5675]">
                    {message || 'You do not have permission to view this page.'}
                </p>

                {auth && (
                    <p className="mx-auto mt-2 max-w-[400px] text-[13px] leading-relaxed text-[#99A1B7]">
                        Complete your college and personal profile so your college representative or administrator can verify your membership.
                    </p>
                )}

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    {auth ? (
                        <>
                            <Link
                                href="/member/profile"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(27,132,255,0.22)] transition-colors hover:bg-[#006AE6]"
                            >
                                Complete Profile
                            </Link>
                            <Link
                                href="/member/dashboard"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#DBDFE9] bg-white px-5 text-[13px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                            >
                                Back to Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(27,132,255,0.22)] transition-colors hover:bg-[#006AE6]"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#DBDFE9] bg-white px-5 text-[13px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                            >
                                Go to Home
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    if (auth) {
        return (
            <MemberLayout title="Access Restricted" breadcrumbs={[{ title: 'Verification Required' }]}>
                <Head title="Access Restricted - INTAKE97.COM" />
                {content}
            </MemberLayout>
        );
    }

    return (
        <>
            <Head title="403 Access Restricted - INTAKE97.COM" />
            {content}
        </>
    );
}
