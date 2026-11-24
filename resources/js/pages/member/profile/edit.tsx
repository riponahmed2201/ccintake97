import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronLeft, ChevronRight, Save } from 'lucide-react';
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
    'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#C9A55C] dark:border-white/10 dark:bg-[#0B1220] dark:text-white';

function Label({ children, optional = false }: { children: React.ReactNode; optional?: boolean }) {
    return (
        <label className="mb-1.5 block text-xs font-semibold text-[#0B1220] dark:text-white">
            {children}
            {optional && <span className="ml-1 font-normal text-slate-400">Optional</span>}
        </label>
    );
}

function ErrorText({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="mt-1 text-[11px] text-rose-600">{message}</p>;
}

const CLEAR = '__clear__';

const selectTriggerClass =
    'h-10 w-full cursor-pointer rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-[#0B1220] shadow-none focus-visible:border-[#C9A55C] focus-visible:ring-[#C9A55C]/30 data-[placeholder]:text-slate-400 dark:border-white/10 dark:bg-[#0B1220] dark:text-white';

const selectMenuClass =
    'rounded-xl border-slate-200 bg-white text-[#0B1220] shadow-[0_18px_40px_-24px_rgba(7,17,31,0.55)] dark:border-white/10 dark:bg-[#0F1724] dark:text-white';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 focus:bg-[#C9A55C]/15 focus:text-[#0B1220] dark:focus:text-white';

const HOUSE_SWATCH: Record<string, string> = {
    Red: 'bg-red-600',
    Blue: 'bg-blue-600',
    Green: 'bg-emerald-600',
    Yellow: 'bg-yellow-400',
    Maroon: 'bg-[#7F1D1D]',
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
    { key: 'college', label: 'College', title: 'College information', hint: 'Pick the college. Do not type a passing-out year beside it.' },
    { key: 'personal', label: 'Personal', title: 'Personal information', hint: 'Spouse, spouse career, and children can be left blank.' },
    { key: 'address', label: 'Address', title: 'Address information', hint: 'Where you can be reached at home.' },
    { key: 'career', label: 'Career', title: 'Professional information', hint: 'Job type is a fixed list. Office address sits with the occupation.' },
    { key: 'more', label: 'More', title: 'Additional information', hint: 'Photo up to 5 MB. Links and remarks can be left blank.' },
] as const;

const STEP_FIELDS: Record<string, number> = {
    college_id: 0,
    college_roll_no: 0,
    intake_year: 0,
    house_name: 0,
    house_color: 0,
    cadet_name: 1,
    name: 1,
    phone: 1,
    blood_group: 1,
    spouse_name: 1,
    spouse_occupation: 1,
    spouse_job_location: 1,
    children_names: 1,
    address: 2,
    job_type: 3,
    designation: 3,
    organization: 3,
    office_address: 3,
    office_phone: 3,
    photo: 4,
    facebook_url: 4,
    linkedin_url: 4,
    remarks: 4,
};

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,31,0.04)] dark:border-white/10 dark:bg-[#0F1724] sm:p-6">
            <h2 className="text-sm font-semibold text-[#0B1220] dark:text-white">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-white/55">{hint}</p>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export default function ProfileEdit({ member, colleges, houses, houseColors, bloodGroups, jobTypes, photoUrl }: ProfileEditProps) {
    const storedChildren = member.profile?.children_names ?? [];
    const [saved, setSaved] = useState(false);
    const [step, setStep] = useState(0);
    const [stepNotice, setStepNotice] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(photoUrl || null);

    const form = useForm({
        name: member.user?.name || '',
        cadet_name: member.profile?.cadet_name || '',
        phone: member.user?.phone || '',
        blood_group: member.profile?.blood_group || '',
        spouse_name: member.profile?.spouse_name || '',
        spouse_occupation: member.profile?.spouse_occupation || '',
        spouse_job_location: member.profile?.spouse_job_location || '',
        children_names: [storedChildren[0] || '', storedChildren[1] || '', storedChildren[2] || ''],
        address: member.profile?.address || '',
        college_id: member.college_id ? String(member.college_id) : '',
        college_roll_no: member.college_roll_no || '',
        intake_year: member.intake_year ? String(member.intake_year) : '1997',
        house_name: member.house_name || '',
        house_color: member.house_color || '',
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
        if (!form.data.college_id || !form.data.college_roll_no.trim() || !form.data.intake_year) {
            return 0;
        }
        if (!form.data.name.trim() || !form.data.phone.trim()) {
            return 1;
        }

        return null;
    };

    const goTo = (target: number) => {
        if (target > step) {
            const blocked = firstIncomplete();
            if (blocked !== null && blocked < target) {
                setStep(blocked);
                setStepNotice('Fill the required fields on this step before continuing.');
                return;
            }
        }
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
        router.put('/member/privacy', { settings: privacySettings }, { preserveScroll: true });
    };

    return (
        <MemberLayout fluid title="My Alumni Profile" breadcrumbs={[{ title: 'My Profile' }]}>
            <Head title="My Profile - INTAKE 97 Alumni" />

            <div className="w-full space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-3xl text-[#0B1220] dark:text-white">Profile</h1>
                        <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-white/55">
                            Move across the steps. College is a fixed list, and intake number is the year you entered.
                        </p>
                    </div>
                    {saved && <p className="text-sm font-medium text-emerald-600">Saved.</p>}
                </div>

                <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                <ol className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#0F1724]">
                    {STEPS.map((item, index) => {
                        const active = index === step;
                        const done = index < step;

                        return (
                            <li key={item.key} className="relative">
                                {index < STEPS.length - 1 && (
                                    <span className={`absolute top-10 left-5 h-[calc(100%-1.5rem)] w-px ${done ? 'bg-[#C9A55C]' : 'bg-slate-200 dark:bg-white/10'}`} />
                                )}
                                <button
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={`relative flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left ${active ? 'bg-[#C9A55C]/10' : ''}`}
                                    aria-current={active ? 'step' : undefined}
                                >
                                    <span
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            active
                                                ? 'bg-[#C9A55C] text-[#07111F]'
                                                : done
                                                  ? 'bg-[#07111F] text-[#E8D5A3] dark:bg-[#C9A55C]/20'
                                                  : 'bg-slate-100 text-slate-400 dark:bg-white/10 dark:text-white/40'
                                        }`}
                                    >
                                        {done ? <Check className="size-3.5" /> : index + 1}
                                    </span>
                                    <span className={`text-sm font-semibold ${active ? 'text-[#0B1220] dark:text-white' : 'text-slate-400 dark:text-white/45'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <div className="space-y-5">
                {stepNotice && <p className="text-sm text-rose-600">{stepNotice}</p>}

                <form onSubmit={submit} className="space-y-5">
                {step === 0 && (
                <Section title={STEPS[0].title} hint={STEPS[0].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label>College name</Label>
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
                            <Label>Cadet number</Label>
                            <Input required value={form.data.college_roll_no} onChange={(event) => form.setData('college_roll_no', event.target.value)} className={fieldClass} placeholder="Roll number" />
                            <ErrorText message={form.errors.college_roll_no} />
                        </div>
                        <div>
                            <Label>Intake number</Label>
                            <Input required type="number" min={1950} max={2035} value={form.data.intake_year} onChange={(event) => form.setData('intake_year', event.target.value)} className={fieldClass} placeholder="1997" />
                            <p className="mt-1 text-[11px] text-slate-400">Year of entry, for example 1997. Not the passing-out year.</p>
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
                    </div>
                </Section>
                )}

                {step === 1 && (
                <Section title={STEPS[1].title} hint={STEPS[1].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label optional>Cadet name</Label>
                            <Input value={form.data.cadet_name} onChange={(event) => form.setData('cadet_name', event.target.value)} className={fieldClass} placeholder="Name used at college" />
                            <ErrorText message={form.errors.cadet_name} />
                        </div>
                        <div>
                            <Label>Full name</Label>
                            <Input required value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className={fieldClass} />
                            <ErrorText message={form.errors.name} />
                        </div>
                        <div>
                            <Label>Mobile number</Label>
                            <Input required type="tel" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} className={fieldClass} placeholder="+880..." />
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
                            <Input value={form.data.spouse_name} onChange={(event) => form.setData('spouse_name', event.target.value)} className={fieldClass} />
                        </div>
                        <div>
                            <Label optional>Spouse occupation</Label>
                            <Input value={form.data.spouse_occupation} onChange={(event) => form.setData('spouse_occupation', event.target.value)} className={fieldClass} />
                        </div>
                        <div>
                            <Label optional>Spouse job location</Label>
                            <Input value={form.data.spouse_job_location} onChange={(event) => form.setData('spouse_job_location', event.target.value)} className={fieldClass} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Children names</Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {form.data.children_names.map((child, index) => (
                                    <Input
                                        key={index}
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
                                        placeholder={`${index + 1}.`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>
                )}

                {step === 2 && (
                <Section title={STEPS[2].title} hint={STEPS[2].hint}>
                    <Label optional>Home address</Label>
                    <textarea
                        rows={3}
                        value={form.data.address}
                        onChange={(event) => form.setData('address', event.target.value)}
                        className={`${fieldClass} h-auto py-2`}
                        placeholder="House, road, area, city"
                    />
                    <ErrorText message={form.errors.address} />
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
                            <Input value={form.data.designation} onChange={(event) => form.setData('designation', event.target.value)} className={fieldClass} placeholder="Current post" />
                            <ErrorText message={form.errors.designation} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Organization / institution</Label>
                            <Input value={form.data.organization} onChange={(event) => form.setData('organization', event.target.value)} className={fieldClass} />
                            <ErrorText message={form.errors.organization} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Office address</Label>
                            <textarea
                                rows={3}
                                value={form.data.office_address}
                                onChange={(event) => form.setData('office_address', event.target.value)}
                                className={`${fieldClass} h-auto py-2`}
                            />
                            <ErrorText message={form.errors.office_address} />
                        </div>
                        <div>
                            <Label optional>Office contact number</Label>
                            <Input type="tel" value={form.data.office_phone} onChange={(event) => form.setData('office_phone', event.target.value)} className={fieldClass} />
                            <ErrorText message={form.errors.office_phone} />
                        </div>
                    </div>
                </Section>
                )}

                {step === 4 && (
                <Section title={STEPS[4].title} hint={STEPS[4].hint}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label optional>Personal photo</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-[#07111F] text-lg font-semibold text-[#E8D5A3]">
                                    {preview ? <img src={preview} alt="" className="size-full object-cover" /> : (form.data.name.charAt(0) || 'C')}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className={fieldClass}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        form.setData('photo', file);
                                        setPreview(file ? URL.createObjectURL(file) : photoUrl || null);
                                    }}
                                />
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">JPG or PNG. Maximum 5 MB.</p>
                            <ErrorText message={form.errors.photo} />
                        </div>
                        <div>
                            <Label optional>Facebook profile</Label>
                            <Input type="url" value={form.data.facebook_url} onChange={(event) => form.setData('facebook_url', event.target.value)} className={fieldClass} placeholder="https://facebook.com/..." />
                            <ErrorText message={form.errors.facebook_url} />
                        </div>
                        <div>
                            <Label optional>LinkedIn profile</Label>
                            <Input type="url" value={form.data.linkedin_url} onChange={(event) => form.setData('linkedin_url', event.target.value)} className={fieldClass} placeholder="https://linkedin.com/in/..." />
                            <ErrorText message={form.errors.linkedin_url} />
                        </div>
                        <div className="sm:col-span-2">
                            <Label optional>Additional remarks</Label>
                            <textarea
                                rows={3}
                                value={form.data.remarks}
                                onChange={(event) => form.setData('remarks', event.target.value)}
                                className={`${fieldClass} h-auto py-2`}
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
                        className="rounded-xl"
                        disabled={step === 0}
                        onClick={() => goTo(step - 1)}
                    >
                        <ChevronLeft className="mr-1 size-4" /> Back
                    </Button>
                    {step < STEPS.length - 1 ? (
                        <Button
                            type="button"
                            className="rounded-xl bg-[#07111F] px-5 text-white hover:bg-[#121b2e] dark:bg-[#C9A55C] dark:text-[#07111F] dark:hover:bg-[#E8D5A3]"
                            onClick={() => goTo(step + 1)}
                        >
                            Next <ChevronRight className="ml-1 size-4" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={form.processing} className="rounded-xl bg-[#07111F] px-5 text-white hover:bg-[#121b2e] dark:bg-[#C9A55C] dark:text-[#07111F] dark:hover:bg-[#E8D5A3]">
                            <Save className="mr-1.5 size-4" /> Save profile
                        </Button>
                    )}
                </div>
                </form>

                {step === 4 && (
                <form onSubmit={savePrivacy}>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0F1724] sm:p-6">
                    <h2 className="text-sm font-semibold text-[#0B1220] dark:text-white">Who can see these details</h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-white/55">Choose who can see organization, designation, and LinkedIn.</p>
                    <div className="mt-4 divide-y divide-slate-100 dark:divide-white/10">
                        {[
                            { key: 'organization', label: 'Organization' },
                            { key: 'designation', label: 'Designation' },
                            { key: 'linkedin', label: 'LinkedIn' },
                        ].map((item) => (
                            <div key={item.key} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#0B1220] dark:text-white">{item.label}</span>
                                <FieldSelect
                                    className="sm:w-56"
                                    value={privacySettings[item.key] || 'verified_members'}
                                    placeholder="Who can see this"
                                    onChange={(visibility) => setPrivacySettings({ ...privacySettings, [item.key]: visibility })}
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
                        <Button type="submit" variant="outline" className="rounded-xl">Save privacy</Button>
                    </div>
                </section>
                </form>
                )}
                </div>
                </div>
            </div>
        </MemberLayout>
    );
}
