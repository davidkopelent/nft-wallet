'use client';

import React, { useState, useEffect } from 'react';
import { Transaction } from '@/types/blockfrost';
import { getWalletTransactions } from '@/lib/blockfrost';

interface TransactionModalProps {
  walletAddress: string;
  initialTransactions: Transaction[];
  onClose: () => void;
}

export default function TransactionModal({
  walletAddress,
  initialTransactions,
  onClose
}: TransactionModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedTxs, setExpandedTxs] = useState<Set<string>>(new Set());

  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Add no-scroll class to body
    document.body.classList.add('overflow-hidden');

    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  // Load more transactions when clicking the "Load more" button
  const loadMoreTransactions = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const moreTransactions = await getWalletTransactions(walletAddress, nextPage, 25);

      if (!moreTransactions || moreTransactions.length === 0) {
        setHasMore(false);
      } else {
        setTransactions(prev => [...prev, ...moreTransactions]);
        setPage(nextPage);
        setHasMore(moreTransactions.length === 25); // Assume there are more if we got a full page
      }
    } catch (error) {
      console.error('Error loading more transactions:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle transaction expanded state
  const toggleTransactionDetails = (txHash: string) => {
    setExpandedTxs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(txHash)) {
        newSet.delete(txHash);
      } else {
        newSet.add(txHash);
      }
      return newSet;
    });
  };

  // Close modal when clicking outside content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Format date for better readability
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            All Transactions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Block
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (
                <React.Fragment key={tx.tx_hash}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                    onClick={() => toggleTransactionDetails(tx.tx_hash)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {tx.tx_hash.substring(0, 14)}...{tx.tx_hash.substring(tx.tx_hash.length - 14)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tx.block_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tx.block_height.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={`https://cardanoscan.io/transaction/${tx.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-gradient/90 hover:text-orange-gradient"
                        onClick={(e) => e.stopPropagation()} // Prevent row click
                      >
                        View
                      </a>
                    </td>
                  </tr>

                  {/* Expanded transaction details */}
                  {expandedTxs.has(tx.tx_hash) && (
                    <tr className="bg-gray-50 dark:bg-gray-750">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="animate-slideDown">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-8/12">
                              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">Transaction Details</h4>
                              <dl className="text-sm">
                                <div className="mb-2">
                                  <dt className="font-medium text-gray-500 dark:text-gray-400">Transaction Hash</dt>
                                  <dd className="mt-1 text-gray-900 dark:text-white font-mono break-all">
                                    {tx.tx_hash}
                                  </dd>
                                </div>
                                <div className="mb-2">
                                  <dt className="font-medium text-gray-500 dark:text-gray-400">Timestamp</dt>
                                  <dd className="mt-1 text-gray-900 dark:text-white">
                                    {new Date(tx.block_time * 1000).toLocaleString()}
                                  </dd>
                                </div>
                                <div className="mb-2">
                                  <dt className="font-medium text-gray-500 dark:text-gray-400">Block</dt>
                                  <dd className="mt-1 text-gray-900 dark:text-white">
                                    #{tx.block_height.toLocaleString()}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <div className="md:w-4/12">
                              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">Links</h4>
                              <ul className="space-y-2 text-sm">
                                <li>
                                  <a
                                    href={`https://cardanoscan.io/transaction/${tx.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-gradient/90 hover:text-orange-gradient"
                                  >
                                    View on CardanoScan
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`https://cexplorer.io/tx/${tx.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-gradient/90 hover:text-orange-gradient"
                                  >
                                    View on Cardano Explorer
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={`https://pool.pm/tx/${tx.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-gradient/90 hover:text-orange-gradient"
                                  >
                                    View on Pool.pm
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {hasMore && (
            <div className="flex justify-center pt-4 pb-6">
              <button
                onClick={loadMoreTransactions}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-gradient text-white rounded-md hover:bg-orange-gradient focus:outline-none focus:ring-2 focus:ring-orange-gradient focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Loading...' : 'Load More Transactions'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 