import { Link } from '@inertiajs/react';
import { PrimaryCta } from '@/components/landing/cta';
import { LANDING_CONTAINER } from '@/components/landing/layout';

export function MarketingCtaBand({
    title,
    description,
    links,
}: {
    title: string;
    description: string;
    links?: { href: string; label: string }[];
}) {
    return (
        <section className="relative isolate overflow-hidden border-t border-[#10B981]/20 bg-[#091324] py-16 text-[#F8F5EE] sm:py-20">
            <div className="pointer-events-none absolute -top-32 right-0 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(200,162,82,0.16),transparent_65%)]" />
            <div className={`${LANDING_CONTAINER} flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center`}>
                <div className="max-w-xl">
                    <p className="text-[11px] font-medium tracking-[0.24em] text-[#34D399]/75 uppercase">Next steps</p>
                    <h2 className="mt-2 font-serif text-3xl font-medium text-white sm:text-4xl">{title}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#F8F5EE]/70">{description}</p>
                    {links && links.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-3">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[13px] font-medium text-[#34D399] transition-colors hover:border-[#10B981]/50 hover:bg-white/[0.12]"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <PrimaryCta as="link" href="/?signup=1" variant="gold" className="shrink-0 !px-8 !py-4">
                    Join the association
                </PrimaryCta>
            </div>
        </section>
    );
}