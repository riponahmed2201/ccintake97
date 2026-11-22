import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save } from 'lucide-react';

interface SettingsIndexProps {
    settings: Record<string, string>;
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const [siteName, setSiteName] = useState(settings.site_name || 'INTAKE97.COM');
    const [siteTagline, setSiteTagline] = useState(settings.site_tagline || 'Cadet College 1997 Intake Alumni Community');
    const [contactEmail, setContactEmail] = useState(settings.contact_email || 'contact@intake97.com');
    const [contactPhone, setContactPhone] = useState(settings.contact_phone || '+880 1711 000097');
    const [officeAddress, setOfficeAddress] = useState(settings.office_address || 'Dhaka, Bangladesh');
    const [registrationOpen, setRegistrationOpen] = useState(settings.registration_open === 'true');
    const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Dhaka');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        router.put('/admin/settings', {
            site_name: siteName,
            site_tagline: siteTagline,
            contact_email: contactEmail,
            contact_phone: contactPhone,
            office_address: officeAddress,
            registration_open: registrationOpen ? 'true' : 'false',
            timezone,
        });
    };

    return (
        <AdminLayout
            title="Website & Platform Settings"
            breadcrumbs={[{ title: 'Settings' }]}
        >
            <Head title="Platform Settings - INTAKE 97 Admin" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Website & System Configuration
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Control organization metadata, branding text, contact channels, and registration controls.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Settings className="size-4 text-emerald-600" />
                                General Association Branding & Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-1">Platform Name</label>
                                    <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Timezone</label>
                                    <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Association Tagline</label>
                                    <Input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Contact Email</label>
                                    <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Official Secretariat Phone</label>
                                    <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Secretariat Physical Address</label>
                                    <Input value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">
                                Registration & Access Control Availability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <label className="flex items-center gap-2.5 cursor-pointer font-medium">
                                <input
                                    type="checkbox"
                                    checked={registrationOpen}
                                    onChange={(e) => setRegistrationOpen(e.target.checked)}
                                    className="rounded text-emerald-600"
                                />
                                Allow public registration for 1997 Cadet College intake alumni
                            </label>
                            <p className="text-[11px] text-slate-400 pl-6">
                                When disabled, new visitors cannot submit registration applications.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold">
                            <Save className="size-3.5 mr-1.5" /> Save Configuration
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
