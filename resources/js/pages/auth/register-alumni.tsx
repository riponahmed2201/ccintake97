import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { College, Industry } from '@/types';

interface RegisterAlumniProps {
    colleges: College[];
    industries: Industry[];
}

export default function RegisterAlumni({ colleges, industries }: RegisterAlumniProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [phone, setPhone] = useState('');
    const [collegeId, setCollegeId] = useState(colleges[0]?.id ? String(colleges[0].id) : '');
    const [collegeRollNo, setCollegeRollNo] = useState('');
    const [designation, setDesignation] = useState('');
    const [organization, setOrganization] = useState('');
    const [industryId, setIndustryId] = useState('');
    const [city, setCity] = useState('');
    const [countryCode, setCountryCode] = useState('BD');
    const [referenceName, setReferenceName] = useState('');
    const [referencePhone, setReferencePhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/register-alumni', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            phone,
            college_id: parseInt(collegeId),
            college_roll_no: collegeRollNo,
            designation,
            organization,
            industry_id: industryId ? parseInt(industryId) : null,
            city,
            country_code: countryCode,
            reference_name: referenceName,
            reference_phone: referencePhone,
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Alumni Membership Registration - INTAKE97.COM" />

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-xs font-semibold mb-4">
                    <ArrowLeft className="size-4" /> Back to Homepage
                </Link>
                <div className="size-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                    97
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
                    INTAKE 97 Alumni Membership Registration
                </h1>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Exclusively for alumni of the 1997 intake from Bangladesh Cadet Colleges.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
                <Card className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-xl p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                        {/* Section 1: Account Login */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                                1. Personal Account Credentials
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Full Name *</label>
                                    <Input
                                        required
                                        placeholder="Full Name as recorded in Cadet College"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Email Address *</label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Phone Number</label>
                                    <Input
                                        placeholder="+8801..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Password (min 8 characters) *</label>
                                    <Input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Confirm Password *</label>
                                    <Input
                                        required
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Cadet College Affiliation */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                                <GraduationCap className="size-4" />
                                2. Cadet College Affiliation (1997 Intake)
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-1">Cadet College *</label>
                                    <select
                                        required
                                        value={collegeId}
                                        onChange={(e) => setCollegeId(e.target.value)}
                                        className="w-full text-xs rounded-md border border-slate-700 bg-slate-900 p-2 text-white"
                                    >
                                        {colleges.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.short_name})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Cadet College Roll Number *</label>
                                    <Input
                                        required
                                        placeholder="e.g. 1001"
                                        value={collegeRollNo}
                                        onChange={(e) => setCollegeRollNo(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Batchmate Alumnus Reference Name</label>
                                    <Input
                                        placeholder="Name of another 1997 alumnus"
                                        value={referenceName}
                                        onChange={(e) => setReferenceName(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Batchmate Reference Phone</label>
                                    <Input
                                        placeholder="Reference phone number"
                                        value={referencePhone}
                                        onChange={(e) => setReferencePhone(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Professional Info */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                                3. Professional Profile
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-1">Current Job Title</label>
                                    <Input
                                        placeholder="e.g. Software Architect, Director"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Current Organization / Employer</label>
                                    <Input
                                        placeholder="e.g. Microsoft, Square Group"
                                        value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Industry Sector</label>
                                    <select
                                        value={industryId}
                                        onChange={(e) => setIndustryId(e.target.value)}
                                        className="w-full text-xs rounded-md border border-slate-700 bg-slate-900 p-2 text-white"
                                    >
                                        <option value="">Select industry...</option>
                                        {industries.map((ind) => (
                                            <option key={ind.id} value={ind.id}>{ind.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Current City of Residence</label>
                                    <Input
                                        placeholder="e.g. Dhaka, London, Toronto"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
                            >
                                Submit Application for Verification
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
