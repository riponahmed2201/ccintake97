import type { Article, Business, College, Committee, Event } from '@/types/intake97';

export interface WelcomeMetrics {
    total_members: number;
    verified_members: number;
    total_colleges: number;
    intake_year: number;
}

export interface DirectoryPreviewMember {
    id: number;
    name: string;
    initials: string;
    college: { short_name?: string; name: string; logo_url?: string | null } | null;
    photo_url: string | null;
    designation: string | null;
    organization: string | null;
    city: string | null;
}

export interface WelcomeProps {
    colleges: (College & { members_count: number })[];
    events: Event[];
    articles: Article[];
    committee: Committee | null;
    businesses?: Business[];
    metrics: WelcomeMetrics;
    directoryPreview?: DirectoryPreviewMember[];
}

export type MergedCollege = {
    short_name: string;
    name: string;
    established: number;
    location: string;
    region: string;
    houses: string;
    cohort: string;
    tagline: string;
    id: number | string;
    members_count: number;
    website: string;
    logo_url: string | null;
};