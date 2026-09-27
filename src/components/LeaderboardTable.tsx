import React from 'react';
import { Listing, LeaderboardViewMode } from '../types/index.ts';
import { formatInr, formatRelativeIst, sanitizeDomain } from '../utils/format.ts';
import { ExternalLink, ArrowUpRight, Flame, Trophy, MousePointerClick, ShieldCheck } from 'lucide-react';

interface LeaderboardTableProps {
  listings: Listing[];
  loading: boolean;
  view: LeaderboardViewMode;
  onSelectListing: (listing: Listing) => void;
  onOpenOutbid: (listing: Listing) => void;
  onOpenSubmit: () => void;
  onTrackClick: (listingId: string) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  listings,
  loading,
  view,
  onSelectListing,
  onOpenOutbid,
  onOpenSubmit,
  onTrackClick,
}) => {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-mono">Querying verified ledger...</p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EMPTY STATE: Strictly compliant with:
  // "If the real database contains zero listings, the website must show a beautiful empty state."
  // Example: "Be the first to claim a position."
  // --------------------------------------------------------------------------
  if (listings.length === 0) {
    return (
      <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-8 sm:p-14 text-center my-6">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500">
          <Trophy className="w-6 h-6 stroke-[1.5]" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
          Be the first to claim a position.
        </h3>

        <p className="text-sm text-neutral-400 max-w-lg mx-auto mb-6 leading-relaxed">
          {view === 'today'
            ? 'No qualifying bids recorded yet today in Asia/Kolkata. Be the first Indian startup or builder to secure Rank #1 today.'
            : 'The leaderboard is live and waiting for its inaugural listing. Position #1 is currently open at the minimum starting bid of ₹500.'}
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenSubmit}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Claim Your Rank</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Transparent rules reminder */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 max-w-md mx-auto grid grid-cols-2 gap-4 text-left text-xs text-neutral-400">
          <div>
            <span className="text-neutral-500 block font-mono text-[10px] uppercase">Starting Bid</span>
            <span className="text-neutral-200 font-semibold font-mono-numbers">₹500</span>
          </div>
          <div>
            <span className="text-neutral-500 block font-mono text-[10px] uppercase">Outbid Increment</span>
            <span className="text-neutral-200 font-semibold font-mono-numbers">₹5</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-800/90 rounded-xl overflow-hidden bg-neutral-900/30">
      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Listing & Pitch</div>
        <div className="col-span-2 text-right">Qualifying Spend</div>
        <div className="col-span-2 text-right">Real Clicks</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-800/70">
        {listings.map((item, index) => {
          const rankNum = item.rank || index + 1;
          const isTopThree = rankNum <= 3;
          const displaySpend = item.qualifyingSpend !== undefined ? item.qualifyingSpend : item.verifiedLifetimeSpend;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-6 transition-colors group hover:bg-neutral-800/30 ${
                rankNum === 1 ? 'bg-amber-500/[0.02]' : ''
              }`}
            >
              {/* Desktop layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                {/* Rank column */}
                <div className="col-span-1 flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono-numbers font-bold text-sm tracking-tight border ${
                      rankNum === 1
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                        : rankNum === 2
                        ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                        : rankNum === 3
                        ? 'bg-neutral-850 text-neutral-300 border-neutral-750'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    #{rankNum}
                  </div>
                </div>

                {/* Details column */}
                <div className="col-span-5 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onSelectListing(item)}
                      className="text-base font-bold text-white hover:text-amber-400 transition-colors tracking-tight text-left cursor-pointer"
                    >
                      {item.title}
                    </button>
                    <a
                      href={`/api/r/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onTrackClick(item.id)}
                      className="text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-0.5 text-xs"
                      title="Visit official website directly"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
                    {item.tagline}
                  </p>

                  {/* Clean unboxed metadata with typographic separators (anti-slop rule) */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1.5">
                    <span className="capitalize text-neutral-400">{item.category.replace('-', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-neutral-400">{sanitizeDomain(item.websiteUrl)}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {item.founderName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatRelativeIst(item.lastPaymentConfirmedAt)}</span>
                  </div>
                </div>

                {/* Spend column */}
                <div className="col-span-2 text-right">
                  <div className="font-mono-numbers text-base font-bold text-white">
                    {formatInr(displaySpend)}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase font-mono tracking-tight flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Real clicks column */}
                <div className="col-span-2 text-right">
                  <div className="font-mono-numbers text-sm font-semibold text-neutral-300 flex items-center justify-end gap-1.5">
                    <MousePointerClick className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{item.clickCount || 0} clicks</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Direct verified
                  </div>
                </div>

                {/* Actions column */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onSelectListing(item)}
                    className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 rounded-md font-medium transition-colors cursor-pointer"
                  >
                    View Listing
                  </button>
                  <button
                    onClick={() => onOpenOutbid(item)}
                    className="px-3 py-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    title="Outbid to take or claim this position"
                  >
                    <span>Outbid</span>
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-mono-numbers font-bold text-xs border ${
                        rankNum === 1
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      #{rankNum}
                    </div>
                    <div>
                      <button
                        onClick={() => onSelectListing(item)}
                        className="text-sm font-bold text-white text-left cursor-pointer"
                      >
                        {item.title}
                      </button>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{item.category.replace('-', ' ')}</span>
                        <span>·</span>
                        <span>{sanitizeDomain(item.websiteUrl)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-numbers text-sm font-bold text-white">
                      {formatInr(displaySpend)}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {item.clickCount || 0} clicks
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2">
                  {item.tagline}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/60">
                  <button
                    onClick={() => onSelectListing(item)}
                    className="flex-1 py-1.5 text-xs text-neutral-300 bg-neutral-800/80 rounded font-medium text-center cursor-pointer"
                  >
                    View Listing
                  </button>
                  <button
                    onClick={() => onOpenOutbid(item)}
                    className="flex-1 py-1.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-medium text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Outbid</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
