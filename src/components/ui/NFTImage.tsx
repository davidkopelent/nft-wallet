'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';

interface NFTImageProps {
  src: string | string[] | null;
  alt: string;
  size?: 'thumbnail' | 'card' | 'detail';
  className?: string;
  priority?: boolean;
}

export default function NFTImage({
  src,
  alt,
  size = 'card',
  className = '',
  priority = false
}: NFTImageProps) {
  // Use imageUtils to process the image URL
  const [imgSrc, setImgSrc] = useState<string>(() => getImageUrl(src));
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Define standard dimensions for each size
  const dimensions = {
    thumbnail: { width: 100, height: 100 },
    card: { width: 300, height: 300 },
    detail: { width: 600, height: 600 }
  };

  // Get sizes attribute based on image context
  const getSizes = () => {
    switch (size) {
      case 'thumbnail':
        return '100px';
      case 'card':
        return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
      case 'detail':
        return '(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 600px';
      default:
        return '300px';
    }
  };

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc('/images/placeholder.png');
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse">
          <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt}
        width={dimensions[size].width}
        height={dimensions[size].height}
        className={`object-cover w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${isError ? 'opacity-70' : ''}`}
        sizes={getSizes()}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJc2Tj7UgAAAABJRU5ErkJggg=="
        placeholder="blur"
      />
    </div>
  );
} 