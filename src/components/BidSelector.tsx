import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { formatInr } from '../utils/format.ts';

interface BidSelectorProps {
  value: number;
  onChange: (value: number) => void;
  minBid?: number; // Configurable from backend (defaults to ₹500 for new listings)
  step?: number;
  disabled?: boolean;
  helperText?: string;
}

export const BidSelector: React.FC<BidSelectorProps> = ({
  value,
  onChange,
  minBid = 500,
  step = 50,
  disabled = false,
  helperText,
}) => {
  const handleDecrement = () => {
    if (disabled) return;
    const next = Math.max(minBid, value - step);
    onChange(next);
  };

  const handleIncrement = () => {
    if (disabled) return;
    onChange(value + step);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) {
      onChange(minBid);
      return;
    }
    onChange(raw);
  };

  const handleBlur = () => {
    if (value < minBid) {
      onChange(minBid);
    }
  };

  return (
    <div className="space-y-2">
      {/* Controls: [-] [₹500] [+] */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= minBid}
          aria-label="Decrease bid"
          className="w-11 h-11 shrink-0 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold font-mono text-base pointer-events-none select-none">
            ₹
          </span>
          <input
            type="number"
            min={minBid}
            step={step}
            value={value}
            onChange={handleManualInput}
            onBlur={handleBlur}
            disabled={disabled}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-lg pl-8 pr-4 py-2.5 text-base sm:text-lg font-mono-numbers font-bold text-white focus:outline-none transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          aria-label="Increase bid"
          className="w-11 h-11 shrink-0 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
        <span>{helperText || `New listings start at ${formatInr(minBid)}.`}</span>
        {value > minBid && (
          <button
            type="button"
            onClick={() => onChange(minBid)}
            className="text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
          >
            Reset to min ({formatInr(minBid)})
          </button>
        )}
      </div>
    </div>
  );
};
