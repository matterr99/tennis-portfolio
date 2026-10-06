import React, { useState, useEffect } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'Tennis Performance Archive'
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  // Generate resilient fallback candidates for GitHub Pages and subpaths
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  const candidates = Array.from(
    new Set([
      src,
      `${cleanBase}${cleanSrc}`,
      `./${cleanSrc}`,
      `/${cleanSrc}`,
      `/Tennis-portfolio/${cleanSrc}`,
      `/tennis-portfolio/${cleanSrc}`,
      cleanSrc.includes('/') ? cleanSrc : `images/${cleanSrc}`
    ])
  );

  useEffect(() => {
    setCandidateIndex(0);
    setHasFailedAll(false);
  }, [src]);

  const handleImgError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#181A1F] text-[#F4F4F0] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-10 h-10 text-[#0051FF] mb-3 opacity-80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M5.6 5.6C9 9 9 15 5.6 18.4" />
          <path d="M18.4 5.6C15 9 15 15 18.4 18.4" />
        </svg>
        <span className="font-display text-lg tracking-tight text-white/90">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={candidates[candidateIndex]}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleImgError}
      className={className}
    />
  );
};
