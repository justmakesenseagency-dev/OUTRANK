import React, { useState, useEffect } from 'react';
import { ListingCategory, CATEGORIES, OutbidQuoteResponse } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatInr } from '../utils/format.ts';
import { X, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newListingId: string) => void;
  topRankSpend: number;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  topRankSpend,
}) => {
  // Step 1: Listing details
  // Step 2: Choose Bid
  // Step 3: Payment
  // Step 4: Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState<ListingCategory>('startups');
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  // Bid state
  const minBid = 500;
  // Suggested initial bid: if top rank exists, calculate amount to take #1 or #2, else ₹500
  const recommendedBid = topRankSpend > 0 ? topRankSpend + 5 : 500;
  const [bidAmount, setBidAmount] = useState<number>(recommendedBid);
  const [quote, setQuote] = useState<OutbidQuoteResponse | null>(null);
  const [calculatingQuote, setCalculatingQuote] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedData, setConfirmedData] = useState<{
    listingId: string;
    txnRef: string;
    rank: number;
    amount: number;
  } | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMessage('');
      setIsProcessing(false);
      setBidAmount(topRankSpend > 0 ? topRankSpend + 5 : 500);
      setConfirmedData(null);
    }
  }, [isOpen, topRankSpend]);

  // Fetch server-authoritative quote when bid amount changes in Step 2
  useEffect(() => {
    if (step === 2 && bidAmount >= 500) {
      setCalculatingQuote(true);
      api
        .getOutbidQuote({ customTargetSpend: bidAmount })
        .then((res) => {
          setQuote(res);
          setCalculatingQuote(false);
        })
        .catch(() => {
          setCalculatingQuote(false);
        });
    }
  }, [step, bidAmount]);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !tagline.trim() || !description.trim() || !websiteUrl.trim() || !founderName.trim() || !founderEmail.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (!founderEmail.includes('@') || !founderEmail.includes('.')) {
      setErrorMessage('Please provide a valid founder email address.');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (bidAmount < minBid) {
      setErrorMessage(`The minimum starting bid is ₹${minBid}.`);
      return;
    }

    setStep(3);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const response = await api.createListing({
        title,
        tagline,
        description,
        websiteUrl,
        category,
        founderName,
        founderEmail,
        twitterHandle,
        bidAmount,
        paymentMethod,
      });

      setConfirmedData({
        listingId: response.listing.id,
        txnRef: response.transaction.paymentRef,
        rank: response.listing.rank || 1,
        amount: response.transaction.amount,
      });

      setStep(4);
      onSuccess(response.listing.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-xl shadow-2xl relative my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {step === 1 && 'Claim Your Rank — Listing Details'}
              {step === 2 && 'Choose Your Initial Bid'}
              {step === 3 && 'Complete Payment & Verification'}
              {step === 4 && 'Verification Confirmed!'}
            </h2>
            <p className="text-[11px] text-neutral-400 font-mono">
              Step {step} of 4 · Real-time ranking verification
            </p>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Indicator (Clean typographic bar) */}
        <div className="grid grid-cols-4 border-b border-neutral-800 text-[10px] font-mono uppercase tracking-wider text-center py-2 bg-neutral-950/30">
          <div className={step >= 1 ? 'text-amber-400 font-bold' : 'text-neutral-600'}>1. Details</div>
          <div className={step >= 2 ? 'text-amber-400 font-bold' : 'text-neutral-600'}>2. Bid</div>
          <div className={step >= 3 ? 'text-amber-400 font-bold' : 'text-neutral-600'}>3. Pay</div>
          <div className={step === 4 ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>4. Ranked</div>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Listing Title / Product Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Acme AI, QuickLaunch, SaaSForge"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Category <span className="text-amber-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ListingCategory)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Destination URL <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourproduct.in"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                One-Line Tagline <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={90}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Concise, punchy hook (e.g. AI-powered invoice generation for Indian freelancers)"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none"
              />
              <div className="text-[10px] text-neutral-400 text-right mt-1 font-mono">
                {tagline.length}/90 chars
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Detailed Pitch / Description <span className="text-amber-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what your listing solves, who it is for, and key metrics or value propositions..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/60">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Founder Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Founder Email <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={founderEmail}
                  onChange={(e) => setFounderEmail(e.target.value)}
                  placeholder="founder@domain.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Twitter / X (Optional)
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@handle"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Choose Bid */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="p-6 space-y-5">
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-300">Minimum Starting Bid:</span>
                <span className="text-xs font-mono font-bold text-neutral-200">₹500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300">Current Highest Bid:</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {topRankSpend > 0 ? formatInr(topRankSpend) : 'None (Leaderboard Open)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Your Initial Bid (INR) <span className="text-amber-500">*</span>
              </label>

              <div className="relative mb-3">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  min={500}
                  step={5}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg pl-8 pr-4 py-2.5 text-lg font-mono-numbers font-bold text-white focus:outline-none"
                />
              </div>

              {/* Quick preset buttons */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-neutral-400 text-[11px]">Presets:</span>
                <button
                  type="button"
                  onClick={() => setBidAmount(500)}
                  className={`px-2.5 py-1 rounded border text-xs font-mono cursor-pointer ${
                    bidAmount === 500
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  ₹500 (Min)
                </button>
                {topRankSpend > 0 && (
                  <button
                    type="button"
                    onClick={() => setBidAmount(topRankSpend + 5)}
                    className={`px-2.5 py-1 rounded border text-xs font-mono cursor-pointer ${
                      bidAmount === topRankSpend + 5
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {formatInr(topRankSpend + 5)} (Take #1)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setBidAmount(1000)}
                  className={`px-2.5 py-1 rounded border text-xs font-mono cursor-pointer ${
                    bidAmount === 1000
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  ₹1,000
                </button>
                <button
                  type="button"
                  onClick={() => setBidAmount(2500)}
                  className={`px-2.5 py-1 rounded border text-xs font-mono cursor-pointer ${
                    bidAmount === 2500
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  ₹2,500
                </button>
              </div>
            </div>

            {/* Server-authoritative quote projection */}
            <div className="border border-neutral-800 bg-neutral-950/80 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Projected All-Time Rank:</span>
                <span className="font-mono-numbers font-bold text-amber-400 text-sm">
                  {calculatingQuote ? 'Calculating...' : `#${quote?.projectedRank || 1}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Qualifying Spend:</span>
                <span className="font-mono-numbers font-semibold text-white">
                  {formatInr(bidAmount)}
                </span>
              </div>
              {quote?.reason && (
                <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-900 font-mono">
                  {quote.reason}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={bidAmount < minBid}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
            {/* Amount Summary */}
            <div className="border border-amber-500/30 bg-amber-500/[0.04] rounded-lg p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">Total Qualifying Amount</span>
                <span className="text-2xl font-bold font-mono-numbers text-white tracking-tight">
                  {formatInr(bidAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider block">
                  Projected Rank
                </span>
                <span className="text-lg font-bold font-mono-numbers text-amber-400">
                  #{quote?.projectedRank || 1}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Select Indian Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-neutral-950 text-white'
                      : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs">UPI</div>
                  <div className="text-[10px] text-neutral-400">GPay, PhonePe, Paytm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-500 bg-neutral-950 text-white'
                      : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs">NetBanking</div>
                  <div className="text-[10px] text-neutral-400">All Indian Banks</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-neutral-950 text-white'
                      : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs">Card</div>
                  <div className="text-[10px] text-neutral-400">RuPay, Visa, MC</div>
                </button>
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  UPI ID / VPA
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank or 9876543210@paytm"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                  A verification request will be initiated for {formatInr(bidAmount)}.
                </p>
              </div>
            )}

            <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-3 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant server-side verification and ranking placement</span>
              </div>
              <p>Tie breaking rule: Qualifying spend DESC, confirmation time ASC.</p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm rounded-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatInr(bidAmount)}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Confirmed & Ranked */}
        {step === 4 && confirmedData && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Listing Verified & Ranked!
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Your payment of <strong className="text-white font-mono">{formatInr(confirmedData.amount)}</strong> has been verified.
                Your listing is now live on the public leaderboard.
              </p>
            </div>

            <div className="border border-neutral-800 bg-neutral-950 rounded-lg p-4 max-w-xs mx-auto text-left space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">Official Rank:</span>
                <span className="text-amber-400 font-bold">#{confirmedData.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="text-neutral-300 truncate max-w-[130px]">{confirmedData.txnRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="text-emerald-400 font-semibold">VERIFIED</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
              >
                View on Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
