import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingCategory, CATEGORIES } from '../types/index.ts';
import { api } from '../services/api.ts';
import { BidSelector } from '../components/BidSelector.tsx';
import { formatInr } from '../utils/format.ts';
import { ArrowUpRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const SubmitPage: React.FC = () => {
  const navigate = useNavigate();

  // Step 1: Form details, Step 2: Verification summary (Do NOT implement real payments yet!)
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('startups');
  const [logoUrl, setLogoUrl] = useState('');
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  // Bid
  const [bidAmount, setBidAmount] = useState<number>(500);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    id: string;
    title: string;
    bid: number;
  } | null>(null);

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!websiteUrl.trim() || !title.trim() || !tagline.trim() || !category) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (bidAmount < 500) {
      setErrorMessage('The minimum starting bid is ₹500.');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Create listing on the authoritative server
      // Note: Phase instructions: "Do NOT implement real payments yet."
      // The listing is submitted and marked active, ready for live payment gateway in future phases.
      const res = await api.createListing({
        title,
        tagline,
        description: description || tagline,
        websiteUrl,
        category,
        logoUrl: logoUrl.trim() || undefined,
        founderName: founderName || 'Founder',
        founderEmail: founderEmail || 'contact@listing.in',
        twitterHandle: twitterHandle || undefined,
        bidAmount,
        paymentMethod: 'upi',
      });

      setSubmissionSuccess({
        id: res.listing.id,
        title: res.listing.title,
        bid: res.listing.verifiedLifetimeSpend,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Leaderboard</span>
        </button>

        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Claim Your Rank
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Submit your product or business to compete for an official position. Starting bid: <strong className="text-amber-400 font-mono-numbers">₹500</strong>.
        </p>
      </div>

      {submissionSuccess ? (
        /* Confirmation State */
        <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Listing Submitted Successfully
            </h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
              <strong className="text-white">{submissionSuccess.title}</strong> has been registered with a qualifying bid of <strong className="text-white font-mono">{formatInr(submissionSuccess.bid)}</strong>.
            </p>
            <p className="text-[11px] text-amber-400/90 font-mono mt-3">
              Your listing becomes active after payment is verified.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/listing/${submissionSuccess.id}`)}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              View Listing Profile
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer"
            >
              Return to Leaderboard
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        /* STEP 1: Details & Initial Bid */
        <form onSubmit={handleStep1Continue} className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Website URL <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourproduct.in"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Listing Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Listing Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Supafast, QuickD2C, Paperclip"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Short Description <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One clear sentence explaining what this does."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
            <div className="text-[10px] text-neutral-500 font-mono text-right mt-1">
              {tagline.length}/120
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Category <span className="text-amber-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ListingCategory)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} — {cat.description}
                </option>
              ))}
            </select>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Logo URL <span className="text-neutral-500 text-[10px]">(Optional)</span>
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://yourproduct.in/logo.png"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Bid Selector Component */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-200 mb-2">
              Choose Your Bid Amount (INR)
            </label>
            <BidSelector
              value={bidAmount}
              onChange={setBidAmount}
              minBid={500}
              step={50}
              helperText="Starting bid: ₹500. Higher bids rank higher."
            />
          </div>

          {/* Explanation Banner */}
          <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg flex items-start gap-2.5 text-xs text-neutral-400">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your listing becomes active after payment is verified.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Continue</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: Review & Confirm */
        <form onSubmit={handleFinalSubmit} className="border border-neutral-800 bg-neutral-900/40 rounded-xl p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="border border-neutral-800 bg-neutral-950 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Listing:</span>
              <span className="text-sm font-bold text-white">{title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">URL:</span>
              <span className="text-xs font-mono text-neutral-300">{websiteUrl}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Category:</span>
              <span className="text-xs font-medium text-amber-400 capitalize">{category}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-850">
              <span className="text-xs text-neutral-400">Selected Starting Bid:</span>
              <span className="text-base font-bold font-mono-numbers text-white">
                {formatInr(bidAmount)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-amber-500/[0.04] border border-amber-500/20 rounded-lg space-y-1.5 text-xs text-neutral-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authoritative Verification Notice</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Your listing becomes active after payment is verified. In this development phase, your listing entry will be registered in the authoritative database without live charge.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Register</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
