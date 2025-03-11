import WalletSearch from "@/components/WalletSearch";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen py-4">
      <h1 className="text-4xl font-bold text-center mb-2">Cardano Wallet Explorer</h1>
      <p className="text-center text-gray-600 mb-8">Explore Cardano wallets and their associated stake addresses.</p>
      <div className="max-w-6xl mx-auto px-4">
        <WalletSearch />
      </div>
      <div className="max-w-6xl w-full text-center mx-auto px-4 py-4">
        <Link href={`/${process.env.DEFAULT_ADDRESS}`} className="text-center text-gray-600 mb-8">Default address: {process.env.DEFAULT_ADDRESS}</Link>
      </div>
    </div>
  );
}   