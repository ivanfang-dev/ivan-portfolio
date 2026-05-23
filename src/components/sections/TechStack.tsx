import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../utils/motion';

const groups: { label: string; items: string[] }[] = [
  {
    label: 'Languages',
    items: ['C++', 'Python', 'SQL (Postgres)', 'JavaScript', 'Java', 'TypeScript', 'HTML/CSS'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Node.js', 'Next.js', 'Express.js', 'Unity Engine'],
  },
  {
    label: 'Databases & Tools',
    items: ['MongoDB', 'Git', 'Docker', 'Playwright', 'Prisma', 'Oracle Cloud Infrastructure'],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const TechStack: React.FC = () => (
  <section
    aria-label="Technical skills"
    className="border-y border-hairline bg-surface"
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <motion.span
        className="text-caption text-ink-faint flex items-center justify-center gap-3 mb-10 sm:mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block h-px w-7 bg-ink-faint/50" />
        Technical Skills
        <span className="inline-block h-px w-7 bg-ink-faint/50" />
      </motion.span>

      <motion.div
        className="grid gap-10 sm:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {groups.map((group) => (
          <motion.div key={group.label} variants={item} className="text-center sm:text-left">
            <h3 className="text-caption text-ink mb-4">{group.label}</h3>
            <ul className="flex flex-wrap justify-center sm:justify-start gap-2.5">
              {group.items.map((tech) => (
                <li
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full border border-hairline bg-white text-body-small text-ink-soft"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TechStack;
