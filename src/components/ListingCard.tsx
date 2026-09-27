import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../types/index.ts';
import { formatInr, sanitizeDomain } from '../utils/format.ts';
import { ArrowUpRight, MousePointerClick, ShieldCheck } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onOutbid?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onOutbid }) => {
  const navigate = useNavigate();
  const displaySpend = listing.qualifyingSpend !== undefined ? listing.qualifyingSpend : listing.verifiedLifetimeSpend;
  const initial = listing.title.charAt(0).toUpperCase();

  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 rounded-xl p-5 transition-all group cursor-pointer relative flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Rank (only if exists) & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {listing.rank ? (
              <span
                className={`font-mono-numbers font-bold text-xs px-2 py-0.5 rounded border ${
                  listing.rank === 1
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                #{listing.rank}
              </span>
            ) : null}

            <span className="text-[11px] text-neutral-400 capitalize font-medium">
              {listing.category.replace('-', ' ')}
            </span>
          </div>

          <span className="text-[11px] font-mono text-neutral-500">
            {sanitizeDomain(listing.websiteUrl)}
          </span>
        </div>

        {/* Logo and Name */}
        <div className="flex items-start gap-3 mb-2.5">
          {listing.logoUrl ? (
            <img
              src={listing.logoUrl}
              alt={listing.title}
              onError={(e) => {
                // Fallback to initial on image failure
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
            <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors truncate">
              {listing.title}
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5">
              {listing.tagline || listing.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom stats & CTA */}
      <div className="mt-4 pt-3 border-t border-neutral-800/70 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-neutral-500 uppercase font-mono block">
            Verified Bid
          </span>
          <span className="font-mono-numbers font-bold text-sm text-white">
            {formatInr(displaySpend)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-500 uppercase font-mono block">
            Direct Clicks
          </span>
          <span className="font-mono-numbers text-xs text-neutral-300 flex items-center justify-end gap-1">
            <MousePointerClick className="w-3 h-3 text-neutral-500" />
            <span>{listing.clickCount || 0}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {onOutbid && (
            <button
              onClick={() => onOutbid(listing)}
              className="px-2.5 py-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Outbid</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={handleCardClick}
            className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors cursor-pointer font-medium"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};
