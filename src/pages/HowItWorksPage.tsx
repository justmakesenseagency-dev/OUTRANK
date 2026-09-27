import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Check, ShieldCheck, Zap, TrendingUp, Clock, MousePointerClick } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
          Platform Architecture & Rules
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-2 uppercase">
          How Kramank Works
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
          Kramank is an Indian public ranking marketplace. Any creator, startup, SaaS founder, or agency can pay to rank and get discovered by thousands of Indian founders and builders.
        </p>
      </div>

      {/* The 3-Step Product Loop */}
      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-10 space-y-8">
        <h2 className="text-xl font-bold tracking-tight text-white">
          The Core Product Loop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/60">
            <span className="font-mono text-2xl font-black text-amber-500 block mb-2">01</span>
            <h3 className="font-bold text-white text-base mb-1">Submit</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Add your website, startup, SaaS tool, AI product, or digital agency. Enter your pitch and destination link.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/60">
            <span className="font-mono text-2xl font-black text-amber-500 block mb-2">02</span>
            <h3 className="font-bold text-white text-base mb-1">Bid</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              New listings start from a minimum bid of <strong className="text-white font-mono-numbers">₹500</strong>. Choose how high you want to place on the leaderboard.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/60">
            <span className="font-mono text-2xl font-black text-amber-500 block mb-2">03</span>
            <h3 className="font-bold text-white text-base mb-1">Get Discovered</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your verified qualifying spend determines your exact rank. Visitors click directly to your website.
            </p>
          </div>
        </div>
      </div>

      {/* Authoritative Rules Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Authoritative Ranking Rules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Minimum Starting Bid: ₹500</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No new listing can be submitted below ₹500. This maintains high quality and eliminates spam across the entire directory.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Outbid Increment: ₹5</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The default increment to surpass another listing is ₹5. If Position #1 has verified ₹1,000, the minimum qualifying spend to overtake is ₹1,005.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Difference-Only Billing</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If your listing already has ₹1,000 accumulated and you wish to raise it to ₹1,500, you only pay the ₹500 difference. You are never double-charged.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Tie-Breaking Principle</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If two listings have identical qualifying spend, the listing whose payment was confirmed earlier gets the higher rank.
            </p>
          </div>
        </div>
      </div>

      {/* Real Data Guarantee */}
      <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] space-y-2">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-amber-400" />
          <span>Strict Zero Fake Data Policy</span>
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Kramank contains zero fabricated listings, zero fake clicks, and zero mock revenue numbers. Every click is counted directly on our proxy redirect, and every ranking position is backed by real qualifying transactions.
        </p>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/submit')}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-lg transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <span>Claim Your Rank Now</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
