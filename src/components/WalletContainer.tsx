'use client';

import { useState, useEffect } from 'react';
import { getWalletInfo, getAdaPrice } from '@/lib/blockfrost';
import WalletHeader from './WalletHeader';
import WalletOverview from './WalletOverview';
import NFTGallery from './NFTGallery';
import TransactionList from './TransactionList';
import LoadingState from './ui/LoadingState';
import ErrorState from './ui/ErrorState';

interface WalletContainerProps {
  defaultAddress: string;
}

export default function WalletContainer({ defaultAddress }: WalletContainerProps) {
  const [data, setData] = useState<any>(null);
  const [adaPrice, setAdaPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [walletData, price] = await Promise.all([
          getWalletInfo(defaultAddress),
          getAdaPrice()
        ]);
        setData(walletData);
        setAdaPrice(price);
      } catch (err) {
        setError('Error loading wallet information');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (defaultAddress) {
      fetchWalletInfo();
    }
  }, [defaultAddress]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'Failed to load wallet data'} />;
  }

  return (
    <div className="space-y-8">
      <WalletHeader address={defaultAddress} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WalletOverview 
            data={data.addressInfo} 
            stakeInfo={data.stakeInfo}
            adaPrice={adaPrice} 
          />
          <div className="mt-8">
            <TransactionList transactions={data.transactions || []} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <NFTGallery assets={data.assets || []} />
        </div>
      </div>
    </div>
  );
} 