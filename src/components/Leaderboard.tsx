import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../types/index.ts';
import { formatInr, sanitizeDomain } from '../utils/format.ts';
import { EmptyState } from './EmptyState.tsx';
import { ExternalLink, ArrowUpRight, MousePointerClick, ShieldCheck } from 'lucide-react';

interface LeaderboardProps {
  listings: Listing[];
  loading?: boolean;
  onOutbid?: (listing: Listing) => void;
  onTrackClick?: (listingId: string) => void;
  emptyHeadline?: string;
  emptySupportingText?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  listings,
  loading = false,
  onOutbid,
  onTrackClick,
  emptyHeadline = 'No listings yet.',
  emptySupportingText = 'Be the first to claim a position on the leaderboard.',
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 font-mono">Loading verified rankings...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        headline={emptyHeadline}
        supportingText={emptySupportingText}
        buttonText="Claim Your Rank"
        secondaryText="Starting at ₹500"
      />
    );
  }

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/40">
      {/* Desktop Column Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 border-b border-neutral-800 bg-neutral-950/70 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Listing</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2 text-right">Bid</div>
        <div className="col-span-2 text-right">Clicks</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-800/70">
        {listings.map((item, index) => {
          const rankNum = item.rank || index + 1;
          const displaySpend =
            item.qualifyingSpend !== undefined ? item.qualifyingSpend : item.verifiedLifetimeSpend;
          const initial = item.title.charAt(0).toUpperCase();

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/listing/${item.id}`)}
              className="p-4 sm:px-6 sm:py-4 transition-colors hover:bg-neutral-850/50 cursor-pointer group"
            >
              {/* Desktop Row */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono-numbers font-bold text-xs border ${
                      rankNum === 1
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                        : rankNum === 2
                        ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                        : rankNum === 3
                        ? 'bg-neutral-850 text-neutral-300 border-neutral-750'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    #{rankNum}
                  </span>
                </div>

                {/* Listing: Logo, Name, Short Description */}
                <div className="col-span-5 flex items-center gap-3 min-w-0 pr-4">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-10 h-10 rounded-lg object-cover border border-neutral-800 bg-neutral-950 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-500 text-sm shrink-0">
                      {initial}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm truncate">
                        {item.title}
                      </span>
                      <a
                        href={`/api/r/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTrackClick) onTrackClick(item.id);
                        }}
                        className="text-neutral-500 hover:text-neutral-300 p-0.5 rounded transition-colors"
                        title="Visit destination directly"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {item.tagline || item.description}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="text-xs text-neutral-300 capitalize font-medium">
                    {item.category.replace('-', ' ')}
                  </span>
                </div>

                {/* Bid */}
                <div className="col-span-2 text-right">
                  <span className="font-mono-numbers font-bold text-sm text-white">
                    {formatInr(displaySpend)}
                  </span>
                  <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Clicks & Outbid action */}
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <div className="text-right">
                    <span className="font-mono-numbers text-xs text-neutral-300 flex items-center justify-end gap-1">
                      <MousePointerClick className="w-3 h-3 text-neutral-500" />
                      <span>{item.clickCount || 0}</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">clicks</span>
                  </div>

                  {onOutbid && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOutbid(item);
                      }}
                      className="px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Outbid</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Row: Rank, Listing, Bid */}
              <div className="md:hidden flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span
                    className={`w-7 h-7 rounded flex items-center justify-center font-mono-numbers font-bold text-xs shrink-0 border ${
                      rankNum === 1
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    #{rankNum}
                  </span>

                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.title}
                      className="w-8 h-8 rounded object-cover border border-neutral-800 bg-neutral-950 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-500 text-xs shrink-0">
                      {initial}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-sm truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      <span className="capitalize">{item.category.replace('-', ' ')}</span>
                      <span> · </span>
                      <span>{item.clickCount || 0} clicks</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono-numbers font-bold text-sm text-white">
                    {formatInr(displaySpend)}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Verified
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
