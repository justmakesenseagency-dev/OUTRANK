import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Award, ArrowUpRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
          About Kramank
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2 uppercase">
          The Indian Internet Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto leading-relaxed">
          A competitive, transparent public ranking platform engineered specifically for the vibrant Indian technology and creator ecosystem.
        </p>
      </div>

      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-neutral-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">Why Kramank Exists</h2>
        <p>
          Traditional internet directories are filled with artificial upvotes, pay-for-review schemes, and opaque algorithms. Founders spend countless hours trying to game ranking algorithms rather than focusing on shipping great products.
        </p>
        <p>
          Kramank cuts through the noise with complete transparency: <strong>Qualifying spend determines ranking.</strong>
        </p>
        <p>
          If you believe in your startup, SaaS tool, AI product, or digital venture, you can put your capital behind it. The leaderboard is 100% public, visible to thousands of Indian builders, investors, and early adopters.
        </p>

        <div className="pt-6 border-t border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-white">Our Core Commitments</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-800 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                1
              </div>
              <div>
                <strong className="text-white block text-xs">Strict Zero Fake Data Policy</strong>
                <span className="text-xs text-neutral-400">
                  We never seed invented startups, fake reviews, or bot click counts. If there are zero listings, we show zero listings. Every Rupee and every click is real.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-800 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                2
              </div>
              <div>
                <strong className="text-white block text-xs">Fair Difference-Only Billing</strong>
                <span className="text-xs text-neutral-400">
                  When boosting your listing to overtake an opponent, you only pay the incremental delta. You are never penalized for your prior investment.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-800 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                3
              </div>
              <div>
                <strong className="text-white block text-xs">Independent Click Verification</strong>
                <span className="text-xs text-neutral-400">
                  All traffic directed from Kramank is tracked authoritatively through proxy redirection, giving founders precise discovery statistics.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => navigate('/submit')}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Claim Your Rank</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
