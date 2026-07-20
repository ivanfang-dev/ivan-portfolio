import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import RevealText from './RevealText';
import { EASE } from '../../utils/motion';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

/**
 * Section opener: an oversized heading that mask-reveals on scroll, with an
 * optional subhead. Titles ending in "." get the brand-blue terminal period —
 * the site's one recurring typographic tic.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
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

  const endsWithPeriod = title.endsWith('.');
  const text = endsWithPeriod ? title.slice(0, -1) : title;
  const suffix = endsWithPeriod ? <span className="text-ucla-blue">.</span> : undefined;

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
      <RevealText
        as="h2"
        text={text}
        suffix={suffix}
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
