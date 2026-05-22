import React, { useRef } from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { EASE } from '../../utils/motion';

export interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'experience' | 'education';
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ entries, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Static track */}
      <div className="absolute left-[6px] top-2 bottom-2 w-px bg-hairline" />
      {/* Progress line that fills with scroll */}
      <motion.div
        className="absolute left-[6px] top-2 bottom-2 w-px bg-ucla-blue origin-top"
        style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }}
      />

      <div className="space-y-12">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="relative pl-10 sm:pl-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
          >
            {/* Node */}
            <span className="absolute left-0 top-1.5 h-[13px] w-[13px] rounded-full bg-white border-2 border-ucla-blue" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-heading-3 text-ink">{entry.title}</h3>
                <p className="text-body text-ucla-blue font-medium mt-1">
                  {entry.organization}
                </p>
              </div>
              <span className="shrink-0 inline-flex w-fit px-3 py-1 rounded-full border border-hairline bg-surface text-caption text-ink-faint">
                {entry.period}
              </span>
            </div>

            <ul className="prose-list">
              {entry.description
                .split('\n')
                .filter((line) => line.trim() !== '')
                .map((line, j) => (
                  <li key={j} className="text-body-small text-ink-soft">
                    {line.trim()}
                  </li>
                ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
