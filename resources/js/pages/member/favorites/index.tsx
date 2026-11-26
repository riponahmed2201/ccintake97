import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Bookmark, Search, Newspaper } from 'lucide-react';

interface FavoritesIndexProps {
    favorites: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function MemberFavoritesIndex({ favorites }: FavoritesIndexProps) {
    const items = favorites.data || [];

    return (
        <MemberLayout
            title="Saved Items"
            breadcrumbs={[{ title: 'Saved Items' }]}
        >
            <Head title="Saved Items - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                        My Saved Items &amp; Bookmarks
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Convenient access to bookmarked alumni profiles, articles, and directory resources.
                    </p>
                </div>

                {/* Bookmarks List */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                                <Bookmark className="size-5" />
                            </div>
                            <p className="text-[13.5px] font-semibold text-[#071437]">No saved items yet</p>
                            <p className="mt-1 max-w-md text-[12.5px] text-[#78829D]">
                                You have not bookmarked any alumni profiles, articles, or resources yet.
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                                <Link
                                    href="/member/directory"
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#006AE6]"
                                >
                                    <Search className="size-3.5" />
                                    Browse Directory
                                </Link>
                                <Link
                                    href="/member/articles"
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                                >
                                    <Newspaper className="size-3.5 text-[#78829D]" />
                                    Read News
                                </Link>
                            </div>
                        </div>
                    ) : (
                        items.map((fav) => (
                            <div
                                key={fav.id}
                                className="flex items-center justify-between gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                            >
                                <div className="min-w-0 space-y-1.5">
                                    <span className="inline-flex rounded-md bg-[#F1F6FF] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#1B84FF] capitalize">
                                        {fav.favoritable_type?.split('\\').pop() || 'Bookmark'}
                                    </span>
                                    <div className="truncate text-[14px] font-semibold text-[#071437]">
                                        {fav.favoritable?.title || fav.favoritable?.name || 'Saved Item'}
                                    </div>
                                </div>
                                <Bookmark className="size-4 shrink-0 text-[#1B84FF]" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
