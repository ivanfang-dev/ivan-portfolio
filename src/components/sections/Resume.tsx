import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionHeader, Button } from '../index';
import { EASE } from '../../utils/motion';

export interface ResumeProps {
  className?: string;
}

const RESUME_URL = `${import.meta.env.BASE_URL}Ivan_Fang_Resume.pdf`;

/* Page 1 rasterized from the PDF — regenerate with `npm run resume:preview`
   after replacing the PDF, and update the dimensions below if the page size
   changes. Rendering a flat image instead of pdf.js keeps this section free of
   react-pdf, which measured +125KB gzipped in the main bundle plus a 282KB
   gzipped worker; the real PDF is one click away. */
const PREVIEW_URL = `${import.meta.env.BASE_URL}resume-preview.webp`;
const PREVIEW_W = 1520;
const PREVIEW_H = 1967;

const ArrowUpRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8m9 0v9" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" />
  </svg>
);

/**
 * The resume, rendered on the page rather than hidden behind a link — a
 * recruiter should be able to read it without deciding to click first. The
 * sheet takes the full column so the body text stays legible at 1x; the PDF
 * itself is one click away from the sheet or the header actions.
 */
const Resume: React.FC<ResumeProps> = ({ className = '' }) => {
  const reduce = useReducedMotion();

  return (
    <Section id="resume" background="white" padding="xl" animate={false} className={className}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            title="The one-pager."
            subtitle="The whole story on a single page."
            align="left"
          />

          <motion.div
            className="flex flex-wrap gap-3 sm:shrink-0"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-60px' },
                  transition: { duration: 0.6, ease: EASE, delay: 0.15 },
                })}
          >
            <Button variant="primary" href={RESUME_URL} download="Ivan_Fang_Resume.pdf">
              <DownloadIcon className="h-5 w-5" />
              Download PDF
            </Button>
            <Button variant="secondary" href={RESUME_URL}>
              Open
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* The sheet itself — a link, so a click anywhere opens the real PDF. */}
        <motion.a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Ivan Fang's resume PDF in a new tab"
          className="group relative block rounded-lg bg-white ring-1 ring-hairline
                     shadow-[0_1px_2px_rgba(20,47,76,0.05),0_16px_40px_-14px_rgba(20,47,76,0.18)]
                     transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                     hover:-translate-y-1
                     hover:shadow-[0_2px_4px_rgba(20,47,76,0.06),0_32px_64px_-18px_rgba(20,47,76,0.26)]"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 32 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-80px' },
                transition: { duration: 0.85, ease: EASE },
              })}
        >
          <img
            src={PREVIEW_URL}
            width={PREVIEW_W}
            height={PREVIEW_H}
            loading="lazy"
            decoding="async"
            alt="Résumé of Ivan Fang: B.S. Computer Science at UCLA, software engineering internships at Amazon, Intelligence Cubed and Archimedes Holdings, and founder of LionCity Tutors."
            className="block w-full h-auto rounded-lg"
          />

          {/* Pointer-device affordance — the sheet is a link, so say so. */}
          <span
            className="pointer-events-none absolute bottom-5 right-5 hidden sm:inline-flex items-center gap-1.5
                       rounded-full bg-ucla-blue px-4 py-2 text-sm font-medium text-white shadow-lg
                       opacity-0 translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                       group-hover:opacity-100 group-hover:translate-y-0
                       group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
          >
            Open full PDF
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </motion.a>

        <p className="mt-5 text-body-small text-ink-faint">
          Open the PDF for a selectable, printable copy
        </p>
      </div>
    </Section>
  );
};

export default Resume;
