import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Listing, Transaction } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatInr, formatIstDate, sanitizeDomain } from '../utils/format.ts';
import { OutbidModal } from '../components/OutbidModal.tsx';
import {
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  MousePointerClick,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  Trash2,
} from 'lucide-react';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [outbidOpen, setOutbidOpen] = useState(false);

  const fetchListingData = async () => {
    if (!id) return;
    setLoading(true);
    setError('');

    try {
      const data = await api.getListing(id);
      setListing(data.listing);
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message || 'Listing not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingData();
  }, [id]);

  const handleVisitWebsite = () => {
    if (!listing) return;
    api.recordClick(listing.id);
    setListing((prev) => (prev ? { ...prev, clickCount: (prev.clickCount || 0) + 1 } : null));
    window.open(`/api/r/${listing.id}`, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteListing = async () => {
    if (!listing) return;
    const confirmed = window.confirm(`Are you sure you want to remove "${listing.title}" from Kramank?`);
    if (!confirmed) return;
    try {
      await api.deleteListing(listing.id);
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to remove listing');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-neutral-500 font-mono">Loading listing details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Listing Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested listing does not exist in the verified database.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Leaderboard</span>
        </button>
      </div>
    );
  }

  const initial = listing.title.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* ---------------------------------------------------- */}
      {/* 1. BREADCRUMB                                        */}
      {/* ---------------------------------------------------- */}
      <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500">
        <Link to="/" className="hover:text-neutral-300 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-700" />
        <Link to="/explore" className="hover:text-neutral-300 transition-colors">
          Leaderboard
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-700" />
        <Link
          to={`/category/${listing.category}`}
          className="hover:text-neutral-300 transition-colors capitalize"
        >
          {listing.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-700" />
        <span className="text-neutral-300 truncate max-w-[200px]">{listing.title}</span>
      </nav>

      {/* ---------------------------------------------------- */}
      {/* 2. PROFILE HEADER: Logo, Name, Category, Description */}
      {/* ---------------------------------------------------- */}
      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {listing.logoUrl ? (
              <img
                src={listing.logoUrl}
                alt={listing.title}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-16 h-16 rounded-xl object-cover border border-neutral-800 bg-neutral-950 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-black text-amber-500 text-2xl shrink-0">
                {initial}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {listing.title}
                </h1>

                {listing.rank ? (
                  <span
                    className={`font-mono-numbers font-bold text-xs px-2.5 py-0.5 rounded border ${
                      listing.rank === 1
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    Rank #{listing.rank}
                  </span>
                ) : null}
              </div>

              <div className="text-xs text-neutral-400 flex items-center gap-2 mt-1 font-mono">
                <span className="capitalize">{listing.category.replace('-', ' ')}</span>
                <span>·</span>
                <span className="text-neutral-300">{sanitizeDomain(listing.websiteUrl)}</span>
                {listing.lastPaymentConfirmedAt && (
                  <>
                    <span>·</span>
                    <span>Verified {formatIstDate(listing.lastPaymentConfirmedAt)}</span>
                  </>
                )}
              </div>

              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                {listing.tagline}
              </p>
            </div>
          </div>

          {/* Action buttons: [Visit Website] and [Outbid] */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={handleVisitWebsite}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setOutbidOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Outbid</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDeleteListing}
              className="w-full sm:w-auto px-3 py-1.5 text-neutral-500 hover:text-red-400 text-[11px] font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="Remove listing from platform"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove Listing</span>
            </button>
          </div>
        </div>

        {/* Detailed Description if distinct from tagline */}
        {listing.description && listing.description !== listing.tagline && (
          <div className="mt-6 pt-6 border-t border-neutral-800/80">
            <h3 className="text-xs font-mono uppercase text-neutral-400 mb-2">About Product</h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/70">
              {listing.description}
            </p>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. RANKING INFORMATION & KEY STATS                   */}
      {/* ---------------------------------------------------- */}
      <div>
        <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-3">
          Ranking Information
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Overall Rank */}
          <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-mono mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Overall Rank</span>
            </div>
            <div className="font-mono-numbers text-xl font-black text-amber-400">
              {listing.rank ? `#${listing.rank}` : '—'}
            </div>
          </div>

          {/* Current Bid */}
          <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current Bid</span>
            </div>
            <div className="font-mono-numbers text-xl font-black text-white">
              {formatInr(listing.verifiedLifetimeSpend)}
            </div>
          </div>

          {/* Real Clicks */}
          <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-mono mb-1">
              <MousePointerClick className="w-3.5 h-3.5 text-neutral-400" />
              <span>Direct Clicks</span>
            </div>
            <div className="font-mono-numbers text-xl font-black text-white">
              {listing.clickCount || 0}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Real verified</div>
          </div>

          {/* Category */}
          <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-mono mb-1">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span>Category</span>
            </div>
            <div className="text-sm font-bold text-white capitalize truncate">
              {listing.category.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. VERIFIED PAYMENT AUDIT LOG                        */}
      {/* ---------------------------------------------------- */}
      <div className="border border-neutral-800 bg-neutral-900/30 rounded-xl p-6">
        <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-3">
          Verified Bid History
        </h3>

        {transactions.length === 0 ? (
          <p className="text-xs text-neutral-500 font-mono py-2">
            No transactions yet.
          </p>
        ) : (
          <div className="divide-y divide-neutral-800/80 border border-neutral-800/80 rounded-lg overflow-hidden bg-neutral-950">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3 sm:px-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">
                    {tx.type === 'initial_bid' ? 'Initial Bid' : 'Competitive Outbid'}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {tx.paymentRef} · {formatIstDate(tx.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-numbers font-bold text-amber-400">
                    {formatInr(tx.amount)}
                  </div>
                  <div className="text-[9px] text-emerald-400 uppercase font-mono">
                    Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        targetListing={listing}
        onSuccess={() => {
          fetchListingData();
        }}
      />
    </div>
  );
};
