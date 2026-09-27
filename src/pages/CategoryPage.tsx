import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Listing, CATEGORIES, CategoryInfo } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Leaderboard } from '../components/Leaderboard.tsx';
import { OutbidModal } from '../components/OutbidModal.tsx';
import { ChevronRight, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const categoryInfo: CategoryInfo | undefined = CATEGORIES.find(
    (c) =>
      c.slug === slug ||
      c.id === slug ||
      c.id.replace(/s$/, '') === slug?.replace(/s$/, '')
  );

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Outbid modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [outbidOpen, setOutbidOpen] = useState(false);

  const loadCategoryData = async () => {
    if (!categoryInfo) return;
    setLoading(true);
    try {
      const data = await api.getRankings('category', categoryInfo.id);
      setListings(data.listings || []);
    } catch (err) {
      console.error('Failed to load category rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryData();
  }, [slug]);

  if (!categoryInfo) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Category Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested category does not exist.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore All Categories</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500">
        <Link to="/" className="hover:text-neutral-300 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-700" />
        <Link to="/explore" className="hover:text-neutral-300 transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-700" />
        <span className="text-neutral-300">{categoryInfo.name}</span>
      </nav>

      {/* Category Header */}
      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1.5 font-semibold">
            <span>Category Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            {categoryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl leading-relaxed">
            {categoryInfo.description}. Position is ranked strictly by verified qualifying spend.
          </p>
        </div>

        <button
          onClick={() => navigate('/submit')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0 cursor-pointer"
        >
          <span>Claim Rank in {categoryInfo.name}</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Leaderboard Table with Empty State */}
      <Leaderboard
        listings={listings}
        loading={loading}
        onOutbid={(item) => {
          setSelectedListing(item);
          setOutbidOpen(true);
        }}
        onTrackClick={(id) => api.recordClick(id)}
        emptyHeadline={`No ${categoryInfo.name} listings yet.`}
        emptySupportingText={`Be the first to claim a position in ${categoryInfo.name} starting at ₹500.`}
      />

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        targetListing={selectedListing}
        onSuccess={() => loadCategoryData()}
      />
    </div>
  );
};
