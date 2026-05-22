import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { EASE } from '../../utils/motion';

// Motion-enabled wrappers, keyed by tag for type-safety.
const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

export type RevealTag = keyof typeof TAGS;

export interface RevealTextProps {
  text: string;
  as?: RevealTag;
  /** 'words' keeps text inline; 'lines' splits on \n for stacked reveals. */
  split?: 'words' | 'lines';
  className?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  trigger?: 'load' | 'inView';
  once?: boolean;
}

/**
 * Kinetic typography: each unit sits in an overflow-hidden mask and
 * translates up from below, staggered. The signature motif of the redesign.
 */
const RevealText: React.FC<RevealTextProps> = ({
  text,
  as = 'span',
  split = 'words',
  className = '',
  stagger = 0.06,
  delay = 0,
  duration = 0.8,
  trigger = 'inView',
  once = true,
}) => {
  const reduce = useReducedMotion();
  const Wrapper = TAGS[as];

  if (reduce) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{text}</Plain>;
  }

  const units = split === 'lines' ? text.split('\n') : text.split(' ');

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: '115%' },
    visible: { y: '0%', transition: { duration, ease: EASE } },
  };

  const animationProps =
    trigger === 'load'
      ? { initial: 'hidden', animate: 'visible' }
      : { initial: 'hidden', whileInView: 'visible', viewport: { once, margin: '-60px' } };

  return (
    <Wrapper className={className} variants={container} {...animationProps}>
      {units.map((unit, i) =>
        split === 'lines' ? (
          <span key={i} className="line-mask">
            <motion.span className="block will-change-transform" variants={child}>
              {unit || ' '}
            </motion.span>
          </span>
        ) : (
          <React.Fragment key={i}>
            <span
              className="line-mask"
              style={{ display: 'inline-block', verticalAlign: 'top' }}
            >
              <motion.span className="inline-block will-change-transform" variants={child}>
                {unit}
              </motion.span>
            </span>{' '}
          </React.Fragment>
        )
      )}
    </Wrapper>
  );
};

export default RevealText;
