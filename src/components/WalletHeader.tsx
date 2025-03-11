'use client';

import { useState } from 'react';

interface WalletHeaderProps {
  address: string;
}

export default function WalletHeader({ address }: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 p-4 sm:p-6 transition-all">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wallet overview</h2>
        <div className="flex flex-col mt-2">
          <div className="w-full overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">{address}</p>
          </div>
          <div className="mt-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-full transition-colors bg-orange-gradient text-white hover:bg-orange-gradient flex items-center"
              aria-label="Copy address to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" className="mr-1">
                <g id="SVGRepo_iconCarrier">
                  <path d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
              {copied ? 'Copied!' : 'Copy'}
            </button>

            {/* Accessibility announcement for screen readers */}
            {copied && (
              <span className="sr-only" role="status" aria-live="polite">
                Address copied to clipboard
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 