export default function NFTSkeleton({ count = 6, view = 'grid' }: { count?: number; view?: 'grid' | 'list' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 
            ${view === 'list' ? 'flex items-center' : ''} animate-pulse`}
        >
          <div className={view === 'list' ? 'w-24 h-24 relative flex-shrink-0' : 'aspect-square relative'}>
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className={view === 'list' ? 'p-4 flex-1' : 'p-4'}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
} 