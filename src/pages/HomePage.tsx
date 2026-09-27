import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, LeaderboardViewMode, CATEGORIES } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Leaderboard } from '../components/Leaderboard.tsx';
import { OutbidModal } from '../components/OutbidModal.tsx';
import { ArrowUpRight, Flame, Trophy, Compass, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<LeaderboardViewMode>('all-time');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Outbid modal
  const [selectedForOutbid, setSelectedForOutbid] = useState<Listing | null>(null);
  const [outbidOpen, setOutbidOpen] = useState(false);

  const fetchRankings = async (mode: LeaderboardViewMode) => {
    setLoading(true);
    try {
      const data = await api.getRankings(mode);
      setListings(data.listings || []);
    } catch (err) {
      console.error('Failed to load rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(viewMode);
  }, [viewMode]);

  const handleOutbid = (listing: Listing) => {
    setSelectedForOutbid(listing);
    setOutbidOpen(true);
  };

  const handleTrackClick = (listingId: string) => {
    api.recordClick(listingId);
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, clickCount: (l.clickCount || 0) + 1 } : l))
    );
  };

  return (
    <div className="space-y-20 pb-12">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO SECTION                                      */}
      {/* ---------------------------------------------------- */}
      <section className="pt-12 sm:pt-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>INDIAN PUBLIC RANKING MARKETPLACE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase leading-[1.08]">
          PAY TO CLIMB.<br />
          GET DISCOVERED.
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">
          Submit your website, product or business and compete for a position on the public leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/submit')}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
          >
            <span>Claim Your Rank</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => navigate('/explore')}
            className="w-full sm:w-auto px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm rounded-lg border border-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-neutral-400" />
            <span>Explore Rankings</span>
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. LIVE LEADERBOARD                                  */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Leaderboard</h2>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Authoritative ranking sorted by qualifying spend DESC, confirmation time ASC.
            </p>
          </div>

          {/* Leaderboard View Tabs: All-Time / Today */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setViewMode('all-time')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'all-time'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'today'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Today</span>
            </button>
          </div>
        </div>

        {/* Reusable Leaderboard with empty state if 0 listings */}
        <Leaderboard
          listings={listings}
          loading={loading}
          onOutbid={handleOutbid}
          onTrackClick={handleTrackClick}
          emptyHeadline="Be the first to claim a position."
          emptySupportingText="Start at ₹500."
        />
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. CATEGORIES SECTION                                */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Categories</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Browse public leaderboards across distinct Indian digital sectors.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Category chips/cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-850 hover:border-neutral-700 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors">
                {cat.name}
              </div>
              <div className="text-[10px] text-neutral-400 line-clamp-1 mt-1 font-mono">
                {cat.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. HOW IT WORKS                                      */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="border border-neutral-800 bg-neutral-900/30 rounded-2xl p-6 sm:p-12">
          <div className="text-center max-w-lg mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
              Simple Mechanics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Three transparent steps to secure your permanent position.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="font-mono text-2xl font-black text-amber-500 block mb-2">
                01
              </span>
              <h3 className="font-bold text-base text-white mb-1.5">Submit</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Add your website, product or business.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="font-mono text-2xl font-black text-amber-500 block mb-2">
                02
              </span>
              <h3 className="font-bold text-base text-white mb-1.5">Bid</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Start from ₹500 and choose your bid.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="font-mono text-2xl font-black text-amber-500 block mb-2">
                03
              </span>
              <h3 className="font-bold text-base text-white mb-1.5">Get Discovered</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your verified bid determines your position.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800/80 text-center">
            <button
              onClick={() => navigate('/submit')}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Claim Your Rank Now</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        targetListing={selectedForOutbid}
        onSuccess={() => {
          fetchRankings(viewMode);
        }}
      />
    </div>
  );
};
