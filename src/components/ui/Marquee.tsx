import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Seamless infinite horizontal marquee. Renders two identical tracks and
 * translates by exactly one track width so the loop is invisible.
 */
const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 32,
  reverse = false,
  className = '',
}) => {
  const reduce = useReducedMotion();

  const track = (
    <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
  );

  if (reduce) {
    return (
      <div className={`flex justify-center overflow-hidden ${className}`}>{track}</div>
    );
  }

  return (
    <div className={`flex overflow-hidden ${className}`}>
      <motion.div
        className="flex shrink-0"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {track}
        <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Marquee;
