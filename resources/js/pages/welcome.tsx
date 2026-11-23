import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
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

const CAMPUS_PHOTOS: Record<string, string> = {
    FCC: '/images/campus/fcc.jpg',
    JCC: '/images/campus/jcc.jpg',
    MCC: '/images/campus/mcc.jpg',
    RCC: '/images/campus/rcc.jpg',
    SCC: '/images/campus/scc.jpg',
    CCR: '/images/campus/ccr.jpg',
    BCC: '/images/campus/bcc.jpg',
    MGCC: '/images/campus/mgcc.jpg',
    CCC: '/images/campus/ccc.jpg',
};

const CAMPUS_LIFE = [
    { src: '/images/campus/athletics.jpg', title: 'Inter-house athletics', place: 'RCC' },
    { src: '/images/campus/playground-mcc.jpg', title: 'The parade ground', place: 'MCC' },
    { src: '/images/campus/rcc.jpg', title: 'The academic block', place: 'RCC' },
    { src: '/images/campus/fcc.jpg', title: 'Where it all began', place: 'FCC' },
    { src: '/images/campus/ccr.jpg', title: 'Northern sentinel', place: 'CCR' },
];

// Wikimedia Commons photographs — CC BY-SA unless noted. Attribution is required.
const PHOTO_CREDITS = [
    { file: 'Sunset at Rajshahi Cadet College (3)', author: 'AfnanAnwar20', license: 'CC BY-SA 4.0' },
    { file: 'Faujdarhat Cadet College Front View', author: 'Rafi Bin Tofa', license: 'CC BY-SA 4.0' },
    { file: 'Jcc Academic Block', author: 'Mrislamreaz', license: 'CC BY-SA 3.0' },
    { file: 'MCC BLOCK', author: 'Kazi Maruf Abdullah', license: 'CC BY-SA 3.0' },
    { file: 'Academic Block of RCC', author: 'Rajshahi Cadet College', license: 'CC BY-SA 4.0' },
    { file: 'Sylhet cadet college', author: 'Hussen Mahbub', license: 'CC BY-SA 3.0' },
    { file: 'APC-4', author: 'Nasif05', license: 'CC BY-SA 4.0' },
    { file: 'Barishal Cadet College Administration Building', author: 'Nfdul', license: 'CC BY-SA 4.0' },
    { file: "Entrance of Mymensingh Girls' Cadet College 01", author: 'Rocky Masum', license: 'CC BY-SA 4.0' },
    { file: 'Cumilla Cadet College-Academic Block-1', author: 'Ftahmed', license: 'Public domain' },
    { file: 'Cadets in class', author: 'Wikimedia Commons contributor', license: 'CC BY-SA 3.0' },
    { file: 'Flag Raising Ceremony in RCC', author: 'Photography Club, Rajshahi Cadet College', license: 'CC BY-SA 4.0' },
    { file: 'Athletes contingent of Inter House Annual Athletics Competition 2024 at RCC', author: 'AfnanAnwar20', license: 'CC BY-SA 4.0' },
    { file: 'Glimpse of Inter House Annual Athletics Competition 2024', author: 'AfnanAnwar20', license: 'CC BY-SA 4.0' },
    { file: "CAS inspecting the parade of the Cadets' during ORCA Reunion 2025 at RCC", author: 'AfnanAnwar20', license: 'CC BY-SA 4.0' },
    { file: 'Aerial view of Mirzapur Cadet College', author: 'Bellfloyd', license: 'CC BY-SA 4.0' },
    { file: 'Play Ground of MCC College, Dhaka', author: 'মুসফিক মুন্না', license: 'CC BY-SA 4.0' },
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
    { href: '#colleges', label: 'Colleges' },
    { href: '#directory', label: 'Directory' },
    { href: '#committee', label: 'Committee' },
    { href: '#welfare', label: 'Welfare' },
    { href: '#contact', label: 'Contact' },
];

const NEWS_FALLBACK_PHOTOS = ['/images/campus/playground-mcc.jpg', '/images/campus/athletics.jpg', '/images/campus/mgcc.jpg'];

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

