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

  const lines = description.split('\n');
  const summary = lines[0].replace(/:\s*$/, '').trim();
  const bullets = lines
    .slice(1)
    .map((l) => l.replace('•', '').trim())
    .filter(Boolean);

  return (
    <Card hover className="group h-full flex flex-col">
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          <img
            src={image}
            alt={`${title} preview`}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05] ${imagePosition || ''}`}
          />
        </div>
      )}

      <div className="p-7 sm:p-8 flex flex-col flex-grow">
        <h3 className="text-heading-2 text-ink mb-3">{title}</h3>
        <p className="text-body text-ink-soft mb-5">{summary}</p>

        {bullets.length > 0 && (
          <ul className="prose-list mb-7 flex-grow">
            {bullets.map((b, i) => (
              <li key={i} className="text-body-small text-ink-soft">
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mb-7">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-ucla-blue/8 text-ucla-blue text-body-small border border-ucla-blue/15"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-auto">
          {links.demo && (
            <Button href={links.demo} variant="primary" size="md" className="flex-1">
              Live Demo
            </Button>
          )}
          {links.github && (
            <Button href={links.github} variant="secondary" size="md" className="flex-1">
              Code
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
