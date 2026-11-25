import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Save, Settings, ShieldCheck } from 'lucide-react';

interface SettingsIndexProps {
    settings: Record<string, string>;
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const [siteName, setSiteName] = useState(settings.site_name || 'INTAKE97.COM');
    const [siteTagline, setSiteTagline] = useState(
        settings.site_tagline || 'Cadet College 1997 Intake Alumni Community',
    );
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

            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        Website & System Configuration
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Control organization metadata, branding text, contact channels, and registration controls.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                <Settings className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">
                                General Association Branding & Identity
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Platform Name</label>
                                <input
                                    className={fieldClass}
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Timezone</label>
                                <input
                                    className={fieldClass}
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Association Tagline</label>
                                <input
                                    className={fieldClass}
                                    value={siteTagline}
                                    onChange={(e) => setSiteTagline(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Contact Email</label>
                                <input
                                    type="email"
                                    className={fieldClass}
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Official Secretariat Phone</label>
                                <input
                                    className={fieldClass}
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Secretariat Physical Address</label>
                                <input
                                    className={fieldClass}
                                    value={officeAddress}
                                    onChange={(e) => setOfficeAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <ShieldCheck className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">
                                Registration & Access Control Availability
                            </h2>
                        </div>
                        <div className="space-y-2 p-6">
                            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-[#071437]">
                                <input
                                    type="checkbox"
                                    checked={registrationOpen}
                                    onChange={(e) => setRegistrationOpen(e.target.checked)}
                                    className="size-4 rounded border-[#DBDFE9] text-[#1B84FF] focus:ring-[#1B84FF]"
                                />
                                Allow public registration for 1997 Cadet College intake alumni
                            </label>
                            <p className="pl-6.5 text-[12px] text-[#78829D]">
                                When disabled, new visitors cannot submit registration applications.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="h-10 rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                        >
                            <Save className="mr-1.5 size-4" /> Save Configuration
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
