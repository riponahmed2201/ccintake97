import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import type { AuthUser } from '@/types';

interface StatusPageProps {
    status: 403 | 404 | 500 | number;
    message?: string | null;
}

const STATUS_META: Record<
    number,
    {
        eyebrow: string;
        title: string;
        defaultMessage: string;
        guestHint?: string;
        memberHint?: string;
    }
> = {
    403: {
        eyebrow: '403 · Access Restricted',
        title: 'Verification Required',
        defaultMessage: 'You do not have permission to view this page.',
        memberHint:
            'Complete your college and personal profile so your college representative or administrator can verify your membership.',
    },
    404: {
        eyebrow: '404 · Page Not Found',
        title: 'Page Not Found',
        defaultMessage: 'The page you are looking for may have been moved, deleted, or does not exist.',
        memberHint: 'Check the URL or return to your portal dashboard to continue browsing.',
        guestHint: 'Check the web address or head back to the homepage.',
    },
    500: {
        eyebrow: '500 · Server Error',
        title: 'Something Went Wrong',
        defaultMessage: 'An unexpected error occurred on our end while processing your request.',
        memberHint: 'Please try refreshing the page or return to your dashboard while we look into it.',
        guestHint: 'Please try again in a moment or return to the homepage.',
    },
};

function StatusIllustration({ status }: { status: number }) {
    if (status === 404) {
        return (
            <svg className="mx-auto mb-6 block w-full max-w-[260px]" viewBox="0 0 340 230" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <ellipse cx="170" cy="196" rx="115" ry="14" fill="#F1F6FF" />
                <circle cx="170" cy="112" r="88" fill="#F8FAFC" stroke="#F1F1F4" strokeWidth="1.5" />
                <circle cx="170" cy="112" r="68" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="5 5" />

                {/* Floating card left */}
                <rect x="38" y="76" width="76" height="50" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="52" y="92" width="48" height="6" rx="3" fill="#E2E8F0" />
                <rect x="52" y="104" width="32" height="5" rx="2.5" fill="#F1F5F9" />

                {/* Floating 404 badge right */}
                <rect x="228" y="64" width="72" height="36" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="244" cy="82" r="5" fill="#1B84FF" fillOpacity="0.16" />
                <circle cx="244" cy="82" r="2.5" fill="#1B84FF" />
                <text x="255" y="86" fill="#071437" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" letterSpacing="0.04em">
                    404
                </text>

                {/* Central Compass / Search Window */}
                <rect x="116" y="54" width="108" height="116" rx="16" fill="#071437" />
                <rect x="122" y="60" width="96" height="104" rx="12" fill="url(#card-grad-404)" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="1.2" />
                <circle cx="170" cy="108" r="24" fill="#FFFFFF" fillOpacity="0.08" stroke="#D4AF37" strokeWidth="2.5" />
                <circle cx="170" cy="108" r="10" fill="#1B84FF" />
                <path d="M187 125L201 139" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />

                <path d="M95 44L97.2 49.8L103 52L97.2 54.2L95 60L92.8 54.2L87 52L92.8 49.8L95 44Z" fill="#1B84FF" fillOpacity="0.45" />
                <circle cx="256" cy="142" r="4" fill="#D4AF37" fillOpacity="0.6" />

                <defs>
                    <linearGradient id="card-grad-404" x1="170" y1="60" x2="170" y2="164" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#13295C" />
                        <stop offset="1" stopColor="#071437" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    if (status === 500) {
        return (
            <svg className="mx-auto mb-6 block w-full max-w-[260px]" viewBox="0 0 340 230" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <ellipse cx="170" cy="196" rx="115" ry="14" fill="#FFF5F8" />
                <circle cx="170" cy="112" r="88" fill="#F8FAFC" stroke="#F1F1F4" strokeWidth="1.5" />
                <circle cx="170" cy="112" r="68" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="5 5" />

                {/* Floating 500 badge right */}
                <rect x="228" y="64" width="72" height="36" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="244" cy="82" r="5" fill="#F8285A" fillOpacity="0.16" />
                <circle cx="244" cy="82" r="2.5" fill="#F8285A" />
                <text x="255" y="86" fill="#071437" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" letterSpacing="0.04em">
                    500
                </text>

                {/* Central Server Stack */}
                <rect x="112" y="58" width="116" height="44" rx="10" fill="#071437" />
                <circle cx="132" cy="80" r="5" fill="#17C653" />
                <rect x="148" y="77" width="60" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.25" />

                <rect x="112" y="112" width="116" height="44" rx="10" fill="#13295C" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="1.2" />
                <circle cx="132" cy="134" r="5" fill="#F8285A" />
                <rect x="148" y="131" width="44" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.25" />
                <path d="M204 128L212 136M212 128L204 136" stroke="#F8285A" strokeWidth="2.5" strokeLinecap="round" />

                <path d="M88 52L90.2 57.8L96 60L90.2 62.2L88 68L85.8 62.2L80 60L85.8 57.8L88 52Z" fill="#F8285A" fillOpacity="0.4" />
                <circle cx="256" cy="142" r="4" fill="#D4AF37" fillOpacity="0.6" />
            </svg>
        );
    }

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
            <path d="M170 44L216 61V107C216 138 196 164 170 175.5C144 164 124 138 124 107V61L170 44Z" fill="url(#shield-grad-403)" stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="1.5" />

            <rect x="148" y="102" width="44" height="34" rx="8" fill="#FFFFFF" />
            <path d="M157 102V92C157 84.8203 162.82 79 170 79C177.18 79 183 84.8203 183 92V102" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="170" cy="117" r="4" fill="#1B84FF" />
            <path d="M170 121V127" stroke="#1B84FF" strokeWidth="3" strokeLinecap="round" />

            <path d="M95 44L97.2 49.8L103 52L97.2 54.2L95 60L92.8 54.2L87 52L92.8 49.8L95 44Z" fill="#1B84FF" fillOpacity="0.45" />
            <circle cx="256" cy="142" r="4" fill="#D4AF37" fillOpacity="0.6" />
            <circle cx="84" cy="154" r="3" fill="#CBD5E1" />

            <defs>
                <linearGradient id="shield-grad-403" x1="170" y1="44" x2="170" y2="175.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#13295C" />
                    <stop offset="1" stopColor="#071437" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function StatusPage({ status, message }: StatusPageProps) {
    const page = usePage();
    const auth = (page.props as { auth?: { user?: AuthUser } }).auth?.user;

    const meta = STATUS_META[status] ?? {
        eyebrow: `${status} · Error`,
        title: 'Unexpected Error',
        defaultMessage: 'Something unexpected happened.',
    };

    const hint = auth ? meta.memberHint : meta.guestHint;

    const content = (
        <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-[480px] text-center">
                <StatusIllustration status={status} />

                <div className={`text-[11.5px] font-bold tracking-[0.14em] uppercase ${status === 500 ? 'text-[#F8285A]' : 'text-[#1B84FF]'}`}>
                    {meta.eyebrow}
                </div>

                <h1 className="mt-2.5 text-[24px] font-bold tracking-tight text-[#071437]">
                    {meta.title}
                </h1>

                <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-relaxed text-[#4B5675]">
                    {message || meta.defaultMessage}
                </p>

                {hint && (
                    <p className="mx-auto mt-2 max-w-[400px] text-[13px] leading-relaxed text-[#99A1B7]">
                        {hint}
                    </p>
                )}

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    {auth ? (
                        <>
                            {status === 403 && (
                                <Link
                                    href="/member/profile"
                                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(27,132,255,0.22)] transition-colors hover:bg-[#006AE6]"
                                >
                                    Complete Profile
                                </Link>
                            )}
                            <Link
                                href="/member/dashboard"
                                className={
                                    status === 403
                                        ? 'inline-flex h-10 items-center justify-center rounded-lg border border-[#DBDFE9] bg-white px-5 text-[13px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]'
                                        : 'inline-flex h-10 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(27,132,255,0.22)] transition-colors hover:bg-[#006AE6]'
                                }
                            >
                                Back to Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(27,132,255,0.22)] transition-colors hover:bg-[#006AE6]"
                            >
                                Go to Home
                            </Link>
                            {status === 403 && (
                                <Link
                                    href="/login"
                                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[#DBDFE9] bg-white px-5 text-[13px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                                >
                                    Sign in
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    if (auth) {
        return (
            <MemberLayout title={meta.title} breadcrumbs={[{ title: `${status}` }]}>
                <Head title={`${status} ${meta.title} - CCINTAKE97.COM`} />
                {content}
            </MemberLayout>
        );
    }

    return (
        <>
            <Head title={`${status} ${meta.title} - CCINTAKE97.COM`} />
            {content}
        </>
    );
}
