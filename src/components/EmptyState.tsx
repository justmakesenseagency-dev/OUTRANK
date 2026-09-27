import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Trophy } from 'lucide-react';

interface EmptyStateProps {
  headline?: string;
  supportingText?: string;
  buttonText?: string;
  secondaryText?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  headline = 'No listings yet.',
  supportingText = 'Be the first to claim a position on the leaderboard.',
  buttonText = 'Claim Your Rank',
  secondaryText = 'Starting at ₹500',
  onAction,
  compact = false,
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/submit');
    }
  };

  return (
    <div
      className={`border border-neutral-800 bg-neutral-900/30 rounded-xl text-center flex flex-col items-center justify-center ${
        compact ? 'p-8 sm:p-10 my-4' : 'p-10 sm:p-16 my-6'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
        <Trophy className="w-5 h-5 stroke-[1.5]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
        {headline}
      </h3>

      <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
        {supportingText}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        <button
          onClick={handleAction}
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
        >
          <span>{buttonText}</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {secondaryText && (
          <span className="text-xs font-mono text-neutral-500 px-3 py-2">
            {secondaryText}
          </span>
        )}
      </div>
    </div>
  );
};
