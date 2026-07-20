import React from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader, ProjectCard } from '../index';
import type { Project } from '../ui/ProjectCard';
import { EASE } from '../../utils/motion';

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
      github: 'https://github.com/ivanfang-dev/lioncity-tutors',
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
      github: 'https://github.com/ivanfang-dev/ENGR1-GD-Group-Project',
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

const Projects: React.FC<ProjectsProps> = ({ className = '' }) => (
  <Section id="projects" background="white" padding="xl" animate={false} className={className}>
    <SectionHeader
      title="Featured projects."
      subtitle="Things I've built to solve real problems and ship polished products."
      align="left"
      className="mb-12"
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          className="h-full"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  </Section>
);

export default Projects;
