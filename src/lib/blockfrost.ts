import { WalletInfo, Transaction, StakeInfo, AccountRegistration, AssetDetails, NFTAsset } from '@/types/blockfrost';

const BLOCKFROST_API_KEY = 'mainnetRUrPjKhpsagz4aKOCbvfTPHsF0SmwhLc';
const BLOCKFROST_URL = 'https://cardano-mainnet.blockfrost.io/api/v0';
export const DEFAULT_ADDRESS = 'addr1x88ttk0fk6ssan4g2uf2xtx3anppy3djftmkg959tufsc6qkqt76lg22kjjmnns37fmyue765qz347sxfnyks27ysqaqd3ph23';

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
      stakeInfo,
      controlled_amount: stakeInfo?.controlled_amount || null,
    };
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    throw error;
  }
}

export async function getAdaPrice(): Promise<number | null> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
    const data = await response.json();
    return data.cardano?.usd || null; // Return the ADA price in USD
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

/**
 * Get account info including registered stake address name
 * @param stakeAddress - The stake address to query
 */
export async function getAccountInfo(stakeAddress: string) {
  try {
    // Use the registrations endpoint to get account metadata
    const registrations = await blockfrostFetch<AccountRegistration[]>(`/accounts/${stakeAddress}/registrations`);

    if (!registrations || registrations.length === 0) {
      return null;
    }

    // Look for the most recent registration with metadata
    const registration = registrations.find(reg => reg.action?.metadata?.name);
    return registration || null;

  } catch (error) {
    console.error('Error fetching account info:', error);
    return null;
  }
}

/**
 * Get stake address from payment address
 * @param address - Cardano payment address
 */
export async function getStakeAddress(address: string) {
  try {
    const addressInfo = await blockfrostFetch<WalletInfo>(`/addresses/${address}`);
    return addressInfo?.stake_address || null;
  } catch (error) {
    console.error('Error fetching stake address:', error);
    return null;
  }
}

/**
 * Fetch NFT transaction history.
 * @param assetId - The unique identifier of the NFT.
 */
export async function getNFTTransactions(assetId: string): Promise<Transaction[] | null> {
  return await blockfrostFetch<Transaction[]>(`/assets/${assetId}/transactions?order=desc`);
}

/**
 * Analyze a transaction to determine if it was an NFT buy/sell.
 * @param txHash - The transaction hash.
 * @param assetId - The NFT asset ID.
 */
export async function analyzeNFTTransaction(txHash: string, assetId: string) {
  try {
    const txDetails = await blockfrostFetch<{ inputs: any[], outputs: any[] }>(`/txs/${txHash}/utxos`);
    if (!txDetails) return null;

    const inputs = txDetails.inputs;
    const outputs = txDetails.outputs;

    let sender = null;
    let receiver = null;
    let adaSent = 0;
    let nftTransferred = false;

    // Identify sender, receiver, ADA amount, and NFT transfer
    for (const input of inputs) {
      if (input.amount.some(a => a.unit === assetId)) {
        sender = input.address; // Sender held the NFT
      }
      adaSent += input.amount
        .filter(a => a.unit === 'lovelace')
        .reduce((sum, a) => sum + parseInt(a.quantity), 0);
    }

    for (const output of outputs) {
      if (output.amount.some(a => a.unit === assetId)) {
        receiver = output.address; // Receiver got the NFT
        nftTransferred = true;
      }
    }

    if (nftTransferred && adaSent > 2_000_000) { // More than ~2 ADA (likely a sale)
      return { type: 'buy', sender, receiver, adaPaid: adaSent / 1_000_000 };
    }

    if (nftTransferred && adaSent <= 2_000_000) {
      return { type: 'transfer', sender, receiver };
    }

    return { type: 'unknown' };
  } catch (error) {
    console.error('Error analyzing NFT transaction:', error);
    return null;
  }
}

/**
 * Get wallet NFTs with pagination support
 * @param address - Wallet address
 * @param page - Page number (1-based)
 * @param limit - Number of NFTs per page
 */
export async function getWalletNFTs(address: string, page = 1, limit = 20): Promise<NFTAsset[]> {
  try {
    // Get address info
    const addressInfo = await blockfrostFetch<WalletInfo>(`/addresses/${address}`);
    
    if (!addressInfo) return [];
    
    // Extract non-lovelace assets from the amount array
    const assets = addressInfo.amount.filter(asset => asset.unit !== 'lovelace') || [];
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Fetch metadata for paginated assets
    const assetsWithMetadata = await Promise.all(
      assets.slice(startIndex, endIndex).map(async (asset) => {
        const metadata = await blockfrostFetch<AssetDetails>(`/assets/${asset.unit}`);
        return {
          ...asset,
          metadata: metadata?.onchain_metadata || null,
          policyId: asset.unit.slice(0, 56),
          assetName: asset.unit.slice(56)
        };
      })
    );
    
    return assetsWithMetadata || [];
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return [];
  }
}

/**
 * Get wallet transactions with pagination support
 * @param address - Wallet address
 * @param page - Page number (1-based)
 * @param limit - Number of transactions per page
 */
export async function getWalletTransactions(
  address: string, 
  page = 1, 
  limit = 25
): Promise<Transaction[]> {
  try {
    // Calculate the offset (0-based)
    const offset = (page - 1) * limit;
    
    // Fetch paginated transactions
    const transactions = await blockfrostFetch<Transaction[]>(
      `/addresses/${address}/transactions?order=desc&page=${page}&count=${limit}`
    );
    
    return transactions || [];
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    return [];
  }
}