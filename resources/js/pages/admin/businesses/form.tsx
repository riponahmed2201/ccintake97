import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Building2,
    CalendarClock,
    Globe,
    ImagePlus,
    Mail,
    MapPin,
    Phone,
    Save,
    Star,
    Tags,
    Trash2,
    UserRound,
} from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

interface BusinessFormProps {
    business: {
        id: number;
        owner_member_id: number;
        name: string;
        category_id: number;
        industry_id: number;
        description: string | null;
        website: string | null;
        email: string | null;
        phone: string | null;
        city: string | null;
        country_code: string | null;
        status: string;
        logo_url: string | null;
        is_featured?: boolean;
        verified_at?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
    } | null;
    categories: Option[];
    industries: Option[];
    owners: (Option & { college?: string | null; status?: string })[];
}

const fieldClass =
    'h-10 w-full rounded-lg border !border-[#DBDFE9] !bg-white px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!ring-[3px] focus:!ring-[#1B84FF]/10';

const iconFieldClass = `${fieldClass} pl-9`;

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] focus-visible:!border-[#1B84FF] focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10';

const selectMenuClass = 'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]';

const selectItemClass = 'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]';

const STATUS_META: Record<string, { label: string; pill: string; dot: string; note: string }> = {
    approved: { label: 'Approved', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', dot: 'bg-emerald-500', note: 'Visible on the website and in the member directory.' },
    pending: { label: 'Pending review', pill: 'bg-amber-50 text-amber-700 ring-amber-600/15', dot: 'bg-amber-500', note: 'Hidden until approved.' },
    rejected: { label: 'Rejected', pill: 'bg-rose-50 text-rose-700 ring-rose-600/15', dot: 'bg-rose-500', note: 'Hidden from members and the website.' },
    suspended: { label: 'Suspended', pill: 'bg-slate-100 text-slate-700 ring-slate-500/15', dot: 'bg-slate-500', note: 'Temporarily hidden from listings.' },
};

const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

function Field({ label, error, required, hint, children, className = '' }: { label: string; error?: string; required?: boolean; hint?: React.ReactNode; children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                {label}
                {required && <span className="ml-0.5 text-[#F8285A]">*</span>}
            </label>
            {children}
            {error ? <p className="mt-1 text-[12px] text-[#F8285A]">{error}</p> : hint ? <p className="mt-1 text-[12px] text-[#99A1B7]">{hint}</p> : null}
        </div>
    );
}

function IconInput({ icon: Icon, ...props }: React.ComponentProps<typeof Input> & { icon: React.ElementType }) {
    return (
        <div className="relative">
            <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#99A1B7]" />
            <Input {...props} className={iconFieldClass} />
        </div>
    );
}

function Card({ icon: Icon, title, description, children, className = '' }: { icon: React.ElementType; title: string; description?: string; children: React.ReactNode; className?: string }) {
    return (
        <section className={`rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] ${className}`}>
            <header className="flex items-center gap-3 border-b border-[#F1F1F4] px-5 py-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                    <Icon className="size-[18px]" />
                </span>
                <div>
                    <h3 className="text-[14px] font-semibold text-[#071437]">{title}</h3>
                    {description && <p className="text-[12px] text-[#78829D]">{description}</p>}
                </div>
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

export default function BusinessForm({ business, categories, industries, owners }: BusinessFormProps) {
    const editing = !!business;
    const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url ?? null);

    const form = useForm({
        owner_member_id: business ? String(business.owner_member_id) : '',
        name: business?.name ?? '',
        category_id: business ? String(business.category_id) : '',
        industry_id: business ? String(business.industry_id) : '',
        description: business?.description ?? '',
        website: business?.website ?? '',
        email: business?.email ?? '',
        phone: business?.phone ?? '',
        city: business?.city ?? '',
        country_code: business?.country_code ?? 'BD',
        status: business?.status ?? 'approved',
        logo: null as File | null,
        remove_logo: false as boolean,
        _method: editing ? 'put' : 'post',
    });
    const err = form.errors as Record<string, string | undefined>;
    const errorCount = Object.keys(form.errors).length;

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        // Files can't be sent with PUT, so edits post with a _method override.
        form.post(editing ? `/admin/businesses/${business!.id}` : '/admin/businesses', { forceFormData: true, preserveScroll: true });
    };

    const title = editing ? 'Edit Business' : 'Add Business';
    const statuses = editing ? ['approved', 'pending', 'rejected', 'suspended'] : ['approved', 'pending'];
    const status = STATUS_META[form.data.status] ?? STATUS_META.pending;
    const owner = owners.find((o) => String(o.id) === form.data.owner_member_id);
    const descLen = form.data.description.length;

    return (
        <AdminLayout title={title} breadcrumbs={[{ title: 'Business Directory', href: '/admin/businesses' }, { title }]}>
            <Head title={`${title} - CCINTAKE 97 Admin`} />

            <form onSubmit={submit} className="w-full space-y-5">
                {/* Page header */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link
                            href="/admin/businesses"
                            aria-label="Back to Business Directory"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#DBDFE9] text-[#78829D] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F1F1F4] bg-[#F9FAFB]">
                            {logoPreview ? <img src={logoPreview} alt="" className="size-full object-contain p-1.5" /> : <Briefcase className="size-6 text-[#1B84FF]" />}
                        </span>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-[18px] font-bold text-[#071437]">{form.data.name || (editing ? business!.name : 'New business')}</h1>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ${status.pill}`}>
                                    <span className={`size-1.5 rounded-full ${status.dot}`} /> {status.label}
                                </span>
                                {business?.is_featured && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-amber-600 ring-1 ring-amber-500/15">
                                        <Star className="size-3 fill-current" /> Featured
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 truncate text-[12.5px] text-[#78829D]">
                                {owner ? `Owned by ${owner.name}${owner.college ? ` · ${owner.college}` : ''}` : editing ? 'Update this alumni business listing.' : 'List a business on behalf of an alumni member.'}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Link href="/admin/businesses" className="inline-flex h-10 items-center rounded-lg border border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9]">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(27,132,255,0.6)] hover:bg-[#006AE6] disabled:opacity-60"
                        >
                            <Save className="size-4" /> {form.processing ? 'Saving…' : editing ? 'Save changes' : 'Add Business'}
                        </button>
                    </div>
                </div>

                {errorCount > 0 && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                        <AlertTriangle className="size-4 shrink-0" />
                        Please fix the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`} below.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-5 xl:col-span-2">
                        <Card icon={Building2} title="Business details" description="Name, owner and what the business does.">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Business name" required error={err.name} className="sm:col-span-2">
                                    <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Enter business name" className={fieldClass} />
                                </Field>
                                <Field label="Alumni owner" required error={err.owner_member_id} className="sm:col-span-2" hint={owner?.status && owner.status !== 'approved' ? `Membership status: ${owner.status.replace('_', ' ')}` : undefined}>
                                    <Select value={form.data.owner_member_id} onValueChange={(v) => form.setData('owner_member_id', v)}>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder="Select member" />
                                        </SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {owners.map((o) => (
                                                <SelectItem key={o.id} value={String(o.id)} className={selectItemClass}>
                                                    {o.name}
                                                    {o.college ? ` · ${o.college}` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field
                                    label="Description"
                                    error={err.description}
                                    className="sm:col-span-2"
                                    hint={<span className="flex justify-between"><span>A short summary shown on listings.</span><span className="tabular-nums">{descLen}/2000</span></span>}
                                >
                                    <textarea
                                        rows={5}
                                        maxLength={2000}
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        placeholder="What the business does"
                                        className={`${fieldClass} h-auto resize-y py-2.5 leading-relaxed`}
                                    />
                                </Field>
                            </div>
                        </Card>

                        <Card icon={Tags} title="Classification" description="Helps members find the business in the directory.">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Category" required error={err.category_id}>
                                    <Select value={form.data.category_id} onValueChange={(v) => form.setData('category_id', v)}>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Industry" required error={err.industry_id}>
                                    <Select value={form.data.industry_id} onValueChange={(v) => form.setData('industry_id', v)}>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {industries.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </Card>

                        <Card icon={Globe} title="Contact & location" description="Public contact points for the business.">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Website" error={err.website}>
                                    <IconInput icon={Globe} value={form.data.website} onChange={(e) => form.setData('website', e.target.value)} placeholder="https://example.com" />
                                </Field>
                                <Field label="Email" error={err.email}>
                                    <IconInput icon={Mail} type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} placeholder="Enter email" />
                                </Field>
                                <Field label="Phone" error={err.phone}>
                                    <IconInput icon={Phone} value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} placeholder="Enter phone number" />
                                </Field>
                                <Field label="City" error={err.city}>
                                    <IconInput icon={MapPin} value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} placeholder="Enter city" />
                                </Field>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-5">
                        <Card icon={CalendarClock} title="Publishing">
                            <Field label="Status" required error={err.status}>
                                <Select value={form.data.status} onValueChange={(v) => form.setData('status', v)}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {statuses.map((value) => (
                                            <SelectItem key={value} value={value} className={selectItemClass}>
                                                <span className="inline-flex items-center gap-2">
                                                    <span className={`size-1.5 rounded-full ${STATUS_META[value].dot}`} /> {STATUS_META[value].label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <p className="mt-2 text-[12px] leading-relaxed text-[#78829D]">{status.note}</p>

                            {editing && (
                                <>
                                    <dl className="mt-4 space-y-2.5 border-t border-[#F1F1F4] pt-4 text-[12.5px]">
                                        <div className="flex justify-between"><dt className="text-[#78829D]">Created</dt><dd className="font-medium text-[#071437]">{fmtDate(business!.created_at)}</dd></div>
                                        <div className="flex justify-between"><dt className="text-[#78829D]">Last updated</dt><dd className="font-medium text-[#071437]">{fmtDate(business!.updated_at)}</dd></div>
                                        <div className="flex justify-between"><dt className="text-[#78829D]">Approved on</dt><dd className="font-medium text-[#071437]">{fmtDate(business!.verified_at)}</dd></div>
                                    </dl>
                                    <button
                                        type="button"
                                        onClick={() => router.post(`/admin/businesses/${business!.id}/feature`, {}, { preserveScroll: true })}
                                        className={`mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-[12.5px] font-semibold transition-colors ${
                                            business!.is_featured ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-[#DBDFE9] text-[#4B5675] hover:bg-[#F9F9F9]'
                                        }`}
                                    >
                                        <Star className={`size-3.5 ${business!.is_featured ? 'fill-current' : ''}`} />
                                        {business!.is_featured ? 'Featured · click to unfeature' : 'Mark as featured'}
                                    </button>
                                </>
                            )}
                        </Card>

                        <Card icon={ImagePlus} title="Logo" description="PNG, JPG or WebP · max 2 MB">
                            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#DBDFE9] bg-[#F9FAFB]">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="" className="max-h-full max-w-full object-contain p-6" />
                                ) : (
                                    <div className="text-center text-[12px] text-[#99A1B7]">
                                        <Briefcase className="mx-auto mb-2 size-8 text-[#C4CADA]" />
                                        No logo yet
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <label className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#DBDFE9] text-[12.5px] font-semibold text-[#071437] hover:bg-[#F9F9F9]">
                                    <ImagePlus className="size-3.5" /> {logoPreview ? 'Replace' : 'Upload logo'}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            form.setData((d) => ({ ...d, logo: file, remove_logo: false }));
                                            setLogoPreview(file ? URL.createObjectURL(file) : business?.logo_url ?? null);
                                        }}
                                    />
                                </label>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            form.setData((d) => ({ ...d, logo: null, remove_logo: true }));
                                            setLogoPreview(null);
                                        }}
                                        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold text-[#F8285A] hover:bg-[#FFEEF3]"
                                    >
                                        <Trash2 className="size-3.5" /> Remove
                                    </button>
                                )}
                            </div>
                            {err.logo && <p className="mt-2 text-[12px] text-[#F8285A]">{err.logo}</p>}
                        </Card>

                        {owner && (
                            <Card icon={UserRound} title="Owner">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F6FF] text-[13px] font-semibold text-[#1B84FF]">
                                        {owner.name.split(' ').filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).slice(0, 2).join('')}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="truncate text-[13.5px] font-semibold text-[#071437]">{owner.name}</div>
                                        <div className="text-[12px] text-[#78829D]">{owner.college ? `${owner.college} · Intake 1997` : 'Intake 1997'}</div>
                                    </div>
                                </div>
                                <Link href={`/admin/members/${owner.id}`} className="mt-3 inline-block text-[12.5px] font-semibold text-[#1B84FF] hover:underline">
                                    View member profile →
                                </Link>
                            </Card>
                        )}
                    </aside>
                </div>

                {/* Sticky save bar */}
                <div className="sticky bottom-4 z-30 rounded-xl border border-[#F1F1F4] bg-white/95 shadow-[0_12px_32px_-12px_rgba(7,20,55,0.25)] backdrop-blur-md">
                    <div className="flex items-center justify-between gap-3 px-5 py-3">
                        <span className="hidden text-[12.5px] text-[#78829D] sm:block">{form.isDirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
                        <div className="ml-auto flex gap-2">
                            <Link href="/admin/businesses" className="inline-flex h-10 items-center rounded-lg border border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9]">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6] disabled:opacity-60"
                            >
                                <Save className="size-4" /> {form.processing ? 'Saving…' : editing ? 'Save changes' : 'Add Business'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
