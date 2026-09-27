import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ListingCard } from '../components/ListingCard.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { OutbidModal } from '../components/OutbidModal.tsx';
import { ArrowUpRight, Plus, ShieldCheck, Layers, MousePointerClick } from 'lucide-react';
import { formatInr } from '../utils/format.ts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Outbid modal
  const [outbidListing, setOutbidListing] = useState<Listing | null>(null);
  const [outbidOpen, setOutbidOpen] = useState(false);

  const fetchDashboardListings = async () => {
    setLoading(true);
    try {
      const data = await api.getRankings('all-time');
      setListings(data.listings || []);
    } catch (err) {
      console.error('Failed to load dashboard listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Founder Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your verified listings, monitor traffic, and defend your rank.
          </p>
        </div>

        <button
          onClick={() => navigate('/submit')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Submit New Listing</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-neutral-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500 font-mono">Loading your listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          headline="No listings yet."
          supportingText="Be the first to claim a position on the leaderboard."
          buttonText="Claim Your Rank"
          secondaryText="Starting at ₹500"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>{listings.length} verified listing(s) registered</span>
            <span>Sorted by verified qualifying spend</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onOutbid={(l) => {
                  setOutbidListing(l);
                  setOutbidOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        targetListing={outbidListing}
        onSuccess={() => fetchDashboardListings()}
      />
    </div>
  );
};
