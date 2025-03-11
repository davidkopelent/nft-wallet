'use client';

import { useState } from 'react';
import { Transaction } from '@/types/blockfrost';
import TransactionModal from './modals/TransactionModal';
import TransactionSkeleton from './ui/TransactionSkeleton';

interface TransactionListProps {
  transactions: Transaction[];
  walletAddress: string;
  isLoading?: boolean;
}

export default function TransactionList({
  transactions,
  walletAddress,
  isLoading = false
}: TransactionListProps) {
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  if (!transactions.length && !isLoading) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent transactions</h2>
      </div>

      {isLoading ? (
        <TransactionSkeleton />
      ) : (
        <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {transactions.slice(0, 5).map((tx) => (
              <li key={tx.tx_hash} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tx.tx_hash.substring(0, 30)}...
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.block_time * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {transactions.length > 5 && (
            <div className="px-6 py-3 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-slate-700 text-center">
              <button
                onClick={() => setShowAllTransactions(true)}
                className="px-3 py-2 rounded-lg text-sm text-white bg-orange-gradient font-medium"
              >
                View all transactions
              </button>
            </div>
          )}
        </>
      )}

      {showAllTransactions && (
        <TransactionModal
          walletAddress={walletAddress}
          initialTransactions={transactions}
          onClose={() => setShowAllTransactions(false)}
        />
      )}
    </div>
  );
} 