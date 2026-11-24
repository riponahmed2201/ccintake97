import {
    Shield, Stethoscope, Cpu, Globe2, Coins, Scale, HeartHandshake, GraduationCap, Percent,
} from 'lucide-react';

export const CADET_COLLEGES_DATA = [
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

export const CAMPUS_PHOTOS: Record<string, string> = {
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

// Hero slideshow — only photos sharp enough for a full-screen background.
// `dim` adds extra shade so the headline stays legible on bright daytime shots.
export const HERO_SLIDES = [
    { src: '/images/campus/hero-fcc.jpg', college: 'FCC', caption: 'Faujdarhat Cadet College', position: 'center 45%', dim: 0.35 },
    { src: '/images/campus/hero-jcc.jpg', college: 'JCC', caption: 'Jhenaidah Cadet College', position: 'center 50%', dim: 0.45 },
    { src: '/images/campus/hero-mcc.jpg', college: 'MCC', caption: 'Mirzapur Cadet College', position: 'center 40%', dim: 0.4 },
    { src: '/images/campus/hero-rcc-sunset.jpg', college: 'RCC', caption: 'Rajshahi Cadet College, at dusk', position: 'center 60%', dim: 0 },
    { src: '/images/campus/hero-scc.jpg', college: 'SCC', caption: 'Sylhet Cadet College', position: 'center 50%', dim: 0.5 },
    { src: '/images/campus/hero-ccr.jpg', college: 'CCR', caption: 'Rangpur Cadet College', position: 'center 50%', dim: 0.35 },
    { src: '/images/campus/hero-bcc.jpg', college: 'BCC', caption: 'Barishal Cadet College', position: 'center 45%', dim: 0.45 },
    { src: '/images/campus/hero-pcc.jpg', college: 'PCC', caption: 'Pabna Cadet College', position: 'center 50%', dim: 0.55 },
    { src: '/images/campus/hero-mgcc.jpg', college: 'MGCC', caption: "Mymensingh Girls' Cadet College", position: 'center 50%', dim: 0.35 },
    { src: '/images/campus/hero-ccc.jpg', college: 'CCC', caption: 'Cumilla Cadet College', position: 'center 55%', dim: 0.4 },
];
export const HERO_INTERVAL = 6500;

export const CAMPUS_LIFE = [
    { src: '/images/campus/athletics.jpg', title: 'Inter-house athletics', place: 'RCC' },
    { src: '/images/campus/playground-mcc.jpg', title: 'The parade ground', place: 'MCC' },
    { src: '/images/campus/rcc.jpg', title: 'The academic block', place: 'RCC' },
    { src: '/images/campus/fcc.jpg', title: 'Where it all began', place: 'FCC' },
    { src: '/images/campus/ccr.jpg', title: 'Northern sentinel', place: 'CCR' },
];

// Wikimedia Commons photographs — CC BY-SA unless noted. Attribution is required.
export const PHOTO_CREDITS = [
    { file: 'Sunset at Rajshahi Cadet College (3)', author: 'AfnanAnwar20', license: 'CC BY-SA 4.0' },
    { file: 'Faujdarhat Cadet College Front View (cropped)', author: 'Rafi Bin Tofa', license: 'CC BY-SA 4.0' },
    { file: 'Mirzapur Cadet College, Dhaka', author: 'মুসফিক মুন্না', license: 'CC BY-SA 4.0' },
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

export const REGIONS = ['All', 'Greater Dhaka', 'Chittagong', 'Rajshahi/Rangpur', 'Khulna/Barishal', 'Sylhet', 'Girls Colleges'];

export const SECTORS = [
    { title: 'Armed Forces & Defense', count: '84', unit: 'Officers & Commanders', icon: Shield, description: 'Brigadiers, Commodores, Air Commodores and Battalion Commanders across UN Peacekeeping and national defense commands.', highlight: 'Army · Navy · Air Force' },
    { title: 'Medicine & Healthcare', count: '96', unit: 'Surgeons & Specialists', icon: Stethoscope, description: 'Fellows of the Royal Colleges, professors of neurosurgery, cardiology chiefs and public-health innovators worldwide.', highlight: 'UK NHS · BSMU · US Healthcare' },
    { title: 'Technology & AI', count: '114', unit: 'Engineers & Founders', icon: Cpu, description: 'Principal architects and VPs at global technology firms, alongside venture-backed founders building fintech and AI infrastructure.', highlight: 'Silicon Valley · Singapore · Dhaka' },
    { title: 'Foreign Service & Diplomacy', count: '24', unit: 'Envoys & Diplomats', icon: Globe2, description: 'Career diplomats, counsellors and UN delegates representing Bangladesh in Geneva, New York, Tokyo, Canberra and London.', highlight: 'Foreign Affairs · United Nations' },
    { title: 'Banking & Global Capital', count: '86', unit: 'Managing Directors', icon: Coins, description: 'Managing directors, private-equity partners and chief risk officers in Canary Wharf, Wall Street and DIFC Dubai.', highlight: 'Wall Street · London · DIFC' },
    { title: 'Judiciary & Corporate Law', count: '48', unit: 'Barristers & Jurists', icon: Scale, description: 'Advocates of the Supreme Court, constitutional jurists and partners leading corporate and arbitration practices.', highlight: 'Supreme Court · Cross-border Law' },
];

export const TIMELINE_MILESTONES = [
    { year: '1997', title: 'Induction', tagline: 'Class 7 · ten colleges', description: 'Cadets enter Faujdarhat, Jhenaidah, Mirzapur, Rajshahi, Sylhet, Rangpur, Barishal, Pabna, Mymensingh Girls’ and Cumilla — known ever after by college, house and roll.' },
    { year: '~2003', title: 'Passing out', tagline: 'About six years on', description: 'Most of the intake complete HSC and leave the colleges around 2003, after the years from Class 7 to Class 12.' },
    { year: 'Now', title: 'The association', tagline: 'Directory & verification', description: 'ccIntake97 keeps a verified roll so batchmates can find one another, and a place for welfare alongside the reunion.' },
    { year: '2027', title: 'Reunion', tagline: 'Planned · Dhaka', description: 'Thirty years after induction — a gathering of batchmates, families and faculty, planned for 2027 in Dhaka.' },
];

export const SAMPLE_VERIFIED_MEMBERS = [
    { name: 'Brig. Gen. K. M. Tanvir', post: 'ndc, psc', code: 'JCC ’97', role: 'Central Executive President', location: 'Dhaka', initials: 'KT' },
    { name: 'Dr. Nusrat Ahmed', post: 'FRCS', code: 'MGCC ’97', role: 'Associate Professor of Surgery', location: 'London', initials: 'NA' },
    { name: 'Tariq Hasan', post: 'M.Sc.', code: 'FCC ’97', role: 'VP, Cloud Infrastructure & AI', location: 'Austin, TX', initials: 'TH' },
    { name: 'Barrister Navid Huq', post: '', code: 'MCC ’97', role: 'Advocate, Supreme Court', location: 'Dhaka', initials: 'NH' },
    { name: 'Cdre. Shafiqul Islam', post: 'psc, BN', code: 'CCC ’97', role: 'Commodore, Bangladesh Navy', location: 'Chattogram', initials: 'SI' },
    { name: 'Farzana Rahman', post: 'CFA', code: 'MGCC ’97', role: 'Managing Director, Private Equity', location: 'Singapore', initials: 'FR' },
    { name: 'Mahmud Karim', post: '', code: 'RCC ’97', role: 'Counsellor, Ministry of Foreign Affairs', location: 'Geneva', initials: 'MK' },
    { name: 'Dr. Ashraf Uddin', post: 'MRCP', code: 'SCC ’97', role: 'Consultant Cardiologist', location: 'Manchester', initials: 'AU' },
];

export const FALLBACK_COMMITTEE = [
    { title: 'President', name: 'Brig. Gen. (Retd.) K. M. Tanvir', college: 'JCC ’97', role: 'Strategic Advisor & Trustee' },
    { title: 'General Secretary', name: 'Barrister Navid Huq', college: 'MCC ’97', role: 'Supreme Court Appellate Division' },
    { title: 'Treasurer & Trust', name: 'Kazi Farhan Ahmed, FCA', college: 'FCC ’97', role: 'Partner, Institutional Audits' },
    { title: 'Welfare Director', name: 'Dr. Nusrat Ahmed, FRCS', college: 'MGCC ’97', role: 'Royal College Fellow, Surgeon' },
];

export const WELFARE_PILLARS = [
    { icon: HeartHandshake, figure: '৳42M+', label: 'Disbursed', title: 'Emergency Medical Lifeline', description: 'Zero-friction ICU and emergency funding, released within three hours of verification — anywhere in the world.' },
    { icon: GraduationCap, figure: '18', label: 'Scholars', title: "Children's Education Trust", description: 'Full tuition and mentorship for every child of a fallen batchmate, through to university graduation.' },
    { icon: Globe2, figure: '12,000+', label: 'Families', title: 'National Disaster Relief', description: 'Rapid deployment of water filtration, medical camps and rehabilitation during national flood crises.' },
    { icon: Percent, figure: 'Alumni', label: 'Rates', title: 'Batchmate Enterprise Offers', description: 'Preferential pricing on diagnostics, legal retainers, cloud infrastructure and international logistics.' },
];

export const FALLBACK_BUSINESSES = [
    { tag: 'Infrastructure', lead: 'Tanvir Engineering Ltd.', sector: 'Civil & Defense Contracting', city: 'Dhaka' },
    { tag: 'Software', lead: 'Apex Cloud Solutions', sector: 'Fintech & Cloud Systems', city: 'Dhaka · Austin' },
    { tag: 'Legal', lead: 'Huq & Associates', sector: 'Cross-Border Arbitration', city: 'Dhaka · London' },
    { tag: 'Logistics', lead: 'TransOcean Logistics Ltd.', sector: 'Maritime Freight & Air Cargo', city: 'Chittagong · Singapore' },
];

export const FALLBACK_ARTICLES = [
    { title: 'Central Secretariat announces the Grand Reunion 2027 Executive Committee', cat: 'Official Dispatch', date: 'November 2024', excerpt: 'Regional coordinators appointed to oversee the 30th Anniversary Grand Reunion in Dhaka.' },
    { title: 'Welfare Trust mobilises rapid relief across the eastern flood zones', cat: 'Welfare & Relief', date: 'October 2024', excerpt: 'Medical supplies, water filtration units and rations dispatched by alumni physicians to Feni and Cumilla.' },
    { title: 'Archival photo preservation: the Class of 1997 roll is digitised', cat: 'Heritage', date: 'September 2024', excerpt: 'Over 450 passing-out, drill-square and championship photographs now authenticated in the digital vault.' },
];

export const CHARTER_ARTICLES = [
    { numeral: 'I', title: 'Name & Parity', text: 'Constituted as the central body representing exclusively the 1997 intake, with equal sovereign parity among all ten colleges.' },
    { numeral: 'II', title: 'Strict 1997 Scoping', text: 'Admission by verified intake roll records, batchmate endorsement and executive committee approval.' },
    { numeral: 'III', title: 'Non-Political Mandate', text: 'Strictly non-political and fraternal. Bi-annual leadership rotation across every college chapter.' },
    { numeral: 'IV', title: 'Fiduciary Transparency', text: 'Every welfare and endowment contribution is audited annually by chartered accountants and published to members.' },
];

export const NEWS_FALLBACK_PHOTOS = ['/images/campus/playground-mcc.jpg', '/images/campus/athletics.jpg', '/images/campus/mgcc.jpg'];
