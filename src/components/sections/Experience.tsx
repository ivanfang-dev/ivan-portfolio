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
    period: 'Expected graduation 2028',
    description: "GPA 3.78 · Dean's List (Fall 2025) · Samueli Foundation Engineering Scholarship",
    involvement: [
      {
        org: 'ACM Dev',
        role: 'Developer',
        summary:
          "Helped build an in-house application portal for ACM's internship program, replacing a third-party Airtable workflow with a full-stack platform the club owns and maintains.",
        links: [{ label: 'ACM Internship portal', href: 'https://members.uclaacm.com/internship' }],
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

const ArrowUpRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8m9 0v9" />
  </svg>
);

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
        {/* Lines up with the timeline's text column from sm up; on phones there's
            no rail to align with, so entries take the full width. */}
        <div className="space-y-12 sm:pl-14">
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
                // Phones: stacked cards. Tablets: one card per row, name beside
                // summary. Desktop: three columns.
                <ul className="mt-6 grid gap-3 lg:grid-cols-3">
                  {entry.involvement.map((item) => (
                    <li
                      key={item.org}
                      className="rounded-xl border border-hairline bg-white p-5 sm:grid sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-x-6 lg:flex lg:flex-col"
                    >
                      <div>
                        {/* Weight on an inner span: .text-body-small's unlayered
                            font-weight would beat a utility on the same element. */}
                        <p className="text-body-small text-ink">
                          <span className="font-semibold">{item.org}</span>
                        </p>
                        <p className="text-body-small text-ucla-blue">{item.role}</p>
                      </div>
                      <div className="mt-3 flex min-w-0 flex-col sm:mt-0 lg:mt-3 lg:flex-1">
                        <p className="text-body-small text-ink-soft">{item.summary}</p>
                        {item.links && (
                          <div className="mt-4 flex flex-wrap gap-2 lg:mt-auto lg:pt-4">
                            {item.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 max-w-full items-center gap-1 rounded-full bg-ucla-blue/[0.07] px-3 text-sm font-medium text-ucla-blue transition-colors hover:bg-ucla-blue/[0.13] pointer-coarse:h-11"
                              >
                                <span className="truncate">{link.label}</span>
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
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
