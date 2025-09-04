
import React, { useMemo } from 'react';

interface ResultDisplayProps {
  markdownContent: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ markdownContent }) => {

  const htmlContent = useMemo(() => {
    // Access marked from the window object, as it's loaded via CDN
    const marked = (window as any).marked;
    if (marked) {
      return marked.parse(markdownContent);
    }
    // Fallback to plain text if marked is not available
    return `<p>${markdownContent.replace(/\n/g, '<br>')}</p>`;
  }, [markdownContent]);

  return (
    <div
      className="prose prose-lg max-w-none prose-h2:font-lora prose-h2:text-teal-700 prose-h3:font-lora prose-strong:text-gray-800 prose-a:text-teal-600 hover:prose-a:text-teal-700"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default ResultDisplay;
