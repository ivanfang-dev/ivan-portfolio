import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export interface FullStopProps {
  /** Tailwind color class for the period (blue on light, gold on navy). */
  className?: string;
  /** Seconds after the parent reveal starts before the period drops. */
  delay?: number;
}

/**
 * The site's terminal period, given a landing. Rendered as a RevealText
 * suffix, it inherits the parent's hidden/visible variants: the words rise
 * first, then the period falls into place and squashes on impact like a
 * stamped full stop. Under reduced motion it's just a period.
 */
const FullStop: React.FC<FullStopProps> = ({ className = 'text-ucla-blue', delay = 0.55 }) => {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>.</span>;

  const drop: Variants = {
    hidden: { y: '-1.1em', opacity: 0, scaleX: 1, scaleY: 1 },
    visible: {
      y: ['-1.1em', '0em', '0em', '0em'],
      scaleX: [1, 1.4, 0.9, 1],
      scaleY: [1.15, 0.6, 1.12, 1],
      opacity: 1,
      transition: {
        delay,
        duration: 0.62,
        times: [0, 0.42, 0.7, 1],
        ease: ['easeIn', 'easeOut', 'easeInOut'],
        opacity: { delay, duration: 0.1 },
      },
    },
  };

  return (
    <motion.span
      aria-hidden
      className={`inline-block ${className}`}
      style={{ transformOrigin: '50% 82%' }}
      variants={drop}
    >
      .
    </motion.span>
  );
};

export default FullStop;
