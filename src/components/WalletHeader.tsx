'use client';

interface WalletHeaderProps {
  address: string;
}

export default function WalletHeader({ address }: WalletHeaderProps) {
  // Abbreviate the address for display
  const abbreviatedAddress = address.length > 20 
    ? `${address.substring(0, 10)}...${address.substring(address.length - 10)}`
    : address;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wallet Overview</h2>
        <div className="flex items-center mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{abbreviatedAddress}</p>
          <button 
            onClick={handleCopy}
            className="ml-2 text-blue-600 hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            aria-label="Copy address to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex space-x-2">
        <a 
          href={`https://cardanoscan.io/address/${address}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
        >
          View on CardanoScan
        </a>
        <a 
          href={`https://pool.pm/${address}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm px-3 py-1 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
        >
          View on Pool.pm
        </a>
      </div>
    </div>
  );
} 