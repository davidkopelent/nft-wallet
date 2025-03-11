'use client';

import { useState, useEffect } from 'react';
import { getWalletInfo, getAdaPrice } from '@/lib/blockfrost';
import WalletHeader from './WalletHeader';
import WalletOverview from './WalletOverview';
import NFTGallery from './NFTGallery';
import TransactionList from './TransactionList';
import ErrorState from './ui/ErrorState';

interface WalletContainerProps {
  address: string;
}

export default function WalletContainer({ address }: WalletContainerProps) {
  const [data, setData] = useState<any>(null);
  const [adaPrice, setAdaPrice] = useState<number | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    overview: true,
    transactions: true,
    nfts: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      setLoadingStates({
        overview: true,
        transactions: true,
        nfts: true
      });
      setError(null);

      try {
        // Fetch ADA price first as it's fast and useful for all components
        const price = await getAdaPrice();
        setAdaPrice(price);

        // Fetch main wallet data
        const walletData = await getWalletInfo(address);

        if (!walletData?.addressInfo) {
          throw new Error('Wallet not found');
        }

        setData(walletData);

        // Update loading states progressively
        setLoadingStates(prev => ({
          ...prev,
          overview: false,
          transactions: false,
        }));

        // NFTs typically take longer to load, so update that state last
        setTimeout(() => {
          setLoadingStates(prev => ({
            ...prev,
            nfts: false,
          }));
        }, 300); // Small delay to give a progressive feeling

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet data');
        setLoadingStates({
          overview: false,
          transactions: false,
          nfts: false
        });
      }
    };

    if (address) {
      fetchWalletInfo();
    }
  }, [address]);

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
            data={data?.addressInfo}
            stakeInfo={data?.stakeInfo}
            adaPrice={adaPrice}
            isLoading={loadingStates.overview}
          />
          <div className="mt-8">
            <TransactionList
              transactions={data?.transactions || []}
              walletAddress={address}
              isLoading={loadingStates.transactions}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <NFTGallery
            assets={data?.assets || []}
            walletAddress={address}
            isLoading={loadingStates.nfts}
          />
        </div>
      </div>
    </div>
  );
} 