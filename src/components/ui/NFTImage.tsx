'use client';

import { useState } from 'react';
import Image from 'next/image';

interface NFTImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export default function NFTImage({ src, alt, fill = true, className = '', sizes }: NFTImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src || typeof src !== 'string') return '/placeholder.png';
    
    // Handle IPFS URLs
    if (src.startsWith('ipfs://')) {
      const ipfsHash = src.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    }
    
    // Return HTTP/HTTPS URLs as is
    if (src.startsWith('http')) {
      return src;
    }
    
    return '/placeholder.png';
  });

  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc('/placeholder.png');
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={`${className} ${isError ? 'opacity-70' : ''}`}
      sizes={sizes}
      onError={handleError}
    />
  );
} 