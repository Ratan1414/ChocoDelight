import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="card animate-pulse">
            <div className="h-52 sm:h-60 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded-t-2xl"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-1/4"></div>
              <div className="h-6 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-3/4"></div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded"></div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-1/3"></div>
                <div className="h-10 w-10 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        );

      case 'product-grid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-52 sm:h-60 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-1/4"></div>
                  <div className="h-6 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-3/4"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded"></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-1/3"></div>
                    <div className="h-10 w-10 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'hero':
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-chocolate-800 via-chocolate-700 to-chocolate-900 text-white animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="h-12 bg-white/20 rounded w-3/4"></div>
                  <div className="h-6 bg-white/20 rounded w-full"></div>
                  <div className="h-6 bg-white/20 rounded w-2/3"></div>
                  <div className="h-12 bg-white/20 rounded w-1/3"></div>
                </div>
                <div className="h-96 bg-white/20 rounded-2xl"></div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-4/6"></div>
          </div>
        );

      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 rounded w-full"></div>
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default LoadingSkeleton;