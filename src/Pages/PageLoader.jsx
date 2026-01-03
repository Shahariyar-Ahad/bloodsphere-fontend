import React from 'react';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <span className="loading loading-spinner loading-lg text-red-600"></span>
    </div>
  );
};

export default PageLoader;
