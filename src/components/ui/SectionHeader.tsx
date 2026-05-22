import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import RevealText from './RevealText';
import { EASE } from '../../utils/motion';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

/**
 * Consistent cinematic section opener: small eyebrow label, an oversized
 * heading that mask-reveals on scroll, and an optional subhead.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
  titleClassName = 'text-display-3 text-ink',
}) => {
  const reduce = useReducedMotion();

  const alignment =
    align === 'center'
      ? 'items-center text-center mx-auto'
      : 'items-start text-left';

  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  return (
    <div className={`flex flex-col max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <motion.span
          className="text-caption text-ink-faint mb-5 flex items-center gap-3"
          {...reveal(0)}
        >
          <span className="inline-block h-px w-7 bg-ink-faint/50" />
          {eyebrow}
        </motion.span>
      )}

      <RevealText
        as="h2"
        text={title}
        split="words"
        className={titleClassName}
        stagger={0.05}
        duration={0.7}
      />

      {subtitle && (
        <motion.p className="text-body-large text-ink-soft mt-6" {...reveal(0.15)}>
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
