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
        <section className="border-t border-[#0B1220]/[0.06] bg-white py-16 sm:py-20">
            <div className={`${LANDING_CONTAINER} flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center`}>
                <div className="max-w-xl">
                    <h2 className="font-serif text-2xl font-medium text-[#0B1220] sm:text-3xl">{title}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#4A4F5C]">{description}</p>
                    {links && links.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-4">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="text-[14px] font-medium text-[#7A5E28] underline decoration-[#9A7B3F]/40 underline-offset-4 hover:decoration-[#9A7B3F]"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <PrimaryCta as="link" href="/?signup=1" variant="navy" className="shrink-0 !px-7 !py-3.5">
                    Join the association
                </PrimaryCta>
            </div>
        </section>
    );
}