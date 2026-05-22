import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { motion } from 'framer-motion';
import { Section, SectionHeader, Button } from '../index';
import { EASE } from '../../utils/motion';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ResumeProps {
  className?: string;
}

const RESUME_PATH = `${import.meta.env.BASE_URL}Ivan_Fang_Resume.pdf`;
const DRIVE_URL =
  'https://drive.google.com/file/d/1a8EMZuOKCuFUuNysYZmg4gh1VtaSNERA/view?usp=sharing';

const Resume: React.FC<ResumeProps> = ({ className = '' }) => {
  const [, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('Error loading PDF:', err);
    setError('Failed to load resume. Please try downloading it directly.');
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_PATH;
    link.download = 'Ivan_Fang_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section id="resume" background="gray" padding="xl" animate={false} className={className}>
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="Resume"
          title="The full story."
          subtitle="A one-page snapshot of my experience, projects, and education."
          align="left"
          className="mb-12"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="rounded-2xl border border-hairline bg-white shadow-2xl overflow-hidden p-2 sm:p-4">
            {loading && (
              <div className="flex items-center justify-center h-[28rem] bg-surface rounded-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-ink-faint/30 border-t-ucla-blue mx-auto mb-4" />
                  <p className="text-ink-soft text-body-small">Loading resume…</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-[28rem] bg-surface rounded-xl">
                <div className="text-center px-6">
                  <p className="text-ink-soft mb-5">{error}</p>
                  <Button variant="primary" onClick={handleDownload}>
                    Download PDF
                  </Button>
                </div>
              </div>
            )}

            {!error && (
              <div className="rounded-xl overflow-hidden flex justify-center">
                <Document
                  file={RESUME_PATH}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-w-full"
                    width={Math.min(720, typeof window !== 'undefined' ? window.innerWidth - 64 : 720)}
                  />
                </Document>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" magnetic onClick={handleDownload}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Button>
            <Button variant="secondary" size="lg" href={DRIVE_URL}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239z" />
              </svg>
              Open in Google Drive
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Resume;
