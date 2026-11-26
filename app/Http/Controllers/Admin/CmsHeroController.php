<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\HeroSlide;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CmsHeroController extends Controller
{
    public function index(): Response
    {
        $slides = HeroSlide::orderBy('display_order')->orderBy('id')->get();
        $settings = SystemSetting::where('key', 'like', 'cms_hero_%')
            ->orWhere('key', 'like', 'cms_banner_%')
            ->pluck('value', 'key');

        return Inertia::render('admin/cms/hero', [
            'slides' => $slides,
            'heroConfig' => [
                'headline' => $settings['cms_hero_headline'] ?? 'Different colleges.',
                'highlight' => $settings['cms_hero_highlight'] ?? 'One intake.',
                'subtitle' => $settings['cms_hero_subtitle'] ?? 'Ten cadet colleges. The intake of 1997. A permanent home for the batch.',
                'primary_cta' => $settings['cms_hero_primary_cta'] ?? 'Apply for Membership',
                'secondary_cta' => $settings['cms_hero_secondary_cta'] ?? 'Explore Directory',
            ],
            'banners' => [
                'about' => [
                    'title' => $settings['cms_banner_about_title'] ?? 'About the Association',
                    'subtitle' => $settings['cms_banner_about_subtitle'] ?? 'United across ten cadet colleges since 1997.',
                    'image' => $this->resolveBannerUrl($settings['cms_banner_about_image'] ?? '/images/campus/cadets-in-class.jpg'),
                ],
                'colleges' => [
                    'title' => $settings['cms_banner_colleges_title'] ?? 'Participating Cadet Colleges',
                    'subtitle' => $settings['cms_banner_colleges_subtitle'] ?? 'Ten proud institutions, one shared intake.',
                    'image' => $this->resolveBannerUrl($settings['cms_banner_colleges_image'] ?? '/images/campus/hero-fcc.jpg'),
                ],
                'committee' => [
                    'title' => $settings['cms_banner_committee_title'] ?? 'Executive Committee',
                    'subtitle' => $settings['cms_banner_committee_subtitle'] ?? 'Stewardship and coordination for CCINTAKE 97.',
                    'image' => $this->resolveBannerUrl($settings['cms_banner_committee_image'] ?? '/images/campus/hero-mcc.jpg'),
                ],
                'welfare' => [
                    'title' => $settings['cms_banner_welfare_title'] ?? 'Welfare & Solidarity',
                    'subtitle' => $this->resolveBannerSubtitle($settings['cms_banner_welfare_subtitle'] ?? null, 'Supporting batchmates and families in times of need.'),
                    'image' => $this->resolveBannerUrl($settings['cms_banner_welfare_image'] ?? '/images/campus/aerial-mcc.jpg'),
                ],
                'contact' => [
                    'title' => $settings['cms_banner_contact_title'] ?? 'Contact Secretariat',
                    'subtitle' => $settings['cms_banner_contact_subtitle'] ?? 'Reach out to the Central Coordination Committee.',
                    'image' => $this->resolveBannerUrl($settings['cms_banner_contact_image'] ?? '/images/campus/hero-scc.jpg'),
                ],
            ],
        ]);
    }

    public function updateConfig(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'headline' => 'required|string|max:120',
            'highlight' => 'required|string|max:120',
            'subtitle' => 'required|string|max:300',
            'primary_cta' => 'required|string|max:60',
            'secondary_cta' => 'required|string|max:60',
        ]);

        foreach ($validated as $key => $val) {
            SystemSetting::set('cms_hero_'.$key, $val, 'cms');
        }

        AuditLog::log('cms.hero_config_updated', 'cms', null, null, $validated);

        return back()->with('success', 'Hero section copy updated.');
    }

    public function storeSlide(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:160',
            'college_code' => 'nullable|string|max:20',
            'object_position' => 'required|string|max:40',
            'overlay_dim' => 'required|numeric|min:0|max:0.85',
            'display_order' => 'required|integer|min:0|max:999',
            'is_active' => 'boolean',
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('cms/hero', 'public');

        $slide = HeroSlide::create([
            'title' => $validated['title'],
            'college_code' => $validated['college_code'] ?: null,
            'image_path' => $path,
            'object_position' => $validated['object_position'],
            'overlay_dim' => $validated['overlay_dim'],
            'display_order' => $validated['display_order'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        AuditLog::log('cms.hero_slide_created', 'cms', $slide->id, null, ['title' => $slide->title]);

        return back()->with('success', 'Hero slide added.');
    }

    public function updateSlide(Request $request, int $id): RedirectResponse
    {
        $slide = HeroSlide::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:160',
            'college_code' => 'nullable|string|max:20',
            'object_position' => 'required|string|max:40',
            'overlay_dim' => 'required|numeric|min:0|max:0.85',
            'display_order' => 'required|integer|min:0|max:999',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($slide->image_path && ! str_starts_with($slide->image_path, '/')) {
                Storage::disk('public')->delete($slide->image_path);
            }
            $slide->image_path = $request->file('image')->store('cms/hero', 'public');
        }

        $slide->title = $validated['title'];
        $slide->college_code = $validated['college_code'] ?: null;
        $slide->object_position = $validated['object_position'];
        $slide->overlay_dim = $validated['overlay_dim'];
        $slide->display_order = $validated['display_order'];
        $slide->is_active = $request->boolean('is_active', true);
        $slide->save();

        AuditLog::log('cms.hero_slide_updated', 'cms', $slide->id, null, ['title' => $slide->title]);

        return back()->with('success', 'Hero slide updated.');
    }

    public function destroySlide(int $id): RedirectResponse
    {
        $slide = HeroSlide::findOrFail($id);
        if ($slide->image_path && ! str_starts_with($slide->image_path, '/')) {
            Storage::disk('public')->delete($slide->image_path);
        }
        $title = $slide->title;
        $slide->delete();

        AuditLog::log('cms.hero_slide_deleted', 'cms', $id, ['title' => $title], null);

        return back()->with('success', 'Hero slide deleted.');
    }

    public function updateBanners(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'page_key' => 'required|in:about,colleges,committee,welfare,contact',
            'title' => 'required|string|max:160',
            'subtitle' => 'nullable|string|max:300',
            'image' => 'nullable|image|max:5120',
        ]);

        $key = $validated['page_key'];
        SystemSetting::set("cms_banner_{$key}_title", $validated['title'], 'cms');
        SystemSetting::set("cms_banner_{$key}_subtitle", $validated['subtitle'] ?? '', 'cms');

        if ($request->hasFile('image')) {
            $old = SystemSetting::get("cms_banner_{$key}_image");
            if ($old && ! str_starts_with($old, '/')) {
                Storage::disk('public')->delete($old);
            }
            $path = $request->file('image')->store('cms/banners', 'public');
            SystemSetting::set("cms_banner_{$key}_image", $path, 'cms');
        }

        AuditLog::log('cms.banner_updated', 'cms', null, null, ['page' => $key]);

        return back()->with('success', ucfirst($key).' page banner updated.');
    }

    private function resolveBannerUrl(string $path): string
    {
        if (str_starts_with($path, '/') || preg_match('#^(https?:)?//#', $path)) {
            return asset(ltrim($path, '/'));
        }

        return asset('storage/'.ltrim($path, '/'));
    }

    private function resolveBannerSubtitle(?string $value, string $fallback): string
    {
        return ($value !== null && $value !== '') ? $value : $fallback;
    }
}
