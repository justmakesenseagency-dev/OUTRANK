import React, { useState, useEffect } from 'react';
import { Listing, Transaction } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatInr, formatIstDate, sanitizeDomain } from '../utils/format.ts';
import {
  X,
  ExternalLink,
  ShieldCheck,
  MousePointerClick,
  ArrowUpRight,
  User,
  Calendar,
  Layers,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenOutbid: (listing: Listing) => void;
  onTrackClick: (listingId: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenOutbid,
  onTrackClick,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [clickCount, setClickCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen && listing) {
      setClickCount(listing.clickCount || 0);
      setLoadingTxns(true);
      api
        .getListing(listing.id)
        .then((data) => {
          setTransactions(data.transactions || []);
          setClickCount(data.listing.clickCount || 0);
          setLoadingTxns(false);
        })
        .catch(() => {
          setLoadingTxns(false);
        });
    }
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  const handleVisitWebsite = () => {
    onTrackClick(listing.id);
    setClickCount((prev) => prev + 1);
    window.open(`/api/r/${listing.id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-xl shadow-2xl relative my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono-numbers font-bold text-amber-400 text-xs">
              #{listing.rank || 1}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{listing.title}</h2>
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <span className="capitalize">{listing.category.replace('-', ' ')}</span>
                <span>·</span>
                <span className="font-mono">{sanitizeDomain(listing.websiteUrl)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Pitch */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-200 mb-1">Tagline</h4>
            <p className="text-sm text-neutral-300 leading-snug">{listing.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-200 mb-1">Pitch & Value Proposition</h4>
            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
              {listing.description}
            </p>
          </div>

          {/* Key Metrics Grid (REAL DATA ONLY) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                Qualifying Spend
              </span>
              <span className="text-base font-bold font-mono-numbers text-white">
                {formatInr(listing.verifiedLifetimeSpend)}
              </span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                Direct Clicks
              </span>
              <span className="text-base font-bold font-mono-numbers text-neutral-200 flex items-center gap-1">
                <MousePointerClick className="w-3.5 h-3.5 text-neutral-400" />
                <span>{clickCount}</span>
              </span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                All-Time Rank
              </span>
              <span className="text-base font-bold font-mono-numbers text-amber-400">
                #{listing.rank || 1}
              </span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                Status
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED</span>
              </span>
            </div>
          </div>

          {/* Founder & Metadata */}
          <div className="border-t border-neutral-800 pt-4 text-xs text-neutral-400 space-y-1.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Founder:</span>
              <span className="text-neutral-300 font-sans">{listing.founderName}</span>
            </div>
            {listing.twitterHandle && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Twitter / X:</span>
                <span className="text-amber-400">@{listing.twitterHandle}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Confirmed Timestamp:</span>
              <span className="text-neutral-300">{formatIstDate(listing.lastPaymentConfirmedAt)}</span>
            </div>
          </div>

          {/* Transaction History (Real Ledger) */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-2">
              Verified Payment History
            </h4>
            {loadingTxns ? (
              <div className="py-4 text-center text-xs text-neutral-500 font-mono">
                Loading transaction records...
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-3 text-center text-xs text-neutral-500 font-mono bg-neutral-950 rounded border border-neutral-800">
                No transactions yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/70 border border-neutral-800 rounded-lg bg-neutral-950 overflow-hidden text-xs">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-neutral-300 font-medium">
                        {tx.type === 'initial_bid' ? 'Initial Verification Bid' : 'Outbid Increment'}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {tx.paymentRef} · {formatIstDate(tx.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
                        {formatInr(tx.amount)}
                      </div>
                      <div className="text-[10px] text-emerald-400 uppercase font-mono">
                        Verified
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Primary UX Actions */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              onClick={() => onOpenOutbid(listing)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Outbid</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Primary Action */}
            <button
              onClick={handleVisitWebsite}
              className="flex-1 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
