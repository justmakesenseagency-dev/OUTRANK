import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Listing, ListingCategory, CATEGORIES, LeaderboardViewMode } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Leaderboard } from '../components/Leaderboard.tsx';
import { OutbidModal } from '../components/OutbidModal.tsx';
import { Search, Filter, Layers, Flame, Trophy } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<LeaderboardViewMode>('all-time');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Outbid modal
  const [outbidListing, setOutbidListing] = useState<Listing | null>(null);
  const [outbidOpen, setOutbidOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') as ListingCategory | null;
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getRankings(
        viewMode,
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setListings(data.listings || []);
    } catch (err) {
      console.error('Failed to load explore rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, viewMode]);

  // Client-side search query filtering
  const filteredListings = listings.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.websiteUrl.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Explore Rankings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Browse verified Indian products competing on the public leaderboard.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, pitch or URL..."
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
            <button
              onClick={() => setViewMode('all-time')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'all-time'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setViewMode('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'today'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Today</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category selector chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSearchParams({});
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSearchParams({ category: cat.id });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Leaderboard Table with Empty State */}
      <Leaderboard
        listings={filteredListings}
        loading={loading}
        onOutbid={(item) => {
          setOutbidListing(item);
          setOutbidOpen(true);
        }}
        onTrackClick={(id) => api.recordClick(id)}
        emptyHeadline={
          searchQuery
            ? 'No matching listings found.'
            : selectedCategory !== 'all'
            ? `No listings in ${selectedCategory} yet.`
            : 'No listings yet.'
        }
        emptySupportingText={
          searchQuery
            ? 'Try adjusting your search terms or view all categories.'
            : 'Be the first to claim a position in this category starting at ₹500.'
        }
      />

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        targetListing={outbidListing}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
