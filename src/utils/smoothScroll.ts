export interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  offset?: number;
}

const easingFunctions = {
  linear: (t: number): number => t,
  easeInOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOut: (t: number): number => t * (2 - t),
  easeIn: (t: number): number => t * t,
};

/**
 * Smoothly scrolls to a target. For element/selector targets the destination is
 * recomputed every frame (and snapped at the end) so the scroll still lands
 * correctly even if content above it changes height mid-animation — e.g. lazy
 * images, web-font swap, scroll-reveal elements, or the async résumé PDF.
 */
const smoothScrollTo = (
  target: string | Element | number,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  const { duration = 800, easing = easingFunctions.easeInOut, offset = 0 } = options;

  return new Promise((resolve) => {
    const getTargetY = (): number | null => {
      if (typeof target === 'number') return target;

      let element: Element | null = null;
      if (typeof target === 'string') {
        element = document.querySelector(target);
      } else if (target instanceof Element) {
        element = target;
      }

      if (!element) return null;
      return element.getBoundingClientRect().top + window.scrollY - offset;
    };

    const initialTarget = getTargetY();
    if (initialTarget === null) {
      console.warn(`smoothScrollTo: target "${String(target)}" not found`);
      resolve();
      return;
    }

    const startY = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      // Recompute live each frame so layout shifts above the target don't throw off the landing.
      const targetY = getTargetY() ?? initialTarget;
      window.scrollTo(0, startY + (targetY - startY) * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Final snap to the live position.
        window.scrollTo(0, getTargetY() ?? targetY);
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};

// Matches the fixed navbar height (h-16 = 64px) so sections land flush beneath it.
export const scrollToSection = (sectionId: string, offset: number = 64): Promise<void> => {
  return smoothScrollTo(`#${sectionId}`, {
    duration: 500,
    easing: easingFunctions.easeOut,
    offset,
  });
};

export const scrollToTop = (options: SmoothScrollOptions = {}): Promise<void> => {
  return smoothScrollTo(0, {
    duration: 600,
    easing: easingFunctions.easeOut,
    ...options,
  });
};
