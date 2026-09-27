import {
  Listing,
  Transaction,
  LeaderboardViewMode,
  ListingCategory,
  OutbidQuoteRequest,
  OutbidQuoteResponse,
  LeaderboardStats,
} from '../types/index.ts';

export interface RankingsResponse {
  listings: Listing[];
  total: number;
  view: LeaderboardViewMode;
  category: ListingCategory | null;
  archiveDate: string | null;
  todayIst: string;
  nowIst: string;
}

export const api = {
  async getRankings(
    view: LeaderboardViewMode = 'all-time',
    category?: ListingCategory,
    archiveDate?: string
  ): Promise<RankingsResponse> {
    const params = new URLSearchParams();
    params.set('view', view);
    if (category) params.set('category', category);
    if (archiveDate) params.set('archiveDate', archiveDate);

    const res = await fetch(`/api/rankings?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch rankings');
    }
    return res.json();
  },

  async getListing(id: string): Promise<{ listing: Listing; transactions: Transaction[] }> {
    const res = await fetch(`/api/listings/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to load listing details');
    }
    return res.json();
  },

  async getOutbidQuote(params: OutbidQuoteRequest): Promise<OutbidQuoteResponse> {
    const res = await fetch('/api/outbid/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to calculate quote');
    }
    return res.json();
  },

  async createListing(data: {
    title: string;
    tagline: string;
    description: string;
    websiteUrl: string;
    category: ListingCategory;
    logoUrl?: string;
    founderName: string;
    founderEmail: string;
    twitterHandle?: string;
    bidAmount: number;
    paymentMethod: 'upi' | 'netbanking' | 'card';
  }): Promise<{ listing: Listing; transaction: Transaction }> {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit listing');
    }
    return res.json();
  },

  async outbidListing(
    listingId: string,
    targetCumulativeSpend: number,
    paymentMethod: 'upi' | 'netbanking' | 'card' = 'upi'
  ): Promise<{ listing: Listing; transaction: Transaction }> {
    const res = await fetch(`/api/listings/${listingId}/outbid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetCumulativeSpend, paymentMethod }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to complete outbid');
    }
    return res.json();
  },

  async deleteListing(listingId: string): Promise<boolean> {
    const res = await fetch(`/api/listings/${listingId}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  async recordClick(listingId: string): Promise<number> {
    try {
      const res = await fetch(`/api/track-click/${listingId}`, { method: 'POST' });
      const data = await res.json();
      return data.clickCount;
    } catch {
      return 0;
    }
  },

  async getStats(): Promise<LeaderboardStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) {
      throw new Error('Failed to load stats');
    }
    return res.json();
  },

  async getArchiveDates(): Promise<string[]> {
    const res = await fetch('/api/archive-dates');
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.dates || [];
  },

  async getTransactions(listingId?: string): Promise<Transaction[]> {
    const url = listingId ? `/api/transactions?listingId=${listingId}` : '/api/transactions';
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.transactions || [];
  },
};
