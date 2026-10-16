import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionHeader, Timeline } from '../index';
import { EntryHeader, type TimelineEntry } from '../ui/Timeline';
import { EASE } from '../../utils/motion';

export interface ExperienceProps {
  className?: string;
}

interface Involvement {
  org: string;
  role: string;
  summary: string;
  links?: { label: string; href: string }[];
}

interface EducationEntry extends TimelineEntry {
  involvement?: Involvement[];
}

// Work gets the full timeline; education sits beneath it in the same entry style, minus the rail.
const entries: TimelineEntry[] = [
  {
    id: 'amazon-sde-intern',
    title: 'Software Development Engineer Intern',
    organization: 'Amazon (AWS Marketplace Search)',
    period: 'Jun 2026 – Sep 2026',
    description: `Implemented an event-driven search-indexing pipeline in Java for a 350K-document catalog, retiring two legacy indexing services and cutting update staleness from 30–60 minutes to near real-time.
    Built a concurrency-safe OpenSearch writer using optimistic concurrency control, so concurrent real-time and bulk-backfill writers cannot overwrite fresher data or resurrect deleted records.
    Provisioned a multi-AZ OpenSearch domain with kNN vector fields for semantic search using AWS CDK, templated across 5 regions.
    Developed a SQS-driven AWS Lambda consumer with dead-letter queues, partial-batch failure recovery, and idempotent processing.`,
  },
  {
    id: 'intelligence-cubed-swe-intern',
    title: 'Software Engineering Intern',
    organization: 'Intelligence Cubed',
    period: 'Mar 2026 – Jun 2026',
    description: `Led a full frontend refactor from vanilla JavaScript to React + Tailwind CSS (shadcn/ui), establishing a unified design system and improving UI consistency across 10+ application modules.
    Designed and implemented a centralized design token system (colors, spacing, typography), eliminating 11 legacy CSS files and enforcing scalable styling conventions.
    Migrated complex UI flows (chat system, modals, navigation) to component-based architecture, improving maintainability and reducing UI-related technical debt.`,
  },
  {
    id: 'founder-lioncity',
    title: 'Founder',
    organization: 'LionCity Tutors',
    period: 'Jun 2025 – Present',
    description: `Built and launched a full-stack tuition-matching platform, processing over 100 matching requests within the first three months.
    Developed backend APIs using Express.js and MongoDB to handle tutor registration and parent requests.
    Engineered a Telegram bot to automate tutor profile updates, streamlining communication for 300+ active tutors.`,
  },
  {
    id: 'software-engineering-intern',
    title: 'Software Engineering Intern',
    organization: 'Archimedes Holdings',
    period: 'May 2025 – Aug 2025',
    description: `Boosted online visibility for Cat Paradise Hotel by developing SEO-optimized landing pages with Next.js and Tailwind CSS.
    Integrated Playwright end-to-end tests into CI pipelines to ensure stability.
    Built a data sync service linking Shopify's GraphQL API with Shopee's REST API, automating inventory across 200+ SKUs.`,
  },
  {
    id: 'national-service',
    title: 'National Service',
    organization: 'Singapore Armed Forces',
    period: '2023 – 2024',
    description: `Completed two years of mandatory national service.`,
  },
  {
    id: 'community-leader',
    title: 'Community Leader',
    organization: 'Taman Jurong Youth Network',
    period: 'Jan 2022 – Mar 2023',
    description: `Organized educational programs, workshops, and mentorship serving 200+ local youth.`,
  },
];

const education: EducationEntry[] = [
  {
    id: 'ucla',
    title: 'B.S. Computer Science',
    organization: 'University of California, Los Angeles',
    period: '2025 – 2028',
    description: "GPA 3.78 · Dean's List (Fall 2025) · Samueli Foundation Engineering Scholarship",
    involvement: [
      {
        org: 'ACM Dev',
        role: 'Developer',
        summary:
          "Helped build an in-house application portal for ACM's internship program, replacing a third-party Airtable workflow with a full-stack platform the club owns and maintains.",
      },
      {
        org: 'Quantum Computing Student Association',
        role: 'Web Developer',
        summary: "Built the Quantum California event page and maintain the club's main site.",
        links: [
          { label: 'Quantum California', href: 'https://qdc-qcsa.org/quantum-california' },
          { label: 'qcsa-ucla.org', href: 'https://www.qcsa-ucla.org/' },
        ],
      },
      {
        org: 'MentorSEAS',
        role: 'Tech Team',
        summary: 'Led the full site revamp for the program that onboards 500+ new engineers each year.',
        links: [{ label: 'mentorseas.seas.ucla.edu', href: 'https://mentorseas.seas.ucla.edu/' }],
      },
    ],
  },
  {
    id: 'hwa-chong',
    title: 'GCE A Levels',
    organization: 'Hwa Chong Institution',
    period: '2020 – 2022',
    description: 'Perfect score (90/90 RP), top 10% nationwide',
  },
];

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => {
  const reduce = useReducedMotion();

  return (
    <Section id="experience" background="gray" padding="xl" animate={false} className={className}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Where I've been"
          align="left"
          className="mb-14"
        />
        <Timeline entries={entries} />

        <SectionHeader
          title="Education"
          align="left"
          titleClassName="text-heading-1 text-ink"
          className="mt-24 mb-12"
        />
        {/* Indented to line up with the timeline's text column */}
        <div className="space-y-12 pl-10 sm:pl-14">
          {education.map((entry) => (
            <motion.div
              key={entry.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <EntryHeader {...entry} />
              <p className="text-body-small text-ink-soft">{entry.description}</p>

              {entry.involvement && (
                <ul className="grid gap-3 sm:grid-cols-3 mt-6">
                  {entry.involvement.map((item) => (
                    <li
                      key={item.org}
                      className="flex flex-col p-5 rounded-xl bg-white border border-hairline"
                    >
                      <p className="text-body-small text-ink">
                        <span className="font-semibold">{item.org}</span>
                      </p>
                      <p className="text-body-small text-ucla-blue">{item.role}</p>
                      <p className="text-body-small text-ink-soft mt-3">{item.summary}</p>
                      {item.links && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-auto pt-3">
                          {item.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-body-small text-ucla-blue hover:underline underline-offset-4"
                            >
                              {link.label} ↗
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Experience;
