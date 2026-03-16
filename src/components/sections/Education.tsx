import React from 'react';
import { motion } from 'framer-motion';
import { Section, Timeline } from '../index';
import type { TimelineEntry } from '../ui/Timeline';

export interface EducationProps {
  className?: string;
}

const Education: React.FC<EducationProps> = ({ className = '' }) => {
  // Organized in reverse chronological order 
  const educationEntries: TimelineEntry[] = [
    {
      id: 'ucla',
      title: 'B.S. Computer Science',
      organization: 'University of California, Los Angeles (UCLA)',
      period: '2025–2029',
      description: 'Pursuing a Bachelor of Science in Computer Science. Actively engaged in coursework covering software construction, programming in C++, discrete structures and multivariable calculus.',
      type: 'education',
    },
    {
      id: 'hwa-chong',
      title: 'GCE A Levels',
      organization: 'Hwa Chong Institution',
      period: '2020-2022',
      description: 'Completed comprehensive pre-university education with strong academic performance. Served in leadership roles including student government and various extracurricular organizations. Developed foundational skills in mathematics, sciences, and critical thinking while actively participating in community service and leadership development programs.',
      type: 'education',
    },
  ];


  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <Section
      id="education"
      background="gray"
      padding="xl"
      className={className}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-display-3 text-gray-900 mb-6">
            Education
          </h2>
          <div className="w-20 h-1 bg-[#2774AE] mx-auto rounded-full mb-8"></div>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            My academic journey in computer science and leadership development.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* UCLA Entry */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Timeline entries={[educationEntries[0]]} />
          </motion.div>

          {/* Military Service Bridge */}
          <motion.div
            className="relative flex items-center justify-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Timeline connector */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block"></div>
            
            {/* Bridge content */}
            <div className="relative bg-white rounded-full px-6 py-3 shadow-md border-2 border-gray-100 flex items-center gap-3 z-10">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-body-small text-gray-600 font-medium">
                Served 2 years in Singapore Armed Forces (2023-2024) 🇸🇬
              </span>
            </div>
          </motion.div>

          {/* A Levels Entry */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Timeline entries={[educationEntries[1]]} />
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Education;