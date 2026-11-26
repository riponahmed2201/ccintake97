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

export interface CmsSlideItem {
    src: string;
    college: string;
    caption: string;
    position: string;
    dim: number;
}

export interface CmsMilestoneItem {
    year: string;
    title: string;
    tagline: string;
    description: string;
    is_highlighted?: boolean;
}

export interface CmsGalleryItem {
    src: string;
    title: string;
    place: string;
}

export interface CmsData {
    heroSlides?: CmsSlideItem[];
    heroConfig?: {
        headline?: string | null;
        highlight?: string | null;
        subtitle?: string | null;
        primary_cta?: string | null;
        secondary_cta?: string | null;
    };
    milestones?: CmsMilestoneItem[];
    galleryItems?: CmsGalleryItem[];
}

export interface WelcomeProps {
    colleges: (College & { members_count: number })[];
    events: Event[];
    articles: Article[];
    committee: Committee | null;
    businesses?: Business[];
    metrics: WelcomeMetrics;
    directoryPreview?: DirectoryPreviewMember[];
    cms?: CmsData;
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