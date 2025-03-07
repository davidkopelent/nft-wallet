import { WalletInfo, Transaction, StakeInfo } from '@/types/blockfrost';

const BLOCKFROST_API_KEY = 'mainnetRUrPjKhpsagz4aKOCbvfTPHsF0SmwhLc';
const BLOCKFROST_URL = 'https://cardano-mainnet.blockfrost.io/api/v0';

export const DEFAULT_ADDRESS = 'addr1x88ttk0fk6ssan4g2uf2xtx3anppy3djftmkg959tufsc6qkqt76lg22kjjmnns37fmyue765qz347sxfnyks27ysqaqd3ph23';

interface AssetDetails {
  onchain_metadata?: {
    name: string;
    image: string;
    description?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export async function blockfrostFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${BLOCKFROST_URL}${endpoint}`, {
      headers: {
        "project_id": BLOCKFROST_API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function getWalletInfo(address: string) {
  try {
    // Get address info and transactions in parallel
    const [addressInfo, transactions] = await Promise.all([
      blockfrostFetch<WalletInfo>(`/addresses/${address}`),
      blockfrostFetch<Transaction[]>(`/addresses/${address}/transactions?order=desc`),
    ]);

    let stakeInfo = null;
    if (addressInfo?.stake_address) {
      stakeInfo = await blockfrostFetch<StakeInfo>(`/accounts/${addressInfo.stake_address}`);
    }

    // Extract non-lovelace assets from the amount array
    const assets = addressInfo?.amount.filter(asset => asset.unit !== 'lovelace') || [];
    
    // Fetch metadata for each asset (limit to 20 for performance)
    const assetsWithMetadata = await Promise.all(
      assets.slice(0, 20).map(async (asset) => {
        const metadata = await blockfrostFetch<AssetDetails>(`/assets/${asset.unit}`);
        return {
          ...asset,
          metadata: metadata?.onchain_metadata || null,
          policyId: asset.unit.slice(0, 56),
          assetName: asset.unit.slice(56)
        };
      })
    );

    return {
      addressInfo,
      assets: assetsWithMetadata || [],
      transactions,
      stakeInfo
    };
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    throw error;
  }
}

export async function getAdaPrice(): Promise<number | null> {
  try {
    // This is a mock API call - in a real app you'd call a price API
    return 0.45; // Mock ADA price in USD
  } catch (error) {
    console.error('Error fetching ADA price:', error);
    return null;
  }
}

export async function getNFTMetadata(asset: string) {
  try {
    const assetInfo = await blockfrostFetch(`/assets/${asset}`);
    return assetInfo;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    throw error;
  }
} 