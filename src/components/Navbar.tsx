import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Categories', path: '/explore?tab=categories' },
    { label: 'Daily', path: '/daily' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-700/80 flex items-center justify-center font-bold text-sm tracking-tighter text-amber-500 shadow-inner group-hover:border-amber-500/60 transition-colors">
            KR
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
              KRAMANK
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold">
              .IN
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`transition-colors hover:text-white ${
                isActive(link.path) ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTA Area (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-2 transition-colors"
          >
            Log In
          </Link>
          <button
            onClick={() => navigate('/submit')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Claim Your Rank</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => navigate('/submit')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded transition-all cursor-pointer"
          >
            Claim
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="text-neutral-400 hover:text-white p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md hover:bg-neutral-900 transition-colors ${
                  isActive(link.path) ? 'bg-neutral-900 text-amber-400 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2"
            >
              Log In
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/submit');
              }}
              className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>Claim Your Rank</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
