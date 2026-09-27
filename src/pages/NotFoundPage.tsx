import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 mx-auto">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Error 404
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
          The page or leaderboard segment you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Return to Leaderboard</span>
        </button>
      </div>
    </div>
  );
};
