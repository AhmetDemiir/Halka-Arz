import React from 'react';

const PortfolioSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="flex justify-between items-center">
      <div className="h-10 w-64 bg-slate-800 rounded-xl" />
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-slate-800 rounded-xl" />
        <div className="h-10 w-32 bg-slate-800 rounded-xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-slate-900 rounded-3xl border border-slate-800" />
      ))}
    </div>
    {[1, 2].map(i => (
      <div key={i} className="h-48 bg-slate-900 rounded-[2rem] border border-slate-800" />
    ))}
  </div>
);

export default PortfolioSkeleton;
