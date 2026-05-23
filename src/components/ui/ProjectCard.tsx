import React from 'react';
import Button from './Button';
import Card from './Card';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  imagePosition?: string;
  /** Tailwind aspect class for the image frame (vertical layout). Defaults to 2/1. */
  imageAspect?: string;
  links: {
    demo?: string;
    github?: string;
  };
}

export interface ProjectCardProps {
  project: Project;
  /** 'vertical' stacks image over content; 'horizontal' places them side by side. */
  orientation?: 'vertical' | 'horizontal';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, orientation = 'vertical' }) => {
  const { title, description, technologies, links, image, imagePosition, imageAspect } = project;

  const lines = description.split('\n');
  const summary = lines[0].replace(/:\s*$/, '').trim();
  const bullets = lines
    .slice(1)
    .map((l) => l.replace('•', '').trim())
    .filter(Boolean);

  const isHorizontal = orientation === 'horizontal';

  const imageEl = image && (
    <div
      className={`relative overflow-hidden bg-surface ${
        isHorizontal ? 'w-2/5 h-full' : imageAspect || 'aspect-[2/1]'
      }`}
    >
      <img
        src={image}
        alt={`${title} preview`}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05] ${imagePosition || ''}`}
      />
    </div>
  );

  return (
    <Card
      hover
      className={`group h-full flex ${isHorizontal ? 'flex-row' : 'flex-col'}`}
    >
      {imageEl}

      <div
        className={`p-7 sm:p-8 flex flex-col min-h-0 ${isHorizontal ? 'w-3/5' : 'flex-grow'}`}
      >
        <h3 className="text-heading-2 text-ink mb-3">{title}</h3>
        <p className="text-body text-ink-soft mb-5">{summary}</p>

        {bullets.length > 0 && (
          <ul className="prose-list mb-7 flex-grow overflow-hidden">
            {bullets.map((b, i) => (
              <li key={i} className="text-body-small text-ink-soft">
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-7">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-ucla-blue/8 text-ucla-blue sm:text-body-small border border-ucla-blue/15 whitespace-nowrap"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-auto">
          {links.demo && (
            <Button href={links.demo} variant="primary" size="md" className="flex-1 group/btn whitespace-nowrap">
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Live Demo
            </Button>
          )}
          {links.github && (
            <Button href={links.github} variant="secondary" size="md" className="flex-1 group/btn">
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Code
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
