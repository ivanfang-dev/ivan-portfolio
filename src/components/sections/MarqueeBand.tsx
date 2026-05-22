import React from 'react';
import { Marquee } from '../index';

const items = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'MongoDB',
  'Tailwind CSS',
  'Express',
  'Unity / C#',
  'Playwright',
  'Figma',
];

const MarqueeBand: React.FC = () => (
  <section
    aria-label="Tools and technologies"
    className="border-y border-hairline bg-surface py-7"
  >
    <Marquee speed={38}>
      {items.map((tech, i) => (
        <span
          key={i}
          className="flex items-center gap-12 text-heading-3 font-medium text-ink-soft whitespace-nowrap"
        >
          {tech}
          <span className="h-1.5 w-1.5 rounded-full bg-ucla-blue/60" />
        </span>
      ))}
    </Marquee>
  </section>
);

export default MarqueeBand;
