'use client';

import { useState, useEffect } from 'react';
import { WalletInfo, StakeInfo } from '@/types/blockfrost';
import { formatAda } from '@/utils/format';
import { getAccountInfo } from '@/lib/blockfrost';

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

  // Calculate staking rewards if available
  const totalRewards = stakeInfo ? Number(stakeInfo.rewards_sum) / 1000000 : null;

  // Calculate USD values
  const getUsdValue = (adaAmount: number): string => {
    if (!adaPrice) return '';
    const usdValue = adaAmount * adaPrice;
    return `(≈ ${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
      <div className="p-6">
        {isLoadingName ? (
          <div className="mb-4 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
        ) : accountName && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account name</h3>
            <p className="text-lg text-gray-900 dark:text-white">{accountName}</p>
          </div>
        )}
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Balance</h2>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-orange-gradient">{formatAda(adaAmount.quantity, { decimals: 4, showSymbol: false })}</span>
          <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">₳</span>
        </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {getUsdValue(adaBalance)}
          </div>
      </div>
      
      {stakeInfo && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-4">
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
              <span className="text-sm text-gray-500 dark:text-gray-400">Controlled amount</span>
              <div className="text-right">
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {formatAda(stakeInfo.controlled_amount, { decimals: 4, showSymbol: false })} ₳
                </span>
                {adaPrice && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getUsdValue(Number(stakeInfo.controlled_amount) / 1000000)}
                  </div>
                )}
              </div>
            </div>
            {totalRewards !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total rewards</span>
                <div className="text-right">
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {formatAda(totalRewards, { decimals: 7, showSymbol: false })} ₳
                  </span>
                  {adaPrice && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getUsdValue(totalRewards / 1000000)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Assets</h3>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total assets</span>
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {data.amount.length}
          </span>
        </div>
      </div>
    </div>
  );
} 