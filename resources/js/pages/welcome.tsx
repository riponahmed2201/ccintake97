import { Head } from '@inertiajs/react';
import { LandingPage } from '@/components/landing/LandingPage';
import type { WelcomeProps } from '@/components/landing/types';

const SITE_NAME = 'ccIntake97 — Cadet College Alumni Association · Class of 1997';
const DESCRIPTION =
    'The central alumni association for the 1997 intake across ten cadet colleges — directory, welfare, reunion, and fraternity.';
const OG_IMAGE = '/images/campus/hero-rcc-sunset.jpg';

export default function Welcome(props: WelcomeProps) {
    const base = (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, '') ?? '';
    const canonical = base ? `${base}/` : '/';

    return (
        <>
            <Head title={SITE_NAME}>
                <meta head-key="description" name="description" content={DESCRIPTION} />
                <meta head-key="og:title" property="og:title" content={SITE_NAME} />
                <meta head-key="og:description" property="og:description" content={DESCRIPTION} />
                <meta head-key="og:image" property="og:image" content={OG_IMAGE} />
                <link head-key="canonical" rel="canonical" href={canonical} />
            </Head>
            <LandingPage {...props} />
        </>
    );
}