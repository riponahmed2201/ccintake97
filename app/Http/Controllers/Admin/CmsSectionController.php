<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ContactInquiry;
use App\Models\SystemSetting;
use App\Models\TimelineMilestone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CmsSectionController extends Controller
{
    public function index(): Response
    {
        $milestones = TimelineMilestone::orderBy('display_order')->orderBy('id')->get();
        $inquiries = ContactInquiry::latest()->limit(50)->get();
        $settings = SystemSetting::where('key', 'like', 'cms_%')->pluck('value', 'key');

        return Inertia::render('admin/cms/sections', [
            'milestones' => $milestones,
            'inquiries' => $inquiries,
            'aboutConfig' => [
                'eyebrow' => $settings['cms_about_eyebrow'] ?? 'The Association',
                'title' => $settings['cms_about_title'] ?? 'Ten colleges. One shared history.',
                'body' => $settings['cms_about_body'] ?? 'From Class 7 induction in 1997 to leadership across Bangladesh and the global diaspora, CCINTAKE 97 brings together batchmates from all ten cadet colleges under one verified network.',
                'mosaic_1_caption' => $settings['cms_about_mosaic_1_caption'] ?? 'Prep hour',
                'mosaic_2_caption' => $settings['cms_about_mosaic_2_caption'] ?? 'Morning colours',
                'mosaic_3_caption' => $settings['cms_about_mosaic_3_caption'] ?? 'Inter-house athletics',
                'mosaic_1_image' => $this->resolveUrl($settings['cms_about_mosaic_1_image'] ?? '/images/campus/cadets-in-class.jpg'),
                'mosaic_2_image' => $this->resolveUrl($settings['cms_about_mosaic_2_image'] ?? '/images/campus/flag-raising.jpg'),
                'mosaic_3_image' => $this->resolveUrl($settings['cms_about_mosaic_3_image'] ?? '/images/campus/athletes-contingent.jpg'),
            ],
            'reunionConfig' => [
                'eyebrow' => $settings['cms_reunion_eyebrow'] ?? 'Thirtieth Year · 2027',
                'title' => $settings['cms_reunion_title'] ?? 'Winter 2027 Grand Reunion',
                'subtitle' => $settings['cms_reunion_subtitle'] ?? 'Three days of parade ground memories, family gala dinner, and batch solidarity in Dhaka.',
                'target_date' => $settings['cms_reunion_target_date'] ?? '2027-11-01T00:00:00+06:00',
                'venue' => $settings['cms_reunion_venue'] ?? 'Dhaka · Cadet College Network',
                'cta_label' => $settings['cms_reunion_cta_label'] ?? 'Reserve Your Place',
                'bg_image' => $this->resolveUrl($settings['cms_reunion_bg_image'] ?? '/images/campus/reunion-parade-rcc.jpg'),
            ],
            'footerConfig' => [
                'description' => $settings['cms_footer_description'] ?? 'Official alumni network for the 1997 Cadet College intake across ten institutions.',
                'facebook_url' => $settings['cms_footer_facebook_url'] ?? '',
                'linkedin_url' => $settings['cms_footer_linkedin_url'] ?? '',
                'youtube_url' => $settings['cms_footer_youtube_url'] ?? '',
            ],
        ]);
    }

    public function updateSection(Request $request): RedirectResponse
    {
        $section = $request->input('section');

        if ($section === 'about') {
            $validated = $request->validate([
                'eyebrow' => 'required|string|max:80',
                'title' => 'required|string|max:160',
                'body' => 'required|string|max:2000',
                'mosaic_1_caption' => 'required|string|max:80',
                'mosaic_2_caption' => 'required|string|max:80',
                'mosaic_3_caption' => 'required|string|max:80',
                'mosaic_1_image' => 'nullable|image|max:5120',
                'mosaic_2_image' => 'nullable|image|max:5120',
                'mosaic_3_image' => 'nullable|image|max:5120',
            ]);

            foreach (['eyebrow', 'title', 'body', 'mosaic_1_caption', 'mosaic_2_caption', 'mosaic_3_caption'] as $k) {
                SystemSetting::set("cms_about_{$k}", $validated[$k], 'cms');
            }

            foreach ([1, 2, 3] as $idx) {
                $field = "mosaic_{$idx}_image";
                if ($request->hasFile($field)) {
                    $old = SystemSetting::get("cms_about_{$field}");
                    if ($old && ! str_starts_with($old, '/')) {
                        Storage::disk('public')->delete($old);
                    }
                    $path = $request->file($field)->store('cms/about', 'public');
                    SystemSetting::set("cms_about_{$field}", $path, 'cms');
                }
            }

            AuditLog::log('cms.about_updated', 'cms', null, null, ['title' => $validated['title']]);

            return back()->with('success', 'About section updated.');
        }

        if ($section === 'reunion') {
            $validated = $request->validate([
                'eyebrow' => 'required|string|max:80',
                'title' => 'required|string|max:160',
                'subtitle' => 'required|string|max:500',
                'target_date' => 'required|string|max:60',
                'venue' => 'required|string|max:160',
                'cta_label' => 'required|string|max:60',
                'bg_image' => 'nullable|image|max:5120',
            ]);

            foreach (['eyebrow', 'title', 'subtitle', 'target_date', 'venue', 'cta_label'] as $k) {
                SystemSetting::set("cms_reunion_{$k}", $validated[$k], 'cms');
            }

            if ($request->hasFile('bg_image')) {
                $old = SystemSetting::get('cms_reunion_bg_image');
                if ($old && ! str_starts_with($old, '/')) {
                    Storage::disk('public')->delete($old);
                }
                $path = $request->file('bg_image')->store('cms/reunion', 'public');
                SystemSetting::set('cms_reunion_bg_image', $path, 'cms');
            }

            AuditLog::log('cms.reunion_updated', 'cms', null, null, ['title' => $validated['title']]);

            return back()->with('success', 'Reunion banner settings updated.');
        }

        if ($section === 'footer') {
            $validated = $request->validate([
                'description' => 'required|string|max:400',
                'facebook_url' => 'nullable|url|max:255',
                'linkedin_url' => 'nullable|url|max:255',
                'youtube_url' => 'nullable|url|max:255',
            ]);

            foreach ($validated as $k => $v) {
                SystemSetting::set("cms_footer_{$k}", $v ?? '', 'cms');
            }

            AuditLog::log('cms.footer_updated', 'cms', null, null, $validated);

            return back()->with('success', 'Footer & social links updated.');
        }

        return back()->with('error', 'Unknown section.');
    }

    public function storeMilestone(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'year' => 'required|string|max:20',
            'title' => 'required|string|max:160',
            'tagline' => 'required|string|max:160',
            'description' => 'required|string|max:600',
            'display_order' => 'required|integer|min:0|max:999',
            'is_highlighted' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $milestone = TimelineMilestone::create([
            ...$validated,
            'is_highlighted' => $request->boolean('is_highlighted', false),
            'is_active' => $request->boolean('is_active', true),
        ]);

        AuditLog::log('cms.milestone_created', 'cms', $milestone->id, null, ['year' => $milestone->year, 'title' => $milestone->title]);

        return back()->with('success', 'Timeline milestone added.');
    }

    public function updateMilestone(Request $request, int $id): RedirectResponse
    {
        $milestone = TimelineMilestone::findOrFail($id);

        $validated = $request->validate([
            'year' => 'required|string|max:20',
            'title' => 'required|string|max:160',
            'tagline' => 'required|string|max:160',
            'description' => 'required|string|max:600',
            'display_order' => 'required|integer|min:0|max:999',
            'is_highlighted' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $milestone->update([
            ...$validated,
            'is_highlighted' => $request->boolean('is_highlighted', false),
            'is_active' => $request->boolean('is_active', true),
        ]);

        AuditLog::log('cms.milestone_updated', 'cms', $milestone->id, null, ['year' => $milestone->year, 'title' => $milestone->title]);

        return back()->with('success', 'Timeline milestone updated.');
    }

    public function destroyMilestone(int $id): RedirectResponse
    {
        $milestone = TimelineMilestone::findOrFail($id);
        $title = $milestone->title;
        $milestone->delete();

        AuditLog::log('cms.milestone_deleted', 'cms', $id, ['title' => $title], null);

        return back()->with('success', 'Timeline milestone deleted.');
    }

    public function updateInquiry(Request $request, int $id): RedirectResponse
    {
        $inquiry = ContactInquiry::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,resolved',
        ]);

        $inquiry->update([
            'status' => $validated['status'],
            'read_at' => $inquiry->read_at ?? now(),
        ]);

        return back()->with('success', 'Contact inquiry status updated.');
    }

    private function resolveUrl(string $path): string
    {
        if (str_starts_with($path, '/') || preg_match('#^(https?:)?//#', $path)) {
            return asset(ltrim($path, '/'));
        }

        return asset('storage/'.ltrim($path, '/'));
    }
}
