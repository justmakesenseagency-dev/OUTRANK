import React, { useState, useEffect } from 'react';
import { Listing, OutbidQuoteResponse } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatInr } from '../utils/format.ts';
import { X, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface OutbidModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetListing: Listing | null;
  onSuccess: () => void;
}

export const OutbidModal: React.FC<OutbidModalProps> = ({
  isOpen,
  onClose,
  targetListing,
  onSuccess,
}) => {
  // Mode:
  // 1. "outbid_this": User wants to outbid targetListing directly (become higher than targetListing)
  // 2. "boost_existing": TargetListing is user's own listing that they want to boost (pays difference)
  const [isSelfBoost, setIsSelfBoost] = useState(false);
  const [customSpend, setCustomSpend] = useState<number>(0);
  const [quote, setQuote] = useState<OutbidQuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // Initialize quote calculation when modal opens or target changes
  useEffect(() => {
    if (isOpen && targetListing) {
      setErrorMessage('');
      setConfirmed(false);
      setIsSelfBoost(false);

      // Default required to outbid targetListing: targetListing spend + 5
      const minOvertake = targetListing.verifiedLifetimeSpend + 5;
      setCustomSpend(minOvertake);

      fetchQuote(targetListing.id, minOvertake, false);
    }
  }, [isOpen, targetListing]);

  const fetchQuote = async (listingId: string, spend: number, self: boolean) => {
    setLoadingQuote(true);
    try {
      if (self) {
        // Boost existing listing
        const res = await api.getOutbidQuote({
          listingId,
          customTargetSpend: spend,
        });
        setQuote(res);
      } else {
        // Outbid this target listing
        const res = await api.getOutbidQuote({
          targetListingId: listingId,
          customTargetSpend: spend,
        });
        setQuote(res);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error calculating quote');
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleSpendChange = (newSpend: number) => {
    setCustomSpend(newSpend);
    if (targetListing) {
      fetchQuote(targetListing.id, newSpend, isSelfBoost);
    }
  };

  const handleToggleSelfBoost = (val: boolean) => {
    setIsSelfBoost(val);
    if (targetListing) {
      const initial = val
        ? targetListing.verifiedLifetimeSpend + 500
        : targetListing.verifiedLifetimeSpend + 5;
      setCustomSpend(initial);
      fetchQuote(targetListing.id, initial, val);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetListing || !quote) return;

    setErrorMessage('');
    setIsProcessing(true);

    try {
      if (isSelfBoost) {
        // Server calculates the difference and updates the listing
        await api.outbidListing(targetListing.id, customSpend, paymentMethod);
      } else {
        // Outbid as a new entry or overtaking: if new entry, redirect to submit with prefilled target
        // If outbidding as an overtaking action on existing or new:
        await api.outbidListing(targetListing.id, customSpend, paymentMethod);
      }

      setConfirmed(true);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment execution failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !targetListing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl relative my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Competitive Outbid</span>
              <span className="font-mono text-xs text-amber-500 font-semibold">
                (Rank #{targetListing.rank || 1})
              </span>
            </h2>
            <p className="text-[11px] text-neutral-400">
              Server-authoritative calculation · Minimum increment ₹5
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Outbid Confirmed!
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Payment verified. The leaderboard has been dynamically updated with the new qualifying spend.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-colors cursor-pointer"
              >
                View Updated Leaderboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Target Listing Overview */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
                    Current #{targetListing.rank || 1} Position
                  </span>
                  <div className="text-base font-bold text-white">{targetListing.title}</div>
                  <div className="text-xs text-neutral-400">{targetListing.tagline}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                    Verified Spend
                  </span>
                  <span className="text-sm font-bold font-mono-numbers text-white">
                    {formatInr(targetListing.verifiedLifetimeSpend)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Mode Selector */}
            <div className="p-1 bg-neutral-950 border border-neutral-800 rounded-lg grid grid-cols-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleToggleSelfBoost(false)}
                className={`py-1.5 px-3 rounded text-center cursor-pointer transition-colors ${
                  !isSelfBoost
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Overtake #{targetListing.rank || 1}
              </button>
              <button
                type="button"
                onClick={() => handleToggleSelfBoost(true)}
                className={`py-1.5 px-3 rounded text-center cursor-pointer transition-colors ${
                  isSelfBoost
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                I own this listing (Boost)
              </button>
            </div>

            {/* Target Spend Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Target Cumulative Spend (INR)
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Min. to overtake: {formatInr(targetListing.verifiedLifetimeSpend + 5)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  min={targetListing.verifiedLifetimeSpend + 5}
                  step={5}
                  value={customSpend}
                  onChange={(e) => handleSpendChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg pl-8 pr-4 py-2.5 text-lg font-mono-numbers font-bold text-white focus:outline-none"
                />
              </div>

              {/* Increment presets */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[11px] text-neutral-400">Quick set:</span>
                <button
                  type="button"
                  onClick={() => handleSpendChange(targetListing.verifiedLifetimeSpend + 5)}
                  className="px-2 py-0.5 border border-neutral-800 hover:border-neutral-700 rounded text-[11px] font-mono text-neutral-300 cursor-pointer"
                >
                  +{formatInr(5)} (Overtake by ₹5)
                </button>
                <button
                  type="button"
                  onClick={() => handleSpendChange(targetListing.verifiedLifetimeSpend + 500)}
                  className="px-2 py-0.5 border border-neutral-800 hover:border-neutral-700 rounded text-[11px] font-mono text-neutral-300 cursor-pointer"
                >
                  +{formatInr(500)}
                </button>
                <button
                  type="button"
                  onClick={() => handleSpendChange(targetListing.verifiedLifetimeSpend + 1000)}
                  className="px-2 py-0.5 border border-neutral-800 hover:border-neutral-700 rounded text-[11px] font-mono text-neutral-300 cursor-pointer"
                >
                  +{formatInr(1000)}
                </button>
              </div>
            </div>

            {/* Authoritative Quote Breakdown Card */}
            <div className="border border-amber-500/30 bg-amber-500/[0.04] rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Target Cumulative Total:</span>
                <span className="font-mono-numbers font-semibold text-white">
                  {formatInr(customSpend)}
                </span>
              </div>

              {isSelfBoost && (
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Already Accumulated:</span>
                  <span className="font-mono-numbers text-neutral-300">
                    - {formatInr(targetListing.verifiedLifetimeSpend)}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">You Pay Today</span>
                  <span className="text-[10px] text-neutral-400">
                    {isSelfBoost ? 'Difference calculated by server' : 'Full overtaking allocation'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold font-mono-numbers text-amber-400">
                    {loadingQuote
                      ? '...'
                      : formatInr(
                          isSelfBoost
                            ? Math.max(customSpend - targetListing.verifiedLifetimeSpend, 0)
                            : customSpend
                        )}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-neutral-950 text-white font-semibold'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  UPI (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-500 bg-neutral-950 text-white font-semibold'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  NetBanking
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-neutral-950 text-white font-semibold'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  Card
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || loadingQuote || customSpend <= targetListing.verifiedLifetimeSpend}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm rounded-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Outbid...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Pay{' '}
                      {formatInr(
                        isSelfBoost
                          ? Math.max(customSpend - targetListing.verifiedLifetimeSpend, 0)
                          : customSpend
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
