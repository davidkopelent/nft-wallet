'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WalletSearchProps {
  address?: string;
  onAddressChange?: (address: string) => void;
}

export default function WalletSearch({ address = '', onAddressChange }: WalletSearchProps) {
  const [inputValue, setInputValue] = useState(address);
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      // If there's an onAddressChange callback, use it (for backward compatibility)
      if (onAddressChange) {
        onAddressChange(inputValue.trim());
      }
      
      // Navigate to the wallet page
      router.push(`/${inputValue.trim()}`);
    }
  };

  return (
    <div className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mt-1 flex rounded-md">
            <input
              type="text"
              name="address"
              id="address"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Cardano wallet address"
            />
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Explore
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 