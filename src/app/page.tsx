'use client';

import WalletSearch from "@/components/WalletSearch";
import { DEFAULT_ADDRESS } from "@/lib/blockfrost";

export default function Home() {
  return (
    <>
      <WalletSearch address={DEFAULT_ADDRESS} onAddressChange={() => {}} />
    </>
  );
}   