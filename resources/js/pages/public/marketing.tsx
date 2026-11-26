import { Head } from '@inertiajs/react';
import { LandingAbout } from '@/components/landing/LandingAbout';
import { LandingCampusLife } from '@/components/landing/LandingCampusLife';
import { LandingColleges } from '@/components/landing/LandingColleges';
import { LandingCommittee } from '@/components/landing/LandingCommittee';
import { LandingContact } from '@/components/landing/LandingContact';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingTimeline } from '@/components/landing/LandingTimeline';
import { LandingWelfare } from '@/components/landing/LandingWelfare';
import type { WelcomeProps } from '@/components/landing/types';
import { MarketingCtaBand } from '@/components/marketing/marketing-cta-band';
import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import PublicSiteHeader from '@/components/public-site-header';
import { SignupDialogProvider } from '@/contexts/signup-dialog-context';
import { useLandingPage } from '@/hooks/use-landing-page';
import { assetUrl } from '@/lib/utils';

type MarketingPage = 'about' | 'colleges' | 'committee' | 'welfare' | 'contact';

const PAGE_META: Record<MarketingPage, { title: string; nav: string }> = {
    about: { title: 'About — ccIntake97', nav: 'About' },
    colleges: { title: 'Colleges — ccIntake97', nav: 'Colleges' },
    committee: { title: 'Committee — ccIntake97', nav: 'Committee' },
    welfare: { title: 'Welfare — ccIntake97', nav: 'Welfare' },
    contact: { title: 'Contact — ccIntake97', nav: 'Contact' },
};

type Props = {
    page: MarketingPage;
    colleges?: WelcomeProps['colleges'];
    committee?: WelcomeProps['committee'];
};

