import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
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

function Section({ index, title, hint, children }: { index: string; title: string; hint: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,31,0.04)] dark:border-white/10 dark:bg-[#0F1724] sm:p-6">
            <div className="mb-5 flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#C9A55C] text-sm font-semibold text-[#07111F]">
                    {index}
                </span>
                <div>
                    <h2 className="text-sm font-semibold text-[#0B1220] dark:text-white">{title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-white/55">{hint}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

export default function ProfileEdit({ member, colleges, houses, houseColors, bloodGroups, jobTypes, photoUrl }: ProfileEditProps) {
    const storedChildren = member.profile?.children_names ?? [];
    const [saved, setSaved] = useState(false);
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

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        setSaved(false);
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
        });
    };

    const savePrivacy = (event: React.FormEvent) => {
        event.preventDefault();
        router.put('/member/privacy', { settings: privacySettings }, { preserveScroll: true });
    };

    return (
        <MemberLayout title="My Alumni Profile" breadcrumbs={[{ title: 'My Profile' }]}>
            <Head title="My Profile - INTAKE 97 Alumni" />

            <form onSubmit={submit} className="mx-auto max-w-4xl space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-3xl text-[#0B1220] dark:text-white">Profile</h1>
                        <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-white/55">
                            College is chosen from the list, so every record uses the same name. Intake number is the year you entered, not the year you passed out.
                        </p>
                    </div>
                    {saved && <p className="text-sm font-medium text-emerald-600">Saved.</p>}
                </div>

                <Section index="1" title="College information" hint="Pick the college. Do not type a passing-out year beside it.">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label>College name</Label>
                            <select
                                required
                                value={form.data.college_id}
                                onChange={(event) => {
                                    const collegeId = event.target.value;
                                    form.setData((current) => ({ ...current, college_id: collegeId, house_name: '' }));
                                }}
                                className={fieldClass}
                            >
                                <option value="">Select college</option>
                                {colleges.map((college) => (
                                    <option key={college.id} value={college.id}>
                                        {college.short_name ? `${college.short_name} (${college.name})` : college.name}
                                    </option>
                                ))}
                            </select>
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
                            <select
                                value={form.data.house_name}
                                onChange={(event) => form.setData('house_name', event.target.value)}
                                className={fieldClass}
                                disabled={!form.data.college_id}
                            >
                                <option value="">{form.data.college_id ? 'Select house' : 'Select a college first'}</option>
                                {houseChoices.map((house) => (
                                    <option key={house} value={house}>{house}</option>
                                ))}
                            </select>
                            <ErrorText message={form.errors.house_name} />
                        </div>
                        <div>
                            <Label optional>House color</Label>
                            <select value={form.data.house_color} onChange={(event) => form.setData('house_color', event.target.value)} className={fieldClass}>
                                <option value="">Select color</option>
                                {houseColors.map((color) => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                            <ErrorText message={form.errors.house_color} />
                        </div>
                    </div>
                </Section>

                <Section index="2" title="Personal information" hint="Spouse, spouse career, and children can be left blank.">
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
                            <select value={form.data.blood_group} onChange={(event) => form.setData('blood_group', event.target.value)} className={fieldClass}>
                                <option value="">Select blood group</option>
                                {bloodGroups.map((group) => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
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

                <Section index="3" title="Address information" hint="Where you can be reached at home.">
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

                <Section index="4" title="Professional information" hint="Job type is a fixed list. Office address sits with the occupation.">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label optional>Job type</Label>
                            <select value={form.data.job_type} onChange={(event) => form.setData('job_type', event.target.value)} className={fieldClass}>
                                <option value="">Select job type</option>
                                {jobTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
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

                <Section index="5" title="Additional information" hint="Photo up to 5 MB. Links and remarks can be left blank.">
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

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing} className="rounded-xl bg-[#07111F] px-5 text-white hover:bg-[#121b2e] dark:bg-[#C9A55C] dark:text-[#07111F] dark:hover:bg-[#E8D5A3]">
                        <Save className="mr-1.5 size-4" /> Save profile
                    </Button>
                </div>
            </form>

            <form onSubmit={savePrivacy} className="mx-auto mt-5 max-w-4xl">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0F1724] sm:p-6">
                    <h2 className="text-sm font-semibold text-[#0B1220] dark:text-white">Who can see these details</h2>
                    <div className="mt-4 divide-y divide-slate-100 dark:divide-white/10">
                        {[
                            { key: 'organization', label: 'Organization' },
                            { key: 'designation', label: 'Designation' },
                            { key: 'linkedin', label: 'LinkedIn' },
                        ].map((item) => (
                            <div key={item.key} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#0B1220] dark:text-white">{item.label}</span>
                                <select
                                    value={privacySettings[item.key] || 'verified_members'}
                                    onChange={(event) => setPrivacySettings({ ...privacySettings, [item.key]: event.target.value })}
                                    className={`${fieldClass} sm:w-56`}
                                >
                                    <option value="verified_members">Verified members</option>
                                    <option value="connections">Connections only</option>
                                    <option value="private">Only me and admin</option>
                                </select>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="submit" variant="outline" className="rounded-xl">Save privacy</Button>
                    </div>
                </section>
            </form>
        </MemberLayout>
    );
}
