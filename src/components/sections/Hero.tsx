import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Button, RevealText } from '../index';
import { scrollToSection } from '../../utils/smoothScroll';
import { EASE } from '../../utils/motion';

export interface HeroProps {
  onCTAClick?: () => void;
}

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
  const bloomY = useTransform(scrollYProgress, [0, 1], [0, -80]);

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
      {/* Ambient blue blooms */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={reduce ? undefined : { y: bloomY }}
      >
        <div
          className="absolute -top-40 -left-24 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-70"
          style={{ background: 'radial-gradient(circle, rgba(39,116,174,0.18), transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-32 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(139,184,232,0.22), transparent 70%)' }}
        />
      </motion.div>

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
          <motion.p variants={item} className="text-heading-2 text-ink font-medium">
            I love anything software.
          </motion.p>
          <motion.p variants={item} className="text-body-large text-ink-soft mt-4">
            Founder of LionCity Tutors, builder of products at the intersection of
            technology, education, and entrepreneurship.
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

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <span className="text-caption text-ink-faint">Scroll</span>
        <motion.span
          className="block h-10 w-px origin-top bg-gradient-to-b from-ink-faint to-transparent"
          animate={reduce ? undefined : { scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
