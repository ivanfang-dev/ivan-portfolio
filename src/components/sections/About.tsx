import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { Button, Section, SectionHeader, ExplosiveImage } from '../index';
import { scrollToSection } from '../../utils/smoothScroll';
import { EASE } from '../../utils/motion';

export interface AboutProps {
  content?: string;
}


const About: React.FC<AboutProps> = ({
  content = `Hailing from the sunny shores of Singapore, I'm a computer science student at UCLA fascinated by the intersection of technology, education, and entrepreneurship. As the founder of LionCity Tutors, I've seen firsthand how software can make learning more accessible for students across Singapore.

My work is driven by a desire to build meaningful solutions to real-world problems — whether that's connecting students with tutors, shipping polished product UIs, or contributing to my community.

When I'm not coding or studying, you'll find me reading, or doomscrolling in bed.`,
}) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // After the reveal wipe finishes, expand the clip region past the box so the
  // "Try clicking me!" hint and explosion particles aren't clipped to its edges.
  const [revealed, setRevealed] = useState(false);
  // Track visibility on this outer wrapper rather than on the clipped box itself:
  // the initial `inset(0 0 100% 0)` clip makes the box's intersection ratio 0, so a
  // whileInView on it would never fire and the wipe would never start.
  const inView = useInView(imgRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start end', 'end start'],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const textStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <Section id="about" background="gray" padding="xl" animate={false}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <div ref={imgRef} className="flex justify-center lg:justify-start">
          <motion.div
            className="relative w-full max-w-md"
            variants={{
              hidden: { clipPath: 'inset(0 0 100% 0)' },
              visible: { clipPath: 'inset(0 0 0% 0)' },
              expanded: { clipPath: 'inset(-100% -100% -100% -100%)' },
            }}
            initial="hidden"
            animate={!inView ? 'hidden' : revealed ? 'expanded' : 'visible'}
            transition={{ duration: 0.9, ease: EASE }}
            onAnimationComplete={() => { if (inView) setRevealed(true); }}
            style={reduce ? undefined : { y: parallax }}
          >
            <div className="aspect-[4/5] flex items-center justify-center">
              <ExplosiveImage
                src={`${import.meta.env.BASE_URL}IMG_1957-modified.png`}
                alt="Ivan Fang"
                className="w-full h-full"
                explosionThreshold={5}
                surpriseImage={`${import.meta.env.BASE_URL}IMG_5788-modified.png`}
                objectFit="contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center lg:text-left">
          <SectionHeader
            eyebrow="About"
            title="A builder from Singapore, now at UCLA!"
            align="left"
            className="lg:items-start"
            titleClassName="text-display-3 text-ink"
          />

          <motion.div
            className="mt-8 space-y-5"
            variants={textStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {content.split('\n\n').map((paragraph, i) => (
              <motion.p key={i} variants={item} className="text-body text-ink-soft">
                {paragraph}
              </motion.p>
            ))}
            
            <motion.div variants={item} className="pt-4 flex justify-center lg:justify-start">
              <Button variant="primary" size="lg" magnetic onClick={() => scrollToSection('contact')}>
                Get in touch
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default About;
