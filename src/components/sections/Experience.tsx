import React from 'react';
import { Section, SectionHeader, Timeline } from '../index';
import type { TimelineEntry } from '../ui/Timeline';

export interface ExperienceProps {
  className?: string;
}

// Work and education merged into one reverse-chronological timeline.
const Experience: React.FC<ExperienceProps> = ({ className = '' }) => {
  const entries: TimelineEntry[] = [
    {
      id: 'amazon-sde-intern',
      title: 'Incoming Software Development Engineer Intern',
      organization: 'Amazon',
      period: 'Jun 2026 – Sep 2026',
      description: `Incoming Software Development Engineer Intern for Summer 2026 in Seattle, WA.`,
      type: 'experience',
    },
    {
      id: 'intelligence-cubed-swe-intern',
      title: 'Software Engineering Intern',
      organization: 'Intelligence Cubed',
      period: 'Mar 2026 – Jun 2026',
      description: `Led a full frontend refactor from vanilla JavaScript to React + Tailwind CSS (shadcn/ui), establishing a unified design system and improving UI consistency across 10+ application modules.
      Designed and implemented a centralized design token system (colors, spacing, typography), eliminating 11 legacy CSS files and enforcing scalable styling conventions.
      Migrated complex UI flows (chat system, modals, navigation) to component-based architecture, improving maintainability and reducing UI-related technical debt.`,
      type: 'experience',
    },
    {
      id: 'ucla',
      title: 'B.S. Computer Science',
      organization: 'University of California, Los Angeles',
      period: '2025 – 2028',
      description: `Pursuing a B.S. in Computer Science (GPA 3.76, expected June 2028).
      Dean's List (Fall 2025) and awarded the Samueli Foundation Engineering Undergraduate Scholarship.`,
      type: 'education',
    },
    {
      id: 'founder-lioncity',
      title: 'Founder',
      organization: 'LionCity Tutors',
      period: 'Jun 2025 – Present',
      description: `Built and launched a full-stack tuition-matching platform, processing over 100 matching requests within the first three months.
      Developed backend APIs using Express.js and MongoDB to handle tutor registration and parent requests.
      Engineered a Telegram bot to automate tutor profile updates, streamlining communication for 150+ active tutors.`,
      type: 'experience',
    },
    {
      id: 'software-engineering-intern',
      title: 'Software Engineering Intern',
      organization: 'Archimedes Holdings',
      period: 'May 2025 – Aug 2025',
      description: `Boosted online visibility for Cat Paradise Hotel by developing SEO-optimized landing pages with Next.js and Tailwind CSS.
      Integrated Playwright end-to-end tests into CI pipelines to ensure stability.
      Built a data sync service linking Shopify's GraphQL API with Shopee's REST API, automating inventory across 200+ SKUs.`,
      type: 'experience',
    },
    {
      id: 'national-service',
      title: 'National Service',
      organization: 'Singapore Armed Forces',
      period: '2023 – 2024',
      description: `Completed two years of mandatory national service.`,
      type: 'education',
    },
    {
      id: 'community-leader',
      title: 'Community Leader',
      organization: 'Taman Jurong Youth Network',
      period: 'Jan 2022 – Mar 2023',
      description: `Organized educational programs, workshops, and mentorship serving 200+ local youth.`,
      type: 'experience',
    },
    {
      id: 'hwa-chong',
      title: 'GCE A Levels',
      organization: 'Hwa Chong Institution',
      period: '2020 – 2022',
      description: `Achieved a perfect score (90/90 RP), placing top 10% nationwide.`,
      type: 'education',
    },
  ];

  return (
    <Section id="experience" background="gray" padding="xl" animate={false} className={className}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Where I've been."
          align="left"
          className="mb-14"
        />
        <Timeline entries={entries} />
      </div>
    </Section>
  );
};

export default Experience;
