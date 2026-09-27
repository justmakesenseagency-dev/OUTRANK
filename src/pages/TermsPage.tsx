import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Effective Date: September 2026 · Jurisdiction: India
        </p>
      </div>

      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Nature of the Platform</h2>
          <p>
            Kramank is a competitive public ranking marketplace and discovery directory. Users submit websites, software, digital products, apps, or business profiles and pay qualifying amounts in Indian Rupees (INR) to achieve ranking positions on a publicly accessible leaderboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Bidding and Minimum Starting Bid</h2>
          <p>
            The minimum starting bid for any new listing is ₹500. Bids are verified and recorded authoritatively by the server. All payments are in INR. Ranking order is determined strictly by qualifying spend in descending order, with confirmation timestamp serving as the sole tie-breaking mechanism.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Non-Refundable Ranking Fees</h2>
          <p>
            Because leaderboard positioning is immediate, verified in real-time, and public discovery starts upon confirmation, all paid ranking fees, initial bids, and outbids are strictly non-refundable once processed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Outbid Mechanics and Difference Billing</h2>
          <p>
            Listings can be outbid by other participants who pay a qualifying amount that exceeds the current listing's verified spend by at least the default increment of ₹5. When an existing listing owner boosts their listing, they are only charged the incremental difference.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">5. Prohibited Content and Termination</h2>
          <p>
            Listings promoting illegal products, malicious software, unauthorized gambling, deceptive schemes, or content violating Indian laws will be immediately suspended without refund.
          </p>
        </section>
      </div>
    </div>
  );
};
