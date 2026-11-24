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
            <div
                className={`min-h-screen font-sans text-brand-navy antialiased selection:bg-brand-gold selection:text-brand-navy ${
                    page === 'about' ? 'bg-white' : 'bg-brand-cream'
                }`}
            >
                <PublicSiteHeader active={meta.nav} surface={page === 'about' ? 'white' : 'cream'} />
                <main id="main-content" className={page === 'about' ? '' : 'pt-[76px]'}>
                    {page === 'about' && (
                        <>
                            <MarketingPageHero
                                image="/images/campus/cadets-in-class.jpg"
                                eyebrow="Our story"
                                title={
                                    <>
                                        Bound by a <em className="font-normal text-[#E8D5A3]">shared</em> beginning.
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
                                className="relative z-10 -mt-12 !scroll-mt-0 !pt-8 !pb-16 shadow-[0_32px_64px_-40px_rgba(11,18,32,0.2)] ring-1 ring-[#0B1220]/[0.06] sm:-mt-16 sm:!pt-10 sm:!pb-20 lg:mx-auto lg:max-w-[calc(1440px-5rem)] lg:rounded-[1.75rem] xl:max-w-[calc(1440px-5rem)]"
                            />
                            <LandingTimeline className="bg-white" />
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
                        <LandingColleges
                            selectedRegion={landing.selectedRegion}
                            setSelectedRegion={landing.setSelectedRegion}
                            activeCollege={landing.activeCollege}
                            filteredColleges={landing.filteredColleges}
                            featureRef={landing.featureRef}
                            selectCollege={landing.selectCollege}
                            stepCollege={landing.stepCollege}
                        />
                    )}
                    {page === 'committee' && (
                        <LandingCommittee committee={committee} mergedColleges={landing.mergedColleges} />
                    )}
                    {page === 'welfare' && <LandingWelfare />}
                    {page === 'contact' && (
                        <LandingContact
                            contactSubmitted={landing.contactSubmitted}
                            contactForm={landing.contactForm}
                            setContactForm={landing.setContactForm}
                            handleContactSubmit={landing.handleContactSubmit}
                        />
                    )}
                </main>
                <LandingFooter />
            </div>
        </SignupDialogProvider>
    );
}