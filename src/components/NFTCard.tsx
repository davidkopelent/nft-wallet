'use client';

import { NFTAsset } from '@/types/blockfrost';
import NFTImage from './ui/NFTImage';

interface NFTCardProps {
  nft: NFTAsset;
  view: 'grid' | 'list';
  onClick: () => void;
}

export default function NFTCard({ nft, view, onClick }: NFTCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${
        view === 'list' ? 'flex items-center' : ''
      } hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className={view === 'list' ? 'w-24 h-24 relative flex-shrink-0' : 'aspect-square relative'}>
        <NFTImage
          src={nft.metadata?.image || ''}
          alt={nft.metadata?.name || 'NFT'}
          fill
          sizes={view === 'list' ? '96px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{nft.metadata?.name || 'Unnamed NFT'}</h3>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
          Policy: {nft.policyId?.substring(0, 12)}...
        </div>
        {view === 'list' && nft.metadata?.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{nft.metadata.description}</p>
        )}
      </div>
    </div>
  );
} 