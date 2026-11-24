import { Head, Link } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
import { AlumniSignupForm } from '@/components/auth/alumni-signup-form';
import { ArrowLeft, Lock } from 'lucide-react';

const STEPS = [
    { title: 'Sign up', text: 'Name, email and a secure password.' },
    { title: 'Your profile', text: 'College, roll number, career and contact details.' },
    { title: 'Verification', text: 'Confirmed by your college batch representative.' },
];

export default function RegisterAlumni() {
    return (
        <>
            <Head title="Apply for Membership — ccIntake97" />

            <div className="min-h-screen bg-[#F5F1E8] font-sans text-[#0B1220] antialiased selection:bg-[#C9A55C] selection:text-[#0B1220] lg:grid lg:grid-cols-[5fr_7fr]">
                <aside className="relative isolate overflow-hidden bg-[#070B14] text-[#F7F3EA] lg:sticky lg:top-0 lg:h-screen">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-48 -right-48 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.18),transparent_62%)]" />
                        <div className="absolute -bottom-56 -left-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(123,17,19,0.22),transparent_65%)]" />
                    </div>

                    <div className="flex h-full flex-col px-6 py-7 sm:px-10 lg:px-14 lg:py-12">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <BrandMark className="h-11 w-auto shrink-0" />
                                <span className="font-brand text-xl font-semibold tracking-[0.02em]">
                                    ccIntake<span className="text-[#C9A55C] [font-variant-numeric:lining-nums]">97</span>
                                </span>
                            </Link>
                            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#F7F3EA]/50 transition-colors hover:text-[#F7F3EA]">
                                <ArrowLeft className="h-3.5 w-3.5" /> Back
                            </Link>
                        </div>

                        <div className="flex flex-1 flex-col justify-center py-12 lg:py-0">
                            <p className="text-[11px] font-medium tracking-[0.28em] text-[#D9BF85] uppercase">Class of 1997</p>
                            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.04] font-medium tracking-[-0.015em] sm:text-5xl lg:text-[3.75rem]">
                                Take your place
                                <br />
                                <span className="bg-gradient-to-r from-[#F1DFB0] via-[#C9A55C] to-[#E8D5A3] bg-clip-text font-normal text-transparent">on the roll.</span>
                            </h1>
                            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#F7F3EA]/50">
                                For cadets who entered a Bangladesh Cadet College in 1997.
                            </p>

                            <ol className="mt-14 hidden max-w-sm lg:block">
                                {STEPS.map((s, i) => (
                                    <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0">
                                        {i < STEPS.length - 1 && <span className="absolute top-7 left-[11px] h-[calc(100%-1.75rem)] w-px bg-[#F7F3EA]/10" />}
                                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${i === 0 ? 'bg-[#C9A55C] text-[#0B1220]' : 'border border-[#F7F3EA]/15 text-[#F7F3EA]/45'}`}>
                                            {i + 1}
                                        </span>
                                        <div>
                                            <div className={`text-[14px] font-medium ${i === 0 ? 'text-[#F7F3EA]' : 'text-[#F7F3EA]/65'}`}>{s.title}</div>
                                            <div className="mt-0.5 text-[13px] text-[#F7F3EA]/40">{s.text}</div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <p className="hidden text-[11px] tracking-[0.3em] text-[#F7F3EA]/25 uppercase lg:block">Fidelitas et Disciplina</p>
                    </div>
                </aside>

                <main className="flex items-center justify-center px-3 py-10 sm:px-6 lg:min-h-screen lg:py-16">
                    <div className="w-full max-w-[500px]">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="font-serif text-[2.25rem] leading-tight font-medium text-[#0B1220]">Create your account</h2>
                        </div>

                        <div className="space-y-4 rounded-[1.75rem] bg-white px-4 py-6 shadow-[0_40px_80px_-48px_rgba(11,18,32,0.35)] ring-1 ring-[#0B1220]/[0.05] sm:px-5 sm:py-7">
                            <AlumniSignupForm />
                        </div>

                        <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#0B1220]/40">
                            <Lock className="h-3 w-3" />
                            Your details are private and visible only to verified batchmates.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}