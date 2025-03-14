export interface WalletInfo {
  address: string;
  amount: Amount[];
  stake_address?: string;
  type: string;
  script: boolean;
}

export interface AssetDetails {
  onchain_metadata?: {
    name: string;
    image: string;
    logo: string;
    description?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

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
  inputs: {
    address: string;
    amount: {
      unit: string;
      quantity: string;
    }[];
  }[];
  outputs: {
    address: string;
    amount: {
      unit: string;
      quantity: string;
    }[];
  }[];
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

export interface AccountRegistration {
  tx_hash: string;
  action: {
    type: string;
    title?: string;
    description?: string;
    metadata?: {
      name?: string;
      [key: string]: any;
    };
  };
} 