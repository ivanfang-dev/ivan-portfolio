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
    id: 'ucla-mentorseas',
    title: 'UCLA MentorSEAS',
    description: `The mentorship program pairing every incoming UCLA engineer with an upperclassman:
    • Led a full site revamp for the 500+ students it onboards each year
    • Building a matching system that pairs on major, academic goals and interests
    • Shipped as part of the MentorSEAS tech team`,
    technologies: ['React', 'Next.js', 'Tailwind'],
    image: `${import.meta.env.BASE_URL}MentorSEAS.webp`,
    links: {
      demo: 'https://mentorseas.seas.ucla.edu/',
      github: 'https://github.com/uclamentorseas/mentorseas-newsite',
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
      demoLabel: 'Play game',
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
      title="More things I've built."
      subtitle="A team build, a class game and a campus marketplace."
      align="left"
      className="mb-12"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
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
