import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Effective Date: September 2026 · Jurisdiction: India
        </p>
      </div>

      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            When you submit a listing to Kramank, we collect public listing information including your listing title, description, category, destination URL, and logo. For account management and transactional receipts, we collect your name and email address.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Public Ledger Transparency</h2>
          <p>
            As a core feature of the Kramank platform, verified qualifying bids and ranking positions are publicly displayed on our open leaderboard and public ledger. We do not display private banking or card details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Click Tracking Analytics</h2>
          <p>
            We operate an outbound redirect service to calculate real clicks received by verified listings. We do not sell user data to advertising third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Data Security</h2>
          <p>
            We implement strict server-authoritative controls and encryption in transit. Financial operations and database integrity are managed with high security.
          </p>
        </section>
      </div>
    </div>
  );
};
