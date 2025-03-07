'use client';

import { Transaction } from '@/types/blockfrost';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.slice(0, 5).map((tx) => (
          <li key={tx.tx_hash} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <a 
              href={`https://cardanoscan.io/transaction/${tx.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {tx.tx_hash.substring(0, 10)}...
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Block: {tx.block_height}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(tx.block_time * 1000).toLocaleDateString()}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {transactions.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 text-center">
          <a 
            href={`https://cardanoscan.io/address/${transactions[0]?.tx_hash}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all transactions
          </a>
        </div>
      )}
    </div>
  );
} 