import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import Card from './Card';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string; // Add image support
  imagePosition?: string; // Custom image positioning
  links: {
    demo?: string;
    github?: string;
  };
}

export interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, technologies, links, image, imagePosition } = project;
  const [isHovered, setIsHovered] = useState(false);

  return ( 
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className="group w-full h-full flex"
    >
      <Card hover={true} className="p-0 w-full flex flex-col relative overflow-hidden">
        {/* Project Image */}
        {image && (
          <div className="relative h-64 overflow-hidden flex-shrink-0">
            <motion.img
              src={image}
              alt={`${title} screenshot`}
              className={`w-full h-full object-cover ${imagePosition || 'object-center'}`}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Content Section */}
        <div className="p-8 flex flex-col flex-grow min-h-0">
          {/* Sparkle effect - only show when no image */}
          {!image && (
            <motion.div
              className="absolute top-4 right-4 text-2xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
                rotate: isHovered ? [0, 360] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              ✨
            </motion.div>
          )}

      <motion.h3 
        className="text-heading-2 text-gray-900 mb-6 flex-shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>

      <motion.div 
        className="text-gray-600 mb-8 flex-grow overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {description.split('\n').map((line, index) => {
          if (index === 0) {
            return (
              <p key={index} className="text-body-large mb-5 font-medium text-gray-800 leading-relaxed">
                {line.replace(/:\s*$/, '')}
              </p>
            );
          } else if (line.trim().startsWith('•')) {
            return (
              <div key={index} className="flex items-start mb-4">
                <span className="text-[#2774AE] font-semibold text-base mt-1 flex-shrink-0 mr-3">▸</span>
                <span className="text-body leading-relaxed text-gray-700">
                  {line.replace('•', '').trim()}
                </span>
              </div>
            );
          }
          return null;
        })}
      </motion.div>

      {/* Technology Tags */}
      <motion.div 
        className="flex flex-wrap gap-3 mb-8 flex-shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {technologies.map((tech, index) => (
          <motion.span
            key={index}
            className="px-4 py-2 bg-[#2774AE]/8 text-[#2774AE] text-body-small font-medium rounded-full border border-[#2774AE]/15 cursor-default"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(39, 116, 174, 0.15)',
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>

          {/* Buttons - always show at bottom for easy access */}
          <motion.div 
            className="flex gap-4 flex-shrink-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {links.demo && (
              <motion.a
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group/btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg 
                        className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </span>
                  </Button>
                </motion.a>
              )}
              {links.github && (
                <motion.a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group/btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg 
                        className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Source Code
                    </span>
                  </Button>
                </motion.a>
              )}
            </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;