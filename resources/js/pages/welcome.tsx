import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { College, Event, Article, Committee } from '@/types/intake97';
import { 
    GraduationCap, 
    Calendar, 
    Users, 
    Building2, 
    ShieldCheck, 
    ArrowRight, 
    MapPin, 
    Clock, 
    Newspaper, 
    HeartHandshake, 
    Award, 
    ExternalLink,
    ChevronRight,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

interface WelcomeProps {
    colleges: (College & { members_count: number })[];
    events: Event[];
    articles: Article[];
    committee: Committee | null;
    metrics: {
        total_members: number;
        verified_members: number;
        total_colleges: number;
        intake_year: number;
    };
}

export default function Welcome({ colleges = [], events = [], articles = [], committee, metrics }: WelcomeProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };

    return (
        <>
            <Head title="INTAKE97.COM — Cadet College Alumni Association (1997 Intake)" />

            <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
                {/* Top Notification / Banner */}
                <div className="bg-slate-900 px-4 py-2 text-xs text-slate-300 sm:px-6">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                            <span>Official Platform for Bangladesh Cadet Colleges — Class of 1997 Intake</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-slate-400">
                            <span>Strict 1997 Intake Verification Required</span>
                            <span>•</span>
                            <a href="#colleges" className="hover:text-white transition">Participating Colleges</a>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-serif font-black text-xl shadow-md border border-slate-700">
                                97
                            </div>
                            <div>
                                <div className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                                    INTAKE97.COM
                                    <Badge variant="outline" className="border-amber-500/40 bg-amber-50 text-amber-700 text-[10px] px-1 py-0 h-4">
                                        ALUMNI
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-500 hidden sm:block">
                                    Cadet College Alumni Association (Intake 1997)
                                </p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                            <a href="#colleges" className="hover:text-slate-900 transition">Colleges</a>
                            <a href="#events" className="hover:text-slate-900 transition">Events</a>
                            <a href="#news" className="hover:text-slate-900 transition">Announcements</a>
                            <a href="#leadership" className="hover:text-slate-900 transition">Leadership</a>
                            <a href="#about" className="hover:text-slate-900 transition">Verification Policy</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link href="/dashboard">
                                    <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm">
                                        <span>Alumni Dashboard</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register-alumni">
                                        <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm gap-1.5">
                                            <span>Register Alumni</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-20 lg:py-28">
                    {/* Background Graphic Accents */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                    
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs text-amber-300">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                                    <span>27+ Years of Bond & Excellence — Since 1997</span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                                    One Brotherhood. <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
                                        Every Cadet College.
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                                    The dedicated digital sanctuary and alumni operations network for cadets who joined Bangladesh Cadet Colleges in the intake of 1997. Reconnecting across borders, empowering careers, and driving social welfare.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <Link href="/register-alumni">
                                        <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-7 h-12 gap-2 shadow-lg shadow-amber-500/20">
                                            <span>Apply for 1997 Intake Membership</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button size="lg" variant="outline" className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 h-12 px-6">
                                            Member Portal Login
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-slate-300">
                                    <div>
                                        <div className="text-2xl font-black text-amber-400">{metrics.verified_members}+</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Verified 97 Alumni</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-amber-400">{metrics.total_colleges}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Participating Colleges</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-amber-400">1997</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Intake Batch Year</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Right Visual / Card */}
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 backdrop-blur p-6 shadow-2xl relative">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                            <span className="font-semibold text-sm text-slate-200">Verified Alumni Registry</span>
                                        </div>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                                            Class of '97
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 text-xs text-slate-300">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40">
                                            <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
                                                <GraduationCap className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-200">Cadet College Authenticity</div>
                                                <div className="text-slate-400 mt-0.5">Every registrant is vetted against cadet college records, cadet numbers, and peer references.</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40">
                                            <div className="p-2 rounded-md bg-blue-500/10 text-blue-400">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-200">Professional Networking & Mentorship</div>
                                                <div className="text-slate-400 mt-0.5">Direct access to C-level executives, defense veterans, doctors, engineers, and entrepreneurs in 30+ countries.</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40">
                                            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-200">Reunions & QR Pass Attendance</div>
                                                <div className="text-slate-400 mt-0.5">Secure registration and instant digital entry pass for reunions and national gatherings.</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                                        <span>Official Intake: <strong>1997</strong></span>
                                        <Link href="/register-alumni" className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
                                            Apply for Access <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Participating Colleges Network Section */}
                <section id="colleges" className="py-16 sm:py-20 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <Badge variant="outline" className="mb-2 border-slate-300 bg-slate-100 text-slate-700 font-medium">
                                Participating Colleges
                            </Badge>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                The 1997 Cadet College Network
                            </h2>
                            <p className="mt-3 text-slate-600 text-sm sm:text-base">
                                Cadets admitted in 1997 across all participating Bangladesh Cadet Colleges. Only institutions that had active 1997 intakes are part of this alumni association.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {colleges.map((college) => (
                                <Card key={college.id} className="hover:shadow-md transition-shadow border-slate-200">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-slate-900 text-white font-mono text-xs">
                                                {college.short_name}
                                            </Badge>
                                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {college.location}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900 mt-2 line-clamp-1">
                                            {college.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
                                        <p className="line-clamp-2 text-slate-500">
                                            {college.description || `Established in ${college.established_year}.`}
                                        </p>
                                        <div className="pt-2 border-t flex items-center justify-between text-slate-700 font-medium">
                                            <span>Registered '97 Cadets:</span>
                                            <Badge variant="secondary" className="font-semibold">
                                                {college.members_count || 0}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-8 rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-slate-800">Historical Intake Accuracy Note:</strong> Colleges established after 1997 (such as Feni Girls Cadet College and Joypurhat Girls Cadet College) did not have a 1997 intake and are systematically excluded from 1997 membership according to the association bylaws.
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Events Section */}
                <section id="events" className="py-16 sm:py-20 bg-slate-100/70 border-y border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                            <div>
                                <Badge variant="outline" className="mb-2 border-slate-300 bg-white text-slate-700">
                                    Reunions & Gatherings
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Upcoming Batch Events
                                </h2>
                                <p className="mt-2 text-slate-600 text-sm max-w-xl">
                                    Connect in person at our grand reunions, regional get-togethers, and family days.
                                </p>
                            </div>
                            <Link href="/login" className="mt-4 md:mt-0">
                                <Button variant="outline" className="gap-1.5 text-xs">
                                    <span>View All Events in Member Portal</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>

                        {events.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                                <Calendar className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                                <h3 className="font-semibold text-slate-800">No Public Events Scheduled</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                    The executive committee is planning the next grand reunion. Log in as a member to see internal gatherings.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => (
                                    <Card key={event.id} className="overflow-hidden bg-white border-slate-200 flex flex-col justify-between hover:shadow-md transition">
                                        <div>
                                            <div className="h-36 bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white flex flex-col justify-between relative">
                                                <Badge className="self-start bg-amber-500 text-slate-950 font-semibold text-[10px]">
                                                    {event.category?.name || 'Reunion'}
                                                </Badge>
                                                <div>
                                                    <span className="text-xs text-amber-300 font-medium">
                                                        {new Date(event.starts_on).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">
                                                        {event.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 space-y-3 text-xs text-slate-600">
                                                <p className="line-clamp-2 text-slate-500">
                                                    {event.description}
                                                </p>
                                                <div className="space-y-1.5 text-slate-600 pt-2 border-t">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="truncate">{event.venue}, {event.city || 'Dhaka'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                        <span>{event.start_time || 'Full Day'}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>

                                        <div className="p-4 pt-0">
                                            <Link href="/login" className="w-full block">
                                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-9">
                                                    Sign In to Register
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Association Leadership Section */}
                {committee && (
                    <section id="leadership" className="py-16 sm:py-20 bg-white">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <Badge variant="outline" className="mb-2 border-slate-300 bg-slate-100 text-slate-700">
                                    Association Leadership
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    {committee.name}
                                </h2>
                                <p className="mt-2 text-slate-600 text-sm">
                                    {committee.description || 'Serving the 1997 intake community with transparency and dedication.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {committee.members?.slice(0, 8).map((cm) => (
                                    <div key={cm.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-center">
                                        <div className="mx-auto h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xl mb-3 border-2 border-white shadow-sm overflow-hidden">
                                            {cm.member?.user?.avatar_path ? (
                                                <img src={cm.member.user.avatar_path} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                cm.member?.user?.name?.slice(0, 2).toUpperCase() || 'CC'
                                            )}
                                        </div>
                                        <Badge variant="secondary" className="text-[11px] mb-1 font-semibold text-amber-800 bg-amber-100">
                                            {cm.position_title}
                                        </Badge>
                                        <h3 className="font-bold text-slate-900 text-sm mt-1">
                                            {cm.member?.user?.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {cm.member?.college?.name}
                                        </p>
                                        {cm.bio && (
                                            <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                                                {cm.bio}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Latest Announcements & News */}
                <section id="news" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                            <div>
                                <Badge variant="outline" className="mb-2 border-slate-300 bg-white text-slate-700">
                                    Official News
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Announcements & Stories
                                </h2>
                                <p className="mt-2 text-slate-600 text-sm max-w-xl">
                                    Latest updates on association initiatives, member achievements, and official communiques.
                                </p>
                            </div>
                        </div>

                        {articles.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 text-xs">
                                No published articles currently available.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {articles.map((article) => (
                                    <Card key={article.id} className="bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                                        <CardHeader className="p-5 pb-3">
                                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {article.category?.name || 'General'}
                                                </Badge>
                                                <span>
                                                    {article.published_at 
                                                        ? new Date(article.published_at).toLocaleDateString() 
                                                        : 'Recent'}
                                                </span>
                                            </div>
                                            <CardTitle className="text-base font-bold text-slate-900 line-clamp-2">
                                                {article.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 pt-0 text-xs text-slate-600">
                                            <p className="line-clamp-3 text-slate-500 mb-4">
                                                {article.excerpt || article.content?.slice(0, 140) + '...'}
                                            </p>
                                            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-1">
                                                <span>Read Full Story</span>
                                                <ChevronRight className="h-3 w-3" />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Verification & Trust / Policy Statement */}
                <section id="about" className="py-16 bg-slate-900 text-slate-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div className="space-y-4">
                                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    Security & Integrity First
                                </Badge>
                                <h2 className="text-3xl font-extrabold text-white">
                                    Strict Alumni Verification Workflow
                                </h2>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    To protect member privacy and keep networking genuine, INTAKE97.COM is strictly closed to the general public. Every application undergoes systematic verification by college batch representatives:
                                </p>
                                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Cross-referenced against verified Cadet College 1997 intake records and cadet numbers.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Peer voucher validation from verified batchmates.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Granular privacy controls: each member chooses what contact information to disclose.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 sm:p-8 space-y-6">
                                <h3 className="text-lg font-bold text-white">Are you a 1997 Cadet College Intake Alumnus?</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Join over {metrics.verified_members} verified batchmates across the world. Registering takes only 3 minutes.
                                </p>
                                <div className="space-y-3">
                                    <Link href="/register-alumni" className="block w-full">
                                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-11">
                                            Start Alumni Registration
                                        </Button>
                                    </Link>
                                    <Link href="/login" className="block w-full">
                                        <Button variant="outline" className="w-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 h-11 text-xs">
                                            Already Registered? Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div className="space-y-3 md:col-span-2">
                                <div className="flex items-center gap-2 text-white font-bold text-base">
                                    <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500 text-slate-950 font-bold text-sm">
                                        97
                                    </div>
                                    <span>INTAKE97.COM</span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                                    Official Central Alumni Association Management System for the 1997 intake of Bangladesh Cadet Colleges. Fostering unity, integrity, and mutual progress.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Quick Links</h4>
                                <ul className="space-y-2 text-xs">
                                    <li><a href="#colleges" className="hover:text-white transition">Colleges List</a></li>
                                    <li><a href="#events" className="hover:text-white transition">Batch Events</a></li>
                                    <li><a href="#leadership" className="hover:text-white transition">Executive Committee</a></li>
                                    <li><Link href="/register-alumni" className="hover:text-white transition">Alumni Registration</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Portal Access</h4>
                                <ul className="space-y-2 text-xs">
                                    <li><Link href="/login" className="hover:text-white transition">Member Login</Link></li>
                                    <li><Link href="/login" className="hover:text-white transition">Admin Panel</Link></li>
                                    <li><span className="text-slate-500">Inquiries: info@intake97.com</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
                            <div>
                                © {new Date().getFullYear()} INTAKE97.COM — All rights reserved.
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Batch of 1997</span>
                                <span>•</span>
                                <span>Bangladesh Cadet Colleges</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
