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
  address: string;
}

export default function WalletContainer({ address }: WalletContainerProps) {
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
          getWalletInfo(address),
          getAdaPrice()
        ]);

        if (!walletData?.addressInfo) {
          throw new Error('Wallet not found');
        }

        setData(walletData);
        setAdaPrice(price);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchWalletInfo();
    }
  }, [address]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Wallet Not Found"
        message="The wallet address you entered could not be found. Please check the address and try again."
        action={{
          label: "Try Another Address",
          href: "/"
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <WalletHeader address={address} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WalletOverview 
            data={data.addressInfo} 
            stakeInfo={data.stakeInfo}
            adaPrice={adaPrice} 
          />
          <div className="mt-8">
            <TransactionList 
              transactions={data.transactions || []} 
              walletAddress={address} 
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <NFTGallery assets={data.assets || []} />
        </div>
      </div>
    </div>
  );
} 