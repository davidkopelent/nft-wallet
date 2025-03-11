'use client';

import { useState, useMemo, useEffect } from 'react';
import { NFTAsset } from '@/types/blockfrost';
import NFTCard from './NFTCard';
import NFTModal from './modals/NFTModal';
import { getWalletNFTs } from '@/lib/blockfrost';
import NFTSkeleton from './ui/NFTSkeleton';
import ErrorAlert from './ui/ErrorAlert';

interface NFTGalleryProps {
  assets: NFTAsset[];
  walletAddress: string;
  isLoading?: boolean;
}

export default function NFTGallery({ assets: initialAssets, walletAddress, isLoading = false }: NFTGalleryProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFTAsset | null>(null);
  const [assets, setAssets] = useState<NFTAsset[]>(initialAssets);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialAssets.length > 0);
  const [error, setError] = useState<string | null>(null);

  // Update assets when initialAssets change
  useEffect(() => {
    setAssets(initialAssets);
    setHasMore(initialAssets.length === 20);
  }, [initialAssets]);

  // Filter NFTs based on search criteria
  const nfts = useMemo(() => {
    return assets.filter(asset => {
      if (search) {
        return (
          (asset.metadata?.name && asset.metadata.name.toLowerCase().includes(search.toLowerCase())) ||
          (asset.policyId && asset.policyId.toLowerCase().includes(search.toLowerCase())) ||
          (asset.asset_name && asset.asset_name.toLowerCase().includes(search.toLowerCase()))
        );
      }
      return true;
    });
  }, [assets, search]);

  const handleNFTClick = (nft: NFTAsset) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = page + 1;
      const moreAssets = await getWalletNFTs(walletAddress, nextPage);

      if (moreAssets.length === 0) {
        setHasMore(false);
      } else {
        const existingUnits = new Set(assets.map(asset => asset.unit));
        const newAssets = moreAssets.filter(asset => !existingUnits.has(asset.unit));

        if (newAssets.length === 0) {
          setHasMore(false);
        } else {
          setAssets(prev => [...prev, ...newAssets]);
          setPage(nextPage);
          setHasMore(moreAssets.length >= 20);
        }
      }
    } catch (err) {
      console.error('Error loading more NFTs:', err);
      setError('Failed to load more NFTs. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 p-6 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          NFT Collection {!isLoading && `(${nfts.length})`}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NFTs..."
              className="block w-full h-full pl-3 pr-10 py-2 border border-slate-100 dark:border-slate-700 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-orange-gradient focus:border-orange-gradient sm:text-sm"
              disabled={isLoading}
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
              className={`px-3 py-2 rounded-md ${view === 'grid'
                ? 'bg-orange-gradient text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                } transition-colors`}
              disabled={isLoading}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 rounded-md ${view === 'list'
                ? 'bg-orange-gradient text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                } transition-colors`}
              disabled={isLoading}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={handleLoadMore} />}

      {isLoading ? (
        <div className={`grid ${view === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'grid-cols-1 gap-4'
          }`}>
          <NFTSkeleton count={6} view={view} />
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No NFTs found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {search ? 'Try adjusting your search terms.' : 'This wallet doesn\'t have any NFTs.'}
          </p>
        </div>
      ) : (
        <>
          <div className={`grid ${view === 'grid'
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

          {hasMore && (
            <div className="mt-8 mb-2 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-4 py-2 bg-orange-gradient text-white rounded-md hover:bg-orange-gradient focus:outline-none focus:ring-2 focus:ring-orange-gradient focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loadingMore ? 'Loading...' : 'Load More NFTs'}
              </button>
            </div>
          )}
        </>
      )}

      {selectedNFT && (
        <NFTModal nft={selectedNFT} onClose={closeModal} />
      )}
    </div>
  );
} 