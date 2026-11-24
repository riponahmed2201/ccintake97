import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh bg-white text-[#0B1220] lg:grid-cols-2">
            <aside className="relative hidden overflow-hidden bg-[#0B1220] text-[#F7F3EA] lg:flex lg:flex-col lg:justify-between">
                <img src="/images/campus/rcc.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#0B1220]/80 to-[#0B1220]/55" />
                <div className="relative z-10 p-10 xl:p-14">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <BrandMark className="h-14 w-auto" />
                        <span>
                            <span className="block font-brand text-[22px] font-semibold tracking-[0.02em]">
                                ccIntake<span className="text-[#C9A55C]">97</span>
                            </span>
                            <span className="text-[10px] tracking-[0.28em] text-[#F7F3EA]/50 uppercase">Cadet College Alumni</span>
                        </span>
                    </Link>
                </div>
                <div className="relative z-10 max-w-md p-10 xl:p-14">
                    <p className="text-[11px] font-medium tracking-[0.28em] text-[#D9BF85] uppercase">Member portal</p>
                    <h2 className="mt-4 font-serif text-4xl leading-[1.08] font-medium xl:text-5xl">
                        The roll is open to <em className="font-normal text-[#E8D5A3]">verified batchmates.</em>
                    </h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-[#F7F3EA]/65">
                        Sign in to the directory, your profile, and the association. Public pages stay open without an account.
                    </p>
                </div>
            </aside>

            <main className="flex flex-col px-5 py-8 sm:px-10">
                <div className="flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-[#0B1220]/55 transition-colors hover:text-[#0B1220]">
                        <ArrowLeft className="h-4 w-4" /> Home
                    </Link>
                    <Link href="/" className="inline-flex items-center gap-2 lg:hidden">
                        <BrandMark className="h-10 w-auto" />
                        <span className="font-brand text-lg font-semibold">
                            ccIntake<span className="text-[#9A7B3F]">97</span>
                        </span>
                    </Link>
                </div>

                <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
                    <h1 className="font-serif text-4xl leading-tight font-medium tracking-[-0.02em]">{title}</h1>
                    {description && <p className="mt-3 text-[15px] leading-relaxed text-[#4A4F5C]">{description}</p>}
                    <div className="mt-8">{children}</div>
                </div>
            </main>
        </div>
    );
}