export default function Marketing({ page, colleges = [], committee = null }: Props) {
    const meta = PAGE_META[page];
    const landing = useLandingPage(colleges);

    return (
        <SignupDialogProvider>
            <Head title={meta.title} />
            <div className="min-h-screen bg-white font-sans text-brand-navy antialiased selection:bg-brand-gold selection:text-white">
                <PublicSiteHeader active={meta.nav} surface="white" />
                <main id="main-content">
                    {page === 'about' && (
                        <>
                            <MarketingPageHero
                                image={assetUrl('/images/campus/cadets-in-class.jpg')}
                                eyebrow="Our story"
                                title={
                                    <>
                                        Bound by a <em className="font-normal italic text-[#F4C2C7]">shared</em> beginning.
                                    </>
                                }
                                intro="INTAKE 1997 brings together the cadets who entered ten cadet colleges that year — one cohort, still known to each other by college, house and roll."
                                stats={[
                                    { value: '1997', label: 'Induction' },
                                    { value: '10', label: 'Colleges' },
                                    { value: 'Class 7', label: 'Entry' },
                                    { value: '2027', label: 'Reunion' },
                                ]}
                            />
                            <LandingAbout
                                omitHeading
                                className="relative z-10 -mt-12 !scroll-mt-0 !pt-8 !pb-14 shadow-[0_32px_64px_-40px_rgba(9,19,36,0.22)] ring-1 ring-[#091324]/[0.07] sm:-mt-16 sm:!pt-10 sm:!pb-16 lg:mx-auto lg:max-w-[calc(1440px-5rem)] lg:rounded-[1.75rem] xl:max-w-[calc(1440px-5rem)]"
                            />
                            <LandingTimeline className="mt-12 bg-[#F8FAFC]" />
                            <LandingCampusLife className="!bg-white" />
                            <MarketingCtaBand
                                title="Explore the batch"
                                description="Browse colleges, meet verified batchmates in the directory, or start your membership application."
                                links={[
                                    { href: '/colleges', label: 'Ten cadet colleges' },
                                    { href: '/directory', label: 'Public directory' },
                                    { href: '/committee', label: 'Executive committee' },
                                ]}
                            />
                        </>
                    )}
                    {page === 'colleges' && (
                        <>
                            <MarketingPageHero
                                image={assetUrl('/images/campus/hero-fcc.jpg')}
                                eyebrow="Constituent network"
                                title={
                                    <>
                                        Ten colleges. <em className="font-normal italic text-[#F4C2C7]">Equal voice.</em>
                                    </>
                                }
                                intro="Every constituent cadet college from the 1997 intake holds an equal seat and sovereign parity in the Central Secretariat."
                                stats={[
                                    { value: '10', label: 'Colleges' },
                                    { value: '~500', label: 'Cadets' },
                                    { value: '1958', label: 'First Est.' },
                                    { value: '1997', label: 'Intake' },
                                ]}
                            />
                            <LandingColleges
                                omitHeading
                                className="relative z-10 -mt-12 !scroll-mt-0 !bg-white !pt-8 !pb-16 shadow-[0_32px_64px_-40px_rgba(9,19,36,0.22)] ring-1 ring-[#091324]/[0.07] sm:-mt-16 sm:!pt-10 sm:!pb-20 lg:mx-auto lg:max-w-[calc(1440px-5rem)] lg:rounded-[1.75rem] xl:max-w-[calc(1440px-5rem)]"
                                selectedRegion={landing.selectedRegion}
                                setSelectedRegion={landing.setSelectedRegion}
                                activeCollege={landing.activeCollege}
                                filteredColleges={landing.filteredColleges}
                                featureRef={landing.featureRef}
                                selectCollege={landing.selectCollege}
                                stepCollege={landing.stepCollege}
                            />
                            <div className="mt-16" />
                            <MarketingCtaBand
                                title="Connect with your college chapter"
                                description="Search verified batchmates by college and house, or submit your 1997 intake roll for verification."
                                links={[
                                    { href: '/directory', label: 'Public directory' },
                                    { href: '/committee', label: 'Executive committee' },
                                    { href: '/about', label: 'Our story' },
                                ]}
                            />
                        </>
                    )}
                    {page === 'committee' && (
                        <>
                            <MarketingPageHero
                                image={assetUrl('/images/campus/hero-mcc.jpg')}
                                eyebrow="Secretariat stewardship"
                                title={
                                    <>
                                        Led by <em className="font-normal italic text-[#F4C2C7]">batchmates.</em>
                                    </>
                                }
                                intro="The Central Executive Committee — elected from every college chapter to serve the whole intake with zero hierarchy."
                                stats={[
                                    { value: '10', label: 'Colleges' },
                                    { value: '2-Yr', label: 'Term' },
                                    { value: '5', label: 'Officers' },
                                    { value: '1997', label: 'Intake' },
                                ]}
                            />
                            <LandingCommittee
                                omitHeading
                                className="relative z-10 -mt-12 !scroll-mt-0 !bg-white !pt-8 !pb-16 shadow-[0_32px_64px_-40px_rgba(9,19,36,0.22)] ring-1 ring-[#091324]/[0.07] sm:-mt-16 sm:!pt-10 sm:!pb-20 lg:mx-auto lg:max-w-[calc(1440px-5rem)] lg:rounded-[1.75rem] xl:max-w-[calc(1440px-5rem)]"
                                committee={committee}
                                mergedColleges={landing.mergedColleges}
                            />
                            <div className="mt-16" />
                            <MarketingCtaBand
                                title="Participate in association governance"
                                description="Verify your 1997 intake roll to vote in executive elections, join regional chapters, or contact the Secretariat."
                                links={[
                                    { href: '/directory', label: 'Public directory' },
                                    { href: '/colleges', label: 'Ten cadet colleges' },
                                    { href: '/contact', label: 'Contact secretariat' },
                                ]}
                            />
                        </>
                    )}
                    {page === 'welfare' && (
                        <>
                            <MarketingPageHero
                                image={assetUrl('/images/campus/aerial-mcc.jpg')}
                                eyebrow="The Sacred Covenant"
                                title={
                                    <>
                                        We leave <em className="font-normal italic text-[#F4C2C7]">no comrade</em> behind.
                                    </>
                                }
                                intro="Medical lifelines, protected futures for the children of fallen batchmates, and privileges shared among our own."
                                stats={[
                                    { value: '৳42M+', label: 'Disbursed' },
                                    { value: '18', label: 'Scholars' },
                                    { value: '12,000+', label: 'Families' },
                                    { value: '100%', label: 'Audited' },
                                ]}
                            />
                            <LandingWelfare
                                omitHeading
                                className="relative z-10 -mt-12 shadow-[0_32px_64px_-40px_rgba(9,19,36,0.22)] ring-1 ring-[#091324]/[0.07] sm:-mt-16 lg:mx-auto lg:max-w-[calc(1440px-5rem)] lg:rounded-[1.75rem] xl:max-w-[calc(1440px-5rem)]"
                            />
                            <div className="mt-16" />
                            <MarketingCtaBand
                                title="Support the Intake ’97 Welfare Trust"
                                description="Contact the Secretariat to contribute to the endowment, nominate a batchmate in urgent need, or extend an alumni enterprise privilege."
                                links={[
                                    { href: '/contact', label: 'Contact secretariat' },
                                    { href: '/committee', label: 'Trustees & council' },
                                    { href: '/directory', label: 'Public directory' },
                                ]}
                            />
                        </>
                    )}
                    {page === 'contact' && (
                        <>
                            <MarketingPageHero
                                image={assetUrl('/images/campus/hero-scc.jpg')}
                                eyebrow="Central Secretariat"
                                title={
                                    <>
                                        Write to the <em className="font-normal italic text-[#F4C2C7]">Council.</em>
                                    </>
                                }
                                intro="For membership verification, Grand Reunion 2027 reservations, welfare endowments, or regional chapter affiliations."
                                stats={[
                                    { value: '4', label: 'Global Desks' },
                                    { value: '24h', label: 'Response' },
                                    { value: 'Dhaka', label: 'Secretariat' },
                                    { value: '1997', label: 'Intake' },
                                ]}
                            />
                            <LandingContact
                                omitHeading
                                className="relative z-10 -mt-12 !scroll-mt-0 !pt-10 !pb-16 shadow-[0_32px_64px_-40px_rgba(9,19,36,0.22)] ring-1 ring-[#091324]/[0.07] sm:-mt-16 sm:!pt-12 sm:!pb-20 lg:mx-auto lg:max-w-[calc(1440px-5rem)] lg:rounded-[1.75rem] xl:max-w-[calc(1440px-5rem)]"
                                contactSubmitted={landing.contactSubmitted}
                                contactForm={landing.contactForm}
                                setContactForm={landing.setContactForm}
                                handleContactSubmit={landing.handleContactSubmit}
                            />
                            <div className="mt-16" />
                            <MarketingCtaBand
                                title="Ready to verify your batch roll?"
                                description="Apply for verified membership in the 1997 intake network or browse our constituent cadet colleges."
                                links={[
                                    { href: '/directory', label: 'Public directory' },
                                    { href: '/colleges', label: 'Ten cadet colleges' },
                                    { href: '/about', label: 'Our story' },
                                ]}
                            />
                        </>
                    )}
                </main>
                <LandingFooter />
            </div>
        </SignupDialogProvider>
    );
}