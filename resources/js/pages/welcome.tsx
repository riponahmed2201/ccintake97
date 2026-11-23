import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import type { College, Event, Article, Committee, Business } from '@/types/intake97';
import {
    ArrowRight,
    ArrowUpRight,
    Calendar,
    Check,
    Coins,
    Cpu,
    FileText,
    Globe2,
    GraduationCap,
    HeartHandshake,
    Lock,
    Mail,
    MapPin,
    Menu,
    Percent,
    Phone,
    QrCode,
    Scale,
    Search,
    Shield,
    ShieldCheck,
    Stethoscope,
    X,
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

/* -------------------------------------------------------------------------- */
/*  Reference data                                                            */
/* -------------------------------------------------------------------------- */

const CADET_COLLEGES_DATA = [
    { short_name: 'FCC', name: 'Faujdarhat Cadet College', established: 1958, location: 'Chittagong', region: 'Chittagong', houses: 'Babur, Fazlul Huq, Rab, Qasim Houses', cohort: '54 Cadets', tagline: 'The First & Pioneer College of Bangladesh' },
    { short_name: 'JCC', name: 'Jhenaidah Cadet College', established: 1963, location: 'Khulna / Jhenaidah', region: 'Khulna/Barishal', houses: 'Badr, Khaybar, Hunain Houses', cohort: '52 Cadets', tagline: 'Vanguard of the South-West Plains' },
    { short_name: 'MCC', name: 'Mirzapur Cadet College', established: 1965, location: 'Tangail / Dhaka', region: 'Greater Dhaka', houses: 'Fazlul Huq, Suhrawardy, Nazrul, Qudrat-i-Khuda Houses', cohort: '54 Cadets', tagline: 'Collegiate Bastion of the Central Valley' },
    { short_name: 'RCC', name: 'Rajshahi Cadet College', established: 1966, location: 'Sarda, Rajshahi', region: 'Rajshahi/Rangpur', houses: 'Qasim, Tariq, Khalid Houses', cohort: '54 Cadets', tagline: 'Padma Riverside Fortress of Discipline' },
    { short_name: 'SCC', name: 'Sylhet Cadet College', established: 1978, location: 'Sylhet', region: 'Sylhet', houses: 'Surma, Kushiyara, Titumir Houses', cohort: '52 Cadets', tagline: 'Lush Hills and the Spirit of Surma' },
    { short_name: 'CCR', name: 'Rangpur Cadet College', established: 1979, location: 'Rangpur', region: 'Rajshahi/Rangpur', houses: 'Bir Sreshtho Mustafa, Omar, Teesta Houses', cohort: '54 Cadets', tagline: 'Northern Sentinel of Honor & Rectitude' },
    { short_name: 'BCC', name: 'Barishal Cadet College', established: 1981, location: 'Barishal', region: 'Khulna/Barishal', houses: 'Sher-e-Bangla, Suhrawardy, Kirtankhola Houses', cohort: '51 Cadets', tagline: 'Pride of the Southern Delta Waters' },
    { short_name: 'PCC', name: 'Pabna Cadet College', established: 1981, location: 'Pabna', region: 'Rajshahi/Rangpur', houses: 'Siraj-ud-Daula, Bhashani Houses', cohort: '54 Cadets', tagline: 'Heart of the North-Central Cadre' },
    { short_name: 'MGCC', name: "Mymensingh Girls' Cadet College", established: 1982, location: 'Mymensingh', region: 'Girls Colleges', houses: 'Begum Rokeya, Pritilata Houses', cohort: '52 Cadets', tagline: 'Pioneering Women Cadre Vanguard' },
    { short_name: 'CCC', name: 'Cumilla Cadet College', established: 1983, location: 'Kotbari, Cumilla', region: 'Chittagong', houses: 'Shanti, Mukti, Bijoy Houses', cohort: '55 Cadets', tagline: 'Red Hills Fortress of Valour' },
];

const REGIONS = ['All', 'Greater Dhaka', 'Chittagong', 'Rajshahi/Rangpur', 'Khulna/Barishal', 'Sylhet', 'Girls Colleges'];

const SECTORS = [
    { title: 'Armed Forces & Defense', count: '84', unit: 'Officers & Commanders', icon: Shield, description: 'Brigadiers, Commodores, Air Commodores and Battalion Commanders across UN Peacekeeping and national defense commands.', highlight: 'Army · Navy · Air Force' },
    { title: 'Medicine & Healthcare', count: '96', unit: 'Surgeons & Specialists', icon: Stethoscope, description: 'Fellows of the Royal Colleges, professors of neurosurgery, cardiology chiefs and public-health innovators worldwide.', highlight: 'UK NHS · BSMU · US Healthcare' },
    { title: 'Technology & AI', count: '114', unit: 'Engineers & Founders', icon: Cpu, description: 'Principal architects and VPs at global technology firms, alongside venture-backed founders building fintech and AI infrastructure.', highlight: 'Silicon Valley · Singapore · Dhaka' },
    { title: 'Foreign Service & Diplomacy', count: '24', unit: 'Envoys & Diplomats', icon: Globe2, description: 'Career diplomats, counsellors and UN delegates representing Bangladesh in Geneva, New York, Tokyo, Canberra and London.', highlight: 'Foreign Affairs · United Nations' },
    { title: 'Banking & Global Capital', count: '86', unit: 'Managing Directors', icon: Coins, description: 'Managing directors, private-equity partners and chief risk officers in Canary Wharf, Wall Street and DIFC Dubai.', highlight: 'Wall Street · London · DIFC' },
    { title: 'Judiciary & Corporate Law', count: '48', unit: 'Barristers & Jurists', icon: Scale, description: 'Advocates of the Supreme Court, constitutional jurists and partners leading corporate and arbitration practices.', highlight: 'Supreme Court · Cross-border Law' },
];

const TIMELINE_MILESTONES = [
    { year: '1997', title: 'Induction & Reveille', tagline: 'January 1997', description: '642 adolescents pass through the iron gates — issued khakis, footlockers and roll numbers that would stay with them for life.' },
    { year: '1999', title: 'The Crucible', tagline: 'Inter-Cadet Championships', description: 'Ten-mile cross-country, firing ranges, debates and fierce house rivalries cement an unbreakable fraternal trust.' },
    { year: '2003', title: 'Passing Out', tagline: 'Commissioning & Universities', description: 'The final salute. Cadets step out to BMA, Sandhurst, BUET, Dhaka Medical, IBA and leading universities abroad.' },
    { year: '2010–22', title: 'Global Ascent', tagline: 'Command, Boardrooms, Embassies', description: 'Alumni rise to command ranks, chief executive offices, diplomatic missions and surgical fellowships across 34 nations.' },
    { year: '2027', title: 'The 30-Year Jubilee', tagline: 'Winter 2027 · Dhaka', description: 'Thirty years since the first muster call — the landmark gathering of batchmates, families and revered faculty.' },
];

const SAMPLE_VERIFIED_MEMBERS = [
    { name: 'Brig. Gen. K. M. Tanvir', post: 'ndc, psc', code: 'JCC ’97', role: 'Central Executive President', location: 'Dhaka', initials: 'KT' },
    { name: 'Dr. Nusrat Ahmed', post: 'FRCS', code: 'MGCC ’97', role: 'Associate Professor of Surgery', location: 'London', initials: 'NA' },
    { name: 'Tariq Hasan', post: 'M.Sc.', code: 'FCC ’97', role: 'VP, Cloud Infrastructure & AI', location: 'Austin, TX', initials: 'TH' },
    { name: 'Barrister Navid Huq', post: '', code: 'MCC ’97', role: 'Advocate, Supreme Court', location: 'Dhaka', initials: 'NH' },
];

const FALLBACK_COMMITTEE = [
    { title: 'President', name: 'Brig. Gen. (Retd.) K. M. Tanvir', college: 'JCC ’97', role: 'Strategic Advisor & Trustee' },
    { title: 'General Secretary', name: 'Barrister Navid Huq', college: 'MCC ’97', role: 'Supreme Court Appellate Division' },
    { title: 'Treasurer & Trust', name: 'Kazi Farhan Ahmed, FCA', college: 'FCC ’97', role: 'Partner, Institutional Audits' },
    { title: 'Welfare Director', name: 'Dr. Nusrat Ahmed, FRCS', college: 'MGCC ’97', role: 'Royal College Fellow, Surgeon' },
];

const WELFARE_PILLARS = [
    { icon: HeartHandshake, figure: '৳42M+', label: 'Disbursed', title: 'Emergency Medical Lifeline', description: 'Zero-friction ICU and emergency funding, released within three hours of verification — anywhere in the world.' },
    { icon: GraduationCap, figure: '18', label: 'Scholars', title: "Children's Education Trust", description: 'Full tuition and mentorship for every child of a fallen batchmate, through to university graduation.' },
    { icon: Globe2, figure: '12,000+', label: 'Families', title: 'National Disaster Relief', description: 'Rapid deployment of water filtration, medical camps and rehabilitation during national flood crises.' },
    { icon: Percent, figure: 'Alumni', label: 'Rates', title: 'Batchmate Enterprise Offers', description: 'Preferential pricing on diagnostics, legal retainers, cloud infrastructure and international logistics.' },
];

const FALLBACK_BUSINESSES = [
    { tag: 'Infrastructure', lead: 'Tanvir Engineering Ltd.', sector: 'Civil & Defense Contracting', city: 'Dhaka' },
    { tag: 'Software', lead: 'Apex Cloud Solutions', sector: 'Fintech & Cloud Systems', city: 'Dhaka · Austin' },
    { tag: 'Legal', lead: 'Huq & Associates', sector: 'Cross-Border Arbitration', city: 'Dhaka · London' },
    { tag: 'Logistics', lead: 'TransOcean Logistics Ltd.', sector: 'Maritime Freight & Air Cargo', city: 'Chittagong · Singapore' },
];

const FALLBACK_ARTICLES = [
    { title: 'Central Secretariat announces the Grand Reunion 2027 Executive Committee', cat: 'Official Dispatch', date: 'November 2024', excerpt: 'Regional coordinators appointed to oversee the 30th Anniversary Grand Reunion in Dhaka.' },
    { title: 'Welfare Trust mobilises rapid relief across the eastern flood zones', cat: 'Welfare & Relief', date: 'October 2024', excerpt: 'Medical supplies, water filtration units and rations dispatched by alumni physicians to Feni and Cumilla.' },
    { title: 'Archival photo preservation: the Class of 1997 roll is digitised', cat: 'Heritage', date: 'September 2024', excerpt: 'Over 450 passing-out, drill-square and championship photographs now authenticated in the digital vault.' },
];

const CHARTER_ARTICLES = [
    { numeral: 'I', title: 'Name & Parity', text: 'Constituted as the central body representing exclusively the 1997 intake, with equal sovereign parity among all ten colleges.' },
    { numeral: 'II', title: 'Strict 1997 Scoping', text: 'Admission by verified intake roll records, batchmate endorsement and executive committee approval.' },
    { numeral: 'III', title: 'Non-Political Mandate', text: 'Strictly non-political and fraternal. Bi-annual leadership rotation across every college chapter.' },
    { numeral: 'IV', title: 'Fiduciary Transparency', text: 'Every welfare and endowment contribution is audited annually by chartered accountants and published to members.' },
];

const NAV_LINKS = [
    { href: '#about', label: 'About' },
    { href: '#directory', label: 'Directory' },
    { href: '#committee', label: 'Committee' },
    { href: '#welfare', label: 'Welfare' },
    { href: '#businesses', label: 'Businesses' },
    { href: '#news', label: 'News' },
    { href: '#constitution', label: 'Charter' },
    { href: '#contact', label: 'Contact' },
];

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
}

