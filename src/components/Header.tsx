import React from 'react';
import { LeaderboardViewMode, ListingCategory, CATEGORIES } from '../types/index.ts';
import { ArrowUpRight, Clock, ShieldCheck, Flame, History, Layers } from 'lucide-react';

interface HeaderProps {
  currentView: LeaderboardViewMode;
  onViewChange: (view: LeaderboardViewMode) => void;
  selectedCategory?: ListingCategory;
  onCategoryChange: (cat: ListingCategory | undefined) => void;
  onOpenSubmit: () => void;
  onOpenLedger: () => void;
  currentTimeIst?: string;
  totalListings: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  selectedCategory,
  onCategoryChange,
  onOpenSubmit,
  onOpenLedger,
  currentTimeIst,
  totalListings,
}) => {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top microbar */}
      <div className="border-b border-neutral-800/40 text-[11px] text-neutral-400 py-1 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE LEADERBOARD
            </span>
            <span className="text-neutral-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">Min. Initial Bid: <strong className="text-neutral-200 font-mono-numbers">₹500</strong></span>
            <span className="text-neutral-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">Min. Outbid Increment: <strong className="text-neutral-200 font-mono-numbers">₹5</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLedger}
              className="hover:text-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Public Ledger</span>
            </button>
            <span className="text-neutral-600" aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
              <Clock className="w-3 h-3 text-neutral-500" />
              <span>{currentTimeIst || 'Asia/Kolkata'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('all-time');
              onCategoryChange(undefined);
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-700/80 flex items-center justify-center font-bold text-base tracking-tighter text-amber-500 shadow-inner group-hover:border-amber-500/60 transition-colors">
              KR
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  KRAMANK
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold">
                  .IN
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 -mt-0.5 tracking-tight hidden sm:block">
                The Indian Public Ranking Marketplace
              </p>
            </div>
          </a>
        </div>

        {/* View Switcher Tabs (Segmented Buttons) */}
        <nav className="hidden md:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          <button
            onClick={() => onViewChange('all-time')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'all-time'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>All-Time</span>
          </button>

          <button
            onClick={() => onViewChange('today')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'today'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Today (IST)</span>
          </button>

          <button
            onClick={() => onViewChange('category')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'category'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>Category</span>
          </button>

          <button
            onClick={() => onViewChange('archive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'archive'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span>Archive</span>
          </button>
        </nav>

        {/* Primary Action Button (Primary UX Principle: Single clear CTA) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSubmit}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-bold tracking-tight rounded-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Claim Your Rank</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden border-t border-neutral-900 px-4 py-2 bg-neutral-950 flex items-center justify-between text-xs overflow-x-auto gap-2">
        <button
          onClick={() => onViewChange('all-time')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer ${
            currentView === 'all-time' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
          }`}
        >
          All-Time
        </button>
        <button
          onClick={() => onViewChange('today')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1 cursor-pointer ${
            currentView === 'today' ? 'bg-neutral-800 text-amber-400 font-medium' : 'text-neutral-400'
          }`}
        >
          <Flame className="w-3 h-3 text-amber-500" />
          <span>Today</span>
        </button>
        <button
          onClick={() => onViewChange('category')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer ${
            currentView === 'category' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
          }`}
        >
          Category
        </button>
        <button
          onClick={() => onViewChange('archive')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer ${
            currentView === 'archive' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
          }`}
        >
          Archive
        </button>
      </div>

      {/* Category selector row when in Category mode */}
      {currentView === 'category' && (
        <div className="border-t border-neutral-900 bg-neutral-900/60 px-4 sm:px-8 py-2 overflow-x-auto">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono mr-1">
              Category:
            </span>
            <button
              onClick={() => onCategoryChange(undefined)}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                !selectedCategory
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/40'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
