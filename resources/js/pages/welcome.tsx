import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { College, Event, Article, Committee, Business } from '@/types/intake97';
import { 
    GraduationCap, 
    Calendar, 
    Users, 
    Building2, 
    ShieldCheck, 
    ArrowRight, 
    MapPin, 
    Clock, 
    HeartHandshake, 
    Award, 
    ExternalLink,
    ChevronRight,
    Lock,
    Globe2,
    Briefcase,
    QrCode,
    ScrollText,
    Star,
    Compass,
    Landmark,
    BookOpen,
    Quote,
    Check,
    Tag,
    Menu,
    X,
    Mail,
    Phone,
    FileText,
    Percent,
    Sparkles,
    Send,
    Search,
    Stethoscope,
    Scale,
    Cpu,
    Coins,
    Shield,
    Activity,
    CheckCircle2,
    Filter,
    ArrowUpRight,
    Download
} from 'lucide-react';

interface WelcomeProps {
    colleges: (College & { members_count: number })[];
    events: Event[];
    articles: Article[];
    committee: Committee | null;
    businesses?: Business[];
    metrics: {
        total_members: number;
        verified_members: number;
        total_colleges: number;
        intake_year: number;
    };
}

// 12 Constituent Cadet Colleges canonical reference data from Stitch 1 & 2
const CADET_COLLEGES_DATA = [
    {
        short_name: 'FCC',
        name: 'Faujdarhat Cadet College',
        established: 1958,
        location: 'Chittagong',
        region: 'Chittagong',
        houses: 'Babur, Fazlul Huq, Rab, Qasim Houses',
        cohort: '54 Cadets',
        tagline: 'The First & Pioneer College of Bangladesh',
    },
    {
        short_name: 'JCC',
        name: 'Jhenaidah Cadet College',
        established: 1963,
        location: 'Khulna / Jhenaidah',
        region: 'Khulna/Barishal',
        houses: 'Badr, Khaybar, Hunain Houses',
        cohort: '52 Cadets',
        tagline: 'Vanguard of the South-West Plains',
    },
    {
        short_name: 'MCC',
        name: 'Mirzapur Cadet College',
        established: 1965,
        location: 'Tangail / Dhaka',
        region: 'Greater Dhaka',
        houses: 'Fazlul Huq, Suhrawardy, Nazrul, Qudrat-i-Khuda Houses',
        cohort: '54 Cadets',
        tagline: 'Collegiate Bastion of the Central Valley',
    },
    {
        short_name: 'RCC',
        name: 'Rajshahi Cadet College',
        established: 1966,
        location: 'Sarda, Rajshahi',
        region: 'Rajshahi/Rangpur',
        houses: 'Qasim, Tariq, Khalid Houses',
        cohort: '54 Cadets',
        tagline: 'Padma Riverside Fortress of Discipline',
    },
    {
        short_name: 'SCC',
        name: 'Sylhet Cadet College',
        established: 1978,
        location: 'Sylhet',
        region: 'Sylhet',
        houses: 'Surma, Kushiyara, Titumir Houses',
        cohort: '52 Cadets',
        tagline: 'Lush Hills and the Spirit of Surma',
    },
    {
        short_name: 'CCR',
        name: 'Rangpur Cadet College',
        established: 1979,
        location: 'Rangpur',
        region: 'Rajshahi/Rangpur',
        houses: 'Bir Sreshtho Mustafa, Omar, Teesta Houses',
        cohort: '54 Cadets',
        tagline: 'Northern Sentinel of Honor & Rectitude',
    },
    {
        short_name: 'BCC',
        name: 'Barishal Cadet College',
        established: 1981,
        location: 'Barishal',
        region: 'Khulna/Barishal',
        houses: 'Sher-e-Bangla, Suhrawardy, Kirtankhola Houses',
        cohort: '51 Cadets',
        tagline: 'Pride of the Southern Delta Waters',
    },
    {
        short_name: 'PCC',
        name: 'Pabna Cadet College',
        established: 1981,
        location: 'Pabna',
        region: 'Rajshahi/Rangpur',
        houses: 'Siraj-ud-Daula, Bhashani Houses',
        cohort: '54 Cadets',
        tagline: 'Heart of the North-Central Cadre',
    },
    {
        short_name: 'MGCC',
        name: "Mymensingh Girls' Cadet College",
        established: 1982,
        location: 'Mymensingh',
        region: 'Girls Colleges',
        houses: 'Begum Rokeya, Pritilata Houses',
        cohort: '52 Cadets',
        tagline: 'Pioneering Women Cadre Vanguard',
    },
    {
        short_name: 'CCC',
        name: 'Cumilla Cadet College',
        established: 1983,
        location: 'Kotbari, Cumilla',
        region: 'Chittagong',
        houses: 'Shanti, Mukti, Bijoy Houses',
        cohort: '55 Cadets',
        tagline: 'Red Hills Fortress of Valour',
    },
    {
        short_name: 'FGCC',
        name: "Feni Girls' Cadet College",
        established: 2006,
        location: 'Feni',
        region: 'Girls Colleges',
        houses: 'Sufia Kamal, Begum Fazilatunnesa Houses',
        cohort: 'Affiliate Roll',
        tagline: 'Sisterhood of Excellence & Integrity',
    },
    {
        short_name: 'JGCC',
        name: "Joypurhat Girls' Cadet College",
        established: 2006,
        location: 'Joypurhat',
        region: 'Girls Colleges',
        houses: 'Jahanara Imam, Taramon Bibi Houses',
        cohort: 'Affiliate Roll',
        tagline: 'Northern Sisterhood of Steadfast Leadership',
    },
];

// Global impact disciplines
const SECTORS = [
    {
        title: 'Armed Forces & Defense',
        count: '84 Officers & Commanders',
        icon: Shield,
        description: 'Serving as Brigadiers, Commodores, Air Commodores, and Battalion Commanders across UN Peacekeeping and National Defense commands.',
        highlight: 'Army • Navy • Air Force',
    },
    {
        title: 'Medicine & Healthcare',
        count: '96 Surgeons & Specialists',
        icon: Stethoscope,
        description: 'Fellows of the Royal Colleges (FRCS, MRCP), professors of neurosurgery, cardiology chiefs, and public health innovators globally.',
        highlight: 'UK NHS • BSMU • US Healthcare',
    },
    {
        title: 'Technology & AI Systems',
        count: '114 Engineers & Founders',
        icon: Cpu,
        description: 'Principal architects and VPs at Google, AWS, and Microsoft, alongside venture-backed founders building fintech and AI infrastructure.',
        highlight: 'Silicon Valley • Singapore • Dhaka',
    },
    {
        title: 'Foreign Service & Diplomacy',
        count: '24 Envoys & Diplomats',
        icon: Globe2,
        description: 'Career diplomats, counselors, and UN delegates representing Bangladesh in Geneva, New York, Tokyo, Canberra, and London.',
        highlight: 'Ministry of Foreign Affairs • UN',
    },
    {
        title: 'Banking & Global Capital',
        count: '86 Managing Directors',
        icon: Coins,
        description: 'Managing directors, private equity partners, and chief risk officers operating in Canary Wharf, Wall Street, and DIFC Dubai.',
        highlight: 'Wall Street • London City • DIFC',
    },
    {
        title: 'Judiciary & Corporate Law',
        count: '48 Barristers & Jurists',
        icon: Scale,
        description: 'Advocates of the Supreme Court of Bangladesh, constitutional jurists, and partners leading corporate and arbitration practices.',
        highlight: 'Supreme Court • Cross-border Law',
    },
];