function Eyebrow({ index, children, light = false }: { index?: string; children: React.ReactNode; light?: boolean }) {
    return (
        <div className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] ${light ? 'text-[#D9BF85]' : 'text-[#9A7B3F]'}`}>
            {index && <span className="font-serif text-sm italic tracking-normal normal-case">{index}</span>}
            <span className={`h-px w-8 ${light ? 'bg-[#D9BF85]/50' : 'bg-[#9A7B3F]/50'}`} />
            <span>{children}</span>
        </div>
    );
}

function SectionHeading({ index, eyebrow, title, intro, light = false, align = 'left', action }: {
    index?: string;
    eyebrow: string;
    title: React.ReactNode;
    intro?: string;
    light?: boolean;
    align?: 'left' | 'center';
    action?: React.ReactNode;
}) {
    const centered = align === 'center';
    return (
        <Reveal className={`flex flex-col gap-8 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
            <div className={`max-w-3xl space-y-5 ${centered ? 'flex flex-col items-center' : ''}`}>
                <Eyebrow index={index} light={light}>{eyebrow}</Eyebrow>
                <h2 className={`font-serif text-4xl leading-[1.05] font-medium tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem] ${light ? 'text-[#F7F3EA]' : 'text-[#0B1220]'}`}>
                    {title}
                </h2>
                {intro && (
                    <p className={`max-w-2xl text-[15px] leading-relaxed sm:text-base ${light ? 'text-[#F7F3EA]/60' : 'text-[#4A4F5C]'}`}>
                        {intro}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </Reveal>
    );
}

function GhostLink({ href, children, light = false, internal = false }: { href: string; children: React.ReactNode; light?: boolean; internal?: boolean }) {
    const cls = `group inline-flex items-center gap-2 border-b pb-1 text-[13px] font-medium tracking-wide transition-colors ${
        light ? 'border-[#D9BF85]/40 text-[#F7F3EA] hover:border-[#D9BF85]' : 'border-[#0B1220]/20 text-[#0B1220] hover:border-[#9A7B3F]'
    }`;
    const inner = (
        <>
            {children}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
    );
    return internal ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

function Crest({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F1DFB0" />
                    <stop offset="50%" stopColor="#C9A55C" />
                    <stop offset="100%" stopColor="#8C6A2E" />
                </linearGradient>
                <path id="crestTextTop" d="M 70 200 A 130 130 0 0 1 330 200" />
                <path id="crestTextBottom" d="M 62 200 A 138 138 0 0 0 338 200" />
            </defs>
            <circle cx="200" cy="200" r="190" fill="none" stroke="url(#crestGold)" strokeWidth="0.75" opacity="0.5" />
            <circle cx="200" cy="200" r="168" fill="none" stroke="url(#crestGold)" strokeWidth="1.25" />
            <circle cx="200" cy="200" r="108" fill="none" stroke="url(#crestGold)" strokeWidth="0.75" opacity="0.7" />
            {Array.from({ length: 72 }).map((_, i) => {
                const a = (i * 5 * Math.PI) / 180;
                const r1 = 172;
                const r2 = i % 6 === 0 ? 184 : 178;
                return (
                    <line key={i} x1={200 + r1 * Math.cos(a)} y1={200 + r1 * Math.sin(a)} x2={200 + r2 * Math.cos(a)} y2={200 + r2 * Math.sin(a)} stroke="#C9A55C" strokeWidth="0.75" opacity="0.55" />
                );
            })}
            <text fill="#D9BF85" fontSize="13" letterSpacing="6" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500">
                <textPath href="#crestTextTop" startOffset="50%" textAnchor="middle">FIDELITAS · ET · DISCIPLINA</textPath>
            </text>
            <text fill="#D9BF85" fontSize="12" letterSpacing="6" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500" dominantBaseline="hanging">
                <textPath href="#crestTextBottom" startOffset="50%" textAnchor="middle">TEN COLLEGES · ONE INTAKE</textPath>
            </text>
        </svg>
    );
}

function CollegeEmblem({ logo, code, name, size = 88 }: { logo?: string | null; code: string; name: string; size?: number }) {
    const [failed, setFailed] = useState(false);
    const showLogo = !!logo && !failed;
    const inset = Math.round(size * 0.1);
    const fontSize = Math.round(size * (code.length > 3 ? 0.2 : 0.26));
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:rotate-[30deg]" aria-hidden="true">
                <circle cx="50" cy="50" r="48.5" fill="none" stroke="#C9A55C" strokeWidth="0.6" opacity="0.55" />
                {Array.from({ length: 48 }).map((_, i) => {
                    const a = (i * 7.5 * Math.PI) / 180;
                    const r2 = i % 4 === 0 ? 44 : 45.5;
                    return <line key={i} x1={50 + 47 * Math.cos(a)} y1={50 + 47 * Math.sin(a)} x2={50 + r2 * Math.cos(a)} y2={50 + r2 * Math.sin(a)} stroke="#C9A55C" strokeWidth="0.6" opacity="0.6" />;
                })}
            </svg>
            <div
                style={{ inset }}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full ring-1 ring-[#C9A55C]/50 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] ${
                    showLogo ? 'bg-white' : 'bg-gradient-to-br from-[#1E2A42] via-[#0E1628] to-[#070B14]'
                }`}
            >
                {showLogo ? (
                    <img src={logo!} alt={`${name} crest`} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain p-[8%]" />
                ) : (
                    <span style={{ fontSize }} className="bg-gradient-to-b from-[#F1DFB0] to-[#B8924A] bg-clip-text font-serif leading-none font-medium text-transparent">
                        {code}
                    </span>
                )}
            </div>
        </div>
    );
}

const initialsOf = (name?: string) =>
    (name || '')
        .replace(/^(Brig\.|Gen\.|Dr\.|Barrister|\(Retd\.\))\s*/g, '')
        .split(' ')
        .filter((n) => /^[A-Za-z]/.test(n) && !n.includes('.'))
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'CC';

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Welcome({ colleges = [], articles = [], committee, businesses = [] }: WelcomeProps) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [activeCollegeCode, setActiveCollegeCode] = useState(CADET_COLLEGES_DATA[0].short_name);
    const featureRef = useRef<HTMLDivElement>(null);
    const [directorySearch, setDirectorySearch] = useState('');
    const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('');
    const [selectedChapterFilter, setSelectedChapterFilter] = useState('');
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const mergedColleges = useMemo(() => {
        return CADET_COLLEGES_DATA.map((canonical) => {
            const dbMatch = colleges.find(
                (c) =>
                    (c.short_name && c.short_name.toLowerCase() === canonical.short_name.toLowerCase()) ||
                    (c.name && c.name.toLowerCase().includes(canonical.short_name.toLowerCase())),
            );
            return {
                ...canonical,
                id: dbMatch?.id || canonical.short_name,
                members_count: dbMatch?.members_count ?? (parseInt(canonical.cohort, 10) || 52),
                website: dbMatch?.website || '',
                logo_url: dbMatch?.logo_url || null,
            };
        });
    }, [colleges]);

    const filteredColleges = useMemo(() => {
        if (selectedRegion === 'All') return mergedColleges;
        return mergedColleges.filter((c) => c.region === selectedRegion);
    }, [mergedColleges, selectedRegion]);

    const activeCollege = filteredColleges.find((c) => c.short_name === activeCollegeCode) ?? filteredColleges[0];
    const activeIndex = filteredColleges.indexOf(activeCollege);

    const selectCollege = (code: string, scroll = false) => {
        setActiveCollegeCode(code);
        if (scroll && window.innerWidth < 1024) {
            featureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const stepCollege = (dir: 1 | -1) => {
        const next = filteredColleges[(activeIndex + dir + filteredColleges.length) % filteredColleges.length];
        if (next) setActiveCollegeCode(next.short_name);
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactSubmitted(true);
        setTimeout(() => setContactSubmitted(false), 6000);
        setContactForm({ name: '', email: '', subject: '', message: '' });
    };

    const solidHeader = scrolled || mobileMenuOpen;

    const inputCls =
        'w-full border-0 border-b border-[#0B1220]/15 bg-transparent px-0 py-3 text-[15px] text-[#0B1220] placeholder:text-[#0B1220]/35 focus:border-[#9A7B3F] focus:outline-none focus:ring-0 transition-colors';
    const labelCls = 'block text-[11px] font-medium uppercase tracking-[0.2em] text-[#0B1220]/50';

    return (
        <>
            <Head title="INTAKE97 — Cadet College Alumni Association · Class of 1997" />

            <div className="min-h-screen bg-[#FAF7F0] font-sans text-[#0B1220] antialiased selection:bg-[#C9A55C] selection:text-[#0B1220]">
                {/* ================================================================ */}
                {/* HEADER                                                           */}
                {/* ================================================================ */}
                <header
                    className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                        solidHeader
                            ? 'border-b border-[#0B1220]/[0.06] bg-[#FAF7F0]/85 shadow-[0_1px_30px_-12px_rgba(11,18,32,0.18)] backdrop-blur-xl'
                            : 'border-b border-transparent bg-transparent'
                    }`}
                >
                    <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Link href="/" className="group flex shrink-0 items-center gap-3">
                            <span className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 ${solidHeader ? 'border-[#9A7B3F]/60 bg-[#0B1220]' : 'border-[#D9BF85]/50 bg-white/5'}`}>
                                <span className="font-serif text-lg leading-none font-medium text-[#E8D5A3]">97</span>
                            </span>
                            <span className="leading-tight">
                                <span className={`block font-serif text-[22px] font-medium tracking-[0.02em] transition-colors duration-500 ${solidHeader ? 'text-[#0B1220]' : 'text-[#F7F3EA]'}`}>
                                    Intake<span className="text-[#C9A55C]">97</span>
                                </span>
                                <span className={`hidden text-[9.5px] font-medium uppercase tracking-[0.3em] transition-colors duration-500 sm:block ${solidHeader ? 'text-[#0B1220]/45' : 'text-[#F7F3EA]/45'}`}>
                                    Cadet College Alumni
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-8 xl:flex">
                            {NAV_LINKS.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className={`relative text-[13px] font-medium tracking-wide transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#C9A55C] after:transition-all after:duration-300 hover:after:w-full ${
                                        solidHeader ? 'text-[#0B1220]/70 hover:text-[#0B1220]' : 'text-[#F7F3EA]/70 hover:text-[#F7F3EA]'
                                    }`}
                                >
                                    {l.label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <a
                                href="#reunion"
                                className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium tracking-wide transition-all duration-300 lg:inline-flex ${
                                    solidHeader ? 'border-[#9A7B3F]/40 text-[#7A5E28] hover:bg-[#9A7B3F]/10' : 'border-[#D9BF85]/40 text-[#E8D5A3] hover:bg-white/5'
                                }`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A55C]" />
                                Reunion 2027
                            </a>
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${solidHeader ? 'bg-[#0B1220] text-[#F7F3EA] hover:bg-[#1A2438]' : 'bg-[#F7F3EA] text-[#0B1220] hover:bg-white'}`}
                                >
                                    Member Portal <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className={`hidden px-3 py-2 text-[13px] font-medium transition-colors sm:inline-block ${solidHeader ? 'text-[#0B1220]/75 hover:text-[#0B1220]' : 'text-[#F7F3EA]/75 hover:text-[#F7F3EA]'}`}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/register-alumni"
                                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${solidHeader ? 'bg-[#0B1220] text-[#F7F3EA] hover:bg-[#1A2438]' : 'bg-[#F7F3EA] text-[#0B1220] hover:bg-white'}`}
                                    >
                                        Join
                                    </Link>
                                </>
                            )}
                            <button
                                type="button"
                                aria-label="Toggle menu"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`rounded-full p-2 transition-colors xl:hidden ${solidHeader ? 'text-[#0B1220] hover:bg-[#0B1220]/5' : 'text-[#F7F3EA] hover:bg-white/10'}`}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-t border-[#0B1220]/[0.06] bg-[#FAF7F0] px-5 pt-2 pb-6 xl:hidden">
                            {NAV_LINKS.map((l) => (
                                <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-[#0B1220]/[0.06] py-3.5 font-serif text-xl text-[#0B1220]">
                                    {l.label}
                                    <ArrowRight className="h-4 w-4 text-[#9A7B3F]" />
                                </a>
                            ))}
                            <a href="#reunion" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 font-serif text-xl text-[#7A5E28]">
                                Grand Reunion 2027
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <Link href="/login" className="rounded-full border border-[#0B1220]/15 py-3 text-center text-sm font-medium">Sign in</Link>
                                <Link href="/register-alumni" className="rounded-full bg-[#0B1220] py-3 text-center text-sm font-medium text-[#F7F3EA]">Apply</Link>
                            </div>
                        </div>
                    )}
                </header>

                {/* ================================================================ */}
                {/* HERO                                                             */}
                {/* ================================================================ */}
                <section className="relative isolate overflow-hidden bg-[#070B14] text-[#F7F3EA]">
                    {/* Atmosphere */}
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-40 right-[-10%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.20),transparent_62%)]" />
                        <div className="absolute bottom-[-30%] left-[-15%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(123,17,19,0.28),transparent_65%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(247,243,234,0.035)_1px,transparent_1px)] bg-[size:120px_100%]" />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#070B14]" />
                    </div>

                    <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-16 px-5 pt-36 pb-20 sm:px-8 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pt-32 lg:pb-28">
                        <div className="lg:col-span-7">
                            <Reveal>
                                <Eyebrow light>Est. January 1997 · Bangladesh</Eyebrow>
                            </Reveal>
                            <Reveal delay={100}>
                                <h1 className="mt-8 font-serif text-[3.25rem] leading-[0.98] font-medium tracking-[-0.02em] sm:text-7xl lg:text-[5.75rem]">
                                    Different colleges.
                                    <br />
                                    <span className="bg-gradient-to-r from-[#F1DFB0] via-[#C9A55C] to-[#E8D5A3] bg-clip-text font-normal text-transparent italic">One intake.</span>
                                    <br />
                                    A lifetime of brotherhood.
                                </h1>
                            </Reveal>
                            <Reveal delay={200}>
                                <p className="mt-8 max-w-xl text-base leading-relaxed text-[#F7F3EA]/60 sm:text-lg">
                                    In 1997, 642 cadets entered ten cadet colleges across Bangladesh. Today they command forces, lead hospitals, represent the nation abroad and build global enterprises — bound by a single covenant.
                                </p>
                            </Reveal>
                            <Reveal delay={300}>
                                <div className="mt-10 flex flex-wrap items-center gap-4">
                                    <Link
                                        href="/register-alumni"
                                        className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#E8D5A3] to-[#C9A55C] px-7 py-4 text-sm font-semibold text-[#0B1220] shadow-[0_10px_40px_-10px_rgba(201,165,92,0.6)] transition-all duration-300 hover:shadow-[0_14px_50px_-10px_rgba(201,165,92,0.8)]"
                                    >
                                        Apply for membership
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                    <a
                                        href="#directory"
                                        className="inline-flex items-center gap-3 rounded-full border border-[#F7F3EA]/15 px-7 py-4 text-sm font-medium text-[#F7F3EA] transition-all duration-300 hover:border-[#F7F3EA]/35 hover:bg-white/[0.03]"
                                    >
                                        Explore the roll
                                    </a>
                                </div>
                            </Reveal>

                            <Reveal delay={400}>
                                <dl className="mt-16 grid max-w-xl grid-cols-3 divide-x divide-[#F7F3EA]/10 border-t border-[#F7F3EA]/10 pt-8">
                                    {[
                                        { v: '10', l: 'Colleges' },
                                        { v: '642', l: 'Cadets' },
                                        { v: '34', l: 'Nations' },
                                    ].map((s, i) => (
                                        <div key={s.l} className={i === 0 ? 'pr-6' : 'px-6'}>
                                            <dt className="sr-only">{s.l}</dt>
                                            <dd className="font-serif text-4xl font-medium text-[#F7F3EA] sm:text-5xl">{s.v}</dd>
                                            <dd className="mt-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#F7F3EA]/45">{s.l}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </Reveal>
                        </div>

                        <div className="relative hidden lg:col-span-5 lg:block">
                            <Reveal delay={250}>
                                <div className="relative mx-auto aspect-square w-full max-w-[460px]">
                                    <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.14),transparent_70%)] blur-2xl" />
                                    <Crest className="relative h-full w-full animate-[spin_160s_linear_infinite] motion-reduce:animate-none" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-[46%] w-[46%] rounded-full border border-[#C9A55C]/20 bg-[#070B14]/40 backdrop-blur-[2px]" />
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="bg-gradient-to-b from-[#F1DFB0] to-[#9A7B3F] bg-clip-text font-serif text-[7rem] leading-none font-medium text-transparent">97</span>
                                        <span className="mt-1 text-[10px] tracking-[0.5em] text-[#D9BF85]/80">MCMXCVII</span>
                                    </div>
                                </div>
                            </Reveal>
                            <Reveal delay={450}>
                                <figure className="absolute -bottom-6 -left-6 max-w-[280px] rounded-2xl border border-[#F7F3EA]/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                                    <blockquote className="font-serif text-lg leading-snug text-[#F7F3EA]/85 italic">
                                        “The mud of the obstacle course washes away; the honour of our intake endures.”
                                    </blockquote>
                                    <figcaption className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#D9BF85]/70">Founding Charter</figcaption>
                                </figure>
                            </Reveal>
                        </div>
                    </div>

                    {/* College marquee */}
                    <div className="relative border-t border-[#F7F3EA]/[0.07] py-6">
                        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                            <div className="flex shrink-0 animate-[marquee_60s_linear_infinite] items-center gap-12 pr-12 motion-reduce:animate-none">
                                {[...CADET_COLLEGES_DATA, ...CADET_COLLEGES_DATA].map((c, i) => (
                                    <span key={i} className="flex shrink-0 items-center gap-12 font-serif text-lg whitespace-nowrap text-[#F7F3EA]/40 italic">
                                        {c.name}
                                        <span className="h-1 w-1 rounded-full bg-[#C9A55C]/60" />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
                </section>

                {/* ================================================================ */}
                {/* ABOUT — story                                                    */}
                {/* ================================================================ */}
                <section id="about" className="scroll-mt-20 py-28 lg:py-40">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
                            <div className="lg:col-span-5">
                                <Reveal className="lg:sticky lg:top-32">
                                    <Eyebrow index="01">Our Story</Eyebrow>
                                    <h2 className="mt-6 font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] text-[#0B1220] lg:text-[4rem]">
                                        Bound by a <em className="font-normal text-[#9A7B3F]">shared</em> beginning.
                                    </h2>
                                    <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#0B1220]/10">
                                        {[
                                            { v: '1997', l: 'Induction' },
                                            { v: '2003', l: 'Passing out' },
                                            { v: '27+', l: 'Years united' },
                                            { v: '100%', l: 'Audited aid' },
                                        ].map((s) => (
                                            <div key={s.l} className="bg-[#FAF7F0] p-6">
                                                <div className="font-serif text-3xl font-medium text-[#0B1220]">{s.v}</div>
                                                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#0B1220]/45">{s.l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>

                            <div className="space-y-10 lg:col-span-7">
                                <Reveal>
                                    <p className="font-serif text-2xl leading-[1.5] text-[#0B1220] sm:text-[1.75rem] first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[5.5rem] first-letter:leading-[0.8] first-letter:text-[#9A7B3F]">
                                        In January 1997, 642 adolescents arrived at the iron gates of ten cadet colleges. Stripped of privilege and comfort, we were issued box-pleated uniforms, metal chests and roll numbers that would stay etched into our souls.
                                    </p>
                                </Reveal>
                                <Reveal delay={80}>
                                    <p className="text-[17px] leading-[1.8] text-[#4A4F5C]">
                                        Under the chill of 0530 reveille and the echo of bugles, through ten-mile cross-country runs and drill-square inspections, boys and girls were tempered into citizens of unyielding character. We shared quarter-master inspections, clandestine night preps, and the pride of carrying our houses to championship glory.
                                    </p>
                                </Reveal>
                                <Reveal delay={120}>
                                    <p className="text-[17px] leading-[1.8] text-[#4A4F5C]">
                                        Twenty-seven years later, our titles carry responsibility across continents. Yet within this fraternity we remain exactly who we were — cadets standing shoulder to shoulder, bound by an oath that distance and circumstance can never dissolve.
                                    </p>
                                </Reveal>
                                <Reveal delay={160}>
                                    <figure className="relative overflow-hidden rounded-3xl bg-[#0B1220] p-10 text-[#F7F3EA] sm:p-12">
                                        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.25),transparent_65%)]" />
                                        <span className="font-serif text-7xl leading-none text-[#C9A55C]/60">“</span>
                                        <blockquote className="-mt-6 font-serif text-2xl leading-snug italic sm:text-3xl">
                                            No rank outside this room supersedes that of a brother who stood the same cold morning muster beside you in 1997.
                                        </blockquote>
                                        <figcaption className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#D9BF85]/80">
                                            <span className="h-px w-8 bg-[#D9BF85]/50" /> The Cadre Covenant
                                        </figcaption>
                                    </figure>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* COLLEGES                                                         */}
                {/* ================================================================ */}
                <section className="relative isolate overflow-hidden bg-[#0B1220] py-28 text-[#F7F3EA] lg:py-36">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-40 left-[-10%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.13),transparent_62%)]" />
                        <div className="absolute right-[-15%] bottom-[-25%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(123,17,19,0.22),transparent_65%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(247,243,234,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
                    </div>

                    <div className="mx-auto max-w-[1320px] space-y-14 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            light
                            index="02"
                            eyebrow="The Ten Pillars"
                            title={<>Ten colleges. <em className="font-normal text-[#D9BF85]">Equal voice.</em></>}
                            intro="Founded on uncompromised parity — every constituent college holds an equal seat in the Central Secretariat."
                            action={
                                <dl className="flex gap-8 sm:gap-10">
                                    {[
                                        { v: '10', l: 'Colleges' },
                                        { v: '642', l: 'Cadets' },
                                        { v: '1958', l: 'Oldest' },
                                    ].map((st) => (
                                        <div key={st.l}>
                                            <dd className="font-serif text-4xl font-medium text-[#F7F3EA]">{st.v}</dd>
                                            <dt className="mt-1 text-[10.5px] tracking-[0.2em] text-[#F7F3EA]/40 uppercase">{st.l}</dt>
                                        </div>
                                    ))}
                                </dl>
                            }
                        />

                        <Reveal>
                            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
                                <div className="flex w-max gap-1.5 rounded-full border border-[#F7F3EA]/10 bg-white/[0.03] p-1.5 backdrop-blur">
                                    {REGIONS.map((tab) => {
                                        const count = tab === 'All' ? mergedColleges.length : mergedColleges.filter((c) => c.region === tab).length;
                                        const active = selectedRegion === tab;
                                        return (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setSelectedRegion(tab)}
                                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-all duration-300 ${
                                                    active ? 'bg-gradient-to-r from-[#E8D5A3] to-[#C9A55C] text-[#0B1220] shadow-[0_6px_20px_-8px_rgba(201,165,92,0.7)]' : 'text-[#F7F3EA]/60 hover:bg-white/[0.04] hover:text-[#F7F3EA]'
                                                }`}
                                            >
                                                {tab === 'All' ? 'All' : tab}
                                                <span className={`rounded-full px-1.5 text-[10.5px] tabular-nums ${active ? 'bg-[#0B1220]/10' : 'bg-white/[0.06] text-[#F7F3EA]/45'}`}>{count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </Reveal>

                        {activeCollege && (
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                                {/* Featured college */}
                                <div ref={featureRef} className="scroll-mt-24 lg:col-span-5">
                                    <div className="rounded-[2rem] bg-gradient-to-b from-[#C9A55C]/45 via-[#C9A55C]/10 to-white/[0.04] p-px lg:sticky lg:top-28">
                                        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#0E1628]/95 p-7 backdrop-blur-xl sm:p-9">
                                            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.22),transparent_65%)]" />

                                            <div className="relative flex items-center justify-between text-[11px] tracking-[0.2em] uppercase">
                                                <span className="text-[#D9BF85]">
                                                    <span className="font-serif text-base tracking-normal normal-case italic">{String(CADET_COLLEGES_DATA.findIndex((c) => c.short_name === activeCollege.short_name) + 1).padStart(2, '0')}</span>
                                                    <span className="text-[#F7F3EA]/30"> / {CADET_COLLEGES_DATA.length}</span>
                                                </span>
                                                <span className="rounded-full border border-[#F7F3EA]/10 px-3 py-1 text-[#F7F3EA]/55">Est. {activeCollege.established}</span>
                                            </div>

                                            <div key={activeCollege.short_name} className="relative animate-in duration-500 fade-in slide-in-from-bottom-2">
                                                <div className="group mt-8 flex justify-center">
                                                    <CollegeEmblem logo={activeCollege.logo_url} code={activeCollege.short_name} name={activeCollege.name} size={148} />
                                                </div>
                                                <div className="mt-8 text-center">
                                                    <h3 className="font-serif text-[2rem] leading-[1.1] font-medium sm:text-[2.35rem]">{activeCollege.name}</h3>
                                                    <p className="mt-2 font-serif text-lg text-[#D9BF85] italic">{activeCollege.tagline}</p>
                                                </div>

                                                <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#F7F3EA]/[0.07]">
                                                    {[
                                                        { k: 'Location', v: activeCollege.location },
                                                        { k: 'Region', v: activeCollege.region },
                                                        { k: 'Established', v: String(activeCollege.established) },
                                                        { k: 'Intake ’97', v: activeCollege.cohort },
                                                    ].map((d) => (
                                                        <div key={d.k} className="bg-[#0E1628] p-4">
                                                            <dt className="text-[10.5px] tracking-[0.2em] text-[#F7F3EA]/40 uppercase">{d.k}</dt>
                                                            <dd className="mt-1 text-[14px] font-medium text-[#F7F3EA]/90">{d.v}</dd>
                                                        </div>
                                                    ))}
                                                </dl>

                                                <div className="mt-6">
                                                    <div className="text-[10.5px] tracking-[0.2em] text-[#F7F3EA]/40 uppercase">Houses</div>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {activeCollege.houses
                                                            .replace(/\s*Houses?$/, '')
                                                            .split(',')
                                                            .map((h) => h.trim())
                                                            .filter(Boolean)
                                                            .map((h) => (
                                                                <span key={h} className="rounded-full border border-[#C9A55C]/25 bg-[#C9A55C]/[0.06] px-3 py-1 text-[12.5px] text-[#E8D5A3]">
                                                                    {h}
                                                                </span>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative mt-9 flex items-center justify-between border-t border-[#F7F3EA]/[0.08] pt-6">
                                                <div className="flex gap-2">
                                                    <button type="button" aria-label="Previous college" onClick={() => stepCollege(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F3EA]/15 text-[#F7F3EA]/70 transition-all hover:border-[#C9A55C]/60 hover:text-[#E8D5A3]">
                                                        <ArrowRight className="h-4 w-4 rotate-180" />
                                                    </button>
                                                    <button type="button" aria-label="Next college" onClick={() => stepCollege(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F3EA]/15 text-[#F7F3EA]/70 transition-all hover:border-[#C9A55C]/60 hover:text-[#E8D5A3]">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                {activeCollege.website ? (
                                                    <a href={activeCollege.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-[#E8D5A3] hover:text-[#F1DFB0]">
                                                        Official website <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </a>
                                                ) : (
                                                    <span className="text-[12px] text-[#F7F3EA]/35">
                                                        {activeIndex + 1} of {filteredColleges.length}
                                                        {selectedRegion !== 'All' && ` · ${selectedRegion}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* College tiles */}
                                <div className="lg:col-span-7">
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5">
                                        {filteredColleges.map((col, i) => {
                                            const active = col.short_name === activeCollege.short_name;
                                            return (
                                                <Reveal key={col.short_name} delay={(i % 4) * 60} className="h-full">
                                                    <button
                                                        type="button"
                                                        onClick={() => selectCollege(col.short_name, true)}
                                                        aria-pressed={active}
                                                        className={`group relative flex h-full w-full flex-col items-center rounded-2xl border px-3 pt-6 pb-5 text-center transition-all duration-300 hover:-translate-y-1 ${
                                                            active
                                                                ? 'border-[#C9A55C]/60 bg-[#C9A55C]/[0.08] shadow-[0_20px_40px_-24px_rgba(201,165,92,0.6)]'
                                                                : 'border-[#F7F3EA]/[0.07] bg-white/[0.02] hover:border-[#F7F3EA]/20 hover:bg-white/[0.05]'
                                                        }`}
                                                    >
                                                        {active && <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#E8D5A3] shadow-[0_0_10px_2px_rgba(232,213,163,0.6)]" />}
                                                        <CollegeEmblem logo={col.logo_url} code={col.short_name} name={col.name} size={68} />
                                                        <div className={`mt-4 text-[13.5px] leading-snug font-medium ${active ? 'text-[#F7F3EA]' : 'text-[#F7F3EA]/80'}`}>
                                                            {col.name.replace(/ Cadet College$/, '')}
                                                        </div>
                                                        <div className="mt-1 text-[11px] tracking-[0.14em] text-[#F7F3EA]/35 uppercase">Est. {col.established}</div>
                                                    </button>
                                                </Reveal>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-6 flex items-center gap-2 text-[12.5px] text-[#F7F3EA]/35">
                                        <MapPin className="h-3.5 w-3.5" /> Select a college to view its houses, region and 1997 cohort.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ================================================================ */}
                {/* TIMELINE                                                         */}
                {/* ================================================================ */}
                <section className="py-28 lg:py-36">
                    <div className="mx-auto max-w-[1320px] space-y-20 px-5 sm:px-8 lg:px-10">
                        <SectionHeading index="03" eyebrow="Since 1997" title={<>The crucible <em className="font-normal text-[#9A7B3F]">&amp; beyond.</em></>} align="center" intro="From adolescents on the obstacle course to leaders shaping industries on six continents." />

                        <div className="relative">
                            <div className="absolute top-[30px] right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-[#9A7B3F]/40 to-transparent md:block" />
                            <ol className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-8">
                                {TIMELINE_MILESTONES.map((m, i) => (
                                    <Reveal key={m.year} delay={i * 90}>
                                        <li className="relative">
                                            <div className="flex items-center gap-4 md:flex-col md:items-start">
                                                <span className={`relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border ${i === TIMELINE_MILESTONES.length - 1 ? 'border-[#C9A55C] bg-[#0B1220]' : 'border-[#0B1220]/15 bg-[#FAF7F0]'}`}>
                                                    <span className={`h-2 w-2 rounded-full ${i === TIMELINE_MILESTONES.length - 1 ? 'bg-[#E8D5A3]' : 'bg-[#9A7B3F]'}`} />
                                                </span>
                                                <span className="font-serif text-4xl font-medium text-[#0B1220] md:mt-8">{m.year}</span>
                                            </div>
                                            <h3 className="mt-4 text-[15px] font-semibold text-[#0B1220]">{m.title}</h3>
                                            <p className="mt-1 text-[11px] tracking-[0.18em] text-[#9A7B3F] uppercase">{m.tagline}</p>
                                            <p className="mt-4 text-[14px] leading-relaxed text-[#4A4F5C]">{m.description}</p>
                                        </li>
                                    </Reveal>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* DIRECTORY                                                        */}
                {/* ================================================================ */}
                <section id="directory" className="relative scroll-mt-20 overflow-hidden bg-[#0B1220] py-28 text-[#F7F3EA] lg:py-36">
                    <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,165,92,0.10),transparent_65%)]" />
                    <div className="relative mx-auto max-w-[1320px] space-y-20 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            light
                            index="04"
                            eyebrow="The Cadet Roll"
                            title={<>Your batchmates. <em className="font-normal text-[#D9BF85]">Your lifelong network.</em></>}
                            intro="A private directory of verified brothers and sisters across all ten colleges — searchable by house, roll number, sector or chapter."
                        />

                        <Reveal>
                            <div className="rounded-3xl border border-[#F7F3EA]/10 bg-white/[0.03] p-3 backdrop-blur-sm">
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                                    <div className="relative md:col-span-5">
                                        <Search className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-[#F7F3EA]/40" />
                                        <input
                                            type="text"
                                            value={directorySearch}
                                            onChange={(e) => setDirectorySearch(e.target.value)}
                                            placeholder="Search by name, roll number or sector"
                                            className="h-14 w-full rounded-2xl border-0 bg-white/[0.04] pr-4 pl-12 text-[15px] text-[#F7F3EA] placeholder:text-[#F7F3EA]/35 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C9A55C]/50 focus:outline-none"
                                        />
                                    </div>
                                    <select
                                        value={selectedCollegeFilter}
                                        onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                                        className="h-14 rounded-2xl border-0 bg-white/[0.04] px-4 text-[14px] text-[#F7F3EA]/80 focus:ring-1 focus:ring-[#C9A55C]/50 focus:outline-none md:col-span-3 [&>option]:text-[#0B1220]"
                                    >
                                        <option value="">All colleges</option>
                                        {mergedColleges.map((c) => (
                                            <option key={c.short_name} value={c.short_name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedChapterFilter}
                                        onChange={(e) => setSelectedChapterFilter(e.target.value)}
                                        className="h-14 rounded-2xl border-0 bg-white/[0.04] px-4 text-[14px] text-[#F7F3EA]/80 focus:ring-1 focus:ring-[#C9A55C]/50 focus:outline-none md:col-span-2 [&>option]:text-[#0B1220]"
                                    >
                                        <option value="">All chapters</option>
                                        <option value="dhaka">Dhaka Central</option>
                                        <option value="london">London & UK</option>
                                        <option value="ny">North America (East)</option>
                                        <option value="california">Silicon Valley</option>
                                        <option value="dubai">Gulf & MENA</option>
                                        <option value="sydney">Australia & NZ</option>
                                    </select>
                                    <Link href="/login" className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E8D5A3] to-[#C9A55C] text-sm font-semibold text-[#0B1220] transition-opacity hover:opacity-90 md:col-span-2">
                                        Search <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {SAMPLE_VERIFIED_MEMBERS.map((m, i) => (
                                <Reveal key={m.name} delay={i * 80}>
                                    <div className="group h-full rounded-2xl border border-[#F7F3EA]/[0.08] bg-white/[0.02] p-6 transition-all duration-500 hover:border-[#C9A55C]/30 hover:bg-white/[0.04]">
                                        <div className="flex items-center justify-between">
                                            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A55C]/40 bg-gradient-to-br from-[#1A2438] to-[#0B1220] font-serif text-xl text-[#E8D5A3]">{m.initials}</span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A55C]/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-[#D9BF85]">
                                                <ShieldCheck className="h-3 w-3" /> Verified
                                            </span>
                                        </div>
                                        <div className="mt-6 font-serif text-xl leading-tight text-[#F7F3EA]">
                                            {m.name}
                                            {m.post && <span className="text-[#F7F3EA]/40">, {m.post}</span>}
                                        </div>
                                        <div className="mt-1.5 text-[13px] text-[#F7F3EA]/55">{m.role}</div>
                                        <div className="mt-6 flex items-center justify-between border-t border-[#F7F3EA]/[0.08] pt-4 text-[12px] text-[#F7F3EA]/40">
                                            <span>{m.code}</span>
                                            <span>{m.location}</span>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <Reveal>
                            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#F7F3EA]/[0.08] px-6 py-5 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3 text-[14px] text-[#F7F3EA]/60">
                                    <Lock className="h-4 w-4 shrink-0 text-[#C9A55C]" />
                                    Contact details are shielded and visible only to authenticated batchmates.
                                </div>
                                <GhostLink href="/login" light>Sign in to the full roll</GhostLink>
                            </div>
                        </Reveal>

                        {/* Sectors */}
                        <div className="space-y-12 pt-8">
                            <Reveal>
                                <div className="flex flex-col justify-between gap-4 border-b border-[#F7F3EA]/10 pb-8 md:flex-row md:items-end">
                                    <h3 className="font-serif text-3xl font-medium sm:text-4xl">Excellence across <em className="font-normal text-[#D9BF85]">every sector.</em></h3>
                                    <p className="max-w-md text-[14px] text-[#F7F3EA]/50">From command centres and operating theatres to boardrooms and diplomatic missions.</p>
                                </div>
                            </Reveal>
                            <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2 lg:grid-cols-3">
                                {SECTORS.map((sec, i) => {
                                    const Icon = sec.icon;
                                    return (
                                        <Reveal key={sec.title} delay={(i % 3) * 80}>
                                            <div className="group border-b border-[#F7F3EA]/[0.08] py-8">
                                                <div className="flex items-start justify-between">
                                                    <Icon className="h-5 w-5 text-[#C9A55C]" strokeWidth={1.5} />
                                                    <span className="text-[11px] tracking-[0.18em] text-[#F7F3EA]/35 uppercase">{sec.highlight}</span>
                                                </div>
                                                <div className="mt-6 flex items-baseline gap-3">
                                                    <span className="font-serif text-5xl font-medium text-[#F7F3EA] transition-colors group-hover:text-[#E8D5A3]">{sec.count}</span>
                                                    <span className="text-[13px] text-[#F7F3EA]/50">{sec.unit}</span>
                                                </div>
                                                <h4 className="mt-3 text-[15px] font-semibold text-[#F7F3EA]">{sec.title}</h4>
                                                <p className="mt-2 text-[14px] leading-relaxed text-[#F7F3EA]/50">{sec.description}</p>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* COMMITTEE                                                        */}
                {/* ================================================================ */}
                <section id="committee" className="scroll-mt-20 py-28 lg:py-36">
                    <div className="mx-auto max-w-[1320px] space-y-16 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            index="05"
                            eyebrow="Stewardship"
                            title={committee?.name ? committee.name : <>The Central <em className="font-normal text-[#9A7B3F]">Executive Council.</em></>}
                            intro="“We took an oath not merely to achieve personal eminence, but to maintain an inviolable lifeline for one another.”"
                            action={<GhostLink href="#constitution" internal>Governance charter</GhostLink>}
                        />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {(committee?.members && committee.members.length > 0
                                ? committee.members.map((cm) => ({
                                      key: String(cm.id),
                                      title: cm.position_title,
                                      name: cm.member?.user?.name || '',
                                      role: cm.member?.profile?.designation || cm.position_title || 'Executive Steward',
                                      college: `${cm.member?.college?.short_name || 'Cadet College'} ’97`,
                                      avatar: cm.member?.user?.avatar_path,
                                  }))
                                : FALLBACK_COMMITTEE.map((c) => ({ key: c.name, ...c, avatar: undefined as string | undefined }))
                            ).map((p, i) => (
                                <Reveal key={p.key} delay={i * 80}>
                                    <article className="group">
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2438] via-[#0B1220] to-[#070B14]">
                                            {p.avatar ? (
                                                <img src={p.avatar} alt={p.name} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,165,92,0.22),transparent_55%)]" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="font-serif text-[6rem] leading-none font-medium text-[#E8D5A3]/90 transition-transform duration-700 group-hover:scale-105">{initialsOf(p.name)}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="absolute top-5 left-5 rounded-full border border-[#F7F3EA]/15 bg-[#0B1220]/40 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-[#E8D5A3] uppercase backdrop-blur-md">
                                                {p.title}
                                            </div>
                                        </div>
                                        <h3 className="mt-6 font-serif text-2xl leading-tight text-[#0B1220]">{p.name}</h3>
                                        <p className="mt-1.5 text-[14px] text-[#4A4F5C]">{p.role}</p>
                                        <p className="mt-3 text-[11px] tracking-[0.2em] text-[#9A7B3F] uppercase">{p.college}</p>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* WELFARE                                                          */}
                {/* ================================================================ */}
                <section id="welfare" className="relative scroll-mt-20 border-t border-[#0B1220]/[0.07] bg-[#F3EEE3] py-28 lg:py-36">
                    <span id="offers" className="sr-only absolute -top-24" />
                    <div className="mx-auto max-w-[1320px] space-y-16 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            index="06"
                            eyebrow="Welfare & Trust"
                            title={<>We leave <em className="font-normal text-[#9A7B3F]">no comrade</em> behind.</>}
                            intro="Guaranteed medical lifelines, protected futures for the children of fallen batchmates, and privileges shared among our own."
                        />

                        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#0B1220]/10 bg-[#0B1220]/10 md:grid-cols-2 lg:grid-cols-4">
                            {WELFARE_PILLARS.map((w, i) => {
                                const Icon = w.icon;
                                return (
                                    <Reveal key={w.title} delay={i * 80} className="h-full">
                                        <div className="flex h-full flex-col bg-[#FAF7F0] p-8 lg:p-10">
                                            <Icon className="h-6 w-6 text-[#9A7B3F]" strokeWidth={1.5} />
                                            <div className="mt-10 font-serif text-5xl font-medium text-[#0B1220]">{w.figure}</div>
                                            <div className="mt-1 text-[11px] tracking-[0.2em] text-[#0B1220]/45 uppercase">{w.label}</div>
                                            <h3 className="mt-8 text-[16px] font-semibold text-[#0B1220]">{w.title}</h3>
                                            <p className="mt-2 text-[14px] leading-relaxed text-[#4A4F5C]">{w.description}</p>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>

                        <Reveal>
                            <p className="text-center text-[14px] text-[#4A4F5C]">
                                Have an initiative or enterprise perk for batchmates?{' '}
                                <Link href="/login" className="font-medium text-[#0B1220] underline decoration-[#9A7B3F]/50 underline-offset-4 hover:decoration-[#9A7B3F]">Submit via the member portal</Link>
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* BUSINESSES                                                       */}
                {/* ================================================================ */}
                <section id="businesses" className="scroll-mt-20 py-28 lg:py-36">
                    <div className="mx-auto max-w-[1320px] space-y-16 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            index="07"
                            eyebrow="Enterprise Registry"
                            title={<>Built by <em className="font-normal text-[#9A7B3F]">batchmates.</em></>}
                            intro="Verified enterprises and practices founded by members of the 1997 intake."
                            action={<GhostLink href="/login">All businesses</GhostLink>}
                        />

                        <div className="divide-y divide-[#0B1220]/10 border-y border-[#0B1220]/10">
                            {(businesses.length > 0
                                ? businesses.map((b) => ({
                                      key: String(b.id),
                                      tag: b.industry?.name || 'Enterprise',
                                      lead: b.name,
                                      sector: b.description || 'Alumni-owned commercial venture',
                                      city: `${b.owner?.user?.name ? b.owner.user.name + ' · ' : ''}${b.owner?.college?.short_name ? b.owner.college.short_name + ' · ' : ''}${b.city || 'Dhaka'}`,
                                  }))
                                : FALLBACK_BUSINESSES.map((b) => ({ key: b.lead, ...b }))
                            ).map((b, i) => (
                                <Reveal key={b.key} delay={i * 60}>
                                    <Link href="/login" className="group grid grid-cols-12 items-center gap-4 py-7 transition-colors sm:py-8">
                                        <span className="col-span-2 font-serif text-sm text-[#9A7B3F] italic sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                                        <div className="col-span-10 sm:col-span-5">
                                            <h3 className="font-serif text-2xl text-[#0B1220] transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">{b.lead}</h3>
                                        </div>
                                        <p className="col-span-12 line-clamp-1 text-[14px] text-[#4A4F5C] sm:col-span-3">{b.sector}</p>
                                        <div className="col-span-12 flex items-center justify-between gap-4 sm:col-span-3">
                                            <span className="text-[12px] text-[#0B1220]/45">{b.city}</span>
                                            <span className="flex items-center gap-3">
                                                <span className="rounded-full border border-[#0B1220]/10 px-3 py-1 text-[11px] text-[#0B1220]/60">{b.tag}</span>
                                                <ArrowUpRight className="h-4 w-4 text-[#0B1220]/30 transition-all duration-300 group-hover:text-[#9A7B3F]" />
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* NEWS                                                             */}
                {/* ================================================================ */}
                <section id="news" className="scroll-mt-20 border-t border-[#0B1220]/[0.07] bg-[#F3EEE3] py-28 lg:py-36">
                    <div className="mx-auto max-w-[1320px] space-y-16 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            index="08"
                            eyebrow="The Cadet Gazette"
                            title={<>News &amp; <em className="font-normal text-[#9A7B3F]">dispatches.</em></>}
                            action={<GhostLink href="/login">Gazette archive</GhostLink>}
                        />

                        <div className={`grid grid-cols-1 gap-6 ${articles.length === 1 ? 'md:max-w-2xl' : articles.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                            {(articles.length > 0
                                ? articles.map((a) => ({
                                      key: String(a.id),
                                      title: a.title,
                                      cat: a.category?.name || 'Gazette',
                                      date: a.published_at ? new Date(a.published_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recent',
                                      excerpt: a.excerpt || a.body?.slice(0, 160) || '',
                                  }))
                                : FALLBACK_ARTICLES.map((a) => ({ key: a.title, ...a }))
                            ).map((a, i) => (
                                <Reveal key={a.key} delay={i * 80} className="h-full">
                                    <Link
                                        href="/login"
                                        className={`group flex h-full flex-col justify-between rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 ${
                                            i === 0 ? 'bg-[#0B1220] text-[#F7F3EA] hover:shadow-[0_30px_60px_-30px_rgba(11,18,32,0.6)]' : 'bg-[#FAF7F0] hover:shadow-[0_30px_60px_-30px_rgba(11,18,32,0.25)]'
                                        }`}
                                    >
                                        <div>
                                            <div className={`flex items-center justify-between text-[11px] tracking-[0.18em] uppercase ${i === 0 ? 'text-[#D9BF85]' : 'text-[#9A7B3F]'}`}>
                                                <span>{a.cat}</span>
                                                <span className={i === 0 ? 'text-[#F7F3EA]/40' : 'text-[#0B1220]/40'}>{a.date}</span>
                                            </div>
                                            <h3 className={`mt-10 font-serif text-[1.75rem] leading-[1.15] ${i === 0 ? 'text-[#F7F3EA]' : 'text-[#0B1220]'}`}>{a.title}</h3>
                                            <p className={`mt-4 line-clamp-3 text-[14px] leading-relaxed ${i === 0 ? 'text-[#F7F3EA]/55' : 'text-[#4A4F5C]'}`}>{a.excerpt}</p>
                                        </div>
                                        <span className={`mt-10 inline-flex items-center gap-2 text-[13px] font-medium ${i === 0 ? 'text-[#E8D5A3]' : 'text-[#0B1220]'}`}>
                                            Read dispatch <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* CONSTITUTION                                                     */}
                {/* ================================================================ */}
                <section id="constitution" className="scroll-mt-20 py-28 lg:py-36">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <Reveal className="lg:sticky lg:top-32">
                                    <Eyebrow index="09">Governance</Eyebrow>
                                    <h2 className="mt-6 font-serif text-5xl leading-[1.02] font-medium text-[#0B1220]">
                                        The <em className="font-normal text-[#9A7B3F]">Charter.</em>
                                    </h2>
                                    <p className="mt-6 text-[15px] leading-relaxed text-[#4A4F5C]">The constitutional by-laws governing the central alumni body of the 1997 intake.</p>
                                    <Link href="/login" className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#0B1220]/15 px-6 py-3.5 text-[13px] font-medium text-[#0B1220] transition-all hover:border-[#0B1220] hover:bg-[#0B1220] hover:text-[#F7F3EA]">
                                        <FileText className="h-4 w-4" /> Download full charter
                                    </Link>
                                </Reveal>
                            </div>
                            <div className="lg:col-span-8">
                                <ol className="divide-y divide-[#0B1220]/10 border-y border-[#0B1220]/10">
                                    {CHARTER_ARTICLES.map((c, i) => (
                                        <Reveal key={c.numeral} delay={i * 70}>
                                            <li className="grid grid-cols-12 gap-6 py-10">
                                                <span className="col-span-3 font-serif text-5xl leading-none font-medium text-[#9A7B3F]/70 sm:col-span-2">{c.numeral}</span>
                                                <div className="col-span-9 sm:col-span-10">
                                                    <h3 className="font-serif text-2xl text-[#0B1220]">{c.title}</h3>
                                                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#4A4F5C]">{c.text}</p>
                                                </div>
                                            </li>
                                        </Reveal>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* REUNION                                                          */}
                {/* ================================================================ */}
                <section id="reunion" className="relative isolate scroll-mt-20 overflow-hidden bg-[#070B14] py-28 text-[#F7F3EA] lg:py-40">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.16),transparent_60%)]" />
                        <Crest className="absolute top-1/2 left-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]" />
                    </div>
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
                            <div className="lg:col-span-7">
                                <Reveal><Eyebrow light>The 30th Anniversary Conclave</Eyebrow></Reveal>
                                <Reveal delay={100}>
                                    <h2 className="mt-8 font-serif text-6xl leading-[0.95] font-medium tracking-[-0.02em] sm:text-7xl lg:text-[6.5rem]">
                                        Grand Reunion
                                        <br />
                                        <span className="bg-gradient-to-r from-[#F1DFB0] via-[#C9A55C] to-[#E8D5A3] bg-clip-text text-transparent italic">2027.</span>
                                    </h2>
                                </Reveal>
                                <Reveal delay={200}>
                                    <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#F7F3EA]/60">
                                        Three decades of unbroken brotherhood. All 642 batchmates, our families and our revered faculty — together in Dhaka for a historic national assembly.
                                    </p>
                                </Reveal>
                                <Reveal delay={300}>
                                    <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-[#F7F3EA]/10 pt-10 sm:grid-cols-3">
                                        {[
                                            { icon: MapPin, k: 'Venue', v: 'Sena Malancha · Dhaka Club · Kurmitola' },
                                            { icon: Calendar, k: 'When', v: 'Winter 2027 · Three days' },
                                            { icon: QrCode, k: 'Access', v: 'Encrypted digital pass' },
                                        ].map((d) => (
                                            <div key={d.k}>
                                                <dt className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#D9BF85] uppercase"><d.icon className="h-3.5 w-3.5" />{d.k}</dt>
                                                <dd className="mt-2 text-[14px] leading-relaxed text-[#F7F3EA]/75">{d.v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </Reveal>
                            </div>

                            <div className="lg:col-span-5">
                                <Reveal delay={200}>
                                    <div className="relative rounded-[2rem] bg-gradient-to-b from-[#C9A55C]/50 via-[#C9A55C]/10 to-transparent p-px">
                                        <div className="rounded-[calc(2rem-1px)] bg-[#0B1220]/95 p-10 backdrop-blur-xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] tracking-[0.24em] text-[#D9BF85] uppercase">Class of 1997 Pass</span>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Pre-registration open
                                                </span>
                                            </div>
                                            <div className="mt-10 font-serif text-4xl leading-tight">The Jubilee<br />All-Access Pass</div>
                                            <p className="mt-4 text-[14px] leading-relaxed text-[#F7F3EA]/55">Conclave access, the Grand Mess Dinner, the 30th Anniversary Yearbook and the Family Banquet.</p>
                                            <ul className="mt-8 space-y-3.5 border-t border-[#F7F3EA]/10 pt-8">
                                                {['Exclusive to verified 1997 alumni', 'Official commemorative medallion', 'Spouse & children included'].map((f) => (
                                                    <li key={f} className="flex items-center gap-3 text-[14px] text-[#F7F3EA]/80">
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A55C]/15"><Check className="h-3 w-3 text-[#E8D5A3]" /></span>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Link href="/login" className="group mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E8D5A3] to-[#C9A55C] py-4 text-sm font-semibold text-[#0B1220] transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(201,165,92,0.7)]">
                                                Reserve your seat <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* CONTACT                                                          */}
                {/* ================================================================ */}
                <section id="contact" className="scroll-mt-20 py-28 lg:py-36">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
                            <div className="lg:col-span-5">
                                <Reveal>
                                    <Eyebrow index="10">Secretariat</Eyebrow>
                                    <h2 className="mt-6 font-serif text-5xl leading-[1.02] font-medium text-[#0B1220] lg:text-[3.75rem]">
                                        Write to the <em className="font-normal text-[#9A7B3F]">Council.</em>
                                    </h2>
                                    <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                        For membership verification, reunion reservations, endowments or chapter affiliations.
                                    </p>
                                </Reveal>

                                <Reveal delay={100}>
                                    <dl className="mt-12 space-y-7">
                                        {[
                                            { icon: MapPin, k: 'Address', v: <>Central Alumni Secretariat<br />Gulshan-2 / Mohakhali DOHS, Dhaka</> },
                                            { icon: Mail, k: 'Email', v: <a href="mailto:secretariat@intake97.com" className="underline decoration-[#9A7B3F]/40 underline-offset-4 hover:decoration-[#9A7B3F]">secretariat@intake97.com</a> },
                                            { icon: Phone, k: 'Helpline', v: <>+880 1711 000097<br /><span className="text-[#0B1220]/45">Sun – Thu · 10:00 – 18:00 BST</span></> },
                                        ].map((d) => (
                                            <div key={d.k} className="flex gap-5">
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#0B1220]/10"><d.icon className="h-4 w-4 text-[#9A7B3F]" strokeWidth={1.5} /></span>
                                                <div>
                                                    <dt className="text-[11px] tracking-[0.2em] text-[#0B1220]/45 uppercase">{d.k}</dt>
                                                    <dd className="mt-1 text-[15px] leading-relaxed text-[#0B1220]">{d.v}</dd>
                                                </div>
                                            </div>
                                        ))}
                                    </dl>
                                </Reveal>

                                <Reveal delay={150}>
                                    <div className="mt-12 border-t border-[#0B1220]/10 pt-8">
                                        <div className="text-[11px] tracking-[0.2em] text-[#0B1220]/45 uppercase">Regional liaison desks</div>
                                        <div className="mt-4 grid grid-cols-2 gap-y-3 text-[14px] text-[#0B1220]">
                                            <span>New York · DC</span>
                                            <span>London</span>
                                            <span>Dubai · Riyadh</span>
                                            <span>Sydney · Melbourne</span>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            <div className="lg:col-span-7">
                                <Reveal delay={100}>
                                    <div className="rounded-[2rem] bg-white p-8 shadow-[0_40px_80px_-40px_rgba(11,18,32,0.18)] ring-1 ring-[#0B1220]/[0.06] sm:p-12">
                                        {contactSubmitted ? (
                                            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A55C]/15"><Check className="h-7 w-7 text-[#9A7B3F]" /></span>
                                                <h3 className="mt-6 font-serif text-3xl text-[#0B1220]">Message received.</h3>
                                                <p className="mt-3 max-w-sm text-[15px] text-[#4A4F5C]">Your note has reached the Central Secretariat. Expect a response within 24 hours.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleContactSubmit} className="space-y-8">
                                                <div>
                                                    <h3 className="font-serif text-3xl text-[#0B1220]">Send a message</h3>
                                                    <p className="mt-2 text-[14px] text-[#4A4F5C]">Official communications receive priority from the General Secretary’s desk.</p>
                                                </div>
                                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                                    <label className="block">
                                                        <span className={labelCls}>Full name</span>
                                                        <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your name" className={inputCls} />
                                                    </label>
                                                    <label className="block">
                                                        <span className={labelCls}>Email</span>
                                                        <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="you@domain.com" className={inputCls} />
                                                    </label>
                                                </div>
                                                <label className="block">
                                                    <span className={labelCls}>Subject</span>
                                                    <input required type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Membership, reunion, or general inquiry" className={inputCls} />
                                                </label>
                                                <label className="block">
                                                    <span className={labelCls}>Message</span>
                                                    <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can the Council help?" className={`${inputCls} resize-none`} />
                                                </label>
                                                <button type="submit" className="group inline-flex items-center gap-3 rounded-full bg-[#0B1220] px-8 py-4 text-sm font-medium text-[#F7F3EA] transition-all hover:bg-[#1A2438]">
                                                    Send message <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* FOOTER                                                           */}
                {/* ================================================================ */}
                <footer className="relative overflow-hidden bg-[#070B14] text-[#F7F3EA]">
                    <div className="mx-auto max-w-[1320px] px-5 pt-24 pb-10 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 gap-12 border-b border-[#F7F3EA]/[0.08] pb-16 md:grid-cols-12">
                            <div className="md:col-span-5">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A55C]/50"><span className="font-serif text-xl text-[#E8D5A3]">97</span></span>
                                    <div>
                                        <div className="font-serif text-2xl">Intake<span className="text-[#C9A55C]">97</span></div>
                                        <div className="text-[10px] tracking-[0.3em] text-[#F7F3EA]/40 uppercase">Cadet College Alumni Association</div>
                                    </div>
                                </div>
                                <p className="mt-8 max-w-sm text-[14px] leading-relaxed text-[#F7F3EA]/50">
                                    The central association uniting the officers, physicians, engineers, diplomats and leaders who entered the cadet colleges of Bangladesh in 1997.
                                </p>
                                <Link href="/register-alumni" className="mt-8 inline-flex items-center gap-2 text-[14px] text-[#E8D5A3] hover:text-[#F1DFB0]">
                                    Apply for membership <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </div>
                            {[
                                { h: 'Association', links: [['#about', 'About'], ['#directory', 'Directory'], ['#committee', 'Committee'], ['#welfare', 'Welfare & Trust']] },
                                { h: 'Activities', links: [['#businesses', 'Businesses'], ['#news', 'News'], ['#constitution', 'Charter'], ['#reunion', 'Reunion 2027']] },
                            ].map((col) => (
                                <div key={col.h} className="md:col-span-2">
                                    <h4 className="text-[11px] tracking-[0.24em] text-[#D9BF85]/80 uppercase">{col.h}</h4>
                                    <ul className="mt-6 space-y-3 text-[14px]">
                                        {col.links.map(([href, label]) => (
                                            <li key={href}><a href={href} className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">{label}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div className="md:col-span-3">
                                <h4 className="text-[11px] tracking-[0.24em] text-[#D9BF85]/80 uppercase">Portal</h4>
                                <ul className="mt-6 space-y-3 text-[14px]">
                                    <li><Link href="/login" className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">Member sign in</Link></li>
                                    <li><Link href="/register-alumni" className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">Apply for membership</Link></li>
                                    <li><a href="#contact" className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">Contact secretariat</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pointer-events-none py-10 text-center font-serif text-[18vw] leading-none font-medium tracking-[-0.04em] text-[#F7F3EA]/[0.04] select-none lg:text-[14rem]">
                            Intake 97
                        </div>

                        <div className="flex flex-col items-center justify-between gap-4 text-[12px] text-[#F7F3EA]/35 sm:flex-row">
                            <span>© {new Date().getFullYear()} INTAKE97.COM · All rights reserved</span>
                            <span className="tracking-[0.3em] uppercase">Fidelitas et Disciplina</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
