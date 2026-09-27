import React from 'react';
import { ArrowUpRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { formatInr } from '../utils/format.ts';

interface RulesBannerProps {
  onOpenSubmit: () => void;
  topRankSpend: number;
  totalListings: number;
}

export const RulesBanner: React.FC<RulesBannerProps> = ({
  onOpenSubmit,
  topRankSpend,
  totalListings,
}) => {
  return (
    <div className="py-8 sm:py-12 border-b border-neutral-800/80 mb-8">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>INDIAN PUBLIC RANKING MARKETPLACE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.12]">
          Pay to rank. Compete to lead. Get discovered by India.
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 mb-8 max-w-2xl leading-relaxed">
          The transparent, verified leaderboard for Indian startups, SaaS tools, AI products, creators, agencies, and online ventures. Position is determined strictly by verified qualifying spend.
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={onOpenSubmit}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <span>Claim Your Rank</span>
            <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>

          <div className="text-xs text-neutral-500 font-mono">
            {totalListings === 0 ? (
              <span>Position #1 is currently open at <strong className="text-neutral-300 font-mono-numbers">₹500</strong></span>
            ) : (
              <span>Rank #1 qualifying spend: <strong className="text-neutral-300 font-mono-numbers">{formatInr(topRankSpend)}</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* The 3 Core Rules (Clean typography, no pills, no slop) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-neutral-850 text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-200 font-bold">
            <span className="w-4 h-4 rounded bg-neutral-800 text-amber-400 flex items-center justify-center font-mono text-[10px]">1</span>
            <span>Server-Authoritative Ranking</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Minimum starting bid is ₹500. Rankings calculate strictly as qualifying spend DESC, confirmation time ASC.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-200 font-bold">
            <span className="w-4 h-4 rounded bg-neutral-800 text-amber-400 flex items-center justify-center font-mono text-[10px]">2</span>
            <span>Fair Outbid & Difference Billing</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Minimum outbid increment is ₹5. When boosting your existing listing, you only pay the incremental difference.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-200 font-bold">
            <span className="w-4 h-4 rounded bg-neutral-800 text-amber-400 flex items-center justify-center font-mono text-[10px]">3</span>
            <span>Zero Fake Data & Real Clicks</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Strict production data policy. Every click and transaction is independently verified and counted in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};
