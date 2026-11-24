import { Link } from '@inertiajs/react';
import { CalendarDays, ShieldCheck, Users } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import type { AuthLayoutProps } from '@/types';

const POINTS = [
    { icon: Users, title: 'Verified directory', text: 'Find batchmates by college, house and roll.' },
    { icon: ShieldCheck, title: 'Private by default', text: 'Contact details stay inside the member portal.' },
    { icon: CalendarDays, title: 'Reunion 2027', text: 'One intake, ten colleges, gathering planned in Dhaka.' },
];

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
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

                    <div className="relative z-10 flex items-start justify-between px-12 pt-10 xl:px-16">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <BrandMark className="h-14 w-auto" />
                            <span>
                                <span className="block font-brand text-[22px] font-semibold">
                                    ccIntake<span className="text-[#C9A55C]">97</span>
                                </span>
                                <span className="text-[11px] text-[#F7F3EA]/55">Cadet College Alumni</span>
                            </span>
                        </Link>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-[#F7F3EA]/70">
                            Trusted batch portal
                        </span>
                    </div>

                    <div className="relative z-10 px-12 pb-8 xl:px-16">
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#C9A55C]/15 px-3 py-1 text-[12px] font-medium text-[#E8D5A3]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E8D5A3]" />
                            Intake 1997
                        </p>
                        <h2 className="mt-6 max-w-xl font-serif text-5xl leading-[1.05] font-medium tracking-[-0.02em] xl:text-6xl">
                            Everything the batch needs.
                            <span className="mt-1 block text-[#E8D5A3]">One secure sign-in.</span>
                        </h2>
                        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#F7F3EA]/65">
                            Directory, profile and reunion — for verified cadets of the ten colleges.
                        </p>
                    </div>

                    <ul className="relative z-10 space-y-3 px-12 pb-12 xl:px-16">
                        {POINTS.map((point) => (
                            <li key={point.title} className="flex max-w-md items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A55C]/15 text-[#E8D5A3]">
                                    <point.icon className="h-5 w-5" />
                                </span>
                                <span>
                                    <span className="block text-[15px] font-semibold">{point.title}</span>
                                    <span className="mt-0.5 block text-[13px] leading-snug text-[#F7F3EA]/55">{point.text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="relative flex items-center justify-center px-5 py-10 sm:px-8">
                    <div className="w-full max-w-[440px] overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-36px_rgba(7,17,31,0.45)] ring-1 ring-[#0B1220]/[0.06]">
                        <div className="h-1 bg-gradient-to-r from-[#E8D5A3] via-[#C9A55C] to-[#9A7B3F]" />
                        <div className="px-7 py-8 sm:px-9 sm:py-10">
                            <Link href="/" className="inline-flex items-center gap-2.5">
                                <BrandMark className="h-11 w-auto" />
                                <span>
                                    <span className="block font-brand text-lg leading-none font-semibold">
                                        ccIntake<span className="text-[#9A7B3F]">97</span>
                                    </span>
                                    <span className="mt-1 block text-[11px] text-[#0B1220]/45">Member portal</span>
                                </span>
                            </Link>
                            <h1 className="mt-8 text-[28px] leading-tight font-semibold tracking-[-0.02em]">{title}</h1>
                            {description && <p className="mt-1.5 text-[15px] text-[#4A4F5C]">{description}</p>}
                            <div className="mt-7 border-t border-[#0B1220]/[0.06] pt-7">{children}</div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
