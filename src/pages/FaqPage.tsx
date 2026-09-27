import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is Kramank?',
    answer:
      'Kramank is an Indian public ranking marketplace. It allows makers, founders, creators, and agencies to submit their product and pay to secure a competitive position on a high-visibility public leaderboard.',
  },
  {
    question: 'What is the minimum starting bid for a new listing?',
    answer:
      'The minimum starting bid for any new listing is ₹500. Submissions below ₹500 are not permitted. All monetary amounts are in Indian Rupees (INR).',
  },
  {
    question: 'How is rank calculated?',
    answer:
      'Rank is determined authoritatively by qualifying spend in descending order (highest spend gets Rank #1). If two listings have identical spend, the tie is broken by confirmation timestamp—the one confirmed earlier takes the higher position.',
  },
  {
    question: 'What happens when someone outbids me?',
    answer:
      'If another listing pays more than your verified spend, they move above you on the leaderboard. You can instantly outbid them by paying the difference required to overtake their position.',
  },
  {
    question: 'Do I have to pay my entire previous bid again to outbid someone?',
    answer:
      'No. The backend enforces difference-only billing. If you have already verified ₹1,000 and want your total spend to become ₹1,500, you only pay the ₹500 difference.',
  },
  {
    question: 'What is the minimum increment required to overtake another listing?',
    answer:
      'The default outbid increment is ₹5. If Position #1 has verified ₹1,000, the minimum amount required to take Position #1 is ₹1,005.',
  },
  {
    question: 'How do direct clicks work?',
    answer:
      'Every time a visitor clicks on your listing on Kramank, they are routed through our fast click-tracking proxy which registers one real click before redirecting to your destination URL. Real counts only—zero fake clicks.',
  },
  {
    question: 'What time zone is used for daily leaderboards?',
    answer:
      'All daily leaderboards and archive snapshots use Asia/Kolkata (Indian Standard Time, IST). Day boundaries reset at midnight 00:00:00 IST.',
  },
  {
    question: 'Are ranking payments refundable?',
    answer:
      'Because ranking position is immediately applied and public discovery begins immediately upon verification, placement bids are strictly non-refundable.',
  },
];

export const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2 uppercase">
          Everything You Need to Know
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Clear answers about ranking mechanics, bidding, payments, and discovery.
        </p>
      </div>

      <div className="divide-y divide-neutral-800 border border-neutral-800 bg-neutral-900/40 rounded-2xl overflow-hidden">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.question} className="p-5 sm:p-6 transition-colors hover:bg-neutral-900/60">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed pr-6">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border border-neutral-800 bg-neutral-900/30 rounded-xl p-6 text-center space-y-3">
        <h3 className="text-sm font-bold text-white">Ready to claim your position?</h3>
        <p className="text-xs text-neutral-400">
          Position #1 is determined by real qualifying spend. Start at ₹500 today.
        </p>
        <button
          onClick={() => navigate('/submit')}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Claim Your Rank</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
