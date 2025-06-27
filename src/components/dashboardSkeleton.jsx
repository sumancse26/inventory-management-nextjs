const DashboardSkeleton = () => {
  const skeletons = Array(5).fill(0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl shadow-md bg-white border border-gray-200"
        >
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-16 bg-gray-300 rounded" />
          </div>
          <div className="ml-4 p-3 sm:p-4 rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center">
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSkeleton;