// Archival timeline milestones (The Crucible & Beyond)
const TIMELINE_MILESTONES = [
    {
        year: '1997',
        title: 'The Induction & Reveille',
        tagline: 'January 1997 • 642 Adolescents Enter the Iron Gates',
        description: 'Issued box-pleated khakis, metal footlockers, and permanent roll numbers. Tempered by 0530 dawn bugle reveille, rigorous drill squares, and collegiate brotherhood.',
        badge: 'Induction',
    },
    {
        year: '1999',
        title: 'Crucible of Cross-Country & Drills',
        tagline: 'Inter-Cadet Championships & Winter Assemblies',
        description: 'Ten-mile obstacle cross-country races, firing range qualifications, inter-collegiate debates, and rigorous house rivalries that cemented unbreakable fraternal trust.',
        badge: 'Crucible',
    },
    {
        year: '2003',
        title: 'Passing Out Parade & Commissioning',
        tagline: 'BMA, BUET, Medical Colleges & Global Universities',
        description: 'The final ceremonial salute on parade squares. Cadets stepped out to the Bangladesh Military Academy, Sandhurst, BUET, Dhaka Medical, IBA, and top world institutions.',
        badge: 'Commissioning',
    },
    {
        year: '2010–2022',
        title: 'Global Leadership & Sector Rise',
        tagline: 'Ascension to Command, Boardrooms & Consultancies',
        description: 'Intake 97 alumni assume commanding ranks in defense, chief corporate offices, diplomatic missions, and surgical fellowships across 34 nations.',
        badge: 'Global Rise',
    },
    {
        year: '2027',
        title: 'Grand Reunion 30-Year Jubilee',
        tagline: 'Winter 2027 • Dhaka National Conclave',
        description: 'Celebrating 30 years since our initial muster call. The landmark gathering of 642 batchmates, families, and respected faculty members in Dhaka.',
        badge: '30th Jubilee',
    },
];

// Sample verified batchmates for directory teaser preview
const SAMPLE_VERIFIED_MEMBERS = [
    {
        name: 'Brig. Gen. K. M. Tanvir, ndc, psc',
        college: 'Jhenaidah Cadet College',
        code: 'JCC #97',
        roll: 'Cadet No. 1104',
        house: 'Badr House',
        role: 'Central Executive President',
        sector: 'Defense & Strategic Studies',
        location: 'Dhaka, Bangladesh',
        initials: 'KT',
    },
    {
        name: 'Dr. Nusrat Ahmed, FRCS',
        college: "Mymensingh Girls' Cadet College",
        code: 'MGCC #97',
        roll: 'Cadet No. 342',
        house: 'Begum Rokeya House',
        role: 'Associate Professor of Surgery',
        sector: 'Healthcare & Surgery',
        location: 'London, United Kingdom',
        initials: 'NA',
    },
    {
        name: 'Tariq Hasan, M.Sc.',
        college: 'Faujdarhat Cadet College',
        code: 'FCC #97',
        roll: 'Cadet No. 892',
        house: 'Fazlul Huq House',
        role: 'VP, Cloud Infrastructure & AI',
        sector: 'Technology & Cloud',
        location: 'Austin, Texas, USA',
        initials: 'TH',
    },
    {
        name: 'Barrister Navid Huq',
        college: 'Mirzapur Cadet College',
        code: 'MCC #97',
        roll: 'Cadet No. 721',
        house: 'Nazrul House',
        role: 'Advocate, Supreme Court of Bangladesh',
        sector: 'Judiciary & Corporate Law',
        location: 'Dhaka, Bangladesh',
        initials: 'NH',
    },
];

