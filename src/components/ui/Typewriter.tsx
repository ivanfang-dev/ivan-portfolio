import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface TypewriterProps {
  /** Phrases to cycle through, typed and deleted in order. */
  phrases: string[];
  /** ms per character while typing. */
  typingSpeed?: number;
  /** ms per character while deleting. */
  deletingSpeed?: number;
  /** ms to hold a fully-typed phrase before deleting. */
  pauseMs?: number;
  className?: string;
  /** Tailwind classes for the blinking cursor (e.g. a color). */
  cursorClassName?: string;
}

/**
 * Cycling typewriter: types each phrase, holds, deletes, then moves on.
 * Counts by Unicode code points (via Array.from) so emoji aren't split
 * mid-surrogate-pair. Respects prefers-reduced-motion by showing the first
 * phrase statically.
 */
const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseMs = 1600,
  className = '',
  cursorClassName = 'bg-ucla-blue',
}) => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const chars = Array.from(phrases[index % phrases.length]);

    // Fully typed → pause, then start deleting.
    if (!deleting && count === chars.length) {
      const t = window.setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    // Fully deleted → advance to the next phrase.
    if (deleting && count === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    // Otherwise type or delete a single character.
    const t = window.setTimeout(
      () => setCount((c) => c + (deleting ? -1 : 1)),
      deleting ? deletingSpeed : typingSpeed,
    );
    return () => clearTimeout(t);
  }, [count, deleting, index, phrases, reduce, typingSpeed, deletingSpeed, pauseMs]);

  const current = phrases[index % phrases.length];
  const displayed = reduce ? phrases[0] : Array.from(current).slice(0, count).join('');

  return (
    <span className={className}>
      {/* aria-label keeps the line readable to assistive tech as it animates. */}
      <span aria-label={phrases[0]}>{displayed}</span>
      <motion.span
        aria-hidden
        className={`inline-block w-[3px] h-[0.95em] translate-y-[0.12em] ml-1 rounded-[1px] ${cursorClassName}`}
        animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
      />
    </span>
  );
};

export default Typewriter;
