import { Link } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh bg-[#F8FAFC] text-[#0B1220]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(201,165,92,0.12),transparent_45%)]" />
            <div className="relative grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="relative hidden overflow-hidden bg-[#07111F] text-[#F7F3EA] lg:flex lg:flex-col lg:justify-between">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-60"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                            backgroundSize: '56px 56px',
                        }}
                    />
                    <div className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[#C9A55C]/12 blur-3xl" />

                    <div className="relative z-10 px-12 pt-12 xl:px-16">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <BrandMark className="h-12 w-auto" />
                            <span>
                                <span className="block font-brand text-[22px] font-semibold">
                                    ccIntake<span className="text-[#C9A55C]">97</span>
                                </span>
                                <span className="text-[11px] text-[#F7F3EA]/55">Cadet College Alumni Network</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 px-12 pb-16 xl:px-16">
                        <div className="mb-5 h-px w-12 bg-[#C9A55C]" />
                        <h2 className="max-w-lg font-serif text-5xl leading-[1.06] font-medium tracking-[-0.02em] xl:text-[3.5rem]">
                            Ten Cadet Colleges.
                            <span className="mt-1 block text-[#E8D5A3]">One verified portal.</span>
                        </h2>
                        <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-[#F7F3EA]/65">
                            Access the alumni directory, batch events, and member services for the 1997 Cadet College intake.
                        </p>
                    </div>

                    <div className="relative z-10 border-t border-white/10 px-12 py-6 text-[12.5px] text-[#F7F3EA]/50 xl:px-16">
                        © {new Date().getFullYear()} CCINTAKE97.COM · Class of 1997
                    </div>
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
