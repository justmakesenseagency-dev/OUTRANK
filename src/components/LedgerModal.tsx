import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatInr, formatIstDate } from '../utils/format.ts';
import { X, ShieldCheck, RefreshCw } from 'lucide-react';

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({ isOpen, onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTxns = () => {
    setLoading(true);
    api
      .getTransactions()
      .then((txns) => {
        setTransactions(txns);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchTxns();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl shadow-2xl relative my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Public Transparency Ledger
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Immutable log of verified qualifying bids in Asia/Kolkata (IST)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTxns}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono">
              Loading verified transaction ledger...
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-neutral-300">No transactions yet.</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                All confirmed payments, initial bids, and competitive outbids will be recorded here in real-time.
              </p>
            </div>
          ) : (
            <div className="border border-neutral-800 rounded-lg overflow-hidden divide-y divide-neutral-800 bg-neutral-950">
              <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase font-mono text-neutral-500 bg-neutral-900/60">
                <div className="col-span-4">Listing / Product</div>
                <div className="col-span-3">Type & Method</div>
                <div className="col-span-3">Date (IST)</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-neutral-800/60">
                {transactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-12 px-4 py-3 text-xs items-center">
                    <div className="col-span-4 pr-2">
                      <div className="font-semibold text-white truncate">{tx.listingTitle}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{tx.paymentRef}</div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-neutral-300">
                        {tx.type === 'initial_bid' ? 'Initial Bid' : 'Outbid'}
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase font-mono">
                        {tx.paymentMethod}
                      </div>
                    </div>
                    <div className="col-span-3 text-[11px] text-neutral-400 font-mono">
                      {formatIstDate(tx.createdAt)}
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="font-mono-numbers font-bold text-amber-400">
                        {formatInr(tx.amount)}
                      </div>
                      <div className="text-[9px] text-emerald-400 uppercase font-mono">
                        Verified
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
