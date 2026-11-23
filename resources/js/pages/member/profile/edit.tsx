import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, GraduationCap, Briefcase, Lock, Save, ShieldCheck } from 'lucide-react';
import type { Member, Industry, College } from '@/types';

interface ProfileEditProps {
    member: Member;
    industries: Industry[];
    colleges?: College[];
    cadetEditable?: boolean;
}

export default function ProfileEdit({ member, industries, colleges = [], cadetEditable = false }: ProfileEditProps) {
    // User fields
    const [name, setName] = useState(member.user?.name || '');
    const [phone, setPhone] = useState(member.user?.phone || '');

    // Profile fields
    const [city, setCity] = useState(member.profile?.city || '');
    const [countryCode, setCountryCode] = useState(member.profile?.country_code || 'BD');
    const [address, setAddress] = useState(member.profile?.address || '');
    const [gender, setGender] = useState(member.profile?.gender || '');
    const [dateOfBirth, setDateOfBirth] = useState(member.profile?.date_of_birth ? member.profile.date_of_birth.substring(0, 10) : '');
    const [designation, setDesignation] = useState(member.profile?.designation || '');
    const [organization, setOrganization] = useState(member.profile?.organization || '');
    const [industryId, setIndustryId] = useState(member.profile?.industry_id ? String(member.profile.industry_id) : '');
    const [bio, setBio] = useState(member.profile?.professional_bio || '');
    const [linkedin, setLinkedin] = useState(member.profile?.linkedin_url || '');
    const [website, setWebsite] = useState(member.profile?.website_url || '');

    // Privacy settings map
    const existingPrivacy = (member.privacy_settings || []).reduce((acc: any, curr: any) => {
        acc[curr.field_key] = curr.visibility;
        return acc;
    }, {});

    const [privacySettings, setPrivacySettings] = useState<Record<string, string>>({
        photo: existingPrivacy.photo || 'verified_members',
        organization: existingPrivacy.organization || 'verified_members',
        designation: existingPrivacy.designation || 'verified_members',
        country: existingPrivacy.country || 'verified_members',
        city: existingPrivacy.city || 'connections',
        linkedin: existingPrivacy.linkedin || 'connections',
        date_of_birth: existingPrivacy.date_of_birth || 'private',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put('/member/profile', {
            name,
            phone,
            city,
            country_code: countryCode,
            address,
            gender,
            date_of_birth: dateOfBirth || null,
            designation,
            organization,
            industry_id: industryId ? parseInt(industryId) : null,
            professional_bio: bio,
            linkedin_url: linkedin,
            website_url: website,
        });
    };

    const handlePrivacySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put('/member/privacy', {
            settings: privacySettings,
        });
    };

    const [collegeId, setCollegeId] = useState(member.college_id ? String(member.college_id) : '');
    const [collegeRollNo, setCollegeRollNo] = useState(member.college_roll_no || '');
    const [referenceName, setReferenceName] = useState('');
    const [referencePhone, setReferencePhone] = useState('');

    const handleCadetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put('/member/profile/cadet', {
            college_id: collegeId ? parseInt(collegeId, 10) : null,
            college_roll_no: collegeRollNo,
            reference_name: referenceName || null,
            reference_phone: referencePhone || null,
            phone: phone || null,
        });
    };

    return (
        <MemberLayout
            title="My Alumni Profile"
            breadcrumbs={[{ title: 'My Profile' }]}
        >
            <Head title="My Profile - INTAKE 97 Alumni" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        My Alumni Profile & Privacy
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Update your professional details and control what information fellow batchmates can view.
                    </p>
                </div>

                <Tabs defaultValue={cadetEditable ? 'cadet' : 'personal'} className="space-y-4">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="personal" className="text-xs">Personal Info</TabsTrigger>
                        <TabsTrigger value="cadet" className="text-xs">Cadet College Affiliation</TabsTrigger>
                        <TabsTrigger value="professional" className="text-xs">Professional Career</TabsTrigger>
                        <TabsTrigger value="privacy" className="text-xs">Privacy Settings</TabsTrigger>
                    </TabsList>

                    {/* Personal Info Tab */}
                    <TabsContent value="personal">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <UserCircle className="size-4 text-indigo-600" />
                                        Personal & Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-semibold block mb-1">Full Name *</label>
                                            <Input required value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Email (Account Login)</label>
                                            <Input disabled value={member.user?.email} className="bg-slate-50 text-slate-500" />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Phone Number</label>
                                            <Input placeholder="+880..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Date of Birth (Private by default)</label>
                                            <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Current City</label>
                                            <Input placeholder="e.g. Dhaka, London, Toronto" value={city} onChange={(e) => setCity(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Country Code *</label>
                                            <Input placeholder="BD, US, GB, CA" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="font-semibold block mb-1">Residential Address</label>
                                            <Input placeholder="Current residence address..." value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                            <Save className="size-3.5 mr-1.5" /> Save Personal Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>

                    {/* Cadet College Affiliation Tab */}
                    <TabsContent value="cadet">
                        {cadetEditable ? (
                            <form onSubmit={handleCadetSubmit} className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                            <GraduationCap className="size-4 text-emerald-600" />
                                            Cadet College &amp; Roll Number
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-xs">
                                        <p className="text-slate-500">
                                            Required to submit your membership application for INTAKE 97 verification.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-semibold block mb-1">Cadet college *</label>
                                                <select
                                                    required
                                                    value={collegeId}
                                                    onChange={(e) => setCollegeId(e.target.value)}
                                                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                                                >
                                                    <option value="">Select college</option>
                                                    {colleges.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="font-semibold block mb-1">College roll number *</label>
                                                <Input required value={collegeRollNo} onChange={(e) => setCollegeRollNo(e.target.value)} placeholder="e.g. 721" />
                                            </div>
                                            <div>
                                                <label className="font-semibold block mb-1">Mobile (optional)</label>
                                                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880..." />
                                            </div>
                                            <div>
                                                <label className="font-semibold block mb-1">Batchmate reference (optional)</label>
                                                <Input value={referenceName} onChange={(e) => setReferenceName(e.target.value)} placeholder="Name" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="font-semibold block mb-1">Reference phone (optional)</label>
                                                <Input type="tel" value={referencePhone} onChange={(e) => setReferencePhone(e.target.value)} />
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-400">Intake year is fixed at <strong>1997</strong> for this portal.</p>
                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold">
                                                <Save className="size-3.5 mr-1.5" /> Save &amp; submit application
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <GraduationCap className="size-4 text-emerald-600" />
                                        Cadet College 1997 Intake Credentials
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-xs">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Cadet College Affiliation:</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                {member.college?.name || '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Intake Year:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">1997 (Fixed)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Cadet College Roll #:</span>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white">{member.college_roll_no || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Verification Status:</span>
                                            <Badge variant="outline" className="capitalize text-[10px] font-bold text-emerald-600">
                                                {member.verification_status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Cadet college and roll number cannot be changed here after your application is submitted. Contact administration for corrections.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Professional Career Tab */}
                    <TabsContent value="professional">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Briefcase className="size-4 text-purple-600" />
                                        Professional Employment & Career
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-semibold block mb-1">Current Job Title / Designation</label>
                                            <Input
                                                placeholder="e.g. Lead Architect, Managing Director, Surgeon"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Current Organization / Employer</label>
                                            <Input
                                                placeholder="e.g. Grameenphone, Google, Ministry of Defence"
                                                value={organization}
                                                onChange={(e) => setOrganization(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">Industry Sector</label>
                                            <select
                                                value={industryId}
                                                onChange={(e) => setIndustryId(e.target.value)}
                                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                            >
                                                <option value="">Select industry...</option>
                                                {industries.map((ind) => (
                                                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="font-semibold block mb-1">LinkedIn Profile URL</label>
                                            <Input
                                                placeholder="https://linkedin.com/in/..."
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="font-semibold block mb-1">Professional Bio & Areas of Expertise</label>
                                            <textarea
                                                rows={4}
                                                className="w-full text-xs rounded-md border p-3 bg-white dark:bg-slate-900"
                                                placeholder="Brief introduction regarding your career journey and achievements..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                            <Save className="size-3.5 mr-1.5" /> Save Career Information
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>

                    {/* Privacy Settings Tab */}
                    <TabsContent value="privacy">
                        <form onSubmit={handlePrivacySubmit} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Lock className="size-4 text-slate-600" />
                                        Field-Level Visibility Permissions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-xs">
                                    <p className="text-[11px] text-slate-500">
                                        Configure who in the association can view specific personal details in the directory:
                                    </p>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {[
                                            { key: 'organization', label: 'Current Organization / Company' },
                                            { key: 'designation', label: 'Professional Designation' },
                                            { key: 'city', label: 'City of Residence' },
                                            { key: 'linkedin', label: 'LinkedIn Profile Link' },
                                            { key: 'date_of_birth', label: 'Date of Birth' },
                                        ].map((item) => (
                                            <div key={item.key} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {item.label}
                                                </span>
                                                <select
                                                    value={privacySettings[item.key] || 'verified_members'}
                                                    onChange={(e) => setPrivacySettings({ ...privacySettings, [item.key]: e.target.value })}
                                                    className="text-xs rounded-md border p-1.5 bg-white dark:bg-slate-900 w-full sm:w-48"
                                                >
                                                    <option value="verified_members">Verified Members Only</option>
                                                    <option value="connections">Connected Peers Only</option>
                                                    <option value="private">Private (Only Me & Admin)</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-3">
                                        <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                            <Save className="size-3.5 mr-1.5" /> Save Privacy Preferences
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </MemberLayout>
    );
}
