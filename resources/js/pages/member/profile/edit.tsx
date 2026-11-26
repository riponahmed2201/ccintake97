import React, { useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Camera, Check, ChevronLeft, ChevronRight, ExternalLink, Pencil, Plus, QrCode, Save, X } from 'lucide-react';
import type { College, Member } from '@/types';

interface ProfileEditProps {
    member: Member;
    colleges: College[];
    houses: Record<string, string[]>;
    houseColors: string[];
    bloodGroups: string[];
    jobTypes: string[];
    photoUrl?: string | null;
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

function Label({
    children,
    optional = false,
    required = false,
}: {
    children: React.ReactNode;
    optional?: boolean;
    required?: boolean;
}) {
    return (
        <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
            {children}
            {required && <span className="ml-1 font-semibold text-[#F8285A]">*</span>}
            {optional && <span className="ml-1.5 font-normal text-[#99A1B7]">(Optional)</span>}
        </label>
    );
}

function ErrorText({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="mt-1 text-[11.5px] text-[#F8285A]">{message}</p>;
}

const CLEAR = '__clear__';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 data-[placeholder]:!text-[#99A1B7] disabled:!bg-[#F4F4F6] disabled:opacity-75 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'rounded-xl !border-[#F1F1F4] !bg-white !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const HOUSE_SWATCH: Record<string, string> = {
    Red: 'bg-red-600',
    Blue: 'bg-blue-600',
    Green: 'bg-emerald-600',
    Yellow: 'bg-yellow-400',
    Maroon: 'bg-[#5E121D]',
    White: 'bg-white ring-1 ring-slate-300',
    Orange: 'bg-orange-500',
    Purple: 'bg-purple-600',
    Black: 'bg-neutral-950',
};

function FieldSelect({
    value,
    onChange,
    placeholder,
    options,
    disabled = false,
    clearable = false,
    className = '',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: React.ReactNode }[];
    disabled?: boolean;
    clearable?: boolean;
    className?: string;
}) {
    return (
        <Select modal={false} value={value || undefined} onValueChange={(next) => onChange(next === CLEAR ? '' : next)} disabled={disabled}>
            <SelectTrigger className={`${selectTriggerClass} ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={selectMenuClass} align="start" avoidCollisions>
                {clearable && (
                    <SelectItem value={CLEAR} className={selectItemClass}>
                        <span className="text-slate-400">{placeholder}</span>
                    </SelectItem>
                )}
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className={selectItemClass}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

const STEPS = [
    { key: 'basic', label: 'Basic Info', title: 'Basic & personal information', hint: 'Update your photo, contact details, and family information.' },
    { key: 'college', label: 'College', title: 'College information', hint: 'Pick the college. Do not type a passing-out year beside it.' },
    { key: 'address', label: 'Address', title: 'Address information', hint: 'Where you can be reached at home.' },
    { key: 'career', label: 'Career', title: 'Professional information', hint: 'Job type is a fixed list. Office address sits with the occupation.' },
    { key: 'more', label: 'More', title: 'Additional information', hint: 'Links and remarks can be left blank.' },
] as const;

const STEP_FIELDS: Record<string, number> = {
    photo: 0,
    cadet_name: 0,
    name: 0,
    phone: 0,
    blood_group: 0,
    spouse_name: 0,
    spouse_occupation: 0,
    spouse_job_location: 0,
    children_names: 0,
    college_id: 1,
    college_roll_no: 1,
    intake_year: 1,
    house_name: 1,
    house_color: 1,
    cccl_life_member_no: 1,
    address: 2,
    city: 2,
    country_code: 2,
    present_address_line: 2,
    present_area: 2,
    present_postal_code: 2,
    same_as_present_address: 2,
    permanent_address_line: 2,
    permanent_area: 2,
    permanent_city: 2,
    permanent_postal_code: 2,
    permanent_country_code: 2,
    job_type: 3,
    designation: 3,
    organization: 3,
    office_address: 3,
    office_phone: 3,
    facebook_url: 4,
    linkedin_url: 4,
    remarks: 4,
};

const COUNTRIES = [
    { value: 'BD', label: 'Bangladesh' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'SG', label: 'Singapore' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'DE', label: 'Germany' },
    { value: 'JP', label: 'Japan' },
    { value: 'OT', label: 'Other' },
];

function countryLabel(code?: string) {
    if (!code) return undefined;
    return COUNTRIES.find((c) => c.value === code)?.label || code;
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
            <div className="border-b border-[#F1F1F4] pb-4">
                <h2 className="text-[15px] font-semibold text-[#071437]">{title}</h2>
                <p className="mt-0.5 text-[12.5px] text-[#78829D]">{hint}</p>
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <dt className="text-[12.5px] font-medium text-[#78829D]">{label}</dt>
            <dd className="text-[13px] font-semibold text-[#071437] sm:text-right">{value || <span className="font-normal text-[#99A1B7]">Not set</span>}</dd>
        </div>
    );
}

export default function ProfileEdit({ member, colleges, houses, houseColors, bloodGroups, jobTypes, photoUrl }: ProfileEditProps) {
    const storedChildren = member.profile?.children_names ?? [];
    const [editing, setEditing] = useState(false);
    const [overviewTab, setOverviewTab] = useState<'basic' | 'college' | 'career' | 'address' | 'privacy'>('basic');
    const [saved, setSaved] = useState(false);
    const [privacySaved, setPrivacySaved] = useState(false);
    const [step, setStep] = useState(0);
    const [stepNotice, setStepNotice] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(photoUrl || null);
    const [photoSaving, setPhotoSaving] = useState(false);
    const photoInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm({
        name: member.user?.name || '',
        cadet_name: member.profile?.cadet_name || '',
        phone: member.user?.phone || '',
        blood_group: member.profile?.blood_group || '',
        spouse_name: member.profile?.spouse_name || '',
        spouse_occupation: member.profile?.spouse_occupation || '',
        spouse_job_location: member.profile?.spouse_job_location || '',
        children_names: storedChildren.length > 0 ? storedChildren : [''],
        address: member.profile?.address || '',
        present_address_line: member.profile?.present_address_line || '',
        present_area: member.profile?.present_area || '',
        city: member.profile?.city || '',
        present_postal_code: member.profile?.present_postal_code || '',
        country_code: member.profile?.country_code || 'BD',
        same_as_present_address: Boolean(member.profile?.same_as_present_address),
        permanent_address_line: member.profile?.permanent_address_line || '',
        permanent_area: member.profile?.permanent_area || '',
        permanent_city: member.profile?.permanent_city || '',
        permanent_postal_code: member.profile?.permanent_postal_code || '',
        permanent_country_code: member.profile?.permanent_country_code || 'BD',
        college_id: member.college_id ? String(member.college_id) : '',
        college_roll_no: member.college_roll_no || '',
        intake_year: member.intake_year ? String(member.intake_year) : '1997',
        house_name: member.house_name || '',
        house_color: member.house_color || '',
        cccl_life_member_no: member.profile?.cccl_life_member_no || '',
        job_type: member.profile?.job_type || '',
        organization: member.profile?.organization || '',
        designation: member.profile?.designation || '',
        office_address: member.profile?.office_address || '',
        office_phone: member.profile?.office_phone || '',
        facebook_url: member.profile?.facebook_url || '',
        linkedin_url: member.profile?.linkedin_url || '',
        remarks: member.profile?.remarks || '',
        photo: null as File | null,
    });

    const selectedCollege = colleges.find((college) => String(college.id) === form.data.college_id);
    const houseOptions = selectedCollege?.short_name ? houses[selectedCollege.short_name] ?? [] : [];
    const houseChoices = form.data.house_name && !houseOptions.includes(form.data.house_name)
        ? [...houseOptions, form.data.house_name]
        : houseOptions;

    const existingPrivacy = (member.privacy_settings || []).reduce((acc: Record<string, string>, curr) => {
        acc[curr.field_key] = curr.visibility;
        return acc;
    }, {});

    const [privacySettings, setPrivacySettings] = useState<Record<string, string>>({
        organization: existingPrivacy.organization || 'verified_members',
        designation: existingPrivacy.designation || 'verified_members',
        city: existingPrivacy.city || 'connections',
        linkedin: existingPrivacy.linkedin || 'connections',
    });

    const firstIncomplete = () => {
        if (!form.data.name.trim() || !form.data.phone.trim()) {
            return 0;
        }
        if (!form.data.college_id || !form.data.college_roll_no.trim() || !form.data.intake_year) {
            return 1;
        }

        return null;
    };

    const goTo = (target: number) => {
        setStepNotice(null);
        setStep(target);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const blocked = firstIncomplete();
        if (blocked !== null) {
            setStep(blocked);
            setStepNotice('Fill the required fields on this step before saving.');
            return;
        }
        setSaved(false);
        setStepNotice(null);
        form.transform((payload) => {
            const next: Record<string, unknown> = { ...payload, _method: 'put' };
            if (!(payload.photo instanceof File)) {
                delete next.photo;
            }

            return next;
        });
        form.post('/member/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                form.setData('photo', null);
            },
            onError: (errors) => {
                const failed = Object.keys(errors).find((key) => STEP_FIELDS[key] !== undefined);
                if (failed) {
                    setStep(STEP_FIELDS[failed]);
                }
            },
        });
    };

    const savePrivacy = (event: React.FormEvent) => {
        event.preventDefault();
        setPrivacySaved(false);
        router.put(
            '/member/privacy',
            { settings: privacySettings },
            {
                preserveScroll: true,
                onSuccess: () => setPrivacySaved(true),
            }
        );
    };

    const savePhoto = () => {
        if (!(form.data.photo instanceof File)) {
            return;
        }
        setPhotoSaving(true);
        setSaved(false);
        setStepNotice(null);
        router.post(
            '/member/profile/photo',
            { photo: form.data.photo },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSaved(true);
                    form.setData('photo', null);
                    form.clearErrors('photo');
                },
                onError: (errors) => {
                    if (errors.photo) {
                        form.setError('photo', errors.photo);
                    }
                },
                onFinish: () => setPhotoSaving(false),
            }
        );
    };

    return (
        <MemberLayout title="My Alumni Profile" breadcrumbs={[{ title: 'My Profile' }]}>
            <Head title="My Profile - CCINTAKE 97 Alumni" />

            {!editing ? (
                <div className="w-full space-y-6">
                    {/* Profile Overview Header Card */}
                    <div className="flex flex-col justify-between gap-5 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F6FF] text-[20px] font-semibold text-[#1B84FF] ring-2 ring-[#F1F1F4] sm:size-20">
                                {preview ? (
                                    <img src={preview} alt={member.user?.name || 'Profile'} className="size-full object-cover" />
                                ) : (
                                    member.user?.name?.charAt(0) || 'C'
                                )}
                            </div>
                            <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-[20px] font-bold tracking-tight text-[#071437]">
                                        {member.user?.name}
                                    </h1>
                                    <span
                                        className={`inline-flex rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                            member.verification_status === 'verified'
                                                ? 'bg-[#EAFFF1] text-[#17C653]'
                                                : 'bg-[#FFF8DD] text-[#B45309]'
                                        }`}
                                    >
                                        {member.verification_status?.replace('_', ' ') || 'Unverified'}
                                    </span>
                                </div>
                                <div className="text-[13px] font-medium text-[#4B5675]">
                                    {member.college?.name || 'College not selected'} · Intake {member.intake_year || '1997'}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#78829D]">
                                    {member.profile?.cadet_name && <span>Cadet {member.profile.cadet_name}</span>}
                                    {member.college_roll_no && <span>Roll #{member.college_roll_no}</span>}
                                    {member.member_code && <span className="font-mono font-semibold text-[#1B84FF]">ID · {member.member_code}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                href="/member/id-card"
                                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                            >
                                <QrCode className="size-3.5 text-[#78829D]" />
                                Digital ID
                            </Link>
                            <Button
                                type="button"
                                onClick={() => {
                                    const tabToStep: Record<string, number> = { basic: 0, college: 1, career: 3, address: 2, privacy: 0 };
                                    setStep(tabToStep[overviewTab] ?? 0);
                                    setSaved(false);
                                    setEditing(true);
                                }}
                                className="h-9.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                <Pencil className="mr-1.5 size-3.5" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    {/* Overview Details Tabs (Metronic Demo 1 Underline Tabs) */}
                    <div className="space-y-5">
                        <div
                            role="tablist"
                            className="flex w-full items-center gap-6 overflow-x-auto border-b border-[#F1F1F4] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {[
                                { value: 'basic' as const, label: 'Basic & Personal Info' },
                                { value: 'college' as const, label: 'College & Cadet Details' },
                                { value: 'career' as const, label: 'Professional' },
                                { value: 'address' as const, label: 'Address, Links & Remarks' },
                                { value: 'privacy' as const, label: 'Privacy' },
                            ].map((tab) => {
                                const active = overviewTab === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setOverviewTab(tab.value)}
                                        className={`flex-none cursor-pointer border-b-2 px-1 pt-1.5 pb-3 text-[13px] transition-colors duration-200 outline-none focus:outline-none ${
                                            active
                                                ? 'border-[#1B84FF] font-semibold text-[#1B84FF]'
                                                : 'border-transparent font-medium text-[#78829D] hover:text-[#071437]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {overviewTab === 'basic' && (
                            <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                <h2 className="border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                    Basic &amp; Personal Information
                                </h2>
                                <dl className="mt-2 divide-y divide-[#F1F1F4]">
                                    <InfoRow label="Full name" value={member.user?.name} />
                                    <InfoRow label="Cadet name" value={member.profile?.cadet_name} />
                                    <InfoRow label="Mobile number" value={member.user?.phone} />
                                    <InfoRow label="Email address" value={member.user?.email} />
                                    <InfoRow label="Blood group" value={member.profile?.blood_group} />
                                    <InfoRow label="Spouse name" value={member.profile?.spouse_name} />
                                    <InfoRow label="Spouse occupation" value={member.profile?.spouse_occupation} />
                                    <InfoRow label="Spouse job location" value={member.profile?.spouse_job_location} />
                                    <InfoRow
                                        label="Children names"
                                        value={storedChildren.length > 0 ? storedChildren.join(', ') : undefined}
                                    />
                                </dl>
                            </section>
                        )}

                        {overviewTab === 'college' && (
                            <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                <h2 className="border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                    College &amp; Cadet Details
                                </h2>
                                <dl className="mt-2 divide-y divide-[#F1F1F4]">
                                    <InfoRow label="College name" value={member.college?.name} />
                                    <InfoRow label="Cadet number" value={member.college_roll_no} />
                                    <InfoRow label="Intake number" value={member.intake_year ? String(member.intake_year) : '1997'} />
                                    <InfoRow label="House name" value={member.house_name} />
                                    <InfoRow
                                        label="House color"
                                        value={
                                            member.house_color ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <span className={`size-2.5 rounded-full ${HOUSE_SWATCH[member.house_color] ?? 'bg-slate-300'}`} />
                                                    {member.house_color}
                                                </span>
                                            ) : undefined
                                        }
                                    />
                                    <InfoRow label="CCCL Life Member No" value={member.profile?.cccl_life_member_no} />
                                </dl>
                            </section>
                        )}

