'use client';

import { useState, useEffect } from 'react';
import { WalletInfo, StakeInfo } from '@/types/blockfrost';
import { formatAda, shortenAda } from '@/utils/format';
import { getAccountInfo, getStakeAddress } from '@/lib/blockfrost';

interface WalletOverviewProps {
  data: WalletInfo;
  stakeInfo: StakeInfo | null;
  adaPrice: number | null;
}

export default function WalletOverview({ data, stakeInfo, adaPrice }: WalletOverviewProps) {
  const [accountName, setAccountName] = useState<string | null>(null);
  const [isLoadingName, setIsLoadingName] = useState(false);

  useEffect(() => {
    async function fetchAccountName() {
      if (!data.stake_address) return;
      
      setIsLoadingName(true);
      try {
        const accountInfo = await getAccountInfo(data.stake_address);
        if (accountInfo?.action?.metadata?.name) {
          setAccountName(accountInfo.action.metadata.name);
        }
      } catch (error) {
        console.error('Error fetching account name:', error);
      } finally {
        setIsLoadingName(false);
      }
    }

    fetchAccountName();
  }, [data.stake_address]);

  if (!data) return null;

  // Calculate the ADA balance
  const adaAmount = data.amount.find(a => a.unit === 'lovelace');
  const adaBalance = adaAmount ? Number(adaAmount.quantity) / 1000000 : 0;
  
  // Calculate USD value if we have a price
  const usdValue = adaPrice ? adaBalance * adaPrice : null;

  // Calculate staking rewards if available
  const totalRewards = stakeInfo ? Number(stakeInfo.rewards_sum) / 1000000 : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all">
      <div className="p-6">
        {isLoadingName ? (
          <div className="mb-4 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
        ) : accountName && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Name</h3>
            <p className="text-lg text-gray-900 dark:text-white">{accountName}</p>
          </div>
        )}
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Balance</h2>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-blue-600 dark:text-indigo-400">{formatAda(adaAmount.quantity, { decimals: 4, showSymbol: false })}</span>
          <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">₳</span>
        </div>
        {usdValue && (
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            ≈ {usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </div>
        )}
      </div>
      
      {stakeInfo && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Staking</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <span className={`text-sm ${stakeInfo.active ? 'text-green-500' : 'text-red-500'}`}>
                {stakeInfo.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {stakeInfo.active && stakeInfo.pool_id && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Pool</span>
                <span className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {stakeInfo.pool_id.substring(0, 8)}...
                </span>
              </div>
            )}
            <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Controlled Amount</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {formatAda(stakeInfo.controlled_amount, { decimals: 4, showSymbol: false })} ₳
                </span>
              </div>
            {totalRewards !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Rewards</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {formatAda(totalRewards, { decimals: 4, showSymbol: false })} ₳
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Assets</h3>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Assets</span>
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {data.amount.length}
          </span>
        </div>
      </div>
    </div>
  );
} 