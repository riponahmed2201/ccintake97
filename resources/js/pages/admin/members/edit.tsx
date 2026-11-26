import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Plus, Save, X } from 'lucide-react';
import type { College, Industry, Member } from '@/types';

interface AdminMemberEditProps {
    member: Member;
    colleges: College[];
    industries: Industry[];
    houses: Record<string, string[]>;
    houseColors: string[];
    bloodGroups: string[];
    jobTypes: string[];
}

const STEPS = [
    { key: 'basic', label: 'Basic & Account', title: 'Account & Personal Information', hint: 'Manage credentials, registry status, personal and family details.' },
    { key: 'college', label: 'College', title: 'College & Cadet Affiliation', hint: 'Cadet college, house, intake year, and CCCL life membership.' },
    { key: 'address', label: 'Address', title: 'Present & Permanent Address', hint: 'Residential contact details.' },
    { key: 'career', label: 'Career', title: 'Professional Information', hint: 'Career, organization, industry, and office contact.' },
    { key: 'more', label: 'More', title: 'Social Links & Remarks', hint: 'External links and additional notes.' },
] as const;

const STEP_FIELDS: Record<string, number> = {
    name: 0,
    email: 0,
    phone: 0,
    password: 0,
    account_status: 0,
    member_code: 0,
    membership_status: 0,
    verification_status: 0,
    cadet_name: 0,
    gender: 0,
    date_of_birth: 0,
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
    present_address_line: 2,
    present_area: 2,
    city: 2,
    present_postal_code: 2,
    country_code: 2,
    same_as_present_address: 2,
    permanent_address_line: 2,
    permanent_area: 2,
    permanent_city: 2,
    permanent_postal_code: 2,
    permanent_country_code: 2,
    job_type: 3,
    industry_id: 3,
    designation: 3,
    organization: 3,
    office_address: 3,
    office_phone: 3,
    professional_bio: 3,
    owns_business: 3,
    facebook_url: 4,
    linkedin_url: 4,
    website_url: 4,
    remarks: 4,
};

const NONE = '__none__';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

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
];

function FieldLabel({
    children,
    required = false,
    optional = false,
}: {
    children: React.ReactNode;
    required?: boolean;
    optional?: boolean;
}) {
    return (
        <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
            {children}
            {required && <span className="ml-1 text-[#F8285A]">*</span>}
            {optional && <span className="ml-1.5 font-normal text-[#99A1B7]">(Optional)</span>}
        </label>
    );
}

