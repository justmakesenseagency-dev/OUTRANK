import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ArchiveSelectorProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  todayIst: string;
}

export const ArchiveSelector: React.FC<ArchiveSelectorProps> = ({
  dates,
  selectedDate,
  onSelectDate,
  todayIst,
}) => {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Archive (Asia/Kolkata)</span>
          </div>
          <p className="text-sm font-semibold text-white mt-0.5">
            Historical Indian Leaderboard Snapshots
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {dates.length === 0 ? (
            <span className="text-xs text-neutral-500 font-mono">
              No historical days archived yet. Current date: {todayIst}
            </span>
          ) : (
            dates.map((date) => (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  selectedDate === date
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {date} {date === todayIst ? '(Today)' : ''}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
