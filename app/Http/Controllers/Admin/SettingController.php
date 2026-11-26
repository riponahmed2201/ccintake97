<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = SystemSetting::all()->pluck('value', 'key');

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'site_name' => 'required|string|max:120',
            'site_tagline' => 'nullable|string|max:255',
            'contact_email' => 'required|email|max:190',
            'contact_phone' => 'nullable|string|max:40',
            'office_address' => 'nullable|string|max:255',
            'registration_open' => 'required|in:true,false',
            'timezone' => 'required|string|max:80',
        ]);

        $inputs = $request->only([
            'site_name',
            'site_tagline',
            'contact_email',
            'contact_phone',
            'office_address',
            'registration_open',
            'timezone',
        ]);

        foreach ($inputs as $key => $value) {
            SystemSetting::set($key, $value ?? '');
        }

        AuditLog::log('settings.updated', 'settings', null, null, $inputs);

        return back()->with('success', 'Website settings saved.');
    }
}
