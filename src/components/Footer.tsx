import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-4 sm:px-8 mt-24 text-neutral-500 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-extrabold text-white tracking-tight text-sm">KRAMANK.IN</span>
            <span className="text-neutral-700">·</span>
            <span className="text-neutral-400">The Indian Public Ranking Marketplace</span>
          </div>
          <p className="text-[11px] text-neutral-400 max-w-md leading-relaxed">
            The competitive, verified pay-to-rank platform for Indian startups, digital products, and creators. All bids in INR (₹). Asia/Kolkata timezone.
          </p>
        </div>

        {/* Links: About, How It Works, FAQ, Terms, Privacy, Contact */}
        <div className="flex items-center gap-5 flex-wrap text-neutral-400 text-xs">
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link to="/how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link to="/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <a href="mailto:founder@kramank.in" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-neutral-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-neutral-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span>Strict Zero Fake Data Policy · Real qualifying spend and verified clicks only</span>
        </div>
        <div>
          <span>© {new Date().getFullYear()} Kramank. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
