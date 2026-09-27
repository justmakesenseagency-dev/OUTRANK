/**
 * Kramank Platform Types - Real Data Domain Definitions
 */

export type ListingCategory =
  | 'ai'
  | 'startups'
  | 'saas'
  | 'd2c'
  | 'creators'
  | 'apps'
  | 'agencies'
  | 'fintech'
  | 'edtech'
  | 'marketing'
  | 'dev-tools';

export interface CategoryInfo {
  id: ListingCategory;
  name: string;
  slug: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'ai', name: 'AI', slug: 'ai', description: 'Generative AI apps, LLM models, and AI automation tools' },
  { id: 'startups', name: 'Startups', slug: 'startups', description: 'Early-stage ventures, bootstrapped ideas, and funded startups' },
  { id: 'saas', name: 'SaaS', slug: 'saas', description: 'Cloud software, enterprise solutions, and B2B workflows' },
  { id: 'd2c', name: 'D2C', slug: 'd2c', description: 'Direct-to-consumer consumer brands, retail products, and merchandise' },
  { id: 'creators', name: 'Creators', slug: 'creators', description: 'Indie hackers, newsletters, media brands, and personal platforms' },
  { id: 'apps', name: 'Apps', slug: 'apps', description: 'Mobile, desktop, and progressive web applications' },
  { id: 'agencies', name: 'Agencies', slug: 'agencies', description: 'Design studios, dev consultancies, and growth marketing firms' },
  { id: 'fintech', name: 'Fintech', slug: 'fintech', description: 'Payments, wealth tech, crypto, accounting, and banking tools' },
  { id: 'edtech', name: 'EdTech', slug: 'edtech', description: 'Learning platforms, cohort courses, and educational software' },
  { id: 'marketing', name: 'Marketing', slug: 'marketing', description: 'SEO, ad tech, growth tools, email marketing, and conversion tools' },
  { id: 'dev-tools', name: 'Developer Tools', slug: 'dev-tools', description: 'APIs, SDKs, developer infrastructure, libraries, and open-source' },
];

export interface Listing {
  id: string;
  title: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  category: ListingCategory;
  logoUrl?: string;
  founderName: string;
  founderEmail: string;
  twitterHandle?: string;
  verifiedLifetimeSpend: number; // in INR ₹
  lastPaymentConfirmedAt: string; // ISO format
  createdAt: string; // ISO format
  clickCount: number; // Real tracked clicks, strictly no fake counts
  status: 'active' | 'suspended';
  // Computed ranking fields for specific view
  rank?: number;
  qualifyingSpend?: number; // Depending on view (all-time vs today vs category)
}

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  type: 'initial_bid' | 'outbid';
  amount: number; // In INR ₹
  previousSpend: number;
  newCumulativeSpend: number;
  status: 'pending' | 'verified' | 'failed';
  paymentMethod: 'upi' | 'netbanking' | 'card';
  paymentRef: string;
  istDate: string; // YYYY-MM-DD in Asia/Kolkata
  createdAt: string;
  confirmedAt?: string;
}

export type LeaderboardViewMode = 'all-time' | 'today' | 'category' | 'archive';

export interface OutbidQuoteRequest {
  listingId?: string; // If existing listing wanting to outbid
  targetRank?: number; // e.g. Rank 1, 2, 3
  targetListingId?: string; // Or target a specific listing to surpass
  customTargetSpend?: number; // Or a specific spend amount
}

export interface OutbidQuoteResponse {
  canBid: boolean;
  listingId?: string;
  currentListingSpend: number;
  targetCumulativeSpend: number;
  amountToPay: number; // What the user actually pays (never charged prior spend again)
  projectedRank: number;
  minimumIncrement: number; // Default ₹5
  competingListing?: {
    id: string;
    title: string;
    spend: number;
  };
  reason?: string;
}

export interface LeaderboardStats {
  totalVerifiedListings: number;
  totalQualifyingVolume: number;
  topRankSpend: number;
  minStartingBid: number;
  defaultIncrement: number;
  currentTimeIst: string;
}