function ErrorText({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-[11.5px] text-[#F8285A]">{message}</p>;
}

function SectionCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
            <div className="border-b border-[#F1F1F4] pb-4">
                <h2 className="text-[15px] font-semibold text-[#071437]">{title}</h2>
                {subtitle && <p className="mt-0.5 text-[12.5px] text-[#78829D]">{subtitle}</p>}
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export default function AdminMemberEdit({
    member,
    colleges,
    industries,
    houses,
    houseColors,
    bloodGroups,
    jobTypes,
}: AdminMemberEditProps) {
    const storedChildren = Array.isArray(member.profile?.children_names) ? member.profile.children_names : [];
    const [step, setStep] = useState(0);
    const [stepNotice, setStepNotice] = useState<string | null>(null);

    const form = useForm({
        name: member.user?.name || '',
        email: member.user?.email || '',
        phone: member.user?.phone || '',
        password: '',
        account_status: member.user?.account_status || 'active',
        member_code: member.member_code || '',
        membership_status: member.membership_status || 'pending',
        verification_status: member.verification_status || 'unverified',
        college_id: member.college_id ? String(member.college_id) : '',
        college_roll_no: member.college_roll_no || '',
        intake_year: member.intake_year ? String(member.intake_year) : '1997',
        house_name: member.house_name || '',
        house_color: member.house_color || '',
        cadet_name: member.profile?.cadet_name || '',
        cccl_life_member_no: member.profile?.cccl_life_member_no || '',
        gender: member.profile?.gender || '',
        date_of_birth: member.profile?.date_of_birth ? String(member.profile.date_of_birth).slice(0, 10) : '',
        blood_group: member.profile?.blood_group || '',
        spouse_name: member.profile?.spouse_name || '',
        spouse_occupation: member.profile?.spouse_occupation || '',
        spouse_job_location: member.profile?.spouse_job_location || '',
        children_names: storedChildren.length > 0 ? storedChildren : [''],
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
        job_type: member.profile?.job_type || '',
        designation: member.profile?.designation || '',
        organization: member.profile?.organization || '',
        industry_id: member.profile?.industry_id ? String(member.profile.industry_id) : '',
        office_address: member.profile?.office_address || '',
        office_phone: member.profile?.office_phone || '',
        professional_bio: member.profile?.professional_bio || '',
        owns_business: Boolean(member.profile?.owns_business),
        facebook_url: member.profile?.facebook_url || '',
        linkedin_url: member.profile?.linkedin_url || '',
        website_url: member.profile?.website_url || '',
        remarks: member.profile?.remarks || '',
    });

    const selectedCollege = colleges.find((c) => String(c.id) === form.data.college_id);
    const houseOptions = selectedCollege?.short_name ? houses[selectedCollege.short_name] ?? [] : [];
    const houseChoices = form.data.house_name && !houseOptions.includes(form.data.house_name)
        ? [...houseOptions, form.data.house_name]
        : houseOptions;

    const goTo = (next: number) => {
        setStepNotice(null);
        setStep(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStepNotice(null);
        form.put(`/admin/members/${member.id}`, {
            onError: (errors) => {
                const firstKey = Object.keys(errors)[0];
                const target = firstKey ? (STEP_FIELDS[firstKey] ?? 0) : 0;
                setStep(target);
                setStepNotice('Please fix the highlighted fields before saving.');
            },
        });
    };

    const addChild = () => form.setData('children_names', [...form.data.children_names, '']);
    const removeChild = (idx: number) => {
        const next = form.data.children_names.filter((_, i) => i !== idx);
        form.setData('children_names', next.length > 0 ? next : ['']);
    };
    const updateChild = (idx: number, val: string) => {
        const next = [...form.data.children_names];
        next[idx] = val;
        form.setData('children_names', next);
    };

    return (
        <AdminLayout
            title={`Edit ${member.user?.name || 'Member'}`}
            breadcrumbs={[
                { title: 'Members', href: '/admin/members' },
                { title: member.user?.name || `Member #${member.id}`, href: `/admin/members/${member.id}` },
                { title: 'Edit' },
            ]}
        >
            <Head title={`Edit ${member.user?.name || 'Member'} - INTAKE 97 Admin`} />

            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Edit Member Details
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Step {step + 1} of {STEPS.length} — {STEPS[step].label} for{' '}
                            <strong className="text-[#071437]">{member.user?.name}</strong>.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/members"
                            className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                        >
                            <ArrowLeft className="size-3.5" />
                            Back to Members
                        </Link>
                    </div>
                </div>

                {/* Stepper */}
                <ol className="grid grid-cols-2 gap-2 rounded-xl border border-[#F1F1F4] bg-white p-3 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:grid-cols-5">
                    {STEPS.map((item, index) => {
                        const active = index === step;
                        const done = index < step;

                        return (
                            <li key={item.key} className="relative">
                                <button
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
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

                {stepNotice && (
                    <div className="rounded-lg border border-[#F8285A]/20 bg-[#FFEEF3] px-4 py-2.5 text-[13px] font-medium text-[#F8285A]">
                        {stepNotice}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Step 0: Basic & Account */}
                    {step === 0 && (
                        <SectionCard title={STEPS[0].title} subtitle={STEPS[0].hint}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <FieldLabel required>Full Name</FieldLabel>
                                    <Input required value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.name} />
                                </div>
                                <div>
                                    <FieldLabel required>Email Address</FieldLabel>
                                    <Input required type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.email} />
                                </div>
                                <div>
                                    <FieldLabel optional>Phone Number</FieldLabel>
                                    <Input type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.phone} />
                                </div>
                                <div>
                                    <FieldLabel optional>New Password</FieldLabel>
                                    <Input
                                        type="password"
                                        minLength={8}
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        className={fieldClass}
                                    />
                                    <ErrorText message={form.errors.password} />
                                </div>
                                <div>
                                    <FieldLabel optional>Member ID / Code</FieldLabel>
                                    <Input value={form.data.member_code} onChange={(e) => form.setData('member_code', e.target.value)} placeholder="Auto-assigned when approved" className={fieldClass} />
                                    <ErrorText message={form.errors.member_code} />
                                </div>
                                <div>
                                    <FieldLabel required>Account Status</FieldLabel>
                                    <Select value={form.data.account_status} onValueChange={(v) => form.setData('account_status', v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {['active', 'pending', 'suspended', 'archived'].map((s) => (
                                                <SelectItem key={s} value={s} className={`${selectItemClass} capitalize`}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.account_status} />
                                </div>
                                <div>
                                    <FieldLabel required>Membership Status</FieldLabel>
                                    <Select value={form.data.membership_status} onValueChange={(v) => form.setData('membership_status', v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {['pending', 'approved', 'rejected', 'suspended'].map((s) => (
                                                <SelectItem key={s} value={s} className={`${selectItemClass} capitalize`}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.membership_status} />
                                </div>
                                <div>
                                    <FieldLabel required>Verification Status</FieldLabel>
                                    <Select value={form.data.verification_status} onValueChange={(v) => form.setData('verification_status', v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {['unverified', 'pending', 'verified', 'rejected'].map((s) => (
                                                <SelectItem key={s} value={s} className={`${selectItemClass} capitalize`}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.verification_status} />
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#F1F1F4] pt-5 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <FieldLabel optional>Cadet Name</FieldLabel>
                                    <Input value={form.data.cadet_name} onChange={(e) => form.setData('cadet_name', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.cadet_name} />
                                </div>
                                <div>
                                    <FieldLabel optional>Gender</FieldLabel>
                                    <Select value={form.data.gender || NONE} onValueChange={(v) => form.setData('gender', v === NONE ? '' : v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select gender" /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={NONE} className={selectItemClass}>Not specified</SelectItem>
                                            {['male', 'female', 'other'].map((g) => (
                                                <SelectItem key={g} value={g} className={`${selectItemClass} capitalize`}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.gender} />
                                </div>
                                <div>
                                    <FieldLabel optional>Date of Birth</FieldLabel>
                                    <DatePicker
                                        value={form.data.date_of_birth}
                                        onChange={(val) => form.setData('date_of_birth', val)}
                                        placeholder="Select date of birth"
                                        defaultYear={1982}
                                        maxYear={new Date().getFullYear()}
                                    />
                                    <ErrorText message={form.errors.date_of_birth} />
                                </div>
                                <div>
                                    <FieldLabel optional>Blood Group</FieldLabel>
                                    <Select value={form.data.blood_group || NONE} onValueChange={(v) => form.setData('blood_group', v === NONE ? '' : v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select blood group" /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={NONE} className={selectItemClass}>Not specified</SelectItem>
                                            {bloodGroups.map((bg) => (
                                                <SelectItem key={bg} value={bg} className={selectItemClass}>{bg}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.blood_group} />
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#F1F1F4] pt-5 sm:grid-cols-3">
                                <div>
                                    <FieldLabel optional>Spouse Name</FieldLabel>
                                    <Input value={form.data.spouse_name} onChange={(e) => form.setData('spouse_name', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.spouse_name} />
                                </div>
                                <div>
                                    <FieldLabel optional>Spouse Occupation</FieldLabel>
                                    <Input value={form.data.spouse_occupation} onChange={(e) => form.setData('spouse_occupation', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.spouse_occupation} />
                                </div>
                                <div>
                                    <FieldLabel optional>Spouse Job Location</FieldLabel>
                                    <Input value={form.data.spouse_job_location} onChange={(e) => form.setData('spouse_job_location', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.spouse_job_location} />
                                </div>
                            </div>

                            <div className="mt-5 border-t border-[#F1F1F4] pt-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <FieldLabel optional>Children Names</FieldLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addChild}
                                        className="h-8 rounded-md border-[#DBDFE9] !bg-white px-2.5 text-[12px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                                    >
                                        <Plus className="mr-1 size-3.5" /> Add Child
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    {form.data.children_names.map((child, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                value={child}
                                                onChange={(e) => updateChild(idx, e.target.value)}
                                                placeholder={`Child ${idx + 1} name`}
                                                className={fieldClass}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeChild(idx)}
                                                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#DBDFE9] text-[#78829D] hover:border-[#F8285A] hover:text-[#F8285A]"
                                                aria-label="Remove child"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* Step 1: College */}
                    {step === 1 && (
                        <SectionCard title={STEPS[1].title} subtitle={STEPS[1].hint}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Cadet College</FieldLabel>
                                    <Select
                                        value={form.data.college_id || NONE}
                                        onValueChange={(v) => form.setData((prev) => ({ ...prev, college_id: v === NONE ? '' : v, house_name: '' }))}
                                    >
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select college" /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={NONE} className={selectItemClass}>Not assigned</SelectItem>
                                            {colleges.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>
                                                    {c.short_name ? `${c.short_name} — ${c.name}` : c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.college_id} />
                                </div>
                                <div>
                                    <FieldLabel optional>Cadet Roll No</FieldLabel>
                                    <Input value={form.data.college_roll_no} onChange={(e) => form.setData('college_roll_no', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.college_roll_no} />
                                </div>
                                <div>
                                    <FieldLabel optional>Intake Year</FieldLabel>
                                    <Input type="number" min={1950} max={2035} value={form.data.intake_year} onChange={(e) => form.setData('intake_year', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.intake_year} />
                                </div>
                                <div>
                                    <FieldLabel optional>House Name</FieldLabel>
                                    {houseChoices.length > 0 ? (
                                        <Select value={form.data.house_name || NONE} onValueChange={(v) => form.setData('house_name', v === NONE ? '' : v)}>
                                            <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select house" /></SelectTrigger>
                                            <SelectContent className={selectMenuClass}>
                                                <SelectItem value={NONE} className={selectItemClass}>None</SelectItem>
                                                {houseChoices.map((h) => (
                                                    <SelectItem key={h} value={h} className={selectItemClass}>{h}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input value={form.data.house_name} onChange={(e) => form.setData('house_name', e.target.value)} className={fieldClass} />
                                    )}
                                    <ErrorText message={form.errors.house_name} />
                                </div>
                                <div>
                                    <FieldLabel optional>House Color</FieldLabel>
                                    <Select value={form.data.house_color || NONE} onValueChange={(v) => form.setData('house_color', v === NONE ? '' : v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select color" /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={NONE} className={selectItemClass}>None</SelectItem>
                                            {houseColors.map((c) => (
                                                <SelectItem key={c} value={c} className={selectItemClass}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.house_color} />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>CCCL Life Member No (if any)</FieldLabel>
                                    <Input
                                        value={form.data.cccl_life_member_no}
                                        onChange={(e) => form.setData('cccl_life_member_no', e.target.value)}
                                        placeholder="Enter CCCL life member number (if any)"
                                        className={fieldClass}
                                    />
                                    <ErrorText message={form.errors.cccl_life_member_no} />
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* Step 2: Address */}
                    {step === 2 && (
                        <SectionCard title={STEPS[2].title} subtitle={STEPS[2].hint}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Present House / Road / Street</FieldLabel>
                                    <Input value={form.data.present_address_line} onChange={(e) => form.setData('present_address_line', e.target.value)} className={fieldClass} />
                                </div>
                                <div>
                                    <FieldLabel optional>Present Area / Thana</FieldLabel>
                                    <Input value={form.data.present_area} onChange={(e) => form.setData('present_area', e.target.value)} className={fieldClass} />
                                </div>
                                <div>
                                    <FieldLabel optional>Present City / District</FieldLabel>
                                    <Input value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} className={fieldClass} />
                                </div>
                                <div>
                                    <FieldLabel optional>Present Postal Code</FieldLabel>
                                    <Input value={form.data.present_postal_code} onChange={(e) => form.setData('present_postal_code', e.target.value)} className={fieldClass} />
                                </div>
                                <div>
                                    <FieldLabel optional>Present Country</FieldLabel>
                                    <Select value={form.data.country_code || 'BD'} onValueChange={(v) => form.setData('country_code', v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {COUNTRIES.map((c) => (
                                                <SelectItem key={c.value} value={c.value} className={selectItemClass}>{c.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <label className="mt-5 flex cursor-pointer items-center gap-2.5 border-t border-[#F1F1F4] pt-4 text-[13px] font-medium text-[#071437]">
                                <input
                                    type="checkbox"
                                    checked={form.data.same_as_present_address}
                                    onChange={(e) => form.setData('same_as_present_address', e.target.checked)}
                                    className="size-4 rounded border-[#DBDFE9] text-[#1B84FF]"
                                />
                                Permanent address is same as present address
                            </label>

                            {!form.data.same_as_present_address && (
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <FieldLabel optional>Permanent House / Road / Street</FieldLabel>
                                        <Input value={form.data.permanent_address_line} onChange={(e) => form.setData('permanent_address_line', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <FieldLabel optional>Permanent Area / Thana</FieldLabel>
                                        <Input value={form.data.permanent_area} onChange={(e) => form.setData('permanent_area', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <FieldLabel optional>Permanent City / District</FieldLabel>
                                        <Input value={form.data.permanent_city} onChange={(e) => form.setData('permanent_city', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <FieldLabel optional>Permanent Postal Code</FieldLabel>
                                        <Input value={form.data.permanent_postal_code} onChange={(e) => form.setData('permanent_postal_code', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <FieldLabel optional>Permanent Country</FieldLabel>
                                        <Select value={form.data.permanent_country_code || 'BD'} onValueChange={(v) => form.setData('permanent_country_code', v)}>
                                            <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                            <SelectContent className={selectMenuClass}>
                                                {COUNTRIES.map((c) => (
                                                    <SelectItem key={c.value} value={c.value} className={selectItemClass}>{c.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </SectionCard>
                    )}

                    {/* Step 3: Career */}
                    {step === 3 && (
                        <SectionCard title={STEPS[3].title} subtitle={STEPS[3].hint}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <FieldLabel optional>Job Type</FieldLabel>
                                    <Select value={form.data.job_type || NONE} onValueChange={(v) => form.setData('job_type', v === NONE ? '' : v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select job type" /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={NONE} className={selectItemClass}>None</SelectItem>
                                            {jobTypes.map((jt) => (
                                                <SelectItem key={jt} value={jt} className={selectItemClass}>{jt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.job_type} />
                                </div>
                                <div>
                                    <FieldLabel optional>Industry</FieldLabel>
                                    <Select value={form.data.industry_id || NONE} onValueChange={(v) => form.setData('industry_id', v === NONE ? '' : v)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select industry" /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={NONE} className={selectItemClass}>None</SelectItem>
                                            {industries.map((ind) => (
                                                <SelectItem key={ind.id} value={String(ind.id)} className={selectItemClass}>{ind.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorText message={form.errors.industry_id} />
                                </div>
                                <div>
                                    <FieldLabel optional>Designation</FieldLabel>
                                    <Input value={form.data.designation} onChange={(e) => form.setData('designation', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.designation} />
                                </div>
                                <div>
                                    <FieldLabel optional>Office Phone</FieldLabel>
                                    <Input type="tel" value={form.data.office_phone} onChange={(e) => form.setData('office_phone', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.office_phone} />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Organization / Institution</FieldLabel>
                                    <Input value={form.data.organization} onChange={(e) => form.setData('organization', e.target.value)} className={fieldClass} />
                                    <ErrorText message={form.errors.organization} />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Office Address</FieldLabel>
                                    <textarea
                                        rows={2}
                                        value={form.data.office_address}
                                        onChange={(e) => form.setData('office_address', e.target.value)}
                                        className={`${fieldClass} h-auto py-2`}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Professional Bio</FieldLabel>
                                    <textarea
                                        rows={3}
                                        value={form.data.professional_bio}
                                        onChange={(e) => form.setData('professional_bio', e.target.value)}
                                        className={`${fieldClass} h-auto py-2`}
                                    />
                                </div>
                            </div>
                            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-[#071437]">
                                <input
                                    type="checkbox"
                                    checked={form.data.owns_business}
                                    onChange={(e) => form.setData('owns_business', e.target.checked)}
                                    className="size-4 rounded border-[#DBDFE9] text-[#1B84FF]"
                                />
                                Member owns a business
                            </label>
                        </SectionCard>
                    )}

                    {/* Step 4: More */}
                    {step === 4 && (
                        <SectionCard title={STEPS[4].title} subtitle={STEPS[4].hint}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <FieldLabel optional>Facebook URL</FieldLabel>
                                    <Input type="url" value={form.data.facebook_url} onChange={(e) => form.setData('facebook_url', e.target.value)} placeholder="https://facebook.com/..." className={fieldClass} />
                                    <ErrorText message={form.errors.facebook_url} />
                                </div>
                                <div>
                                    <FieldLabel optional>LinkedIn URL</FieldLabel>
                                    <Input type="url" value={form.data.linkedin_url} onChange={(e) => form.setData('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." className={fieldClass} />
                                    <ErrorText message={form.errors.linkedin_url} />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Website URL</FieldLabel>
                                    <Input type="url" value={form.data.website_url} onChange={(e) => form.setData('website_url', e.target.value)} placeholder="https://..." className={fieldClass} />
                                    <ErrorText message={form.errors.website_url} />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldLabel optional>Additional Remarks</FieldLabel>
                                    <textarea
                                        rows={3}
                                        value={form.data.remarks}
                                        onChange={(e) => form.setData('remarks', e.target.value)}
                                        className={`${fieldClass} h-auto py-2`}
                                    />
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* Step Navigation Footer */}
                    <div className="flex items-center justify-between gap-3 pb-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-lg border-[#DBDFE9] bg-white text-[13px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9] hover:text-[#071437]"
                            disabled={step === 0}
                            onClick={() => goTo(step - 1)}
                        >
                            <ChevronLeft className="mr-1 size-4" /> Back
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                variant={step < STEPS.length - 1 ? 'outline' : 'default'}
                                className={
                                    step < STEPS.length - 1
                                        ? 'rounded-lg border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#071437] hover:bg-[#F9F9F9]'
                                        : 'rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6]'
                                }
                            >
                                <Save className="mr-1.5 size-4" />
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </Button>

                            {step < STEPS.length - 1 && (
                                <Button
                                    type="button"
                                    className="rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6]"
                                    onClick={() => goTo(step + 1)}
                                >
                                    Next <ChevronRight className="ml-1 size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
