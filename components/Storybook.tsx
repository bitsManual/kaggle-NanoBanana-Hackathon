
import React, { useState } from 'react';
import { GeneratedPage } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

interface StorybookProps {
  pages: GeneratedPage[];
  onStartOver: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);


const Storybook: React.FC<StorybookProps> = ({ pages, onStartOver }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (i > 0) {
          doc.addPage();
        }
        
        const imageSize = contentWidth;
        const imageX = margin;
        const imageY = margin;
        doc.addImage(page.imageUrl, 'PNG', imageX, imageY, imageSize, imageSize);
        
        const textY = imageY + imageSize + 15;
        doc.setFontSize(14);
        doc.setTextColor('#374151');
        const textLines = doc.splitTextToSize(page.text, contentWidth);
        doc.text(textLines, imageX, textY);

        doc.setFontSize(10);
        doc.setTextColor('#6B7280');
        doc.text(`Page ${i + 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      doc.save('Moral-Tales-Storybook.pdf');
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const page = pages[currentPage];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center w-full">
            <div className="w-full lg:w-1/2 aspect-square">
                 <img src={page.imageUrl} alt={`Illustration for page ${page.page}`} className="w-full h-full object-cover rounded-xl shadow-lg"/>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-between h-full min-h-[300px] md:min-h-[400px]">
                <p className="text-stone-700 text-lg md:text-xl leading-relaxed flex-grow">{page.text}</p>
                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 0}
                            className="p-3 rounded-full bg-rose-500 text-white disabled:bg-stone-300 transition-transform duration-200 hover:scale-110"
                            aria-label="Previous page"
                        >
                            <ArrowLeftIcon className="w-6 h-6"/>
                        </button>
                        <span className="font-semibold text-stone-600">Page {currentPage + 1} of {pages.length}</span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === pages.length - 1}
                            className="p-3 rounded-full bg-rose-500 text-white disabled:bg-stone-300 transition-transform duration-200 hover:scale-110"
                            aria-label="Next page"
                        >
                            <ArrowRightIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

      <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
        {currentPage === pages.length - 1 && (
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-8 py-3 bg-teal-500 text-white font-bold rounded-full shadow-lg hover:bg-teal-600 transition-all duration-200 transform hover:scale-105 disabled:bg-stone-300 disabled:cursor-wait"
                aria-live="polite"
            >
                {isDownloading ? 'Downloading...' : 'Download as PDF'}
            </button>
        )}
        <button
            onClick={onStartOver}
            className="px-8 py-3 bg-amber-500 text-white font-bold rounded-full shadow-lg hover:bg-amber-600 transition-all duration-200 transform hover:scale-105"
        >
            Create Another Story
        </button>
      </div>
    </div>
  );
};

export default Storybook;