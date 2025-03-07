export interface WalletInfo {
  address: string;
  amount: Amount[];
  stake_address?: string;
  type: string;
  script: boolean;
}

export interface Amount {
  unit: string;
  quantity: string;
}

export interface NFTAsset {
  unit: string;
  quantity: string;
  decimals?: number;
  asset_name?: string;
  fingerprint?: string;
  policyId?: string;
  assetName?: string;
  metadata?: {
    name: string;
    image: string;
    description?: string;
    attributes?: any[];
    [key: string]: any;
  };
}

export interface AssetMetadata {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  metadata?: {
    name: string;
    image: string;
    description?: string;
  };
}

export interface Transaction {
  tx_hash: string;
  tx_index: number;
  block_height: number;
  block_time: number;
}

export interface StakeInfo {
  stake_address: string;
  active: boolean;
  active_epoch: number;
  controlled_amount: string;
  rewards_sum: string;
  withdrawals_sum: string;
  reserves_sum: string;
  treasury_sum: string;
  withdrawable_amount: string;
  pool_id: string;
} 