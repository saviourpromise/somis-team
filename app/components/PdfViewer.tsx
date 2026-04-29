"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set worker path - using unpkg for simplicity, ensures version match
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      if (width < 640) setContainerWidth(width - 40);
      else if (width < 1024) setContainerWidth(width - 100);
      else setContainerWidth(1000);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-container">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Product List...</p>
          </div>
        }
        error={
          <div className="error-message">
            <p>Failed to load PDF. Please try refreshing.</p>
          </div>
        }
      >
        {numPages &&
          Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="page-wrapper">
              <Page
                pageNumber={index + 1}
                width={containerWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
              />
              <div className="page-number">
                Page {index + 1} of {numPages}
              </div>
            </div>
          ))}
      </Document>

      <style jsx global>{`
        .pdf-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f8fafc;
          min-height: 100vh;
          width: 100%;
          padding: 2rem 1rem;
          overflow-x: hidden;
          box-sizing: border-box;
        }



        .page-wrapper {
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .pdf-page {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          overflow: hidden;
          background: white;
          transition: transform 0.2s ease;
          max-width: 100%;
        }

        .pdf-page canvas {
          max-width: 100% !important;
          height: auto !important;
        }


        .pdf-page:hover {
          transform: translateY(-4px);
        }

        .page-number {
          margin-top: 1rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.875rem;
          color: #64748b;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          font-family: var(--font-geist-sans), sans-serif;
          color: #64748b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #ef4444;
          padding: 2rem;
          text-align: center;
          background: #fee2e2;
          border-radius: 8px;
          margin: 2rem;
        }

        /* React PDF layer fixes */
        .react-pdf__Page__textContent {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
