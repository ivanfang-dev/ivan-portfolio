import React from 'react';
import { motion } from 'framer-motion';
import { Section, Timeline } from '../index';
import type { TimelineEntry } from '../ui/Timeline';

export interface ExperienceProps {
  className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => {
  const experienceEntries: TimelineEntry[] = [
    {
      id: 'amazon-sde-intern',
      title: 'Incoming Software Development Engineer Intern',
      organization: 'Amazon',
      period: 'June 2026 – September 2026',
      description: `Incoming Software Development Engineer Intern for Summer 2026 in Seattle, WA.`,
      type: 'experience',
    },
    {
      id: 'intelligence-cubed-swe-intern',
      title: 'Software Engineering Intern',
      organization: 'Intelligence Cubed',
      period: 'March 2026 – June 2026',
      description: `Led a full frontend refactor from vanilla JavaScript to React + Tailwind CSS (shadcn/ui), establishing a unified design system and improving UI consistency across 10+ application modules.
      Designed and implemented a centralized design token system (colors, spacing, typography), eliminating 11 legacy CSS files and enforcing scalable styling conventions.
      Migrated complex UI flows (chat system, modals, navigation) to component-based architecture, improving maintainability and reducing UI-related technical debt.`,
      type: 'experience',
    },
    {
      id: 'founder-lioncity',
      title: 'Founder',
      organization: 'LionCity Tutors',
      period: 'June 2025–Present',
      description: `Built and launched a full-stack tuition-matching platform, processing over 100 matching requests within the first three months.
      Developed backend APIs using Express.js and MongoDB to handle tutor registration and parent requests.
      Engineered a Telegram bot to automate tutor profile updates, streamlining communication for 150+ active tutors.`,
      type: 'experience',
    },
    {
      id: 'software-engineering-intern',
      title: 'Software Engineering Intern',
      organization: 'Archimedes Holdings',
      period: 'May 2025 - August 2025',
      description: `Boosted online visibility for Cat Paradise Hotel by developing SEO-optimized landing pages with Next.js and Tailwind CSS. 
      Integrated Playwright end-to-end tests into CI pipelines to ensure stability. 
      Built a data sync service linking Shopify’s GraphQL API with Shopee’s REST API, automating inventory across 200+ SKUs.`,      
type: 'experience',
    },
    {
      id: 'community-leader',
      title: 'Community Leader',
      organization: 'Taman Jurong Youth Network',
      period: 'January 2022– March 2023',
      description: `Led community engagement initiatives and organized educational programs for local youth. 
      Coordinated events, workshops, and mentorship programs that served over 200 community members. 
      Developed leadership skills while fostering connections between young people and educational opportunities in the community.`,
      type: 'experience',
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
      id="experience"
      background="white"
      padding="xl"
      className={className}
    >
      <div className="max-w-4xl mx-auto">

        <motion.div
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-display-3 text-gray-900 mb-6">
            Experience
          </h2>
          <div className="w-20 h-1 bg-[#2774AE] mx-auto rounded-full mb-8"></div>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            My professional journey spans entrepreneurship, software development, and community leadership.
          </p>
        </motion.div>


        <Timeline entries={experienceEntries} />
      </div>
    </Section>
  );
};

export default Experience;