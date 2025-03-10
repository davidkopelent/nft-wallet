'use client';

import { useEffect } from 'react';
import { NFTAsset } from '@/types/blockfrost';
import NFTImage from '../ui/NFTImage';
import { getImageUrl } from '@/utils/imageUtils';

interface NFTModalProps {
  nft: NFTAsset;
  onClose: () => void;
}

export default function NFTModal({ nft, onClose }: NFTModalProps) {
  const imageUrl = getImageUrl(nft.metadata?.image);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Add no-scroll class to body
    document.body.classList.add('overflow-hidden');
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  // Close modal when clicking outside of content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Check if attributes exist and convert to array if needed
  const getAttributes = () => {
    if (!nft.metadata?.attributes) return [];
    
    // Check if attributes is already an array
    if (Array.isArray(nft.metadata.attributes)) {
      return nft.metadata.attributes;
    }
    
    // If attributes is an object, convert to array
    if (typeof nft.metadata.attributes === 'object') {
      return Object.entries(nft.metadata.attributes).map(([key, value]) => ({
        trait_type: key,
        value: value
      }));
    }
    
    return [];
  };

  const attributes = getAttributes();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[80vh]">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <NFTImage 
              src={imageUrl} 
              alt={nft.metadata?.name || 'NFT'} 
              fill={true}
              className="object-contain"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {nft.metadata?.name || 'Unnamed NFT'}
              </h3>
            </div>
            
            {nft.metadata?.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h4>
                <p className="text-gray-900 dark:text-white text-sm whitespace-pre-line">
                  {nft.metadata.description}
                </p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Policy ID</h4>
              <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{nft.policyId}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Asset Name</h4>
              <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{nft.assetName}</p>
            </div>
            
            {attributes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {attributes.map((attr: any, index: number) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{attr.trait_type || Object.keys(attr)[0]}</p>
                      <p className="text-sm text-gray-900 dark:text-white">{attr.value || Object.values(attr)[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 