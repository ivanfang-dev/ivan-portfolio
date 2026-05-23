import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Button, RevealText, Typewriter } from '../index';
import { scrollToSection } from '../../utils/smoothScroll';
import { EASE } from '../../utils/motion';

export interface HeroProps {
  onCTAClick?: () => void;
}

// Lines the hero tagline cycles through. Keep them short so they stay on one line.
const TAGLINES = [
  'I love anything software 💙💛',
  'I build full-stack web apps.',
  'I ship polished products.',
  'Currently studying CS @ UCLA.',
];

const Hero: React.FC<HeroProps> = ({ onCTAClick }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Scroll handoff: content drifts up, fades and recedes as you leave the hero.
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const handleViewWork = () => {
    if (onCTAClick) onCTAClick();
    else scrollToSection('projects');
  };

  const contentStyle = reduce ? undefined : { y, opacity, scale };

  // Staggered entrance for everything below the name.
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-canvas"
    >
      {/* Faint grid, masked to fade at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black, transparent 75%)',
          maskImage: 'radial-gradient(circle at 50% 40%, black, transparent 75%)',
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
      />

      {/* Vignette — subtle darkened edges for a filmic frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 115% at 50% 42%, transparent 60%, rgba(15,23,42,0.16) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={contentStyle}
      >
        <motion.span
          className="text-caption text-ink-faint flex items-center gap-3 mb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <span className="inline-block h-px w-8 bg-ink-faint/50" />
          Computer Scientist · UCLA
        </motion.span>

        <RevealText
          as="h1"
          text="Ivan Fang"
          split="words"
          trigger="load"
          className="text-hero text-ink"
          stagger={0.09}
          duration={0.9}
        />

        <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-8 max-w-2xl">
          <motion.p variants={item} className="text-heading-2 text-ink font-medium min-h-[1.4em]">
            <Typewriter phrases={TAGLINES} />
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" magnetic onClick={handleViewWork}>
              View My Work
            </Button>
            <Button variant="ghost" size="lg" className="group" onClick={() => scrollToSection('resume')}>
              Resume
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
