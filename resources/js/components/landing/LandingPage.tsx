import SiteHeader from '@/components/site-header';
import { SCROLL_SPY_SECTIONS } from '@/components/landing/nav-links';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { useLandingPage } from '@/hooks/use-landing-page';
import type { WelcomeProps } from '@/components/landing/types';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingAbout } from '@/components/landing/LandingAbout';
import { LandingColleges } from '@/components/landing/LandingColleges';
import { LandingTimeline } from '@/components/landing/LandingTimeline';
import { LandingCampusLife } from '@/components/landing/LandingCampusLife';
import { LandingDirectory } from '@/components/landing/LandingDirectory';
import { LandingSectors } from '@/components/landing/LandingSectors';
import { LandingEvents } from '@/components/landing/LandingEvents';
import { LandingCommittee } from '@/components/landing/LandingCommittee';
import { LandingWelfare } from '@/components/landing/LandingWelfare';
import { LandingNews } from '@/components/landing/LandingNews';
import { LandingReunion } from '@/components/landing/LandingReunion';
import { LandingContact } from '@/components/landing/LandingContact';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { SignupDialogProvider } from '@/contexts/signup-dialog-context';

const DEFAULT_METRICS = {
    total_members: 500,
    verified_members: 0,
    total_colleges: 10,
    intake_year: 1997,
};

export function LandingPage({
    colleges = [],
    events = [],
    articles = [],
    committee,
    businesses = [],
    metrics = DEFAULT_METRICS,
    directoryPreview = [],
    cms,
}: WelcomeProps) {
    const landing = useLandingPage(colleges);
    const activeNav = useScrollSpy(SCROLL_SPY_SECTIONS);

    return (
        <SignupDialogProvider>
        <div className="min-h-screen bg-brand-cream font-sans text-brand-navy antialiased selection:bg-brand-gold selection:text-brand-navy">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-4 focus:rounded-full focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-brand-cream-text"
            >
                Skip to main content
            </a>
            <SiteHeader
                variant="hero"
                activeNav={activeNav}
                scrolled={landing.scrolled}
                mobileMenuOpen={landing.mobileMenuOpen}
                onMobileMenuOpenChange={landing.setMobileMenuOpen}
            />
            <main id="main-content">
                <LandingHero
                    metrics={metrics}
                    mergedColleges={landing.mergedColleges}
                    heroSlide={landing.heroSlide}
                    setHeroSlide={landing.setHeroSlide}
                    heroPaused={landing.heroPaused}
                    setHeroPaused={landing.setHeroPaused}
                    cmsSlides={cms?.heroSlides}
                    heroConfig={cms?.heroConfig}
                />
                <LandingAbout />
                <LandingColleges
                    selectedRegion={landing.selectedRegion}
                    setSelectedRegion={landing.setSelectedRegion}
                    activeCollege={landing.activeCollege}
                    filteredColleges={landing.filteredColleges}
                    featureRef={landing.featureRef}
                    selectCollege={landing.selectCollege}
                    stepCollege={landing.stepCollege}
                />
                <LandingTimeline milestones={cms?.milestones} />
                <LandingCampusLife galleryItems={cms?.galleryItems} />
                <LandingDirectory
                    directoryPreview={directoryPreview}
                    mergedColleges={landing.mergedColleges}
                    metrics={metrics}
                    spotlightRef={landing.spotlightRef}
                    spotlightPaused={landing.spotlightPaused}
                    setSpotlightPaused={landing.setSpotlightPaused}
                    scrollSpotlight={landing.scrollSpotlight}
                    directorySearch={landing.directorySearch}
                    setDirectorySearch={landing.setDirectorySearch}
                    submitDirectorySearch={landing.submitDirectorySearch}
                />
                <LandingSectors />
                <LandingEvents events={events} />
                <LandingCommittee committee={committee} mergedColleges={landing.mergedColleges} />
                <LandingWelfare />
                <LandingNews articles={articles} businesses={businesses} />
                <LandingReunion />
                <LandingContact
                    contactSubmitted={landing.contactSubmitted}
                    contactForm={landing.contactForm}
                    setContactForm={landing.setContactForm}
                    handleContactSubmit={landing.handleContactSubmit}
                />
            </main>
            <LandingFooter />
        </div>
        </SignupDialogProvider>
    );
}