function ExploreLink({ href, children, light = false, internal = true }: { href: string; children: React.ReactNode; light?: boolean; internal?: boolean }) {
    const cls = `group inline-flex items-center gap-2 text-[14px] font-medium ${light ? 'text-[#F7F3EA]' : 'text-[#0B1220]'}`;
    const inner = (
        <>
            <span className={`relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:transition-transform after:duration-500 group-hover:after:scale-x-50 ${light ? 'after:bg-[#F7F3EA]' : 'after:bg-[#0B1220]'}`}>
                {children}
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </>
    );
    return internal ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
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
            <Head title="ccIntake97 — Cadet College Alumni Association · Class of 1997" />

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
                            <BrandMark className="h-12 w-auto shrink-0 drop-shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:-translate-y-0.5" />
                            <span className="leading-tight">
                                <span className={`block font-serif text-[22px] font-medium tracking-[0.02em] transition-colors duration-500 ${solidHeader ? 'text-[#0B1220]' : 'text-[#F7F3EA]'}`}>
                                    ccIntake<span className="text-[#C9A55C] [font-variant-numeric:lining-nums]">97</span>
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
                {/* HERO — full-bleed photograph                                     */}
                {/* ================================================================ */}
                <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#070B14] text-[#F7F3EA]">
                    <img
                        src="/images/campus/hero-rcc-sunset.jpg"
                        alt="Rajshahi Cadet College silhouetted at sunset"
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 h-full w-full scale-105 animate-[heroZoom_18s_ease-out_forwards] object-cover object-[center_60%] motion-reduce:animate-none"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-[#070B14]/5" />
                    <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#070B14]/60 to-transparent" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070B14]/70 via-[#070B14]/15 to-transparent" />
                    <style>{`@keyframes heroZoom { from { transform: scale(1.12) } to { transform: scale(1.02) } }`}</style>

                    <div className="mx-auto w-full max-w-[1320px] px-5 pt-40 pb-14 sm:px-8 lg:px-10 lg:pb-16">
                        <Reveal>
                            <Eyebrow light>Est. January 1997 · Bangladesh</Eyebrow>
                        </Reveal>
                        <Reveal delay={100}>
                            <h1 className="mt-7 max-w-4xl font-serif text-[3.25rem] leading-[0.98] font-medium tracking-[-0.02em] sm:text-7xl lg:text-[6rem]">
                                Different colleges.
                                <br />
                                <span className="font-normal text-[#E8D5A3] italic">One intake.</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={200}>
                            <p className="mt-7 max-w-lg text-base leading-relaxed text-[#F7F3EA]/75 sm:text-lg">
                                642 cadets. Ten colleges. A lifetime of brotherhood that began on the parade grounds of 1997.
                            </p>
                        </Reveal>
                        <Reveal delay={300}>
                            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                                <Link
                                    href="/register-alumni"
                                    className="group inline-flex items-center gap-3 rounded-full bg-[#F7F3EA] px-7 py-4 text-sm font-semibold text-[#0B1220] transition-all duration-300 hover:bg-white"
                                >
                                    Apply for membership
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                                <ExploreLink href="#about" light>Explore our story</ExploreLink>
                            </div>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="mt-20 flex flex-col gap-6 border-t border-[#F7F3EA]/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
                                <dl className="flex gap-10 sm:gap-14">
                                    {[
                                        { v: '10', l: 'Colleges' },
                                        { v: '642', l: 'Cadets' },
                                        { v: '34', l: 'Nations' },
                                    ].map((st) => (
                                        <div key={st.l}>
                                            <dd className="font-serif text-4xl font-medium sm:text-5xl">{st.v}</dd>
                                            <dt className="mt-1 text-[11px] font-medium tracking-[0.24em] text-[#F7F3EA]/55 uppercase">{st.l}</dt>
                                        </div>
                                    ))}
                                </dl>
                                <span className="text-[11px] tracking-[0.18em] text-[#F7F3EA]/40 uppercase">Rajshahi Cadet College, at dusk</span>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* ABOUT — text + photo mosaic                                      */}
                {/* ================================================================ */}
                <section id="about" className="scroll-mt-20 bg-white py-24 lg:py-32">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
                            <div className="lg:col-span-5">
                                <Reveal>
                                    <Eyebrow index="01">Our Story</Eyebrow>
                                    <h2 className="mt-6 font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] text-[#0B1220] lg:text-[3.75rem]">
                                        Bound by a <em className="font-normal text-[#9A7B3F]">shared</em> beginning.
                                    </h2>
                                    <p className="mt-7 text-[17px] leading-[1.75] text-[#4A4F5C]">
                                        In January 1997, 642 adolescents walked through the gates of ten cadet colleges. Reveille at 0530, ten-mile runs and drill-square inspections turned strangers into brothers and sisters.
                                    </p>
                                    <p className="mt-4 text-[17px] leading-[1.75] text-[#4A4F5C]">
                                        Today we lead across continents — and remain exactly who we were.
                                    </p>
                                    <blockquote className="mt-9 border-l-2 border-[#C9A55C] pl-5 font-serif text-xl leading-snug text-[#0B1220] italic">
                                        “No rank outside this room supersedes that of a brother who stood the same cold morning muster beside you.”
                                    </blockquote>
                                    <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-[#0B1220]/10 pt-6">
                                        {[
                                            { v: '1997', l: 'Induction' },
                                            { v: '2003', l: 'Passing out' },
                                            { v: '27+', l: 'Years' },
                                            { v: '100%', l: 'Audited' },
                                        ].map((st) => (
                                            <div key={st.l}>
                                                <dd className="font-serif text-2xl font-medium text-[#0B1220]">{st.v}</dd>
                                                <dt className="mt-0.5 text-[10.5px] tracking-[0.18em] text-[#0B1220]/45 uppercase">{st.l}</dt>
                                            </div>
                                        ))}
                                    </dl>
                                </Reveal>
                            </div>

                            <div className="lg:col-span-7">
                                <Reveal delay={100}>
                                    <div className="grid h-[520px] grid-cols-5 grid-rows-2 gap-1.5 sm:h-[600px]">
                                        {[
                                            { src: '/images/campus/cadets-in-class.jpg', alt: 'Cadets in a classroom', caption: 'Prep hour', cls: 'col-span-3 row-span-2' },
                                            { src: '/images/campus/flag-raising.jpg', alt: 'Flag raising ceremony', caption: 'Morning colours', cls: 'col-span-2' },
                                            { src: '/images/campus/athletes-contingent.jpg', alt: 'Athletes contingent on parade', caption: 'Inter-house athletics', cls: 'col-span-2' },
                                        ].map((ph) => (
                                            <figure key={ph.src} className={`group relative overflow-hidden bg-[#0B1220] ${ph.cls}`}>
                                                <img src={ph.src} alt={ph.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                                                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pt-10 pb-4 text-[13px] font-medium text-white">
                                                    {ph.caption}
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* COLLEGES — featured banner + photo tiles                         */}
                {/* ================================================================ */}
                <section id="colleges" className="scroll-mt-20 bg-[#F4F2EE] py-24 lg:py-32">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <Reveal>
                            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-2xl">
                                    <Eyebrow index="02">The Ten Pillars</Eyebrow>
                                    <h2 className="mt-6 font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] text-[#0B1220] lg:text-[3.75rem]">
                                        Ten colleges. <em className="font-normal text-[#9A7B3F]">Equal voice.</em>
                                    </h2>
                                    <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#4A4F5C]">
                                        Every constituent college holds an equal seat in the Central Secretariat.
                                    </p>
                                </div>
                                <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
                                    <div className="flex w-max items-center gap-6 border-b border-[#0B1220]/10">
                                        {REGIONS.map((tab) => {
                                            const active = selectedRegion === tab;
                                            return (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() => setSelectedRegion(tab)}
                                                    className={`relative -mb-px border-b-2 pb-3 text-[14px] whitespace-nowrap transition-colors duration-300 ${
                                                        active ? 'border-[#0B1220] font-medium text-[#0B1220]' : 'border-transparent text-[#0B1220]/45 hover:text-[#0B1220]'
                                                    }`}
                                                >
                                                    {tab === 'All' ? 'All' : tab === 'Girls Colleges' ? 'Girls’' : tab}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {activeCollege && (
                            <div className="mt-12 space-y-1.5">
                                {/* Featured banner */}
                                <div ref={featureRef} className="relative isolate scroll-mt-24 overflow-hidden bg-[#0B1220] text-[#F7F3EA]">
                                    <div key={activeCollege.short_name} className="animate-in duration-700 fade-in">
                                        {CAMPUS_PHOTOS[activeCollege.short_name] ? (
                                            <img
                                                src={CAMPUS_PHOTOS[activeCollege.short_name]}
                                                alt={`${activeCollege.name} campus`}
                                                className="absolute inset-0 -z-10 h-full w-full animate-[heroZoom_9s_ease-out_forwards] object-cover motion-reduce:animate-none"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_30%,rgba(201,165,92,0.25),transparent_55%)]" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070B14]/95 via-[#070B14]/45 to-[#070B14]/10" />
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070B14]/70 to-transparent" />

                                    <div className="flex min-h-[520px] flex-col justify-between p-6 sm:p-10 lg:min-h-[560px] lg:p-12">
                                        <div className="flex items-start justify-between text-[11px] tracking-[0.2em] uppercase">
                                            <span className="text-[#E8D5A3]">
                                                <span className="font-serif text-lg tracking-normal normal-case italic">{String(CADET_COLLEGES_DATA.findIndex((c) => c.short_name === activeCollege.short_name) + 1).padStart(2, '0')}</span>
                                                <span className="text-[#F7F3EA]/45"> / {CADET_COLLEGES_DATA.length}</span>
                                            </span>
                                            <span className="text-[#F7F3EA]/70">Est. {activeCollege.established}</span>
                                        </div>

                                        <div key={activeCollege.short_name + '-info'} className="grid animate-in grid-cols-1 items-end gap-8 duration-500 fade-in slide-in-from-bottom-3 lg:grid-cols-12">
                                            <div className="lg:col-span-7">
                                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                                                    <CollegeEmblem logo={activeCollege.logo_url} code={activeCollege.short_name} name={activeCollege.name} size={84} />
                                                    <div>
                                                        <h3 className="font-serif text-[2.1rem] leading-[1.05] font-medium sm:text-5xl">{activeCollege.name}</h3>
                                                        <p className="mt-2 font-serif text-lg text-[#E8D5A3] italic">{activeCollege.tagline}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-5">
                                                <dl className="grid grid-cols-3 gap-4 border-t border-[#F7F3EA]/20 pt-5">
                                                    {[
                                                        { k: 'Location', v: activeCollege.location },
                                                        { k: 'Region', v: activeCollege.region },
                                                        { k: 'Intake ’97', v: activeCollege.cohort },
                                                    ].map((d) => (
                                                        <div key={d.k}>
                                                            <dt className="text-[10.5px] tracking-[0.2em] text-[#F7F3EA]/50 uppercase">{d.k}</dt>
                                                            <dd className="mt-1 text-[14px] font-medium">{d.v}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {activeCollege.houses
                                                        .replace(/\s*Houses?$/, '')
                                                        .split(',')
                                                        .map((h) => h.trim())
                                                        .filter(Boolean)
                                                        .map((h) => (
                                                            <span key={h} className="rounded-full border border-[#F7F3EA]/25 bg-white/10 px-3 py-1 text-[12.5px] backdrop-blur-sm">
                                                                {h}
                                                            </span>
                                                        ))}
                                                </div>
                                                <div className="mt-7 flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        <button type="button" aria-label="Previous college" onClick={() => stepCollege(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F3EA]/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0B1220]">
                                                            <ArrowRight className="h-4 w-4 rotate-180" />
                                                        </button>
                                                        <button type="button" aria-label="Next college" onClick={() => stepCollege(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F3EA]/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0B1220]">
                                                            <ArrowRight className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    {activeCollege.website && (
                                                        <ExploreLink href={activeCollege.website} light>Official website</ExploreLink>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Photo tiles */}
                                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
                                    {filteredColleges.map((col) => {
                                        const active = col.short_name === activeCollege.short_name;
                                        const photo = CAMPUS_PHOTOS[col.short_name];
                                        return (
                                            <button
                                                key={col.short_name}
                                                type="button"
                                                onClick={() => selectCollege(col.short_name, true)}
                                                aria-pressed={active}
                                                className="group relative isolate aspect-[4/3] overflow-hidden bg-[#0B1220] text-left text-white"
                                            >
                                                {photo ? (
                                                    <img src={photo} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                                ) : (
                                                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(201,165,92,0.3),transparent_60%)]" />
                                                )}
                                                <div className={`absolute inset-0 -z-10 transition-colors duration-500 ${active ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : 'bg-gradient-to-t from-black/80 via-black/40 to-black/25 group-hover:via-black/20 group-hover:to-transparent'}`} />
                                                <div className={`absolute inset-0 transition-all duration-300 ${active ? 'ring-[3px] ring-[#C9A55C] ring-inset' : ''}`} />
                                                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-3 sm:p-4">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/50">
                                                        {col.logo_url ? (
                                                            <img src={col.logo_url} alt="" className="h-full w-full object-contain p-0.5" />
                                                        ) : (
                                                            <span className="font-serif text-[10px] text-[#0B1220]">{col.short_name}</span>
                                                        )}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block truncate text-[13.5px] leading-tight font-semibold">{col.name.replace(/ Cadet College$/, '')}</span>
                                                        <span className="block text-[11px] text-white/65">Est. {col.established}</span>
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
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
                {/* CAMPUS LIFE — horizontal photo strip                             */}
                {/* ================================================================ */}
                <section className="bg-[#FAF7F0] pb-24 lg:pb-32">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <Reveal>
                            <div className="flex items-end justify-between gap-6">
                                <h3 className="flex items-center gap-4 font-serif text-3xl font-medium text-[#0B1220] sm:text-4xl">
                                    Life on campus <ArrowRight className="h-6 w-6 text-[#9A7B3F]" strokeWidth={1.25} />
                                </h3>
                                <span className="hidden text-[13px] text-[#0B1220]/45 sm:block">Scroll to explore</span>
                            </div>
                        </Reveal>
                    </div>
                    <div className="mt-8 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 lg:px-[max(2.5rem,calc((100vw_-_1320px)/2_+_2.5rem))]">
                        {CAMPUS_LIFE.map((ph) => (
                            <figure key={ph.src} className="group relative w-[78vw] shrink-0 snap-start overflow-hidden bg-[#0B1220] sm:w-[420px]">
                                <img src={ph.src} alt={ph.title} loading="lazy" className="aspect-[4/5] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pt-16 pb-5 text-white">
                                    <span className="block text-[11px] tracking-[0.2em] text-white/60 uppercase">{ph.place}</span>
                                    <span className="mt-1 block font-serif text-2xl">{ph.title}</span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>

                {/* ================================================================ */}
                {/* DIRECTORY                                                        */}
                {/* ================================================================ */}
                <section id="directory" className="relative scroll-mt-20 overflow-hidden bg-[#0B1220] py-24 text-[#F7F3EA] lg:py-32">
                    <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,165,92,0.10),transparent_65%)]" />
                    <div className="relative mx-auto max-w-[1320px] space-y-14 px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            light
                            index="04"
                            eyebrow="The Cadet Roll"
                            title={<>Your batchmates. <em className="font-normal text-[#D9BF85]">Your network.</em></>}
                            intro="A private directory of verified batchmates — searchable by college, house, sector or city."
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

                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
                            {SAMPLE_VERIFIED_MEMBERS.map((m, i) => (
                                <Reveal key={m.name} delay={i * 80} className="h-full">
                                    <div className="group flex h-full items-center gap-4 bg-white/[0.03] p-5 transition-colors duration-500 hover:bg-white/[0.06]">
                                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C9A55C]/40 bg-gradient-to-br from-[#1A2438] to-[#0B1220] font-serif text-lg text-[#E8D5A3]">{m.initials}</span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 truncate font-serif text-lg leading-tight">
                                                <span className="truncate">{m.name}</span>
                                                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#C9A55C]" />
                                            </div>
                                            <div className="mt-0.5 truncate text-[12.5px] text-[#F7F3EA]/55">{m.role}</div>
                                            <div className="mt-1 text-[11px] tracking-[0.12em] text-[#F7F3EA]/35 uppercase">{m.code} · {m.location}</div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <Reveal>
                            <div className="grid grid-cols-2 gap-px overflow-hidden border-y border-[#F7F3EA]/10 bg-[#F7F3EA]/10 sm:grid-cols-3 lg:grid-cols-6">
                                {SECTORS.map((sec) => {
                                    const Icon = sec.icon;
                                    return (
                                        <div key={sec.title} className="group bg-[#0B1220] px-5 py-7">
                                            <Icon className="h-4 w-4 text-[#C9A55C]" strokeWidth={1.5} />
                                            <div className="mt-4 font-serif text-4xl font-medium transition-colors group-hover:text-[#E8D5A3]">{sec.count}</div>
                                            <div className="mt-1 text-[13px] leading-snug text-[#F7F3EA]/55">{sec.title}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Reveal>

                        <Reveal>
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3 text-[14px] text-[#F7F3EA]/55">
                                    <Lock className="h-4 w-4 shrink-0 text-[#C9A55C]" />
                                    Contact details are visible only to verified batchmates.
                                </div>
                                <ExploreLink href="/login" light internal={false}>Sign in to the full roll</ExploreLink>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* COMMITTEE + CHARTER                                              */}
                {/* ================================================================ */}
                <section id="committee" className="scroll-mt-20 bg-white py-24 lg:py-32">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            index="05"
                            eyebrow="Stewardship"
                            title={committee?.name ? committee.name : <>The Executive <em className="font-normal text-[#9A7B3F]">Council.</em></>}
                            intro="Elected from every college chapter, serving a two-year term."
                        />

                        <div className="mt-12 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
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
                                    <article className="group relative isolate aspect-[3/4] overflow-hidden bg-[#0B1220] text-white">
                                        {p.avatar ? (
                                            <img src={p.avatar} alt={p.name} className="absolute inset-0 -z-10 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                                        ) : (
                                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1E2A42] via-[#0E1628] to-[#070B14]">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,165,92,0.22),transparent_60%)]" />
                                                <span className="absolute inset-x-0 top-[30%] text-center font-serif text-[5.5rem] leading-none text-[#E8D5A3]/85 transition-transform duration-700 group-hover:scale-105">{initialsOf(p.name)}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                            <div className="text-[10.5px] font-medium tracking-[0.2em] text-[#E8D5A3] uppercase">{p.title}</div>
                                            <h3 className="mt-2 font-serif text-xl leading-tight sm:text-2xl">{p.name}</h3>
                                            <p className="mt-1 line-clamp-1 text-[13px] text-white/60">{p.role} · {p.college}</p>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>

                        {/* Charter — compact */}
                        <div id="constitution" className="mt-20 scroll-mt-24 border-t border-[#0B1220]/10 pt-12">
                            <Reveal>
                                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                    <h3 className="font-serif text-3xl font-medium text-[#0B1220] sm:text-4xl">The <em className="font-normal text-[#9A7B3F]">Charter.</em></h3>
                                    <ExploreLink href="/login" internal={false}>Download full charter</ExploreLink>
                                </div>
                            </Reveal>
                            <ol className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                                {CHARTER_ARTICLES.map((c, i) => (
                                    <Reveal key={c.numeral} delay={i * 70}>
                                        <li>
                                            <span className="font-serif text-3xl text-[#9A7B3F]/70">{c.numeral}</span>
                                            <h4 className="mt-3 text-[15px] font-semibold text-[#0B1220]">{c.title}</h4>
                                            <p className="mt-1.5 text-[14px] leading-relaxed text-[#4A4F5C]">{c.text}</p>
                                        </li>
                                    </Reveal>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* WELFARE — full-bleed photo banner                                */}
                {/* ================================================================ */}
                <section id="welfare" className="relative isolate scroll-mt-20 overflow-hidden bg-[#070B14] text-[#F7F3EA]">
                    <span id="offers" className="sr-only absolute -top-24" />
                    <img src="/images/campus/aerial-mcc.jpg" alt="Aerial view of Mirzapur Cadet College" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-[#070B14]/30" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070B14]/80 to-transparent" />

                    <div className="mx-auto flex min-h-[720px] max-w-[1320px] flex-col justify-between px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                        <Reveal>
                            <Eyebrow index="06" light>Welfare &amp; Trust</Eyebrow>
                            <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] lg:text-[4.25rem]">
                                We leave <em className="font-normal text-[#E8D5A3]">no comrade</em> behind.
                            </h2>
                            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[#F7F3EA]/70">
                                Medical lifelines, protected futures for the children of fallen batchmates, and privileges shared among our own.
                            </p>
                            <div className="mt-8">
                                <ExploreLink href="/login" light internal={false}>Support the Trust</ExploreLink>
                            </div>
                        </Reveal>

                        <div className="mt-16 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                            {WELFARE_PILLARS.map((w, i) => {
                                const Icon = w.icon;
                                return (
                                    <Reveal key={w.title} delay={i * 80} className="h-full">
                                        <div className="h-full bg-white/[0.08] p-5 backdrop-blur-md sm:p-6">
                                            <Icon className="h-5 w-5 text-[#E8D5A3]" strokeWidth={1.5} />
                                            <div className="mt-5 font-serif text-4xl font-medium sm:text-[2.75rem]">{w.figure}</div>
                                            <div className="mt-2 text-[14px] font-medium">{w.title}</div>
                                            <div className="mt-0.5 text-[12px] tracking-[0.14em] text-[#F7F3EA]/50 uppercase">{w.label}</div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ================================================================ */}
                {/* COMMUNITY — news + businesses                                    */}
                {/* ================================================================ */}
                <section id="news" className="scroll-mt-20 bg-[#F4F2EE] py-24 lg:py-32">
                    <span id="businesses" className="sr-only" />
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <SectionHeading
                            index="07"
                            eyebrow="Community"
                            title={<>News &amp; <em className="font-normal text-[#9A7B3F]">ventures.</em></>}
                            action={<ExploreLink href="/login" internal={false}>All dispatches</ExploreLink>}
                        />

                        {(() => {
                            const news = (articles.length > 0
                                ? articles.map((a) => ({
                                      key: String(a.id),
                                      title: a.title,
                                      cat: a.category?.name || 'Gazette',
                                      date: a.published_at ? new Date(a.published_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recent',
                                      excerpt: a.excerpt || a.body?.slice(0, 160) || '',
                                      image: a.cover_image_path ? `/storage/${a.cover_image_path.replace(/^\/+/, '')}` : null,
                                  }))
                                : FALLBACK_ARTICLES.map((a) => ({ key: a.title, ...a, image: null as string | null }))
                            ).map((a, i) => ({ ...a, image: a.image || NEWS_FALLBACK_PHOTOS[i % NEWS_FALLBACK_PHOTOS.length] }));
                            const [lead, ...rest] = news;
                            const ventures = businesses.length > 0
                                ? businesses.map((b) => ({ key: String(b.id), tag: b.industry?.name || 'Enterprise', lead: b.name, sector: b.description || 'Alumni-owned venture', city: b.city || 'Dhaka' }))
                                : FALLBACK_BUSINESSES.map((b) => ({ key: b.lead, ...b }));

                            return (
                                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
                                    <div className="lg:col-span-7">
                                        {lead && (
                                            <Reveal>
                                                <Link href="/login" className="group block">
                                                    <div className="aspect-[16/10] overflow-hidden bg-[#0B1220]">
                                                        <img src={lead.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                                                    </div>
                                                    <div className="mt-6 flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase">
                                                        <span className="text-[#9A7B3F]">{lead.cat}</span>
                                                        <span className="text-[#0B1220]/35">{lead.date}</span>
                                                    </div>
                                                    <h3 className="mt-3 font-serif text-3xl leading-[1.15] text-[#0B1220] sm:text-[2.25rem]">{lead.title}</h3>
                                                    <p className="mt-3 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-[#4A4F5C]">{lead.excerpt}</p>
                                                </Link>
                                            </Reveal>
                                        )}
                                        {rest.length > 0 && (
                                            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                                {rest.slice(0, 2).map((a, i) => (
                                                    <Reveal key={a.key} delay={i * 80}>
                                                        <Link href="/login" className="group flex gap-4">
                                                            <div className="h-24 w-28 shrink-0 overflow-hidden bg-[#0B1220]">
                                                                <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-[10.5px] tracking-[0.18em] text-[#9A7B3F] uppercase">{a.cat}</div>
                                                                <h4 className="mt-1.5 line-clamp-3 font-serif text-lg leading-snug text-[#0B1220] group-hover:underline group-hover:decoration-[#9A7B3F]/50 group-hover:underline-offset-4">{a.title}</h4>
                                                            </div>
                                                        </Link>
                                                    </Reveal>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:col-span-5">
                                        <Reveal>
                                            <div className="flex items-end justify-between border-b border-[#0B1220]/15 pb-4">
                                                <h3 className="font-serif text-2xl text-[#0B1220]">Built by batchmates</h3>
                                                <ExploreLink href="/login" internal={false}>Directory</ExploreLink>
                                            </div>
                                        </Reveal>
                                        <ul className="divide-y divide-[#0B1220]/10">
                                            {ventures.slice(0, 5).map((b, i) => (
                                                <Reveal key={b.key} delay={i * 60}>
                                                    <li>
                                                        <Link href="/login" className="group flex items-center gap-4 py-5">
                                                            <span className="w-6 font-serif text-sm text-[#9A7B3F] italic">{String(i + 1).padStart(2, '0')}</span>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="truncate font-serif text-xl text-[#0B1220] transition-transform duration-500 group-hover:translate-x-1">{b.lead}</div>
                                                                <div className="mt-0.5 truncate text-[13px] text-[#4A4F5C]">{b.sector} · {b.city}</div>
                                                            </div>
                                                            <ArrowUpRight className="h-4 w-4 shrink-0 text-[#0B1220]/30 transition-colors group-hover:text-[#9A7B3F]" />
                                                        </Link>
                                                    </li>
                                                </Reveal>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </section>

                {/* ================================================================ */}
                {/* REUNION                                                          */}
                {/* ================================================================ */}
                <section id="reunion" className="relative isolate scroll-mt-20 overflow-hidden bg-[#070B14] py-24 text-[#F7F3EA] lg:py-32">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <img src="/images/campus/reunion-parade-rcc.jpg" alt="" loading="lazy" className="h-full w-full object-cover object-[center_35%]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#070B14]/75 to-[#070B14]/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/70 to-transparent" />
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
                <section id="contact" className="scroll-mt-20 bg-white py-20 lg:py-28">
                    <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
                            <div className="lg:col-span-5">
                                <Reveal>
                                    <Eyebrow index="08">Secretariat</Eyebrow>
                                    <h2 className="mt-6 font-serif text-5xl leading-[1.02] font-medium text-[#0B1220] lg:text-[3.25rem]">
                                        Write to the <em className="font-normal text-[#9A7B3F]">Council.</em>
                                    </h2>
                                    <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                        For membership verification, reunion reservations, endowments or chapter affiliations.
                                    </p>
                                </Reveal>

                                <Reveal delay={100}>
                                    <dl className="mt-10 space-y-5">
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
                                    <div className="bg-[#F4F2EE] p-7 sm:p-10">
                                        {contactSubmitted ? (
                                            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A55C]/15"><Check className="h-7 w-7 text-[#9A7B3F]" /></span>
                                                <h3 className="mt-6 font-serif text-3xl text-[#0B1220]">Message received.</h3>
                                                <p className="mt-3 max-w-sm text-[15px] text-[#4A4F5C]">Your note has reached the Central Secretariat. Expect a response within 24 hours.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                                <div>
                                                    <h3 className="font-serif text-3xl text-[#0B1220]">Send a message</h3>
                                                    <p className="mt-2 text-[14px] text-[#4A4F5C]">Official communications receive priority from the General Secretary’s desk.</p>
                                                </div>
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                                    <textarea required rows={3} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can the Council help?" className={`${inputCls} resize-none`} />
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
                                    <BrandMark className="h-16 w-auto shrink-0" />
                                    <div>
                                        <div className="font-serif text-2xl">ccIntake<span className="text-[#C9A55C] [font-variant-numeric:lining-nums]">97</span></div>
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
                                { h: 'Association', links: [['#about', 'About'], ['#colleges', 'Colleges'], ['#directory', 'Directory'], ['#committee', 'Committee']] },
                                { h: 'Activities', links: [['#welfare', 'Welfare & Trust'], ['#news', 'News & ventures'], ['#constitution', 'Charter'], ['#reunion', 'Reunion 2027']] },
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

                        <details className="group border-b border-[#F7F3EA]/[0.08] py-6 text-[12px] text-[#F7F3EA]/45">
                            <summary className="cursor-pointer list-none transition-colors hover:text-[#F7F3EA]/70">
                                Campus photographs via Wikimedia Commons <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
                            </summary>
                            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                                {PHOTO_CREDITS.map((c) => (
                                    <li key={c.file}>
                                        <a href={`https://commons.wikimedia.org/wiki/Special:Search?search=${encodeURIComponent(c.file)}`} target="_blank" rel="noreferrer" className="hover:text-[#F7F3EA]/80">
                                            “{c.file}”
                                        </a>{' '}
                                        — {c.author} · {c.license}
                                    </li>
                                ))}
                            </ul>
                        </details>

                        <div className="pointer-events-none py-10 text-center font-serif text-[15vw] leading-none font-medium tracking-[-0.04em] text-[#F7F3EA]/[0.04] select-none lg:text-[12rem]">
                            ccIntake97
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
