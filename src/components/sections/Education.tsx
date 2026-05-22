import React from 'react';
import { Section, SectionHeader, Timeline } from '../index';
import type { TimelineEntry } from '../ui/Timeline';

export interface EducationProps {
  className?: string;
}

const Education: React.FC<EducationProps> = ({ className = '' }) => {
  // Reverse chronological — UCLA, national service, then A Levels.
  const educationEntries: TimelineEntry[] = [
    {
      id: 'ucla',
      title: 'B.S. Computer Science',
      organization: 'University of California, Los Angeles',
      period: '2025 – 2028',
      description:
        "Pursuing a B.S. in Computer Science (GPA 3.76, expected June 2028). Coursework includes Programming in C++, Software Construction, and Algorithms & Complexity. Named to the Dean's List (Fall 2025) and awarded the Samueli Foundation Engineering Undergraduate Scholarship.",
      type: 'education',
    },
    {
      id: 'national-service',
      title: 'National Service',
      organization: 'Singapore Armed Forces',
      period: '2023 – 2024',
      description:
        'Completed two years of mandatory national service, developing discipline, leadership, and teamwork under pressure.',
      type: 'education',
    },
    {
      id: 'hwa-chong',
      title: 'GCE A Levels',
      organization: 'Hwa Chong Institution',
      period: '2020 – 2022',
      description:
        'Completed pre-university education with strong academic performance. Held leadership roles in student government and extracurricular organizations, building foundations in mathematics, the sciences, and critical thinking alongside active community service.',
      type: 'education',
    },
  ];

  return (
    <Section id="education" background="white" padding="xl" animate={false} className={className}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Education"
          title="How I got here."
          subtitle="My academic path in computer science and leadership development."
          align="left"
          className="mb-14"
        />
        <Timeline entries={educationEntries} />
      </div>
    </Section>
  );
};

export default Education;
