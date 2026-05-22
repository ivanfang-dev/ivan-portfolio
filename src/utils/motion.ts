import type { Variants, Transition } from 'framer-motion';

/** Single cinematic easing curve used across the whole site. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.8,
} as const;

export const transition: Transition = { duration: DURATION.base, ease: EASE };

/** Standard reveal — fade up into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
};

/** Orchestrating parent that staggers its motion children. */
export const staggerContainer = (stagger = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Shared viewport config so reveals fire consistently on scroll. */
export const viewportOnce = { once: true, margin: '-80px' } as const;
