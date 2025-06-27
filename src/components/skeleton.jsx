"use client";

const SkeletonList = ({ count = 3, withAvatar = true, className = "" }) => {
  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          {withAvatar && (
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
          )}

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
