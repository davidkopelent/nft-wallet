'use client';

import { NFTAsset } from '@/types/blockfrost';
import NFTImage from './ui/NFTImage';
import { getImageUrl } from '@/utils/imageUtils';

interface NFTCardProps {
  nft: NFTAsset;
  view: 'grid' | 'list';
  onClick: () => void;
}

export default function NFTCard({ nft, view, onClick }: NFTCardProps) {
  // Handle NFTs that might not have metadata or images
  const imageUrl = nft.metadata?.image ? getImageUrl(nft.metadata.image) : '/images/placeholder.png';

  // Determine display name for the NFT
  const displayName = nft.metadata?.name || (nft.asset_name ? Buffer.from(nft.asset_name, 'hex').toString('utf8') : 'Unnamed NFT');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 ${view === 'list' ? 'flex items-center' : ''
        } hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View NFT: ${displayName}`}
    >
      <div className={view === 'list' ? 'w-24 h-24 relative flex-shrink-0' : 'aspect-square relative'}>
        <NFTImage
          src={imageUrl}
          alt={displayName}
          size={view === 'list' ? 'thumbnail' : 'card'}
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{displayName}</h3>
        {nft.policyId && (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
            Policy: {nft.policyId?.substring(0, 12)}...
          </div>
        )}
        {view === 'list' && nft.metadata?.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{nft.metadata.description}</p>
        )}
      </div>
    </div>
  );
} 