import { Head, Link } from '@inertiajs/react';
import { AlumniSignupForm } from '@/components/auth/alumni-signup-form';
import BrandMark from '@/components/brand-mark';
import { ShieldCheck, UserRound, BadgeCheck } from 'lucide-react';

const STEPS = [
    { icon: UserRound, title: 'Create your account', text: 'Name, email and a password. That is all for now.' },
    { icon: BadgeCheck, title: 'Complete your profile', text: 'College, roll number and contact details after you sign in.' },
    { icon: ShieldCheck, title: 'Get verified', text: 'A college batch representative confirms you are on the roll.' },
];

export default function RegisterAlumni() {
    return (
        <>
            <Head title="Apply for membership" />

            <div className="relative min-h-svh bg-[#F3F6F5] text-[#0B1220]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(201,165,92,0.16),transparent_42%)]" />
                <div className="relative grid min-h-svh lg:grid-cols-[1.15fr_0.85fr]">
                    <aside className="relative hidden overflow-hidden bg-[#07111F] text-[#F7F3EA] lg:flex lg:flex-col lg:justify-between">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-70"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                                backgroundSize: '56px 56px',
                            }}
                        />
                        <div className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[#C9A55C]/10 blur-3xl" />

                        <div className="relative z-10 px-12 pt-10 xl:px-16">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <BrandMark className="h-14 w-auto" />
                                <span>
                                    <span className="block font-brand text-[22px] font-semibold">
                                        ccIntake<span className="text-[#C9A55C]">97</span>
                                    </span>
                                    <span className="text-[11px] text-[#F7F3EA]/55">Cadet College Alumni</span>
                                </span>
                            </Link>
                        </div>

                        <div className="relative z-10 px-12 xl:px-16">
                            <p className="inline-flex items-center gap-2 rounded-full bg-[#C9A55C]/15 px-3 py-1 text-[12px] font-medium text-[#E8D5A3]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#E8D5A3]" />
                                Class of 1997
                            </p>
                            <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[1.05] font-medium tracking-[-0.02em] xl:text-6xl">
                                Take your place
                                <span className="mt-1 block text-[#E8D5A3]">on the roll.</span>
                            </h1>
                            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#F7F3EA]/65">
                                For cadets who entered one of the ten cadet colleges in 1997.
                            </p>
                        </div>

                        <ol className="relative z-10 space-y-3 px-12 pb-12 xl:px-16">
                            {STEPS.map((step) => (
                                <li key={step.title} className="flex max-w-md items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A55C]/15 text-[#E8D5A3]">
                                        <step.icon className="h-5 w-5" />
                                    </span>
                                    <span>
                                        <span className="block text-[15px] font-semibold">{step.title}</span>
                                        <span className="mt-0.5 block text-[13px] leading-snug text-[#F7F3EA]/55">{step.text}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </aside>

                    <main className="relative flex items-center justify-center px-5 py-10 sm:px-8">
                        <div className="w-full max-w-[460px] overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-36px_rgba(7,17,31,0.45)] ring-1 ring-[#0B1220]/[0.06]">
                            <div className="h-1 bg-gradient-to-r from-[#E8D5A3] via-[#C9A55C] to-[#9A7B3F]" />
                            <div className="px-7 py-8 sm:px-9 sm:py-10">
                                <Link href="/" className="inline-flex items-center gap-2.5 lg:hidden">
                                    <BrandMark className="h-11 w-auto" />
                                    <span className="font-brand text-lg font-semibold">
                                        ccIntake<span className="text-[#9A7B3F]">97</span>
                                    </span>
                                </Link>
                                <h2 className="mt-6 text-[28px] leading-tight font-semibold tracking-[-0.02em] lg:mt-0">Create your account</h2>
                                <p className="mt-1.5 text-[15px] text-[#4A4F5C]">Name, email and password. College details come next.</p>
                                <div className="mt-7 border-t border-[#0B1220]/[0.06] pt-7">
                                    <AlumniSignupForm />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
