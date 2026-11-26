<?php

namespace App\Support;

use App\Models\GalleryItem;
use App\Models\HeroSlide;
use App\Models\Initiative;
use App\Models\SystemSetting;
use App\Models\TimelineMilestone;

class WebsiteCmsData
{
    /**
     * @return array<string, mixed>
     */
    public static function forLanding(): array
    {
        $settings = SystemSetting::where('key', 'like', 'cms_%')
            ->orWhereIn('key', ['site_name', 'site_tagline', 'contact_email', 'contact_phone', 'office_address'])
            ->pluck('value', 'key');

        $heroSlides = HeroSlide::where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(fn (HeroSlide $s) => [
                'src' => $s->image_url,
                'college' => $s->college_code ?: '',
                'caption' => $s->title,
                'position' => $s->object_position ?: 'center 50%',
                'dim' => (float) $s->overlay_dim,
            ])
            ->values();

        $milestones = TimelineMilestone::where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['year', 'title', 'tagline', 'description', 'is_highlighted']);

        $galleryItems = GalleryItem::where('is_active', true)
            ->where('category', 'campus_life')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(fn (GalleryItem $g) => [
                'src' => $g->image_url,
                'title' => $g->title,
                'place' => $g->place_label ?: '',
            ])
            ->values();

        $initiatives = Initiative::where('status', 'active')
            ->latest('id')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'category', 'description', 'target_amount', 'raised_amount']);

        return [
            'cms' => [
                'heroSlides' => $heroSlides,
                'heroConfig' => [
                    'headline' => $settings['cms_hero_headline'] ?? null,
                    'highlight' => $settings['cms_hero_highlight'] ?? null,
                    'subtitle' => $settings['cms_hero_subtitle'] ?? null,
                    'primary_cta' => $settings['cms_hero_primary_cta'] ?? null,
                    'secondary_cta' => $settings['cms_hero_secondary_cta'] ?? null,
                ],
                'aboutConfig' => [
                    'eyebrow' => $settings['cms_about_eyebrow'] ?? null,
                    'title' => $settings['cms_about_title'] ?? null,
                    'body' => $settings['cms_about_body'] ?? null,
                    'mosaic_1_caption' => $settings['cms_about_mosaic_1_caption'] ?? null,
                    'mosaic_2_caption' => $settings['cms_about_mosaic_2_caption'] ?? null,
                    'mosaic_3_caption' => $settings['cms_about_mosaic_3_caption'] ?? null,
                    'mosaic_1_image' => self::resolveOptionalUrl($settings['cms_about_mosaic_1_image'] ?? null),
                    'mosaic_2_image' => self::resolveOptionalUrl($settings['cms_about_mosaic_2_image'] ?? null),
                    'mosaic_3_image' => self::resolveOptionalUrl($settings['cms_about_mosaic_3_image'] ?? null),
                ],
                'milestones' => $milestones,
                'galleryItems' => $galleryItems,
                'reunionConfig' => [
                    'eyebrow' => $settings['cms_reunion_eyebrow'] ?? null,
                    'title' => $settings['cms_reunion_title'] ?? null,
                    'subtitle' => $settings['cms_reunion_subtitle'] ?? null,
                    'target_date' => $settings['cms_reunion_target_date'] ?? null,
                    'venue' => $settings['cms_reunion_venue'] ?? null,
                    'cta_label' => $settings['cms_reunion_cta_label'] ?? null,
                    'bg_image' => self::resolveOptionalUrl($settings['cms_reunion_bg_image'] ?? null),
                ],
                'footerConfig' => [
                    'description' => $settings['cms_footer_description'] ?? null,
                    'facebook_url' => $settings['cms_footer_facebook_url'] ?? null,
                    'linkedin_url' => $settings['cms_footer_linkedin_url'] ?? null,
                    'youtube_url' => $settings['cms_footer_youtube_url'] ?? null,
                ],
                'initiatives' => $initiatives,
            ],
        ];
    }

    private static function resolveOptionalUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, '/') || preg_match('#^(https?:)?//#', $path)) {
            return asset(ltrim($path, '/'));
        }

        return asset('storage/'.ltrim($path, '/'));
    }
}
