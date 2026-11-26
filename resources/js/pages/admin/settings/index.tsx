import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Mail, MapPin, Phone, Save, Settings, ShieldCheck } from 'lucide-react';

interface SettingsIndexProps {
    settings: Record<string, string>;
}

const TIMEZONES = [
    'Asia/Dhaka',
    'UTC',
    'Asia/Dubai',
    'Asia/Singapore',
    'Europe/London',
    'America/New_York',
];

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const [siteName, setSiteName] = useState(settings.site_name || 'CCINTAKE97.COM');
    const [siteTagline, setSiteTagline] = useState(
        settings.site_tagline || 'Cadet College 1997 Intake Alumni Community',
    );
    const [contactEmail, setContactEmail] = useState(settings.contact_email || 'contact@intake97.com');
    const [contactPhone, setContactPhone] = useState(settings.contact_phone || '+880 1711 000097');
    const [officeAddress, setOfficeAddress] = useState(settings.office_address || 'Dhaka, Bangladesh');
    const [registrationOpen, setRegistrationOpen] = useState(settings.registration_open === 'true');
    const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Dhaka');
    const [saving, setSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;

        router.put(
            '/admin/settings',
            {
                site_name: siteName,
                site_tagline: siteTagline,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                office_address: officeAddress,
                registration_open: registrationOpen ? 'true' : 'false',
                timezone,
            },
            {
                preserveScroll: true,
                onStart: () => setSaving(true),
                onFinish: () => setSaving(false),
            },
        );
    };

    const availableTimezones = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES];

    return (
        <AdminLayout
            title="Website & Platform Settings"
            breadcrumbs={[{ title: 'Website Settings' }]}
        >
            <Head title="Platform Settings - CCINTAKE 97 Admin" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Website & System Configuration
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Control organization metadata, branding text, contact channels, and public registration availability.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        form="settings-form"
                        disabled={saving}
                        className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:opacity-60"
                    >
                        <Save className="mr-1.5 size-4" />
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </div>

                <form id="settings-form" onSubmit={handleSave} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Left Column: General Branding & Contact */}
                    <div className="space-y-6 xl:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                                <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                    <Settings className="size-4" />
                                </span>
                                <div>
                                    <h2 className="text-[15px] font-bold text-[#071437]">
                                        General Association Branding & Identity
                                    </h2>
                                    <p className="text-[12px] text-[#78829D]">
                                        Displayed across the public website header, footer, and system emails.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Platform Name</label>
                                    <div className="relative">
                                        <Globe className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                                        <Input
                                            className={`${fieldClass} pl-9`}
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Default Timezone</label>
                                    <Select value={timezone} onValueChange={setTimezone}>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {availableTimezones.map((tz) => (
                                                <SelectItem key={tz} value={tz} className={selectItemClass}>
                                                    {tz}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Association Tagline</label>
                                    <Input
                                        className={fieldClass}
                                        value={siteTagline}
                                        onChange={(e) => setSiteTagline(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Contact Email</label>
                                    <div className="relative">
                                        <Mail className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                                        <Input
                                            type="email"
                                            className={`${fieldClass} pl-9`}
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Official Secretariat Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                                        <Input
                                            className={`${fieldClass} pl-9`}
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Secretariat Physical Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                                        <Input
                                            className={`${fieldClass} pl-9`}
                                            value={officeAddress}
                                            onChange={(e) => setOfficeAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Registration & Access Control */}
                    <div className="space-y-6 xl:col-span-1">
                        <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="flex items-center justify-between gap-2 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                        <ShieldCheck className="size-4" />
                                    </span>
                                    <h2 className="text-[15px] font-bold text-[#071437]">
                                        Registration Control
                                    </h2>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                        registrationOpen
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-rose-200 bg-rose-50 text-rose-700'
                                    }`}
                                >
                                    {registrationOpen ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <div className="space-y-4 p-6">
                                <label
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                                        registrationOpen
                                            ? 'border-[#1B84FF] bg-[#F1F6FF]/60'
                                            : 'border-[#F1F1F4] bg-[#FCFCFC] hover:border-[#DBDFE9]'
                                    }`}
                                >
                                    <Checkbox
                                        checked={registrationOpen}
                                        onCheckedChange={(checked) => setRegistrationOpen(checked === true)}
                                        className="mt-0.5 size-4.5 cursor-pointer rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white focus-visible:!ring-[#1B84FF]/20"
                                    />
                                    <div>
                                        <div className="text-[13px] font-semibold text-[#071437]">
                                            Allow public alumni registration
                                        </div>
                                        <p className="mt-1 text-[12px] leading-relaxed text-[#78829D]">
                                            When disabled, new visitors cannot submit membership applications from the public portal.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-5">
                            <h3 className="text-[13px] font-bold text-[#071437]">Audit & Persistence</h3>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-[#78829D]">
                                Every configuration update is recorded in the system{' '}
                                <span className="font-semibold text-[#4B5675]">Audit Logs</span> with your admin account and timestamp.
                            </p>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-9 w-full cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:opacity-60"
                                >
                                    <Save className="mr-1.5 size-4" />
                                    {saving ? 'Saving...' : 'Save Configuration'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
