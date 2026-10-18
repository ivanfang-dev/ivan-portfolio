import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls, useInView, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { EASE } from '../../utils/motion';

interface ExplosiveImageProps {
  src: string;
  alt: string;
  className?: string;
  explosionThreshold?: number;
  surpriseImage?: string;
  surpriseAlt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

const CONFETTI_COLORS = ['#2774ae', '#ffd100', '#8bb8e8', '#ffffff'];

// Literal class names so Tailwind can see them.
const OBJECT_FIT = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  'scale-down': 'object-scale-down',
  none: 'object-none',
} as const;

/**
 * The About photo, with someone hiding behind it. Each click boops the photo
 * and fills a gold ring around it — honest progress toward the reveal — until
 * the dog takes over in a burst of confetti. Click again to swap back.
 *
 * The photos are circular cut-outs, so the button, ring and focus outline are
 * all round to match.
 */
const ExplosiveImage: React.FC<ExplosiveImageProps> = ({
  src,
  alt,
  className = '',
  explosionThreshold = 5,
  surpriseImage = `${import.meta.env.BASE_URL}ivan-surprise.webp`,
  surpriseAlt = 'The real star of the show: a fluffy white dog sitting in autumn leaves',
  objectFit = 'contain',
}) => {
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const boop = useAnimationControls();
  const inView = useInView(buttonRef, { once: true, amount: 0.6 });

  const [clicks, setClicks] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const [backToMe, setBackToMe] = useState(false);
  const backTimer = useRef<number | undefined>(undefined);

  // Offer the hint once, after the About wipe has finished and the photo is
  // actually on screen — never while the visitor is still up in the hero.
  useEffect(() => {
    if (!inView) return;
    const show = window.setTimeout(() => setHint(true), 1200);
    const hide = window.setTimeout(() => setHint(false), 6000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [inView]);

  useEffect(() => () => window.clearTimeout(backTimer.current), []);

  const burst = () => {
    const el = buttonRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
    confetti({ particleCount: 180, spread: 80, startVelocity: 42, origin, colors: CONFETTI_COLORS, scalar: 0.9, zIndex: 9999 });
    confetti({ particleCount: 120, spread: 130, startVelocity: 28, origin, colors: CONFETTI_COLORS, scalar: 0.7, zIndex: 9999 });
  };

  const handleClick = () => {
    setHint(false);

    if (revealed) {
      setRevealed(false);
      setClicks(0);
      setBackToMe(true);
      window.clearTimeout(backTimer.current);
      backTimer.current = window.setTimeout(() => setBackToMe(false), 2200);
      return;
    }

    setBackToMe(false);
    if (!reduce) {
      boop.start({ scale: [1, 0.94, 1.025, 1], transition: { duration: 0.36, times: [0, 0.3, 0.7, 1], ease: 'easeOut' } });
    }

    const next = clicks + 1;
    if (next >= explosionThreshold) {
      setClicks(explosionThreshold);
      setRevealed(true);
      burst();
    } else {
      setClicks(next);
    }
  };

  const remaining = explosionThreshold - clicks;
  const bubble: { text: string; tone: 'blue' | 'gold' } | null = revealed
    ? { text: 'Meet the real star of the show 🐶', tone: 'gold' }
    : backToMe
      ? { text: 'Okay, back to me 😄', tone: 'blue' }
      : clicks > 0
        ? { text: remaining === 1 ? 'One more! 🐾' : `${remaining} more clicks 🐾`, tone: 'blue' }
        : hint
          ? { text: 'Psst, someone wants to say hi 🐾', tone: 'blue' }
          : null;

  const status = revealed
    ? 'Surprise revealed.'
    : clicks > 0
      ? `${remaining} more ${remaining === 1 ? 'click' : 'clicks'} to the surprise.`
      : '';

  const imgClass = `absolute inset-0 w-full h-full ${OBJECT_FIT[objectFit]} select-none`;
  const progress = clicks / explosionThreshold;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-label={revealed ? `${surpriseAlt}. Click to switch back.` : `${alt}. Click a few times for a surprise.`}
        className="relative block w-full aspect-square rounded-full cursor-pointer"
        whileHover={reduce ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* Progress ring — fills a fifth per click. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          // overflow-visible: the ring scales past its viewBox when the dog appears.
          className="pointer-events-none absolute -inset-2.5 h-[calc(100%+1.25rem)] w-[calc(100%+1.25rem)] -rotate-90 overflow-visible"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="48.5"
            fill="none"
            className="stroke-ucla-blue/15"
            strokeWidth="0.8"
            initial={false}
            animate={{ opacity: clicks > 0 && !revealed ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48.5"
            fill="none"
            className="stroke-ucla-gold"
            strokeWidth="1"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: progress, opacity: clicks > 0 ? 1 : 0, scale: revealed && !reduce ? 1.04 : 1 }}
            transition={{
              pathLength: { type: 'spring', stiffness: 260, damping: 24 },
              opacity: { duration: revealed ? 0.6 : 0.2, delay: revealed ? 0.35 : 0 },
              scale: { duration: 0.6, ease: EASE },
            }}
            style={{ transformOrigin: '50% 50%' }}
          />
        </svg>

        <motion.div className="absolute inset-0" animate={boop}>
          <motion.img
            src={src}
            alt=""
            draggable={false}
            className={imgClass}
            initial={false}
            animate={{ opacity: revealed ? 0 : 1, scale: revealed && !reduce ? 0.85 : 1 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
          <AnimatePresence>
            {revealed && (
              <motion.img
                key="surprise"
                src={surpriseImage}
                alt=""
                draggable={false}
                className={imgClass}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.9, transition: { duration: 0.25 } }}
                transition={reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 320, damping: 18, delay: 0.12 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>

      {/* Speech bubble above the photo */}
      <AnimatePresence mode="wait">
        {bubble && (
          <motion.div
            key={bubble.text}
            aria-hidden
            className="pointer-events-none absolute bottom-full left-1/2 mb-6 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 480, damping: 28 }}
            style={{ transformOrigin: '50% 100%' }}
          >
            <span
              className={`relative block w-max max-w-[17rem] rounded-xl px-3.5 py-2 text-sm font-medium shadow-[0_8px_24px_-8px_rgba(20,47,76,0.35)] ${
                bubble.tone === 'gold' ? 'bg-ucla-gold text-ink' : 'bg-ucla-blue text-white'
              }`}
            >
              {bubble.text}
              <span
                className={`absolute top-full left-1/2 -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent ${
                  bubble.tone === 'gold' ? 'border-t-ucla-gold' : 'border-t-ucla-blue'
                }`}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <span role="status" className="sr-only">
        {status}
      </span>
    </div>
  );
};

export default ExplosiveImage;