                        {overviewTab === 'career' && (
                            <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                <h2 className="border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                    Professional Information
                                </h2>
                                <dl className="mt-2 divide-y divide-[#F1F1F4]">
                                    <InfoRow label="Job type" value={member.profile?.job_type} />
                                    <InfoRow label="Designation" value={member.profile?.designation} />
                                    <InfoRow label="Organization" value={member.profile?.organization} />
                                    <InfoRow label="Office address" value={member.profile?.office_address} />
                                    <InfoRow label="Office phone" value={member.profile?.office_phone} />
                                </dl>
                            </section>
                        )}

                        {overviewTab === 'address' && (
                            <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                <h2 className="border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                    Address, Links &amp; Remarks
                                </h2>
                                <div className="mt-4 space-y-5">
                                    <div>
                                        <div className="mb-1 text-[12px] font-semibold tracking-wide text-[#99A1B7] uppercase">
                                            Present Address
                                        </div>
                                        <dl className="divide-y divide-[#F1F1F4]">
                                            <InfoRow label="House / Road / Street" value={member.profile?.present_address_line || member.profile?.address} />
                                            <InfoRow label="Area / Thana" value={member.profile?.present_area} />
                                            <InfoRow label="City / District" value={member.profile?.city} />
                                            <InfoRow label="Postal / ZIP code" value={member.profile?.present_postal_code} />
                                            <InfoRow label="Country" value={countryLabel(member.profile?.country_code)} />
                                        </dl>
                                    </div>

                                    <div className="border-t border-[#F1F1F4] pt-4">
                                        <div className="mb-1 text-[12px] font-semibold tracking-wide text-[#99A1B7] uppercase">
                                            Permanent Address
                                        </div>
                                        {member.profile?.same_as_present_address ? (
                                            <p className="py-2 text-[13px] font-medium text-[#4B5675]">Same as present address</p>
                                        ) : (
                                            <dl className="divide-y divide-[#F1F1F4]">
                                                <InfoRow label="House / Road / Village" value={member.profile?.permanent_address_line} />
                                                <InfoRow label="Area / Thana" value={member.profile?.permanent_area} />
                                                <InfoRow label="City / District" value={member.profile?.permanent_city} />
                                                <InfoRow label="Postal / ZIP code" value={member.profile?.permanent_postal_code} />
                                                <InfoRow label="Country" value={countryLabel(member.profile?.permanent_country_code)} />
                                            </dl>
                                        )}
                                    </div>

                                    <div className="border-t border-[#F1F1F4] pt-4">
                                        <div className="mb-1 text-[12px] font-semibold tracking-wide text-[#99A1B7] uppercase">
                                            Social Links &amp; Remarks
                                        </div>
                                        <dl className="divide-y divide-[#F1F1F4]">
                                            <InfoRow
                                                label="Facebook profile"
                                                value={
                                                    member.profile?.facebook_url ? (
                                                        <a
                                                            href={member.profile.facebook_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-[#1B84FF] hover:underline"
                                                        >
                                                            View Profile <ExternalLink className="size-3" />
                                                        </a>
                                                    ) : undefined
                                                }
                                            />
                                            <InfoRow
                                                label="LinkedIn profile"
                                                value={
                                                    member.profile?.linkedin_url ? (
                                                        <a
                                                            href={member.profile.linkedin_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-[#1B84FF] hover:underline"
                                                        >
                                                            View Profile <ExternalLink className="size-3" />
                                                        </a>
                                                    ) : undefined
                                                }
                                            />
                                            <InfoRow label="Additional remarks" value={member.profile?.remarks} />
                                        </dl>
                                    </div>
                                </div>
                            </section>
                        )}

                        {overviewTab === 'privacy' && (
                            <form onSubmit={savePrivacy}>
                                <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                    <div className="flex flex-col gap-2 border-b border-[#F1F1F4] pb-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-[15px] font-semibold text-[#071437]">Who can see these details</h2>
                                            <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                                                Choose who can see organization, designation, and LinkedIn in the alumni directory.
                                            </p>
                                        </div>
                                        {privacySaved && (
                                            <span className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[#EAFFF1] px-3 py-1 text-[12px] font-semibold text-[#17C653] sm:self-auto">
                                                <Check className="size-3.5" /> Privacy saved
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 divide-y divide-[#F1F1F4]">
                                        {[
                                            { key: 'organization', label: 'Organization' },
                                            { key: 'designation', label: 'Designation' },
                                            { key: 'linkedin', label: 'LinkedIn' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="text-[13.5px] font-medium text-[#071437]">{item.label}</span>
                                                <FieldSelect
                                                    className="sm:w-56"
                                                    value={privacySettings[item.key] || 'verified_members'}
                                                    placeholder="Who can see this"
                                                    onChange={(visibility) => {
                                                        setPrivacySaved(false);
                                                        setPrivacySettings({ ...privacySettings, [item.key]: visibility });
                                                    }}
                                                    options={[
                                                        { value: 'verified_members', label: 'Verified members' },
                                                        { value: 'connections', label: 'Connections only' },
                                                        { value: 'private', label: 'Only me and admin' },
                                                    ]}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            type="submit"
                                            className="h-9.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                                        >
                                            <Save className="mr-1.5 size-3.5" />
                                            Save privacy
                                        </Button>
                                    </div>
                                </section>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
            <div className="w-full space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">Edit Alumni Profile</h1>
                        <p className="mt-1 max-w-xl text-[13px] text-[#78829D]">
                            Move across the steps below. College is a fixed list, and intake number is the year you entered.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        {saved && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAFFF1] px-3 py-1.5 text-[12.5px] font-semibold text-[#17C653]">
                                <Check className="size-3.5" /> Profile saved
                            </span>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditing(false)}
                            className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9] hover:text-[#071437]"
                        >
                            <ArrowLeft className="mr-1.5 size-3.5 text-[#78829D]" />
                            Back to Overview
                        </Button>
                    </div>
                </div>

                {/* Horizontal Metronic Stepper */}
                <ol className="grid grid-cols-2 gap-2 rounded-xl border border-[#F1F1F4] bg-white p-3 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:grid-cols-5 sm:gap-3 sm:p-3.5">
                    {STEPS.map((item, index) => {
                        const active = index === step;
                        const done = index < step;

                        return (
                            <li key={item.key} className="relative">
                                <button
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                        active
                                            ? 'bg-[#F1F6FF] ring-1 ring-[#1B84FF]/20'
                                            : 'hover:bg-[#FCFCFC]'
                                    }`}
                                    aria-current={active ? 'step' : undefined}
                                >
                                    <span
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                                            active
                                                ? 'bg-[#1B84FF] text-white'
                                                : done
                                                  ? 'bg-[#EAFFF1] text-[#17C653]'
                                                  : 'bg-[#F9F9F9] text-[#99A1B7]'
                                        }`}
                                    >
                                        {done ? <Check className="size-3.5" /> : index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <span className="block text-[10px] font-medium tracking-wide text-[#99A1B7] uppercase">
                                            Step {index + 1}
                                        </span>
                                        <span className={`block truncate text-[13px] font-semibold ${active ? 'text-[#1B84FF]' : done ? 'text-[#071437]' : 'text-[#78829D]'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <div className="space-y-5">
                {stepNotice && (
                    <div className="rounded-lg border border-[#F8285A]/20 bg-[#FFEEF3] px-4 py-2.5 text-[13px] font-medium text-[#F8285A]">
                        {stepNotice}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                {step === 0 && (
                <Section title={STEPS[0].title} hint={STEPS[0].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 flex flex-col justify-between gap-4 border-b border-[#F1F1F4] pb-5 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4">
                                <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F6FF] text-[20px] font-semibold text-[#1B84FF] ring-2 ring-[#F1F1F4]">
                                    {preview ? (
                                        <img src={preview} alt={form.data.name || 'Profile'} className="size-full object-cover" />
                                    ) : (
                                        form.data.name.charAt(0) || 'C'
                                    )}
                                </div>
                                <div>
                                    <div className="text-[13.5px] font-semibold text-[#071437]">
                                        Profile picture
                                        <span className="ml-1.5 text-[12px] font-normal text-[#99A1B7]">(Optional)</span>
                                    </div>
                                    <p className="mt-0.5 text-[12px] text-[#78829D]">JPG or PNG, up to 5 MB.</p>
                                    <ErrorText message={form.errors.photo} />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        form.setData('photo', file);
                                        setPreview(file ? URL.createObjectURL(file) : photoUrl || null);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => photoInputRef.current?.click()}
                                    className="h-9 rounded-lg border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                >
                                    <Camera className="mr-1.5 size-3.5 text-[#78829D]" />
                                    {preview ? 'Change photo' : 'Upload photo'}
                                </Button>
                                {form.data.photo && (
                                    <Button
                                        type="button"
                                        disabled={photoSaving}
                                        onClick={savePhoto}
                                        className="h-9 rounded-lg bg-[#1B84FF] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                                    >
                                        <Save className="mr-1.5 size-3.5" /> {photoSaving ? 'Saving...' : 'Save photo'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label required>Full name</Label>
                            <Input required value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className={fieldClass} placeholder="Enter your full name" />
                            <ErrorText message={form.errors.name} />
                        </div>
                        <div>
                            <Label optional>Cadet name</Label>
                            <Input value={form.data.cadet_name} onChange={(event) => form.setData('cadet_name', event.target.value)} className={fieldClass} placeholder="Enter name used at college" />
                            <ErrorText message={form.errors.cadet_name} />
                        </div>
                        <div>
                            <Label required>Mobile number</Label>
                            <Input required type="tel" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} className={fieldClass} placeholder="Enter mobile number (e.g. +880...)" />
                            <ErrorText message={form.errors.phone} />
                        </div>
                        <div>
                            <Label>Email address</Label>
                            <Input disabled value={member.user?.email || ''} className={`${fieldClass} text-slate-500`} />
                        </div>
                        <div>
                            <Label optional>Blood group</Label>
                            <FieldSelect
                                value={form.data.blood_group}
                                placeholder="Select blood group"
                                clearable
                                onChange={(group) => form.setData('blood_group', group)}
                                options={bloodGroups.map((group) => ({ value: group, label: group }))}
                            />
                            <ErrorText message={form.errors.blood_group} />
                        </div>
                        <div>
                            <Label optional>Spouse name</Label>
                            <Input value={form.data.spouse_name} onChange={(event) => form.setData('spouse_name', event.target.value)} className={fieldClass} placeholder="Enter spouse name" />
                        </div>
                        <div>
                            <Label optional>Spouse occupation</Label>
                            <Input value={form.data.spouse_occupation} onChange={(event) => form.setData('spouse_occupation', event.target.value)} className={fieldClass} placeholder="Enter spouse occupation" />
                        </div>
                        <div>
                            <Label optional>Spouse job location</Label>
                            <Input value={form.data.spouse_job_location} onChange={(event) => form.setData('spouse_job_location', event.target.value)} className={fieldClass} placeholder="Enter spouse job location" />
                        </div>
                        <div className="sm:col-span-2">
                            <div className="mb-1.5 flex items-center justify-between">
                                <Label optional>Children names</Label>
                                {form.data.children_names.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={() => form.setData('children_names', [...form.data.children_names, ''])}
                                        className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                    >
                                        <Plus className="size-3.5" /> Add child
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {form.data.children_names.map((child, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={child}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                form.setData((current) => {
                                                    const next = [...current.children_names];
                                                    next[index] = value;
                                                    return { ...current, children_names: next };
                                                });
                                            }}
                                            className={fieldClass}
                                            placeholder={`Enter child ${index + 1} name`}
                                        />
                                        {form.data.children_names.length > 1 && (
                                            <button
                                                type="button"
                                                aria-label={`Remove child ${index + 1}`}
                                                onClick={() =>
                                                    form.setData(
                                                        'children_names',
                                                        form.data.children_names.filter((_, i) => i !== index)
                                                    )
                                                }
                                                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#DBDFE9] bg-white text-[#99A1B7] transition-colors hover:border-[#F8285A]/40 hover:bg-[#FFEEF3] hover:text-[#F8285A]"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>
                )}

                {step === 1 && (
                <Section title={STEPS[1].title} hint={STEPS[1].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label required>College name</Label>
                            <FieldSelect
                                value={form.data.college_id}
                                placeholder="Select college"
                                onChange={(collegeId) => form.setData((current) => ({ ...current, college_id: collegeId, house_name: '' }))}
                                options={colleges.map((college) => ({
                                    value: String(college.id),
                                    label: college.short_name ? `${college.short_name} (${college.name})` : college.name,
                                }))}
                            />
                            <ErrorText message={form.errors.college_id} />
                        </div>
                        <div>
                            <Label required>Cadet number</Label>
                            <Input required value={form.data.college_roll_no} onChange={(event) => form.setData('college_roll_no', event.target.value)} className={fieldClass} placeholder="Enter cadet roll number" />
                            <ErrorText message={form.errors.college_roll_no} />
                        </div>
                        <div>
                            <Label required>Intake number</Label>
                            <Input required type="number" min={1950} max={2035} value={form.data.intake_year} onChange={(event) => form.setData('intake_year', event.target.value)} className={fieldClass} placeholder="Enter intake year (e.g. 1997)" />
                            <ErrorText message={form.errors.intake_year} />
                        </div>
                        <div>
                            <Label optional>House name</Label>
                            <FieldSelect
                                value={form.data.house_name}
                                placeholder={form.data.college_id ? 'Select house' : 'Select a college first'}
                                disabled={!form.data.college_id}
                                clearable
                                onChange={(house) => form.setData('house_name', house)}
                                options={houseChoices.map((house) => ({ value: house, label: house }))}
                            />
                            <ErrorText message={form.errors.house_name} />
                        </div>
                        <div>
                            <Label optional>House color</Label>
                            <FieldSelect
                                value={form.data.house_color}
                                placeholder="Select color"
                                clearable
                                onChange={(color) => form.setData('house_color', color)}
                                options={houseColors.map((color) => ({
                                    value: color,
                                    label: (
                                        <span className="flex items-center gap-2">
                                            <span className={`size-2.5 rounded-full ${HOUSE_SWATCH[color] ?? 'bg-slate-300'}`} />
                                            {color}
                                        </span>
                                    ),
                                }))}
                            />
                            <ErrorText message={form.errors.house_color} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>CCCL Life Member No (if any)</Label>
                            <Input
                                value={form.data.cccl_life_member_no}
                                onChange={(event) => form.setData('cccl_life_member_no', event.target.value)}
                                className={fieldClass}
                                placeholder="Enter CCCL life member number (if any)"
                            />
                            <ErrorText message={form.errors.cccl_life_member_no} />
                        </div>
                    </div>
                </Section>
                )}

                {step === 2 && (
                <Section title={STEPS[2].title} hint={STEPS[2].hint}>
                    <div className="space-y-6">
                        {/* Present Address */}
                        <div>
                            <div className="mb-3 text-[13px] font-semibold text-[#071437]">Present Address</div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Label optional>House / Road / Street</Label>
                                    <Input
                                        value={form.data.present_address_line}
                                        onChange={(event) => form.setData('present_address_line', event.target.value)}
                                        className={fieldClass}
                                        placeholder="Enter house, flat, road, or street"
                                    />
                                    <ErrorText message={form.errors.present_address_line} />
                                </div>
                                <div>
                                    <Label optional>Area / Thana / Upazila</Label>
                                    <Input
                                        value={form.data.present_area}
                                        onChange={(event) => form.setData('present_area', event.target.value)}
                                        className={fieldClass}
                                        placeholder="Enter area, thana, or upazila"
                                    />
                                    <ErrorText message={form.errors.present_area} />
                                </div>
                                <div>
                                    <Label optional>City / District</Label>
                                    <Input
                                        value={form.data.city}
                                        onChange={(event) => form.setData('city', event.target.value)}
                                        className={fieldClass}
                                        placeholder="Enter city or district"
                                    />
                                    <ErrorText message={form.errors.city} />
                                </div>
                                <div>
                                    <Label optional>Postal / ZIP code</Label>
                                    <Input
                                        value={form.data.present_postal_code}
                                        onChange={(event) => form.setData('present_postal_code', event.target.value)}
                                        className={fieldClass}
                                        placeholder="Enter postal or ZIP code"
                                    />
                                    <ErrorText message={form.errors.present_postal_code} />
                                </div>
                                <div>
                                    <Label optional>Country</Label>
                                    <FieldSelect
                                        value={form.data.country_code}
                                        placeholder="Select country"
                                        onChange={(code) => form.setData('country_code', code)}
                                        options={COUNTRIES}
                                    />
                                    <ErrorText message={form.errors.country_code} />
                                </div>
                            </div>
                        </div>

                        {/* Permanent Address */}
                        <div className="border-t border-[#F1F1F4] pt-5">
                            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-[13px] font-semibold text-[#071437]">Permanent Address</div>
                                <label className="inline-flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-[#4B5675]">
                                    <input
                                        type="checkbox"
                                        checked={form.data.same_as_present_address}
                                        onChange={(event) => form.setData('same_as_present_address', event.target.checked)}
                                        className="size-4 rounded border-[#DBDFE9] text-[#1B84FF] focus:ring-[#1B84FF]"
                                    />
                                    <span>Same as present address</span>
                                </label>
                            </div>

                            {!form.data.same_as_present_address && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Label optional>House / Road / Village</Label>
                                        <Input
                                            value={form.data.permanent_address_line}
                                            onChange={(event) => form.setData('permanent_address_line', event.target.value)}
                                            className={fieldClass}
                                            placeholder="Enter house, road, or village"
                                        />
                                        <ErrorText message={form.errors.permanent_address_line} />
                                    </div>
                                    <div>
                                        <Label optional>Area / Thana / Upazila</Label>
                                        <Input
                                            value={form.data.permanent_area}
                                            onChange={(event) => form.setData('permanent_area', event.target.value)}
                                            className={fieldClass}
                                            placeholder="Enter area, thana, or upazila"
                                        />
                                        <ErrorText message={form.errors.permanent_area} />
                                    </div>
                                    <div>
                                        <Label optional>City / District</Label>
                                        <Input
                                            value={form.data.permanent_city}
                                            onChange={(event) => form.setData('permanent_city', event.target.value)}
                                            className={fieldClass}
                                            placeholder="Enter city or district"
                                        />
                                        <ErrorText message={form.errors.permanent_city} />
                                    </div>
                                    <div>
                                        <Label optional>Postal / ZIP code</Label>
                                        <Input
                                            value={form.data.permanent_postal_code}
                                            onChange={(event) => form.setData('permanent_postal_code', event.target.value)}
                                            className={fieldClass}
                                            placeholder="Enter postal or ZIP code"
                                        />
                                        <ErrorText message={form.errors.permanent_postal_code} />
                                    </div>
                                    <div>
                                        <Label optional>Country</Label>
                                        <FieldSelect
                                            value={form.data.permanent_country_code}
                                            placeholder="Select country"
                                            onChange={(code) => form.setData('permanent_country_code', code)}
                                            options={COUNTRIES}
                                        />
                                        <ErrorText message={form.errors.permanent_country_code} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>
                )}

                {step === 3 && (
                <Section title={STEPS[3].title} hint={STEPS[3].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label optional>Job type</Label>
                            <FieldSelect
                                value={form.data.job_type}
                                placeholder="Select job type"
                                clearable
                                onChange={(type) => form.setData('job_type', type)}
                                options={jobTypes.map((type) => ({ value: type, label: type }))}
                            />
                            <ErrorText message={form.errors.job_type} />
                        </div>
                        <div>
                            <Label optional>Designation</Label>
                            <Input value={form.data.designation} onChange={(event) => form.setData('designation', event.target.value)} className={fieldClass} placeholder="Enter current designation" />
                            <ErrorText message={form.errors.designation} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Organization / institution</Label>
                            <Input value={form.data.organization} onChange={(event) => form.setData('organization', event.target.value)} className={fieldClass} placeholder="Enter organization or institution name" />
                            <ErrorText message={form.errors.organization} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Office address</Label>
                            <textarea
                                rows={3}
                                value={form.data.office_address}
                                onChange={(event) => form.setData('office_address', event.target.value)}
                                className={`${fieldClass} h-auto py-2`}
                                placeholder="Enter office address"
                            />
                            <ErrorText message={form.errors.office_address} />
                        </div>
                        <div>
                            <Label optional>Office contact number</Label>
                            <Input type="tel" value={form.data.office_phone} onChange={(event) => form.setData('office_phone', event.target.value)} className={fieldClass} placeholder="Enter office contact number" />
                            <ErrorText message={form.errors.office_phone} />
                        </div>
                    </div>
                </Section>
                )}

                {step === 4 && (
                <Section title={STEPS[4].title} hint={STEPS[4].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label optional>Facebook profile</Label>
                            <Input type="url" value={form.data.facebook_url} onChange={(event) => form.setData('facebook_url', event.target.value)} className={fieldClass} placeholder="Enter Facebook URL (https://facebook.com/...)" />
                            <ErrorText message={form.errors.facebook_url} />
                        </div>
                        <div>
                            <Label optional>LinkedIn profile</Label>
                            <Input type="url" value={form.data.linkedin_url} onChange={(event) => form.setData('linkedin_url', event.target.value)} className={fieldClass} placeholder="Enter LinkedIn URL (https://linkedin.com/in/...)" />
                            <ErrorText message={form.errors.linkedin_url} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Additional remarks</Label>
                            <textarea
                                rows={3}
                                value={form.data.remarks}
                                onChange={(event) => form.setData('remarks', event.target.value)}
                                className={`${fieldClass} h-auto py-2`}
                                placeholder="Enter any additional remarks or notes"
                            />
                            <ErrorText message={form.errors.remarks} />
                        </div>
                    </div>
                </Section>
                )}

                <div className="flex items-center justify-between gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg border-[#DBDFE9] bg-white text-[13px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9] hover:text-[#071437]"
                        disabled={step === 0}
                        onClick={() => goTo(step - 1)}
                    >
                        <ChevronLeft className="mr-1 size-4" /> Back
                    </Button>
                    {step < STEPS.length - 1 ? (
                        <Button
                            type="button"
                            className="rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6]"
                            onClick={() => goTo(step + 1)}
                        >
                            Next <ChevronRight className="ml-1 size-4" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={form.processing} className="rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6]">
                            <Save className="mr-1.5 size-4" /> Save profile
                        </Button>
                    )}
                </div>
                </form>
                </div>
            </div>
            )}
        </MemberLayout>
    );
}
