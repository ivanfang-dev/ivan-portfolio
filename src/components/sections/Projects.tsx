import React from 'react';
import { motion } from 'framer-motion';
import { Section, ProjectCard, type Project } from '../index';

export interface ProjectsProps {
  className?: string;
}

const Projects: React.FC<ProjectsProps> = ({ className = '' }) => {

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
        github: 'https://github.com/pelican103/lioncity-tutors'
      },
    },
    {
      id: 'unity',
      title: 'ANU (Unity Game)',
      description: `A top-down 2D adventure game developed for my Unity game development class:
      • Worked with 3 other developers through complete game development lifecycle
      • Published on itch.io 
      • Gained hands-on experience in C# programming and Unity Engine`,
      technologies: ['C#', 'Unity Engine'],
      image: `${import.meta.env.BASE_URL}ANU.webp`,
      links: {
        demo: 'https://toastercosplay.itch.io/an-u',
        github: 'https://github.com/pelican103/ENGR1-GD-Group-Project'
      },
    },
    {
      id: 'ucla-meal-swipes',
      title: 'UCLA Meal Swipes',
      description: `A webpage that lets students buy and sell meal swipes:
      • Made a 1:1 clone of UCLA’s official UI
      • Worked on the frontend using Next.js and Tailwind`,
      technologies: ['Next.js', 'Tailwind'],
      image: `${import.meta.env.BASE_URL}swipes.webp`,
      imagePosition: 'object-contain object-top',
      links: {
        demo: 'https://www.swipesatucla.com/',
        github: 'https://github.com/SleepyWoodpecker/swipes-ucla'
      },
    }
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <Section
      id="projects"
      background="gray"
      padding="lg"
      className={className}
    >

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-display-3 text-gray-900 mb-6">
          Featured Projects
        </h2>
        <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
          Explore some of the projects I've built to solve real-world problems and make a positive impact.
        </p>
      </motion.div>


      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className="h-full flex"
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Projects;