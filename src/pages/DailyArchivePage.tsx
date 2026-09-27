import React, { useState, useEffect } from 'react';
import { Listing } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Leaderboard } from '../components/Leaderboard.tsx';
import { OutbidModal } from '../components/OutbidModal.tsx';
import { Calendar, Clock, Flame } from 'lucide-react';

export const DailyArchivePage: React.FC = () => {
  const [archiveDates, setArchiveDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [todayIst, setTodayIst] = useState<string>('');
  const [currentTimeIst, setCurrentTimeIst] = useState<string>('');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Outbid modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [outbidOpen, setOutbidOpen] = useState(false);

  useEffect(() => {
    // Initial fetch of dates
    api.getArchiveDates().then((dates) => {
      setArchiveDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    });
  }, []);

  const loadDateRankings = async (date: string) => {
    setLoading(true);
    try {
      const data = await api.getRankings('archive', undefined, date || undefined);
      setListings(data.listings || []);
      setTodayIst(data.todayIst || '');
      setCurrentTimeIst(data.nowIst || '');
      if (!selectedDate && data.todayIst) {
        setSelectedDate(data.todayIst);
      }
    } catch (err) {
      console.error('Failed to load archive rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDateRankings(selectedDate);
  }, [selectedDate]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>DAILY ARCHIVE (ASIA/KOLKATA)</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Daily Leaderboard Archive
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Historical daily ranking snapshots calculated strictly within Indian calendar day boundaries.
        </p>
      </div>

      {/* Date Selector Row */}
      <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">
            Selected Date: {selectedDate || todayIst || 'Today'}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-neutral-600" />
            <span>IST boundary resets at 00:00:00 Asia/Kolkata</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {archiveDates.length === 0 ? (
            <div className="text-xs text-neutral-500 font-mono">
              Today ({todayIst || 'Live'}) is Day 1 of the platform.
            </div>
          ) : (
            archiveDates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedDate === date
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                {date} {date === todayIst ? '(Today)' : ''}
              </button>
            ))
          )}
        </div>
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
        emptyHeadline={
          selectedDate && selectedDate !== todayIst
            ? `No activity recorded for ${selectedDate}.`
            : 'No qualifying bids recorded today yet.'
        }
        emptySupportingText="Be the first to claim a position on today's Indian leaderboard starting at ₹500."
      />

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        targetListing={selectedListing}
        onSuccess={() => loadDateRankings(selectedDate)}
      />
    </div>
  );
};
