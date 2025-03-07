'use client';

import { NFTAsset } from '@/types/blockfrost';
import NFTImage from './ui/NFTImage';

interface NFTModalProps {
  nft: NFTAsset;
  onClose: () => void;
}

export default function NFTModal({ nft, onClose }: NFTModalProps) {
  // Close modal when clicking outside of content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {nft.metadata?.name || 'NFT Details'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <NFTImage
              src={nft.metadata?.image || '/placeholder.png'}
              alt={nft.metadata?.name || 'NFT'}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
              <p className="text-base text-gray-900 dark:text-white">{nft.metadata?.name || 'Unnamed'}</p>
            </div>
            
            {nft.metadata?.description && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                <p className="text-base text-gray-900 dark:text-white whitespace-pre-line">{nft.metadata.description}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Policy ID</h4>
              <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{nft.policyId}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Asset Name</h4>
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