export default function Welcome({ colleges = [], events = [], articles = [], committee, businesses = [], metrics }: WelcomeProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [directorySearch, setDirectorySearch] = useState('');
    const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('');
    const [selectedChapterFilter, setSelectedChapterFilter] = useState('');
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

    // College list with fallback to canonical data
    const mergedColleges = useMemo(() => {
        return CADET_COLLEGES_DATA.map((canonical) => {
            const dbMatch = colleges.find(
                (c) => (c.short_name && c.short_name.toLowerCase() === canonical.short_name.toLowerCase()) ||
                       (c.name && c.name.toLowerCase().includes(canonical.short_name.toLowerCase()))
            );
            return {
                ...canonical,
                id: dbMatch?.id || canonical.short_name,
                members_count: dbMatch?.members_count ?? (parseInt(canonical.cohort, 10) || 52),
                website: dbMatch?.website || '',
                logo_path: dbMatch?.logo_path || null,
            };
        });
    }, [colleges]);

    // Filtered colleges by region tab
    const filteredColleges = useMemo(() => {
        if (selectedRegion === 'All') return mergedColleges;
        return mergedColleges.filter((c) => c.region === selectedRegion);
    }, [mergedColleges, selectedRegion]);

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactSubmitted(true);
        setTimeout(() => setContactSubmitted(false), 6000);
        setContactForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <>
            <Head title="INTAKE97.COM — National Cadet College Alumni Association | Class of 1997" />

            <div className="min-h-screen bg-white text-slate-900 selection:bg-[#7B1113] selection:text-white font-sans antialiased">
                
                {/* 1. TOP ANNOUNCEMENT & FRATERNITY TICKER */}
                <div className="bg-[#0B1528] text-slate-300 text-[11px] py-2 px-4 sm:px-8 border-b border-slate-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                            </span>
                            <span className="font-mono text-[#D4AF37] font-semibold tracking-wider uppercase text-[10px] sm:text-[11px]">
                                INTAKE OF 1997
                            </span>
                            <span className="text-slate-600 hidden sm:inline">•</span>
                            <span className="text-slate-300 font-medium hidden sm:inline">
                                Sovereign Central Alumni Association of Bangladesh Cadet Colleges
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-[10px] sm:text-[11px]">
                            <span className="hidden md:inline font-mono text-slate-400">
                                34 Global Chapters • 642 Inducted Cadets
                            </span>
                            <a href="#directory" className="text-[#D4AF37] hover:underline font-mono font-medium">
                                Roll Verification Protocol
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN HEADER NAVIGATION BAR — Matching exact iutaa.com menu */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
                        
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
                            <div className="flex h-11 w-11 items-center justify-center rounded bg-[#7B1113] text-[#F3E5AB] border border-[#D4AF37]/80 shadow-xs transition-transform group-hover:scale-105">
                                <span className="font-serif font-bold text-xl tracking-tighter">97</span>
                            </div>
                            <div>
                                <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-1.5">
                                    INTAKE97<span className="text-[#7B1113]">.COM</span>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium hidden sm:block">
                                    Cadet College Alumni Association
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation Menu Items (Option 1: Executive Sequence) */}
                        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-semibold text-slate-700 tracking-wide">
                            <a href="#about" className="hover:text-[#7B1113] transition-colors py-1">
                                About
                            </a>
                            <a href="#directory" className="hover:text-[#7B1113] transition-colors py-1">
                                Directory
                            </a>
                            <a href="#committee" className="hover:text-[#7B1113] transition-colors py-1">
                                Committee
                            </a>
                            <a href="#welfare" className="hover:text-[#7B1113] transition-colors py-1">
                                Welfare & Trust
                            </a>
                            <a href="#businesses" className="hover:text-[#7B1113] transition-colors py-1">
                                Businesses
                            </a>
                            <a href="#news" className="hover:text-[#7B1113] transition-colors py-1">
                                News
                            </a>
                            <a href="#constitution" className="hover:text-[#7B1113] transition-colors py-1">
                                Constitution
                            </a>
                            <a href="#contact" className="hover:text-[#7B1113] transition-colors py-1">
                                Contact
                            </a>
                            
                            {/* Grand Reunion 2027 Button (Featured highlighted CTA) */}
                            <a 
                                href="#reunion" 
                                className="inline-flex items-center gap-1.5 bg-[#7B1113] text-[#FFFDF8] hover:bg-[#600C0E] px-3.5 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider shadow-xs transition-all border border-[#D4AF37]/50 hover:shadow-md"
                            >
                                <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                                Grand Reunion 2027
                            </a>
                        </nav>

                        {/* User / Portal Account Section (Right Side) */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link href="/dashboard">
                                    <Button className="bg-[#0B1528] hover:bg-[#1E293B] text-white font-medium text-xs h-10 px-4 rounded border border-[#D4AF37]/40 shadow-xs gap-2">
                                        <span>Portal</span>
                                        <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-slate-800 hover:text-slate-950 hover:bg-slate-100 text-xs font-semibold px-3 h-10 rounded">
                                            Login ▾
                                        </Button>
                                    </Link>
                                    <Link href="/register-alumni">
                                        <Button className="bg-[#0B1528] hover:bg-[#1E293B] text-white font-semibold text-xs h-10 px-4 rounded border border-[#D4AF37]/40 shadow-xs hidden sm:inline-flex">
                                            Join / Register
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Hamburger Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="xl:hidden p-2 text-slate-800 hover:bg-slate-100 rounded"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Drawer Navigation (Option 1: Executive Sequence) */}
                    {mobileMenuOpen && (
                        <div className="xl:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-2 text-sm font-semibold shadow-lg">
                            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                About
                            </a>
                            <a href="#directory" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                Directory
                            </a>
                            <a href="#committee" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                Committee
                            </a>
                            <a href="#welfare" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                Welfare & Trust
                            </a>
                            <a href="#businesses" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                Businesses
                            </a>
                            <a href="#news" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                News
                            </a>
                            <a href="#constitution" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                Constitution
                            </a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800 hover:text-[#7B1113] border-b border-slate-100">
                                Contact
                            </a>
                            <a href="#reunion" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 bg-[#7B1113] text-[#FFFDF8] font-bold rounded uppercase text-xs">
                                Grand Reunion 2027
                            </a>
                            <div className="pt-2 flex gap-2">
                                <Link href="/login" className="flex-1">
                                    <Button variant="outline" className="w-full text-xs">Sign In</Button>
                                </Link>
                                <Link href="/register-alumni" className="flex-1">
                                    <Button className="w-full bg-[#0B1528] text-white text-xs">Apply for Membership</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </header>

                {/* 3. HERO SECTION (Harvard / Oxford Collegiate Grandeur) */}
                <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-100">
                    {/* Subtle Academic Watermark Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                            
                            {/* Left Column: Hero Narrative */}
                            <div className="lg:col-span-7 space-y-7 text-left">
                                <div className="inline-flex items-center gap-2.5 border-y border-[#D4AF37]/60 py-1.5 px-2 text-[11px] font-mono tracking-widest text-[#7B1113] uppercase font-semibold">
                                    <span>FOUNDED JANUARY 1997</span>
                                    <span className="text-[#D4AF37]">•</span>
                                    <span>CENTRAL CADET SECRETARIAT</span>
                                </div>

                                <div className="space-y-4">
                                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12]">
                                        Different Colleges. <br />
                                        <span className="text-[#7B1113] italic font-normal">
                                            One Intake.
                                        </span>{' '}
                                        A Lifetime of Brotherhood.
                                    </h1>
                                    <p className="text-base sm:text-lg text-slate-600 font-serif leading-relaxed max-w-2xl">
                                        In January 1997, 642 adolescents arrived at the iron gates of twelve cadet colleges across Bangladesh. Stripped of privilege, we were forged through 0530 reveilles, 10-mile obstacle courses, and drill square discipline. Twenty-seven years later, our brothers and sisters lead armed forces commands, hospitals, embassies, and global tech enterprises — bound forever by an unbreakable covenant.
                                    </p>
                                </div>

                                {/* Call to Action Buttons */}
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <Link href="/register-alumni">
                                        <Button size="lg" className="bg-[#7B1113] hover:bg-[#600C0E] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider px-7 h-12 rounded shadow-sm border border-[#D4AF37]/50 gap-2">
                                            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                                            <span>Apply for Membership</span>
                                        </Button>
                                    </Link>
                                    <a href="#directory">
                                        <Button size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs uppercase tracking-wider h-12 px-6 rounded gap-2">
                                            <Users className="h-4 w-4 text-slate-500" />
                                            <span>Explore Alumni Roll</span>
                                        </Button>
                                    </a>
                                </div>

                                {/* Quick Highlights */}
                                <div className="pt-6 border-t border-slate-200/90 grid grid-cols-3 gap-6 text-xs font-serif text-slate-600">
                                    <div>
                                        <div className="font-sans font-bold text-2xl text-slate-950">12</div>
                                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Constituent Colleges</span>
                                    </div>
                                    <div>
                                        <div className="font-sans font-bold text-2xl text-[#7B1113]">642</div>
                                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Inducted Cadets</span>
                                    </div>
                                    <div>
                                        <div className="font-sans font-bold text-2xl text-slate-950">34</div>
                                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Global Nations</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Historical Frame & Archival Credential */}
                            <div className="lg:col-span-5 flex justify-center">
                                <div className="w-full max-w-md bg-white p-6 sm:p-7 rounded border border-slate-200 shadow-xl relative">
                                    {/* Regimental Header Stamp */}
                                    <div className="border border-slate-200 p-6 space-y-5 text-center bg-slate-50/50 rounded-xs">
                                        <div className="mx-auto h-16 w-16 rounded-full border-2 border-[#D4AF37] p-1 flex items-center justify-center bg-[#0B1528] text-[#F3E5AB] shadow-sm">
                                            <span className="font-serif font-bold text-xl">97</span>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-mono tracking-widest uppercase text-[#7B1113] font-bold">
                                                Official Digital Pass
                                            </div>
                                            <h3 className="font-serif text-xl font-bold text-slate-950">
                                                Alumni Member Credential
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Class of 1997 Central Verification
                                            </p>
                                        </div>

                                        <div className="border-t border-b border-slate-200 py-3 text-left text-xs font-serif space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Intake Cohort:</span>
                                                <span className="font-bold text-slate-900 font-mono">1997 — 2003</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Central Roll ID:</span>
                                                <span className="font-bold text-slate-900 font-mono">M97-0001 to M97-0642</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Security Clearance:</span>
                                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono text-[11px]">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    VERIFIED CADRE
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Fiduciary Parity:</span>
                                                <span className="text-slate-900 font-bold">100% Audited</span>
                                            </div>
                                        </div>

                                        <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <QrCode className="h-4 w-4 text-slate-700" />
                                                <span>Encrypted QR</span>
                                            </div>
                                            <span className="text-[#7B1113] font-semibold">Strict 1997 Scoping</span>
                                        </div>
                                    </div>

                                    {/* Bottom Decorative Label */}
                                    <div className="mt-4 text-center">
                                        <p className="text-[11px] font-serif italic text-slate-500">
                                            “The mud of the obstacle course washes away; the honour of our intake endures for generations.”
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. OVERLAPPING METRICS RIBBON (Association at a Glance) */}
                <section className="bg-slate-50 border-y border-slate-200 py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7B1113] font-bold block mb-1">
                                Sovereign Fraternity Metrics
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950">
                                Association at a Glance
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-serif">
                                Rigid standards of mutual trust, global fraternity distribution, and 100% audited institutional accountability since 1997.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs hover:border-[#D4AF37] transition-colors group">
                                <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center mb-4 group-hover:bg-[#7B1113] transition-colors">
                                    <Landmark className="h-5 w-5" />
                                </div>
                                <div className="font-sans text-3xl font-bold text-slate-950">12</div>
                                <div className="font-serif text-base font-bold text-[#7B1113] mt-1">Colleges</div>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-serif">
                                    Equal sovereign parity across every participating cadet college in Bangladesh.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs hover:border-[#D4AF37] transition-colors group">
                                <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center mb-4 group-hover:bg-[#7B1113] transition-colors">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="font-sans text-3xl font-bold text-slate-950">642</div>
                                <div className="font-serif text-base font-bold text-[#7B1113] mt-1">Enrolled Cadets</div>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-serif">
                                    Verified 1997 Induction roll maintained in the Central Secretariat ledger.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs hover:border-[#D4AF37] transition-colors group">
                                <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center mb-4 group-hover:bg-[#7B1113] transition-colors">
                                    <Globe2 className="h-5 w-5" />
                                </div>
                                <div className="font-sans text-3xl font-bold text-slate-950">34</div>
                                <div className="font-serif text-base font-bold text-[#7B1113] mt-1">Nations</div>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-serif">
                                    Global alumni chapters across North America, Europe, MENA, and Australasia.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs hover:border-[#D4AF37] transition-colors group">
                                <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center mb-4 group-hover:bg-[#7B1113] transition-colors">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="font-sans text-3xl font-bold text-slate-950">100%</div>
                                <div className="font-serif text-base font-bold text-[#7B1113] mt-1">Audited Aid</div>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-serif">
                                    Every taka directed to medical lifelines and endowments is third-party audited.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs hover:border-[#D4AF37] transition-colors group">
                                <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center mb-4 group-hover:bg-[#7B1113] transition-colors">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div className="font-sans text-3xl font-bold text-slate-950">27+</div>
                                <div className="font-serif text-base font-bold text-[#7B1113] mt-1">Years of Unity</div>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-serif">
                                    Continuous fraternal alignment since the first January 1997 muster call.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. SECTION: ABOUT (#about) — Story, Colleges & Crucible Timeline */}
                <section id="about" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-20">
                        
                        {/* Part A: "Bound by a Shared Beginning" */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-6 space-y-5">
                                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                    Crucible of Character
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight leading-tight">
                                    Bound by a Shared Beginning
                                </h2>
                                <div className="space-y-4 text-slate-700 font-serif leading-relaxed text-base">
                                    <p>
                                        In January 1997, 642 adolescents arrived at the iron gates of twelve cadet colleges across Bangladesh. Stripped of individual privilege, regional dialects, and personal comfort, we were issued our box-pleated uniforms, metal chests, and roll numbers that would stay etched into our souls.
                                    </p>
                                    <p>
                                        Under the raw chill of 0530 morning reveille, the piercing echo of bugles, and agonizing 10-mile cross-country sprints, boys and girls were tempered into citizens of unyielding valor. We shared the sting of quarter-master inspections, the laughter of clandestine night preps, and the pride of leading our houses to inter-collegiate championship glory.
                                    </p>
                                    <p>
                                        Twenty-seven years later, the hair has greyed and our titles carry immense responsibility across continents. Yet within this brotherhood, we remain precisely who we were: cadets standing shoulder to shoulder, bounded by an iron oath that distance and circumstance can never dissolve.
                                    </p>
                                </div>

                                <div className="p-5 bg-slate-50 border-l-4 border-[#7B1113] rounded-xs space-y-2">
                                    <blockquote className="font-serif text-base italic text-slate-900 font-medium">
                                        “The mud of the obstacle course washes away with the rains of monsoon; the honour of our intake endures for generations.”
                                    </blockquote>
                                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                                        — Central Council Founding Charter, Intake 1997
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 relative">
                                <div className="bg-slate-900 rounded p-4 shadow-xl border border-slate-800 text-white space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                                        <span className="text-[#D4AF37]">ARCHIVAL ROLL #97-CC-01</span>
                                        <span className="text-slate-400">Class of 1997 Assembly</span>
                                    </div>

                                    {/* Archival Heritage Narrative Box */}
                                    <div className="p-6 bg-slate-950/80 rounded border border-slate-800/80 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded bg-[#7B1113] text-[#F3E5AB] flex items-center justify-center font-serif font-bold text-lg">
                                                97
                                            </div>
                                            <div>
                                                <div className="font-serif font-bold text-base text-white">The Cadre Covenant</div>
                                                <div className="text-xs font-mono text-slate-400">12 Participating Colleges • Equal Representation</div>
                                            </div>
                                        </div>

                                        <p className="font-serif text-sm text-slate-300 leading-relaxed italic">
                                            “No rank outside this room supersedes the rank of a brother who suffered the same cold morning muster on the drill square with you in 1997.”
                                        </p>

                                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                                            <div>
                                                <span className="text-slate-500 block">Induction Period</span>
                                                <span className="text-slate-200 font-semibold">January 1997</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block">Passing Out</span>
                                                <span className="text-slate-200 font-semibold">Spring 2003</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                                        <span>Certified Sovereign Ledger</span>
                                        <span className="text-emerald-400">● 642 Records Authenticated</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Part B: The 12 Constituent Cadet Colleges Network */}
                        <div className="space-y-8 pt-10 border-t border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                        The Twelve Pillars of Intake 97
                                    </span>
                                    <h3 className="font-serif text-3xl font-bold text-slate-950 mt-1">
                                        Participating Cadet Colleges Network
                                    </h3>
                                    <p className="font-serif text-sm text-slate-600 mt-1">
                                        Founded on uncompromised egalitarian parity. Each constituent college retains equal voice in the Central Secretariat.
                                    </p>
                                </div>

                                {/* Region Filter Tabs */}
                                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded text-xs font-mono">
                                    {['All', 'Greater Dhaka', 'Chittagong', 'Rajshahi/Rangpur', 'Khulna/Barishal', 'Sylhet', 'Girls Colleges'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelectedRegion(tab)}
                                            className={`px-3 py-1.5 rounded transition-all text-xs font-medium ${
                                                selectedRegion === tab
                                                    ? 'bg-[#0B1528] text-white shadow-xs'
                                                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
                                            }`}
                                        >
                                            {tab === 'All' ? 'All (12)' : tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colleges Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredColleges.map((col) => (
                                    <div 
                                        key={col.short_name} 
                                        className="p-6 bg-slate-50/70 rounded border border-slate-200 hover:border-[#D4AF37] hover:shadow-md transition-all flex flex-col justify-between group"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-semibold">
                                                    EST. {col.established}
                                                </span>
                                                <span className="font-mono text-[10px] text-[#7B1113] font-bold uppercase tracking-wider">
                                                    {col.location}
                                                </span>
                                            </div>

                                            <div>
                                                <h4 className="font-serif font-bold text-base text-slate-950 group-hover:text-[#7B1113] transition-colors">
                                                    {col.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 font-serif italic mt-0.5">
                                                    {col.tagline}
                                                </p>
                                            </div>

                                            <p className="text-[11px] text-slate-600 font-sans leading-relaxed border-t border-slate-200/60 pt-2">
                                                <span className="font-semibold text-slate-700">Houses:</span> {col.houses}
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-xs text-slate-600">
                                            <span>Intake 97 Cohort</span>
                                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {col.cohort}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Part C: The Crucible & Beyond — 27-Year Milestone Timeline */}
                        <div className="space-y-8 pt-10 border-t border-slate-100">
                            <div className="text-center max-w-2xl mx-auto">
                                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                    Our Journey Since 1997
                                </span>
                                <h3 className="font-serif text-3xl font-bold text-slate-950 mt-1">
                                    The Crucible & Beyond
                                </h3>
                                <p className="font-serif text-sm text-slate-600 mt-1">
                                    From adolescents on the obstacle course to global leaders shaping industries across six continents.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                {TIMELINE_MILESTONES.map((item, idx) => (
                                    <div 
                                        key={item.year}
                                        className="relative p-6 bg-slate-50/50 rounded border border-slate-200 hover:border-[#D4AF37] transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-mono text-xl font-bold text-[#7B1113]">
                                                    {item.year}
                                                </span>
                                                <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
                                                    {item.badge}
                                                </Badge>
                                            </div>
                                            <h4 className="font-serif font-bold text-base text-slate-950">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] font-mono text-slate-500 mt-1 uppercase tracking-tight">
                                                {item.tagline}
                                            </p>
                                            <p className="text-xs text-slate-600 font-serif leading-relaxed mt-3">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-200/60 text-[10px] font-mono text-slate-400">
                                            Step {idx + 1} of 5
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. SECTION: DIRECTORY (#directory) — Cadet Roll & Global Sectors */}
                <section id="directory" className="py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-16">
                        
                        {/* Interactive Cadet Roll Search Teaser */}
                        <div className="p-8 sm:p-10 bg-white rounded border border-slate-200 shadow-sm space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="max-w-xl space-y-2">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#7B1113] font-bold block">
                                        Cadet Roll Verification
                                    </span>
                                    <h2 className="font-serif text-3xl font-bold text-slate-950">
                                        Your Batchmates. Your Lifelong Network.
                                    </h2>
                                    <p className="font-serif text-sm text-slate-600">
                                        Access the secure directory of 642 verified brothers and sisters across all 12 cadet colleges. Filter by collegiate house, cadet roll number, sector, or global chapter.
                                    </p>
                                </div>

                                <div className="w-full lg:w-auto flex-1 max-w-lg space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <select 
                                            value={selectedCollegeFilter}
                                            onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                                            className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono focus:outline-none focus:border-slate-900"
                                        >
                                            <option value="">All Cadet Colleges (12)</option>
                                            {mergedColleges.map((c) => (
                                                <option key={c.short_name} value={c.short_name}>
                                                    {c.name} ({c.short_name})
                                                </option>
                                            ))}
                                        </select>

                                        <select 
                                            value={selectedChapterFilter}
                                            onChange={(e) => setSelectedChapterFilter(e.target.value)}
                                            className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono focus:outline-none focus:border-slate-900"
                                        >
                                            <option value="">All Global Chapters (34)</option>
                                            <option value="dhaka">Dhaka Central</option>
                                            <option value="london">London & UK</option>
                                            <option value="ny">North America (East Coast)</option>
                                            <option value="california">Silicon Valley (West Coast)</option>
                                            <option value="dubai">Gulf & MENA</option>
                                            <option value="sydney">Australia & New Zealand</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                                            <input 
                                                type="text"
                                                value={directorySearch}
                                                onChange={(e) => setDirectorySearch(e.target.value)}
                                                placeholder="Search by cadet name, roll number, or sector..."
                                                className="w-full pl-9 pr-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-slate-900"
                                            />
                                        </div>
                                        <Link href="/login">
                                            <Button className="bg-[#0B1528] hover:bg-[#1E293B] text-white text-xs font-mono uppercase tracking-wider px-4 h-9 rounded">
                                                Filter Roll
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Sample Verified Alumni Spotlight Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                                {SAMPLE_VERIFIED_MEMBERS.map((m, i) => (
                                    <div key={i} className="p-4 bg-slate-50/60 rounded border border-slate-200 flex items-center gap-3.5 hover:bg-slate-50 transition-colors">
                                        <div className="h-12 w-12 rounded-full bg-[#0B1528] text-[#F3E5AB] border border-[#D4AF37] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                                            {m.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1">
                                                <span className="font-serif font-bold text-sm text-slate-950 truncate">{m.name}</span>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-mono truncate">{m.code} • {m.house}</div>
                                            <div className="text-[10px] font-mono text-[#7B1113] truncate font-semibold mt-0.5">{m.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Privacy Protocol Notice */}
                            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded flex items-center justify-between text-xs text-amber-900">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-amber-700 shrink-0" />
                                    <span>
                                        <strong>Intake '97 Privacy Protocol:</strong> Direct contact details, phone numbers, and WhatsApp coordinates are shielded and accessible exclusively to authenticated batchmates.
                                    </span>
                                </div>
                                <Link href="/login" className="text-[#7B1113] font-bold font-mono text-xs hover:underline shrink-0 ml-4 hidden sm:block">
                                    Sign In to Access Full Roll →
                                </Link>
                            </div>
                        </div>

                        {/* Global Sector Disciplines Grid */}
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto">
                                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                    Global Impact Roll
                                </span>
                                <h3 className="font-serif text-3xl font-bold text-slate-950 mt-1">
                                    Excellence Across Global Sectors
                                </h3>
                                <p className="font-serif text-sm text-slate-600 mt-1">
                                    From command centers and surgical theaters to boardrooms and diplomatic missions worldwide.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {SECTORS.map((sec) => {
                                    const IconComponent = sec.icon;
                                    return (
                                        <div 
                                            key={sec.title}
                                            className="p-6 bg-white rounded border border-slate-200 shadow-xs hover:border-[#D4AF37] hover:shadow-md transition-all group flex flex-col justify-between"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center group-hover:bg-[#7B1113] transition-colors shrink-0">
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-serif font-bold text-base text-slate-950">
                                                            {sec.title}
                                                        </h4>
                                                        <span className="font-mono text-[10px] text-[#7B1113] font-semibold block">
                                                            {sec.count}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-600 font-serif leading-relaxed">
                                                    {sec.description}
                                                </p>
                                            </div>

                                            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-500">
                                                <span>Hubs</span>
                                                <span className="font-medium text-slate-700">{sec.highlight}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. SECTION: COMMITTEE (#committee) — Leadership & Governance */}
                <section id="committee" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                    Secretariat Stewardship
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
                                    {committee?.name || 'Central Executive Committee'}
                                </h2>
                                <p className="font-serif text-sm text-slate-600 mt-1 max-w-2xl italic">
                                    “We took an oath not merely to achieve personal eminence, but to maintain an inviolable lifeline for one another and to serve the Republic with fearless rectitude.”
                                </p>
                            </div>

                            <a href="#constitution" className="text-xs font-mono font-semibold text-[#7B1113] hover:underline flex items-center gap-1">
                                <span>View Governance Charter</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        {/* Executive Committee Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {committee?.members && committee.members.length > 0 ? (
                                committee.members.map((cm) => (
                                    <div key={cm.id} className="bg-slate-50/70 border border-slate-200 p-6 text-center rounded hover:border-[#D4AF37] hover:shadow-sm transition-all group">
                                        <div className="mx-auto h-20 w-20 rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center font-serif text-slate-800 font-bold text-xl mb-4 shadow-xs overflow-hidden">
                                            {cm.member?.user?.avatar_path ? (
                                                <img src={cm.member.user.avatar_path} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-[#0B1528]">{cm.member?.user?.name?.slice(0, 2).toUpperCase() || 'CC'}</span>
                                            )}
                                        </div>
                                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7B1113] mb-1">
                                            {cm.position_title}
                                        </div>
                                        <h3 className="font-serif font-bold text-base text-slate-950 group-hover:text-[#7B1113] transition-colors">
                                            {cm.member?.user?.name}
                                        </h3>
                                        <p className="text-xs text-slate-600 font-serif mt-1">
                                            {cm.member?.profile?.designation || cm.position_title || 'Executive Steward'}
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                                            {cm.member?.college?.short_name || 'Cadet College'} • Class of 1997
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Canonical executive stewards fallback if committee records are empty
                                [
                                    { title: 'PRESIDENT', name: 'Brig. Gen. (Retd.) K. M. Tanvir', college: 'JCC #97', role: 'Strategic Advisor & Trustee' },
                                    { title: 'GENERAL SECRETARY', name: 'Barrister Navid Huq', college: 'MCC #97', role: 'Supreme Court Appellate Division' },
                                    { title: 'TREASURER & TRUST', name: 'Kazi Farhan Ahmed, FCA', college: 'FCC #97', role: 'Partner, Institutional Audits' },
                                    { title: 'WELFARE DIRECTOR', name: 'Dr. Nusrat Ahmed, FRCS', college: 'MGCC #97', role: 'Royal College Fellow, Surgeon' },
                                ].map((sec, i) => (
                                    <div key={i} className="bg-slate-50/70 border border-slate-200 p-6 text-center rounded hover:border-[#D4AF37] hover:shadow-sm transition-all group">
                                        <div className="mx-auto h-16 w-16 rounded-full bg-[#0B1528] text-[#F3E5AB] border-2 border-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg mb-3 shadow-xs">
                                            {sec.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                                        </div>
                                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7B1113] mb-1">
                                            {sec.title}
                                        </div>
                                        <h3 className="font-serif font-bold text-base text-slate-950 group-hover:text-[#7B1113] transition-colors">
                                            {sec.name}
                                        </h3>
                                        <p className="text-xs text-slate-600 font-serif mt-0.5">
                                            {sec.role}
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                                            {sec.college} • Central Secretariat
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* 12. SECTION: OFFERS (#offers) — Sacred Welfare Trust & Perks */}
                <section id="welfare" className="py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20 relative">
                    <span id="offers" className="absolute -top-24 sr-only" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
                        
                        <div className="max-w-3xl space-y-2">
                            <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                The Sacred Covenant • Welfare & Trust
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">
                                Welfare, Endowment & Batchmate Privileges
                            </h2>
                            <p className="font-serif text-sm text-slate-600 leading-relaxed italic">
                                We leave no comrade behind. The Intake 97 Welfare Trust provides guaranteed medical lifelines, protects the educational future of fallen batchmates' children, and fosters mutual commercial privileges.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-serif">
                            <div className="bg-white p-6 border border-slate-200 rounded shadow-xs flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center">
                                        <HeartHandshake className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-slate-950">Emergency Medical Lifeline</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Guaranteed zero-friction ICU and emergency funding disbursal within 3 hours of verification anywhere across the globe.
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-mono text-[#7B1113] font-bold uppercase">
                                    BDT 42M+ Disbursed
                                </div>
                            </div>

                            <div className="bg-white p-6 border border-slate-200 rounded shadow-xs flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-slate-950">Children's Education Trust</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Full academic tuition and mentoring endowments for every child of deceased 1997 batchmates through university graduation.
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-mono text-[#7B1113] font-bold uppercase">
                                    18 Scholars Supported
                                </div>
                            </div>

                            <div className="bg-white p-6 border border-slate-200 rounded shadow-xs flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center">
                                        <Globe2 className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-slate-950">National Disaster Relief</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Rapid deployment of water filtration, medical camps, and family rehabilitation during national flood crises in Bangladesh.
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-mono text-[#7B1113] font-bold uppercase">
                                    12,000+ Families Aided
                                </div>
                            </div>

                            <div className="bg-white p-6 border border-slate-200 rounded shadow-xs flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-10 w-10 rounded bg-[#0B1528] text-[#F3E5AB] flex items-center justify-center">
                                        <Percent className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-slate-950">Batchmate Enterprise Offers</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Preferential alumni pricing on diagnostic imaging, legal retainers, cloud infrastructure, and international logistics.
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-mono text-[#7B1113] font-bold uppercase">
                                    Verified Alumni Rates
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white border border-slate-200 rounded text-center text-xs font-serif text-slate-500">
                            Have an initiative or enterprise perk to extend to batchmates?{' '}
                            <Link href="/login" className="text-[#7B1113] font-bold hover:underline font-mono">
                                Submit via Member Portal →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 9. SECTION: BUSINESSES (#businesses) — Commercial Directory */}
                <section id="businesses" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                    Alumni Enterprise Registry
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
                                    The Intake '97 Commercial Directory
                                </h2>
                                <p className="font-serif text-sm text-slate-600 mt-1 max-w-2xl italic">
                                    Supporting and partnering with verified commercial enterprises and consultancy practices founded by 1997 alumni.
                                </p>
                            </div>

                            <Link href="/login">
                                <Button variant="outline" className="text-xs font-mono uppercase tracking-wider border-slate-300">
                                    Explore All Businesses
                                </Button>
                            </Link>
                        </div>

                        {businesses.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-serif">
                                {[
                                    { title: 'Infrastructure & Construction', lead: 'Tanvir Engineering Ltd.', sector: 'Civil & Defense Contracting', city: 'Dhaka', tag: 'Infrastructure' },
                                    { title: 'Technology & Enterprise SaaS', lead: 'Apex Cloud Solutions', sector: 'Fintech & Cloud Systems', city: 'Dhaka / Austin', tag: 'Software' },
                                    { title: 'Corporate Law & Arbitration', lead: 'Huq & Associates Legal', sector: 'Cross-Border Arbitration', city: 'Dhaka / London', tag: 'Legal' },
                                    { title: 'Global Freight & Supply Chain', lead: 'TransOcean Logistics Ltd.', sector: 'Maritime Freight & Air Cargo', city: 'Chittagong / Singapore', tag: 'Logistics' },
                                ].map((b, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/60 rounded border border-slate-200 hover:border-[#D4AF37] transition flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <Badge variant="outline" className="text-[10px] font-mono uppercase border-slate-300">
                                                {b.tag}
                                            </Badge>
                                            <h3 className="font-serif font-bold text-base text-slate-950">
                                                {b.lead}
                                            </h3>
                                            <p className="text-xs text-slate-600">
                                                {b.title} • Specializing in verified alumni commercial partnerships.
                                            </p>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-200 text-xs text-slate-500 font-mono">
                                            <div>{b.sector}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{b.city}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {businesses.map((b) => (
                                    <div key={b.id} className="p-6 bg-slate-50/60 border border-slate-200 rounded flex flex-col justify-between hover:border-[#D4AF37] transition group">
                                        <div className="space-y-3">
                                            <Badge variant="outline" className="text-[10px] uppercase font-mono border-slate-300">
                                                {b.industry?.name || 'Enterprise'}
                                            </Badge>
                                            <h3 className="font-serif font-bold text-base text-slate-950 group-hover:text-[#7B1113] transition-colors">
                                                {b.name}
                                            </h3>
                                            <p className="font-serif text-xs text-slate-600 line-clamp-2">
                                                {b.description || 'Alumni-owned commercial venture.'}
                                            </p>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-serif text-slate-500">
                                            <div>Owner: <strong className="text-slate-900">{b.owner?.user?.name}</strong></div>
                                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                                {b.owner?.college?.short_name} • {b.city || 'Dhaka'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 11. SECTION: NEWS (#news) — Gazette & Archival Communiqués */}
                <section id="news" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                    The Cadet Gazette
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
                                    News & Official Announcements
                                </h2>
                                <p className="font-serif text-sm text-slate-600 mt-1 italic">
                                    Official dispatches, national honors, and batchmate milestones.
                                </p>
                            </div>

                            <Link href="/login">
                                <Button variant="outline" className="text-xs font-mono uppercase tracking-wider border-slate-300">
                                    View Gazette Archive
                                </Button>
                            </Link>
                        </div>

                        {articles.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
                                {[
                                    { title: "Central Secretariat Announces Grand Reunion 2027 Executive Committee", cat: "Official Dispatch", date: "November 2024", excerpt: "The Central Council has appointed regional coordinators to oversee the upcoming 30th Anniversary Grand Reunion scheduled in Dhaka." },
                                    { title: "Intake 97 Welfare Trust Mobilizes Rapid Relief in Eastern Flood Zones", cat: "Welfare & Relief", date: "October 2024", excerpt: "Medical supplies, clean water filtration units, and dry rations dispatched by alumni physicians to affected regions in Feni and Cumilla." },
                                    { title: "Archival Photo Preservation Project: Class of 1997 Roll Digitization", cat: "Historical Heritage", date: "September 2024", excerpt: "Over 450 historic passing-out, drill square, and inter-cadet championship photographs are now authenticated in the digital vault." },
                                ].map((art, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/60 rounded border border-slate-200 hover:border-[#D4AF37] transition flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                                <Badge className="bg-[#7B1113]/10 text-[#7B1113] border-none font-mono">
                                                    {art.cat}
                                                </Badge>
                                                <span>{art.date}</span>
                                            </div>
                                            <h3 className="font-serif font-bold text-lg text-slate-950 hover:text-[#7B1113] transition-colors">
                                                {art.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                {art.excerpt}
                                            </p>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-mono text-[#7B1113] font-bold">
                                            Read Dispatch →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
                                {articles.map((art) => (
                                    <div key={art.id} className="p-6 bg-slate-50/60 rounded border border-slate-200 hover:border-[#D4AF37] transition flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                                <Badge className="bg-[#7B1113]/10 text-[#7B1113] border-none font-mono">
                                                    {art.category?.name || 'Gazette'}
                                                </Badge>
                                                <span>{art.published_at ? new Date(art.published_at).toLocaleDateString() : 'Recent'}</span>
                                            </div>
                                            <h3 className="font-serif font-bold text-lg text-slate-950">
                                                {art.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                                {art.excerpt || art.body?.slice(0, 140)}
                                            </p>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-mono text-[#7B1113] font-bold">
                                            Read Dispatch →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 10. SECTION: CONSTITUTION (#constitution) — Sovereign Charter */}
                <section id="constitution" className="py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
                        
                        <div className="max-w-3xl space-y-2">
                            <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                Governance & Legal Charter
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">
                                The Association Constitution
                            </h2>
                            <p className="font-serif text-sm text-slate-600 leading-relaxed italic">
                                The formal legal charter and constitutional by-laws governing the 1997 intake central alumni body.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-serif">
                            <div className="bg-white p-6 border border-slate-200 rounded space-y-3 shadow-xs">
                                <div className="h-9 w-9 rounded bg-[#7B1113] text-white flex items-center justify-center font-bold text-xs font-mono">
                                    I
                                </div>
                                <h3 className="font-bold text-base text-slate-950">Name & Parity</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    The association is formally constituted as the central alumni body representing exclusively cadets of the 1997 intake with equal sovereign parity among all 12 colleges.
                                </p>
                            </div>

                            <div className="bg-white p-6 border border-slate-200 rounded space-y-3 shadow-xs">
                                <div className="h-9 w-9 rounded bg-[#0B1528] text-white flex items-center justify-center font-bold text-xs font-mono">
                                    II
                                </div>
                                <h3 className="font-bold text-base text-slate-950">Strict 1997 Scoping</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Admission criteria: verified intake roll records from participating cadet colleges, verified batchmate endorsement, and executive committee approval.
                                </p>
                            </div>

                            <div className="bg-white p-6 border border-slate-200 rounded space-y-3 shadow-xs">
                                <div className="h-9 w-9 rounded bg-[#7B1113] text-white flex items-center justify-center font-bold text-xs font-mono">
                                    III
                                </div>
                                <h3 className="font-bold text-base text-slate-950">Non-Political Mandate</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    The association is strictly non-political, non-partisan, and fraternal. Bi-annual leadership transitions ensure democratic rotation across all cadet college chapters.
                                </p>
                            </div>

                            <div className="bg-white p-6 border border-slate-200 rounded space-y-3 shadow-xs">
                                <div className="h-9 w-9 rounded bg-[#0B1528] text-white flex items-center justify-center font-bold text-xs font-mono">
                                    IV
                                </div>
                                <h3 className="font-bold text-base text-slate-950">Fiduciary Transparency</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    100% of welfare and endowment contributions are subjected to annual third-party chartered accounting audits published openly to all verified members.
                                </p>
                            </div>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 rounded flex flex-col sm:flex-row items-center justify-between text-xs font-serif gap-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#7B1113]" />
                                <span>Official Constitution & By-Laws of Intake '97 (Certified Legal PDF)</span>
                            </div>
                            <Link href="/login" className="text-[#7B1113] font-bold hover:underline font-mono inline-flex items-center gap-1">
                                <span>Download Full Legal Charter</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 6. SECTION: GRAND REUNION 2027 (#reunion) — Milestone Conclave */}
                <section id="reunion" className="py-24 bg-[#0B1528] text-white border-b border-slate-800 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            
                            <div className="lg:col-span-8 space-y-6">
                                <div className="inline-flex items-center gap-2 bg-[#7B1113] text-[#F3E5AB] border border-[#D4AF37]/50 font-mono text-[11px] uppercase tracking-wider px-3.5 py-1 rounded">
                                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                                    <span>Milestone 30th Anniversary Conclave</span>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                                        Grand Reunion 2027 • 30-Year Jubilee & National Assembly
                                    </h2>
                                    <p className="font-serif text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                                        Three decades of unbroken brotherhood, courageous public service, and global impact. Bringing together all 642 batchmates, our families, and our revered cadet college faculty members for the historic assembly in Dhaka.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-serif text-slate-300">
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block text-white font-sans uppercase text-[11px] font-mono">Assembly Venue</strong>
                                            <span>Sena Malancha / Dhaka Club / Kurmitola Golf Club</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Calendar className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block text-white font-sans uppercase text-[11px] font-mono">Date & Timing</strong>
                                            <span>Winter 2027 • Three-Day National Conclave</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <QrCode className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block text-white font-sans uppercase text-[11px] font-mono">Access Pass</strong>
                                            <span>Encrypted Digital Pass for Verified Alumni</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <div className="bg-[#1E293B] p-8 border border-slate-700 rounded shadow-2xl space-y-5">
                                    <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                                        <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                                            Reunion Registration
                                        </span>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                                            Pre-Reg Open
                                        </Badge>
                                    </div>

                                    <div>
                                        <div className="text-2xl font-bold font-serif text-white">Class of 1997 Pass</div>
                                        <p className="text-xs text-slate-400 mt-1 font-serif leading-relaxed">
                                            Includes All-Access Conclave Pass, Grand Mess Dinner, 30th Anniversary Yearbook, and Family Banquet invitation.
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-xs font-mono text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                                            <span>Exclusive to Verified 1997 Alumni</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                                            <span>Official Commemorative Medallion</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                                            <span>Spouse & Children Registration Included</span>
                                        </div>
                                    </div>

                                    <Link href="/login" className="block w-full pt-2">
                                        <Button className="w-full bg-[#7B1113] hover:bg-[#600C0E] text-white font-bold text-xs uppercase tracking-wider h-11 border border-[#D4AF37]/50 shadow-md">
                                            Reserve Reunion Seat / Pass
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 13. SECTION: CONTACT (#contact) — Central Secretariat & Chapters */}
                <section id="contact" className="py-24 bg-white border-b border-slate-200 scroll-mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Contact Coordinates */}
                            <div className="lg:col-span-5 space-y-7">
                                <div>
                                    <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#7B1113] block">
                                        Executive Secretariat
                                    </span>
                                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
                                        Contact Central Council
                                    </h2>
                                    <p className="font-serif text-sm text-slate-600 mt-2 leading-relaxed">
                                        For inquiries regarding membership roll verification, reunion reservations, endowment submissions, or global chapter affiliations:
                                    </p>
                                </div>

                                <div className="space-y-5 text-xs font-serif text-slate-700">
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-9 w-9 rounded bg-[#7B1113]/10 text-[#7B1113] flex items-center justify-center shrink-0">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <strong className="block text-slate-900 font-sans uppercase text-[11px] font-mono">Secretariat Address</strong>
                                            <span>Central Alumni Secretariat, Gulshan-2 / Mohakhali DOHS, Dhaka, Bangladesh</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5">
                                        <div className="h-9 w-9 rounded bg-[#7B1113]/10 text-[#7B1113] flex items-center justify-center shrink-0">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <strong className="block text-slate-900 font-sans uppercase text-[11px] font-mono">Official Email</strong>
                                            <a href="mailto:secretariat@intake97.com" className="hover:underline text-[#7B1113] font-medium">
                                                secretariat@intake97.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5">
                                        <div className="h-9 w-9 rounded bg-[#7B1113]/10 text-[#7B1113] flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <strong className="block text-slate-900 font-sans uppercase text-[11px] font-mono">Helpline (Direct Batch Line)</strong>
                                            <span>+880 1711 000097 • Sunday — Thursday (10:00 AM — 6:00 PM BST)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Global Chapter Liaison Desks */}
                                <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs font-mono space-y-2">
                                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                                        Regional Liaison Desks
                                    </span>
                                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                                        <div>• North America: <strong>New York / DC</strong></div>
                                        <div>• United Kingdom: <strong>London</strong></div>
                                        <div>• Middle East: <strong>Dubai / Riyadh</strong></div>
                                        <div>• Australasia: <strong>Sydney / Melbourne</strong></div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-7">
                                <div className="bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded shadow-xs">
                                    <h3 className="font-serif font-bold text-xl text-slate-950 mb-2">
                                        Submit a Message to the Secretariat
                                    </h3>
                                    <p className="text-xs text-slate-500 font-serif mb-6">
                                        Official communications receive priority response from the General Secretary desk.
                                    </p>

                                    {contactSubmitted ? (
                                        <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded space-y-1">
                                            <div className="font-bold text-sm">Message Transmitted Successfully</div>
                                            <div>Your dispatch has been delivered to the Central Secretariat. A response will follow within 24 hours.</div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={contactForm.name}
                                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                        placeholder="Cadet Name"
                                                        className="w-full bg-white border border-slate-300 p-2.5 rounded focus:outline-none focus:border-slate-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="font-semibold text-slate-700 block mb-1">Your Email Address *</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        value={contactForm.email}
                                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                        placeholder="cadet@domain.com"
                                                        className="w-full bg-white border border-slate-300 p-2.5 rounded focus:outline-none focus:border-slate-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="font-semibold text-slate-700 block mb-1">Subject / Matter *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={contactForm.subject}
                                                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                                    placeholder="Regarding membership verification / reunion pass / general inquiry"
                                                    className="w-full bg-white border border-slate-300 p-2.5 rounded focus:outline-none focus:border-slate-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="font-semibold text-slate-700 block mb-1">Message Content *</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                    placeholder="Enter details of your inquiry or communication..."
                                                    className="w-full bg-white border border-slate-300 p-2.5 rounded focus:outline-none focus:border-slate-900"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="bg-[#0B1528] hover:bg-[#1E293B] text-white text-xs font-mono uppercase tracking-wider h-11 px-6 rounded gap-2"
                                            >
                                                <Send className="h-3.5 w-3.5 text-[#D4AF37]" />
                                                <span>Transmit Message</span>
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 14. FOOTER (Collegiate & University Standard) */}
                <footer className="bg-[#0B1528] text-slate-400 py-16 text-xs font-serif border-t border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                            <div className="space-y-4 md:col-span-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#7B1113] text-[#F3E5AB] font-serif font-bold text-lg border border-[#D4AF37]">
                                        97
                                    </div>
                                    <div>
                                        <div className="font-serif text-base font-bold text-white">INTAKE97.COM</div>
                                        <div className="text-[9px] font-mono tracking-widest uppercase text-slate-400">
                                            National Cadet College Alumni Association
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                                    The official central alumni association exclusively uniting the 642 cadet officers, doctors, engineers, diplomats, and leaders who entered Bangladesh Cadet Colleges in the intake of 1997.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-sans font-bold text-white text-[11px] uppercase tracking-wider mb-3 font-mono">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2 text-xs">
                                    <li><a href="#about" className="hover:text-white transition">About</a></li>
                                    <li><a href="#directory" className="hover:text-white transition">Directory</a></li>
                                    <li><a href="#committee" className="hover:text-white transition">Committee</a></li>
                                    <li><a href="#welfare" className="hover:text-white transition">Welfare & Trust</a></li>
                                    <li><a href="#businesses" className="hover:text-white transition">Businesses</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-sans font-bold text-white text-[11px] uppercase tracking-wider mb-3 font-mono">
                                    Activities
                                </h4>
                                <ul className="space-y-2 text-xs">
                                    <li><a href="#news" className="hover:text-white transition">News & Gazette</a></li>
                                    <li><a href="#constitution" className="hover:text-white transition">Constitution</a></li>
                                    <li><a href="#reunion" className="hover:text-white transition">Grand Reunion 2027</a></li>
                                    <li><a href="#contact" className="hover:text-white transition">Contact Secretariat</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-sans font-bold text-white text-[11px] uppercase tracking-wider mb-3 font-mono">
                                    Portal Access
                                </h4>
                                <ul className="space-y-2 text-xs">
                                    <li><Link href="/login" className="hover:text-white transition">Member Login</Link></li>
                                    <li><Link href="/register-alumni" className="hover:text-white transition">Apply for Membership</Link></li>
                                    <li><Link href="/login" className="hover:text-white transition">Admin Panel</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-mono gap-4">
                            <div>© {new Date().getFullYear()} INTAKE97.COM • All rights reserved.</div>
                            <div>FIDELITAS ET DISCIPLINA • CLASS OF 1997</div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
