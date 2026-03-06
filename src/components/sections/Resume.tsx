import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Button from '../ui/Button';


pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ResumeProps {
  className?: string;
}

const Resume: React.FC<ResumeProps> = ({ className = '' }) => {
  const [, setNumPages] = useState<number | null>(null);
  const [pageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load resume. Please try downloading it directly.');
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}Ivan_Fang_Resume.pdf`;
    link.download = 'Ivan_Fang_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInDrive = () => {
    window.open('https://drive.google.com/file/d/1il1jmJ70Xkr2Jk0Ek-MZxzyYyfTFjWrN/view?usp=sharing', '_blank');
  };

  return (
    <Section id="resume" className={className}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Resume
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg p-6">

            <div className="flex justify-center mb-6">
              <div className="w-full max-w-4xl">
                {loading && (
                  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading resume...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button
                        variant="primary"
                        onClick={handleDownload}
                      >
                        Download Resume
                      </Button>
                    </div>
                  </div>
                )}
                
                {!error && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Document
                      file={`${import.meta.env.BASE_URL}Ivan_Fang_Resume.pdf`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={null}
                      className="flex justify-center"
                    >
                      <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full"
                        width={Math.min(900, window.innerWidth - 50)}
                      />
                    </Document>
                  </div>
                )}
              </div>
            </div>
            

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleOpenInDrive}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239z"/>
                </svg>
                Open in Google Drive
              </Button>
              
              <Button
                variant="primary"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Resume;