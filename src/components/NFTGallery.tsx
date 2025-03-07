'use client';

import { useState, useMemo } from 'react';
import { NFTAsset } from '@/types/blockfrost';
import NFTCard from './NFTCard';
import NFTModal from './NFTModal';

interface NFTGalleryProps {
  assets: NFTAsset[];
}

export default function NFTGallery({ assets }: NFTGalleryProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFTAsset | null>(null);
  
  // Filter NFTs with metadata and images
  const nfts = useMemo(() => {
    return assets.filter(asset => 
      asset.metadata?.image && 
      (!search || 
        asset.metadata.name?.toLowerCase().includes(search.toLowerCase()) ||
        asset.policyId?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [assets, search]);

  const handleNFTClick = (nft: NFTAsset) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">NFT Collection</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NFTs..."
              className="block w-full h-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2 rounded-md ${
                view === 'grid' 
                  ? 'bg-blue-50 text-blue-600 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              } transition-colors`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 rounded-md ${
                view === 'list' 
                  ? 'bg-blue-50 text-blue-600 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              } transition-colors`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No NFTs found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {search ? 'Try adjusting your search terms.' : 'This wallet doesn\'t have any NFTs with images.'}
          </p>
        </div>
      ) : (
        <div className={`grid ${
          view === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'grid-cols-1 gap-4'
        }`}>
          {nfts.map((nft) => (
            <NFTCard 
              key={nft.unit} 
              nft={nft} 
              view={view} 
              onClick={() => handleNFTClick(nft)}
            />
          ))}
        </div>
      )}
      
      {selectedNFT && (
        <NFTModal nft={selectedNFT} onClose={closeModal} />
      )}
    </div>
  );
} 