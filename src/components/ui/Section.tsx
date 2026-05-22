import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../utils/motion';

export interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'white' | 'gray' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  containerClassName = '',
  background = 'white',
  padding = 'lg',
  animate = true,
}) => {
  const backgroundStyles = {
    white: 'bg-canvas',
    gray: 'bg-surface',
    gradient: 'bg-gradient-to-b from-surface to-canvas',
  };

  const paddingStyles = {
    sm: 'py-12 sm:py-16',
    md: 'py-16 sm:py-24',
    lg: 'py-20 sm:py-28',
    xl: 'py-24 sm:py-36',
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  const SectionComponent = animate ? motion.section : 'section';
  const animationProps = animate
    ? {
        variants: sectionVariants,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
      }
    : {};

  return (
    <SectionComponent
      id={id}
      className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}
      {...animationProps}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </SectionComponent>
  );
};

export default Section;
