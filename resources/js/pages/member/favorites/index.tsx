import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ArrowRight } from 'lucide-react';

interface FavoritesIndexProps {
    favorites: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function MemberFavoritesIndex({ favorites }: FavoritesIndexProps) {
    return (
        <MemberLayout
            title="Saved Items & Bookmarks"
            breadcrumbs={[{ title: 'Saved Items' }]}
        >
            <Head title="Saved Items - INTAKE97.COM" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        My Saved Items & Bookmarks
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Convenient access to bookmarked alumni profiles, articles, and directory resources.
                    </p>
                </div>

                <div className="space-y-3">
                    {favorites.data?.length === 0 ? (
                        <Card className="p-12 text-center text-xs text-slate-400">
                            You have not bookmarked any items yet.
                        </Card>
                    ) : (
                        favorites.data?.map((fav) => (
                            <Card key={fav.id} className="p-4 flex items-center justify-between text-xs">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="text-[10px] capitalize">
                                        {fav.favoritable_type?.split('\\').pop()}
                                    </Badge>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {fav.favoritable?.title || fav.favoritable?.name || 'Saved Item'}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
