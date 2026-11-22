import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    GraduationCap, 
    ArrowLeft, 
    ShieldCheck, 
    CheckCircle2, 
    Lock, 
    UserCheck,
    Briefcase,
    Building2,
    Info,
    ChevronRight
} from 'lucide-react';
import type { College, Industry } from '@/types';

interface RegisterAlumniProps {
    colleges: College[];
    industries: Industry[];
}

export default function RegisterAlumni({ colleges = [], industries = [] }: RegisterAlumniProps) {
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
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
        }, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-600 selection:text-white">
            <Head title="Alumni Membership Application — INTAKE97.COM" />

            {/* Back Navigation & Brand Emblem */}
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-3">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-semibold mb-2 transition"
                >
                    <ArrowLeft className="size-3.5" /> Return to Central Association Homepage
                </Link>

                <div className="flex items-center justify-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-950 text-amber-400 font-serif font-black text-2xl flex items-center justify-center shadow-md border border-amber-500/30">
                        97
                    </div>
                </div>

                <div className="space-y-1.5 pt-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-[11px] font-semibold text-amber-900">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                        <span>CLASS OF 1997 INTAKE COHORT</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-serif">
                        Alumni Membership Application
                    </h1>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                        Exclusively reserved for alumni who entered Bangladesh Cadet Colleges in the intake of 1997. Every submission undergoes verification by designated college batch representatives.
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <Card className="bg-white border-slate-200/90 text-slate-900 shadow-xl rounded-2xl overflow-hidden">
                    {/* Top Security Banner */}
                    <div className="bg-slate-900 text-slate-200 px-6 py-3 text-xs flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-amber-400" />
                            <span className="font-medium">Encrypted & Confidential Submission</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Step 1 of 1</span>
                    </div>

                    <CardContent className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
                            
                            {/* Section 1: Account Login Credentials */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-mono">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px]">1</span>
                                        Personal & Account Credentials
                                    </h2>
                                    <span className="text-[11px] text-slate-400">* Required</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Full Name (as recorded in Cadet College) *
                                        </label>
                                        <Input
                                            required
                                            placeholder="e.g. Tariq Rahman"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Official / Primary Email Address *
                                        </label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="you@domain.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Mobile / WhatsApp Number
                                        </label>
                                        <Input
                                            placeholder="+880 1711 000000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Account Password (min 8 characters) *
                                        </label>
                                        <Input
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Confirm Password *
                                        </label>
                                        <Input
                                            required
                                            type="password"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Cadet College Affiliation & 1997 Intake Verification */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-mono">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px]">2</span>
                                        Cadet College Affiliation (1997 Intake)
                                    </h2>
                                    <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200 font-mono">
                                        BATCH OF 1997
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Participating Cadet College *
                                        </label>
                                        <select
                                            required
                                            value={collegeId}
                                            onChange={(e) => setCollegeId(e.target.value)}
                                            className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                                        >
                                            {colleges.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.short_name})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Cadet College Roll Number *
                                        </label>
                                        <Input
                                            required
                                            placeholder="e.g. 1001"
                                            value={collegeRollNo}
                                            onChange={(e) => setCollegeRollNo(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Batchmate Reference (Alumnus Name)
                                        </label>
                                        <Input
                                            placeholder="Name of a 1997 batchmate"
                                            value={referenceName}
                                            onChange={(e) => setReferenceName(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Batchmate Reference Phone / Contact
                                        </label>
                                        <Input
                                            placeholder="Reference contact number"
                                            value={referencePhone}
                                            onChange={(e) => setReferencePhone(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg bg-amber-50/60 border border-amber-200/70 p-3 text-[11px] text-amber-900 flex items-start gap-2.5">
                                    <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                                    <span>
                                        Providing a known 1997 batchmate reference accelerates application approval by your College Batch Representative.
                                    </span>
                                </div>
                            </div>

                            {/* Section 3: Professional & Geographic Profile */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-mono">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px]">3</span>
                                        Professional & Geographic Profile
                                    </h2>
                                    <span className="text-[11px] text-slate-400">Directory Profile</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Current Designation / Rank</label>
                                        <Input
                                            placeholder="e.g. Lieutenant Colonel, Director, MD"
                                            value={designation}
                                            onChange={(e) => setDesignation(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Organization / Armed Force / Enterprise</label>
                                        <Input
                                            placeholder="e.g. Bangladesh Army, Square, Google"
                                            value={organization}
                                            onChange={(e) => setOrganization(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Industry Sector</label>
                                        <select
                                            value={industryId}
                                            onChange={(e) => setIndustryId(e.target.value)}
                                            className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                                        >
                                            <option value="">Select industry sector...</option>
                                            {industries.map((ind) => (
                                                <option key={ind.id} value={ind.id}>{ind.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Current City of Residence</label>
                                        <Input
                                            placeholder="e.g. Dhaka, London, Toronto, Sydney"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-10 rounded-lg focus-visible:ring-slate-950"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Privacy & Submission Notice */}
                            <div className="pt-2 border-t border-slate-100 space-y-4">
                                <div className="text-[11px] text-slate-500 leading-relaxed">
                                    By submitting this application, you certify that you entered a participating Bangladesh Cadet College in the intake year of 1997. Your contact information is protected under the Association Privacy Charter and is not disclosed to the public.
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs py-3.5 h-12 rounded-xl shadow-md transition-all border border-amber-500/30 gap-2"
                                >
                                    <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application for 1997 Intake Verification'}</span>
                                    <ChevronRight className="h-4 w-4 text-amber-400" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Assurance */}
                <div className="text-center text-xs text-slate-400 mt-6 space-y-1">
                    <p>Already an approved member? <Link href="/login" className="text-slate-900 font-bold hover:underline">Sign In to Member Portal</Link></p>
                    <p className="text-[11px]">© {new Date().getFullYear()} INTAKE97.COM • Central Alumni Association</p>
                </div>
            </div>
        </div>
    );
}
