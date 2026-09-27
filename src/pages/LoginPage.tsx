import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Mail, Lock, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sentMagicLink, setSentMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // Fast simulation of magic link dispatch
    setTimeout(() => {
      setLoading(false);
      setSentMagicLink(true);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Leaderboard</span>
          </button>

          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            Founder Login
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Access your listing dashboard, manage bids, and review real traffic.
          </p>
        </div>

        {sentMagicLink ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Check Your Inbox</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We sent a secure magic sign-in link to <strong className="text-white font-mono">{email}</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Founder Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@yourstartup.in"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <span>Send Magic Sign-In Link</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
          <span>Don't have an account yet? </span>
          <Link to="/signup" className="text-amber-400 hover:underline font-semibold">
            Claim your rank
          </Link>
        </div>
      </div>
    </div>
  );
};
