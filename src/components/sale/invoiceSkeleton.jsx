const InvoiceSkeleton = () => {
  return (
    <div className="flex gap-4 animate-pulse px-4 py-6">
      {/* Left Panel: Invoice Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-40 bg-gray-200 dark:bg-gray-600 rounded" />
            <div className="h-3 w-36 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-7 gap-2 text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
          <div>SL</div>
          <div>Name</div>
          <div>Stock</div>
          <div>Price</div>
          <div>Qty</div>
          <div>VAT</div>
          <div>Total</div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-7 gap-2 items-center py-2 border-b border-gray-200 dark:border-gray-700"
          >
            {Array(7)
              .fill(0)
              .map((_, j) => (
                <div
                  key={j}
                  className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"
                />
              ))}
          </div>
        ))}

        {/* Totals */}
        <div className="mt-6 space-y-3">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Button */}
        <div className="mt-4 h-10 w-full bg-gradient-to-r from-pink-400 to-purple-600 opacity-30 rounded" />
      </div>

      {/* Right Panel: Product List */}
      <div className="w-[350px] bg-white dark:bg-gray-800 rounded-lg p-4 shadow space-y-4">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Product Rows */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-4 text-xs bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
            <div className="h-6 w-10 bg-purple-300 rounded-full opacity-50" />
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-between pt-2">
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSkeleton;
