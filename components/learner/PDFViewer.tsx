'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface PDFViewerProps {
  title: string;
  description?: string | null;
  pdfUrl?: string | null;
  onComplete: () => void;
  isCompleted: boolean;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  title,
  description,
  pdfUrl,
  onComplete,
  isCompleted,
}) => {
  console.log('[PDFViewer] Rendering with pdfUrl:', pdfUrl);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [zoom, setZoom] = useState(100);

  const hasPdf = !!pdfUrl;
  console.log('[PDFViewer] hasPdf:', hasPdf);

  // Memoize handlers to prevent stale closures
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50));
  }, []);

  return (
    <div className={`flex flex-col h-full bg-[var(--gray-50)] ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="bg-white border-b border-[var(--gray-200)] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-[var(--gray-600)]">
              Page <span className="text-[var(--foreground)] font-medium">{currentPage}</span> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--gray-200)]"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-[var(--gray-600)] min-w-[50px] text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] transition-colors"
            title="Download PDF"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] transition-colors"
            title="Print"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div 
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-[var(--gray-200)] overflow-hidden"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {hasPdf ? (
            <iframe
              src={pdfUrl}
              className="w-full h-[800px]"
              title={title}
            />
          ) : (
            // Placeholder content when no PDF URL
            <div className="p-12">
              {/* PDF Header */}
              <div className="border-b-2 border-[var(--gray-200)] pb-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 4.5c-1.5 0-2.7-.4-3.6-1.2-.2-.2-.4-.5-.4-.8 0-.3.1-.6.4-.8.9-.8 2.1-1.2 3.6-1.2s2.7.4 3.6 1.2c.2.2.4.5.4.8 0 .3-.1.6-.4.8-.9.8-2.1 1.2-3.6 1.2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
                    <p className="text-[var(--gray-500)]">Course Material</p>
                  </div>
                </div>
              </div>

              {/* Mock PDF Content */}
              <div className="space-y-6 text-[var(--gray-700)]">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Introduction</h2>
                <p className="leading-relaxed">
                  {description || 'This document contains important course material. Please read through carefully and take notes as needed.'}
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-blue-800 font-medium">Note</p>
                  <p className="text-blue-700 text-sm mt-1">
                    This is a placeholder for the actual PDF content. Once you upload a PDF file, it will be displayed here.
                  </p>
                </div>

                <h2 className="text-xl font-semibold text-[var(--foreground)] pt-4">Key Concepts</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Understanding the fundamentals</li>
                  <li>Applying theoretical knowledge</li>
                  <li>Practical implementation strategies</li>
                  <li>Best practices and guidelines</li>
                </ul>

                <h2 className="text-xl font-semibold text-[var(--foreground)] pt-4">Summary</h2>
                <p className="leading-relaxed">
                  After completing this material, you should have a solid understanding of the core concepts. 
                  Make sure to complete the associated assessment to test your knowledge.
                </p>

                <div className="bg-[var(--gray-100)] p-6 rounded-xl mt-8">
                  <div className="flex items-center gap-3 text-[var(--gray-600)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">
                      PDF content will be available once the instructor uploads the document.
                    </span>
                  </div>
                </div>
              </div>

              {/* Page Footer */}
              <div className="mt-12 pt-6 border-t border-[var(--gray-200)] flex items-center justify-between text-sm text-[var(--gray-500)]">
                <span>Virtual Film Office Academy</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-[var(--gray-200)] px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-[var(--gray-600)]">
            {isCompleted ? (
              <span className="flex items-center gap-2 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                You have completed this lesson
              </span>
            ) : (
              <span>Read through the document and mark as complete when done</span>
            )}
          </div>
          {!isCompleted && (
            <Button
              variant="primary"
              onClick={handleComplete}
            >
              Mark as Complete
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
