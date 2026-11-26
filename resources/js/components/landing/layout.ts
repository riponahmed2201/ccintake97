/**
 * Shared spacing for the public landing (1440px content grid, 76px header).
 * Use these tokens so section padding and horizontal gutters stay consistent.
 */
export const LANDING_CONTAINER = 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10';

export const LANDING_SECTION = 'scroll-mt-20 py-20 sm:py-24 lg:py-28';

/** Horizontal inset for full-bleed carousels — aligns with the container on large screens. */
export const LANDING_BLEED = 'px-5 sm:px-8 lg:px-[max(2.5rem,calc((100vw_-_1440px)/2_+_2.5rem))]';

/** Distance from section heading to primary content. */
export const LANDING_SECTION_BODY = 'mt-12 lg:mt-14';

/** Default two-column / content grid gutter. */
export const LANDING_GRID_GAP = 'gap-12 lg:gap-16';

/** Space between two major blocks inside one section (e.g. committee + charter). */
export const LANDING_SUBSECTION = 'mt-16 lg:mt-20';

/** Hero: comfortable top and bottom breathing room below sticky header. */
export const LANDING_HERO_INNER = 'pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28';

/** Horizontal scroll track — snap, hide scrollbar, use with LANDING_BLEED. */
export const LANDING_SCROLL_TRACK =
    'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';