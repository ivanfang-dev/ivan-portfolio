import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Section, SectionHeader, ProjectCard } from '../index';
import type { Project } from '../ui/ProjectCard';

export interface ProjectsProps {
  className?: string;
}

const projects: Project[] = [
  {
    id: 'lioncity-tutors',
    title: 'LionCity Tutors',
    description: `A tutoring platform connecting students and educators across Singapore:
    • Built full-stack web application serving 300+ active users
    • Integrated Telegram Bot API for seamless communication and notifications
    • Reduced average tutor search time from weeks to hours`,
    technologies: ['React', 'MongoDB', 'Telegram API'],
    image: `${import.meta.env.BASE_URL}LionCity.webp`,
    links: {
      demo: 'https://www.lioncitytutors.com/',
      github: 'https://github.com/pelican103/lioncity-tutors',
    },
  },
  {
    id: 'unity',
    title: 'ANU (Unity Game)',
    description: `A top-down 2D adventure game developed for my Unity game development class:
    • Worked with 3 other developers through the complete game development lifecycle
    • Published on itch.io
    • Gained hands-on experience in C# programming and the Unity Engine`,
    technologies: ['C#', 'Unity Engine'],
    image: `${import.meta.env.BASE_URL}ANU.webp`,
    links: {
      demo: 'https://toastercosplay.itch.io/an-u',
      github: 'https://github.com/pelican103/ENGR1-GD-Group-Project',
    },
  },
  {
    id: 'ucla-meal-swipes',
    title: 'UCLA Meal Swipes',
    description: `A webpage that lets students buy and sell meal swipes:
    • Made a 1:1 clone of UCLA's official UI
    • Worked on the frontend using Next.js and Tailwind`,
    technologies: ['Next.js', 'Tailwind'],
    image: `${import.meta.env.BASE_URL}swipes.webp`,
    imagePosition: 'object-top',
    links: {
      demo: 'https://www.swipesatucla.com/',
      github: 'https://github.com/SleepyWoodpecker/swipes-ucla',
    },
  },
];

/** Desktop: vertical scroll drives a horizontal pan through the projects. */
const HorizontalProjects: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, (v) => -(v * distance));

  return (
    <section
      id="projects"
      ref={targetRef}
      className="relative bg-canvas"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
          <SectionHeader
            eyebrow="Selected Work"
            title="Featured projects."
            subtitle="Things I've built to solve real problems and ship polished products."
            align="left"
          />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-8 px-4 sm:px-6 lg:px-8 will-change-transform"
        >
          {projects.map((project) => (
            <div key={project.id} className="w-[30rem] max-w-[85vw] shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
          <div className="shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
};

/** Mobile / reduced-motion: a calm responsive grid. */
const StackedProjects: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Section id="projects" background="white" padding="xl" animate={false} className={className}>
    <SectionHeader
      eyebrow="Selected Work"
      title="Featured projects."
      subtitle="Things I've built to solve real problems and ship polished products."
      align="left"
      className="mb-12"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="h-full"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  </Section>
);

const Projects: React.FC<ProjectsProps> = ({ className = '' }) => {
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isDesktop && !reduce ? <HorizontalProjects /> : <StackedProjects className={className} />;
};

export default Projects;
