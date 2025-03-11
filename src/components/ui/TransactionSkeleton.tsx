export default function TransactionSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-700">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="px-6 py-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 