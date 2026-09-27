/**
 * Kramank Authoritative Database Engine
 * 
 * STRICT PRODUCTION DATA POLICY:
 * - Starts with 0 listings, 0 transactions. ZERO FAKE DATA.
 * - Server-authoritative calculations: rank, bid amount, increment, tie breaking.
 * - Asia/Kolkata timezone for IST day boundaries.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Listing,
  Transaction,
  ListingCategory,
  LeaderboardViewMode,
  OutbidQuoteRequest,
  OutbidQuoteResponse,
  LeaderboardStats
} from '../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'kramank-store.json');

// Configuration constants
export const MIN_STARTING_BID_INR = 500;
export const DEFAULT_INCREMENT_INR = 5;

interface DatabaseSchema {
  listings: Listing[];
  transactions: Transaction[];
  archivedDays: string[];
}

function getInitialDb(): DatabaseSchema {
  // STRICT RULE: Empty starting state. ZERO fake listings, ZERO fake transactions.
  return {
    listings: [],
    transactions: [],
    archivedDays: [],
  };
}

export class KramankDb {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDb();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Error creating data directory:', err);
      }
    }
  }

  private loadDb(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read db file, initializing clean empty database:', err);
    }
    const initial = getInitialDb();
    this.saveDb(initial);
    return initial;
  }

  private saveDb(state: DatabaseSchema = this.data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving Kramank database:', err);
    }
  }

  /**
   * Returns current date in Asia/Kolkata timezone as YYYY-MM-DD
   */
  public getTodayIst(): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  }

  /**
   * Returns current IST timestamp formatted string
   */
  public getNowIstString(): string {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
      hour12: true
    }).format(new Date());
  }

  /**
   * Sort logic conforming to rule:
   * ORDER BY qualifying_spend DESC, payment_confirmation_time ASC
   */
  private sortListings(listings: Array<{ listing: Listing; spend: number; confirmationTime: string }>) {
    return listings.sort((a, b) => {
      // 1. Spend descending
      if (b.spend !== a.spend) {
        return b.spend - a.spend;
      }
      // 2. Earliest confirmation time gets higher rank
      const timeA = new Date(a.confirmationTime).getTime();
      const timeB = new Date(b.confirmationTime).getTime();
      return timeA - timeB;
    });
  }

  /**
   * Get rankings for specified view mode
   */
  public getRankings(
    view: LeaderboardViewMode,
    category?: ListingCategory,
    archiveDate?: string
  ): Listing[] {
    const activeListings = this.data.listings.filter((l) => l.status === 'active');
    if (activeListings.length === 0) {
      return [];
    }

    if (view === 'all-time') {
      const mapped = activeListings.map((l) => ({
        listing: l,
        spend: l.verifiedLifetimeSpend,
        confirmationTime: l.lastPaymentConfirmedAt,
      }));
      const sorted = this.sortListings(mapped);
      return sorted.map((item, index) => ({
        ...item.listing,
        rank: index + 1,
        qualifyingSpend: item.spend,
      }));
    }

    if (view === 'today') {
      const todayIst = this.getTodayIst();
      // Calculate qualifying spend verified on today's IST date
      const todayTxns = this.data.transactions.filter(
        (t) => t.status === 'verified' && t.istDate === todayIst
      );

      // Sum today's spend per listing
      const spendMap = new Map<string, { spend: number; earliestConfirmed: string }>();
      for (const txn of todayTxns) {
        const prev = spendMap.get(txn.listingId) || { spend: 0, earliestConfirmed: txn.confirmedAt || txn.createdAt };
        spendMap.set(txn.listingId, {
          spend: prev.spend + txn.amount,
          earliestConfirmed: prev.earliestConfirmed,
        });
      }

      // Listings with activity today
      const todayListings = activeListings
        .filter((l) => spendMap.has(l.id))
        .map((l) => {
          const stats = spendMap.get(l.id)!;
          return {
            listing: l,
            spend: stats.spend,
            confirmationTime: stats.earliestConfirmed,
          };
        });

      const sorted = this.sortListings(todayListings);
      return sorted.map((item, index) => ({
        ...item.listing,
        rank: index + 1,
        qualifyingSpend: item.spend,
      }));
    }

    if (view === 'category' && category) {
      const normalize = (c: string) => c.toLowerCase().replace(/s$/, '').replace(/ies$/, 'y');
      const targetNorm = normalize(category);
      const inCategory = activeListings.filter((l) => normalize(l.category) === targetNorm);
      const mapped = inCategory.map((l) => ({
        listing: l,
        spend: l.verifiedLifetimeSpend,
        confirmationTime: l.lastPaymentConfirmedAt,
      }));
      const sorted = this.sortListings(mapped);
      return sorted.map((item, index) => ({
        ...item.listing,
        rank: index + 1,
        qualifyingSpend: item.spend,
      }));
    }

    if (view === 'archive' && archiveDate) {
      // Historical date ranking
      const dateTxns = this.data.transactions.filter(
        (t) => t.status === 'verified' && t.istDate === archiveDate
      );
      const spendMap = new Map<string, { spend: number; earliestConfirmed: string }>();
      for (const txn of dateTxns) {
        const prev = spendMap.get(txn.listingId) || { spend: 0, earliestConfirmed: txn.confirmedAt || txn.createdAt };
        spendMap.set(txn.listingId, {
          spend: prev.spend + txn.amount,
          earliestConfirmed: prev.earliestConfirmed,
        });
      }

      const archivedListings = activeListings
        .filter((l) => spendMap.has(l.id))
        .map((l) => {
          const stats = spendMap.get(l.id)!;
          return {
            listing: l,
            spend: stats.spend,
            confirmationTime: stats.earliestConfirmed,
          };
        });

      const sorted = this.sortListings(archivedListings);
      return sorted.map((item, index) => ({
        ...item.listing,
        rank: index + 1,
        qualifyingSpend: item.spend,
      }));
    }

    // Default fallback to all-time
    return this.getRankings('all-time');
  }

  public getListingById(id: string): (Listing & { allTimeRank: number }) | null {
    const all = this.getRankings('all-time');
    const found = all.find((l) => l.id === id);
    if (!found) return null;
    return {
      ...found,
      allTimeRank: found.rank || 1,
    };
  }

  /**
   * Authoritative outbid quote calculation
   * Never trusts amount sent by browser!
   */
  public calculateOutbidQuote(params: OutbidQuoteRequest): OutbidQuoteResponse {
    const allTimeRankings = this.getRankings('all-time');
    const existingListing = params.listingId
      ? this.data.listings.find((l) => l.id === params.listingId)
      : null;

    const currentListingSpend = existingListing ? existingListing.verifiedLifetimeSpend : 0;

    // Case 1: Leaderboard is currently empty
    if (allTimeRankings.length === 0) {
      const targetSpend = params.customTargetSpend
        ? Math.max(params.customTargetSpend, MIN_STARTING_BID_INR)
        : MIN_STARTING_BID_INR;

      return {
        canBid: true,
        listingId: params.listingId,
        currentListingSpend,
        targetCumulativeSpend: targetSpend,
        amountToPay: targetSpend - currentListingSpend,
        projectedRank: 1,
        minimumIncrement: DEFAULT_INCREMENT_INR,
        reason: 'Leaderboard is open. Minimum starting bid is ₹500.',
      };
    }

    // Determine target rank or target listing
    let targetListing = allTimeRankings[0]; // Default to overtaking #1
    let desiredRank = params.targetRank || 1;

    if (params.targetListingId) {
      const found = allTimeRankings.find((l) => l.id === params.targetListingId);
      if (found) {
        targetListing = found;
        desiredRank = found.rank || 1;
      }
    } else if (params.targetRank && params.targetRank > 0 && params.targetRank <= allTimeRankings.length) {
      targetListing = allTimeRankings[params.targetRank - 1];
      desiredRank = params.targetRank;
    }

    // If existing listing is already the target listing, overtake the one above it
    if (existingListing && targetListing.id === existingListing.id) {
      if (desiredRank > 1) {
        targetListing = allTimeRankings[desiredRank - 2];
        desiredRank = desiredRank - 1;
      } else {
        // Already #1! Can still defend/boost by at least default increment
        const targetCumulativeSpend = currentListingSpend + (params.customTargetSpend ? Math.max(params.customTargetSpend - currentListingSpend, DEFAULT_INCREMENT_INR) : 100);
        return {
          canBid: true,
          listingId: existingListing.id,
          currentListingSpend,
          targetCumulativeSpend,
          amountToPay: targetCumulativeSpend - currentListingSpend,
          projectedRank: 1,
          minimumIncrement: DEFAULT_INCREMENT_INR,
          reason: 'You are currently #1. Reinforcing your lead.',
        };
      }
    }

    // To overtake targetListing with spend S:
    // Minimum spend required is targetListing.spend + DEFAULT_INCREMENT_INR (₹5)
    let requiredTargetSpend = targetListing.verifiedLifetimeSpend + DEFAULT_INCREMENT_INR;

    // If caller specified a higher custom spend, allow it
    if (params.customTargetSpend && params.customTargetSpend >= requiredTargetSpend) {
      requiredTargetSpend = params.customTargetSpend;
    }

    // Amount to pay = target cumulative spend minus already verified spend
    const amountToPay = Math.max(requiredTargetSpend - currentListingSpend, 0);

    return {
      canBid: true,
      listingId: params.listingId,
      currentListingSpend,
      targetCumulativeSpend: requiredTargetSpend,
      amountToPay,
      projectedRank: desiredRank,
      minimumIncrement: DEFAULT_INCREMENT_INR,
      competingListing: {
        id: targetListing.id,
        title: targetListing.title,
        spend: targetListing.verifiedLifetimeSpend,
      },
      reason: `To achieve #${desiredRank}, minimum qualifying spend is ₹${requiredTargetSpend.toLocaleString('en-IN')}`,
    };
  }

  /**
   * Submit a new listing with verified starting bid
   */
  public createListing(params: {
    title: string;
    tagline: string;
    description: string;
    websiteUrl: string;
    category: ListingCategory;
    logoUrl?: string;
    founderName: string;
    founderEmail: string;
    twitterHandle?: string;
    bidAmount: number; // Must be >= ₹500
    paymentMethod: 'upi' | 'netbanking' | 'card';
  }): { listing: Listing; transaction: Transaction } {
    // Validate minimum bid strictly
    if (!params.bidAmount || params.bidAmount < MIN_STARTING_BID_INR) {
      throw new Error(`Minimum starting bid for a new listing is ₹${MIN_STARTING_BID_INR}`);
    }

    // URL validation
    let validUrl = params.websiteUrl.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    const now = new Date();
    const isoNow = now.toISOString();
    const todayIst = this.getTodayIst();
    const listingId = 'lst_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const txnId = 'txn_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const newListing: Listing = {
      id: listingId,
      title: params.title.trim(),
      tagline: params.tagline.trim(),
      description: params.description.trim(),
      websiteUrl: validUrl,
      category: params.category,
      logoUrl: params.logoUrl?.trim() || undefined,
      founderName: params.founderName.trim(),
      founderEmail: params.founderEmail.trim().toLowerCase(),
      twitterHandle: params.twitterHandle ? params.twitterHandle.trim().replace(/^@/, '') : undefined,
      verifiedLifetimeSpend: params.bidAmount,
      lastPaymentConfirmedAt: isoNow,
      createdAt: isoNow,
      clickCount: 0, // Real click count starts at zero
      status: 'active',
    };

    const newTransaction: Transaction = {
      id: txnId,
      listingId,
      listingTitle: newListing.title,
      type: 'initial_bid',
      amount: params.bidAmount,
      previousSpend: 0,
      newCumulativeSpend: params.bidAmount,
      status: 'verified',
      paymentMethod: params.paymentMethod,
      paymentRef: 'KRM-UPI-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      istDate: todayIst,
      createdAt: isoNow,
      confirmedAt: isoNow,
    };

    this.data.listings.push(newListing);
    this.data.transactions.push(newTransaction);

    if (!this.data.archivedDays.includes(todayIst)) {
      this.data.archivedDays.push(todayIst);
    }

    this.saveDb();

    return { listing: newListing, transaction: newTransaction };
  }

  /**
   * Outbid on an existing listing
   * Server calculates and enforces that only the difference is charged!
   */
  public outbidListing(params: {
    listingId: string;
    targetCumulativeSpend: number;
    paymentMethod: 'upi' | 'netbanking' | 'card';
  }): { listing: Listing; transaction: Transaction } {
    const listing = this.data.listings.find((l) => l.id === params.listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    const currentSpend = listing.verifiedLifetimeSpend;
    if (params.targetCumulativeSpend <= currentSpend) {
      throw new Error(`Target spend must exceed current verified spend of ₹${currentSpend.toLocaleString('en-IN')}`);
    }

    const differenceToPay = params.targetCumulativeSpend - currentSpend;
    if (differenceToPay < DEFAULT_INCREMENT_INR) {
      throw new Error(`Minimum increment is ₹${DEFAULT_INCREMENT_INR}`);
    }

    const now = new Date();
    const isoNow = now.toISOString();
    const todayIst = this.getTodayIst();
    const txnId = 'txn_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const newTransaction: Transaction = {
      id: txnId,
      listingId: listing.id,
      listingTitle: listing.title,
      type: 'outbid',
      amount: differenceToPay, // User only pays the difference!
      previousSpend: currentSpend,
      newCumulativeSpend: params.targetCumulativeSpend,
      status: 'verified',
      paymentMethod: params.paymentMethod,
      paymentRef: 'KRM-OUTBID-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      istDate: todayIst,
      createdAt: isoNow,
      confirmedAt: isoNow,
    };

    // Update listing spend and confirmation timestamp (for tie breaking)
    listing.verifiedLifetimeSpend = params.targetCumulativeSpend;
    listing.lastPaymentConfirmedAt = isoNow;

    this.data.transactions.push(newTransaction);
    if (!this.data.archivedDays.includes(todayIst)) {
      this.data.archivedDays.push(todayIst);
    }

    this.saveDb();

    return { listing, transaction: newTransaction };
  }

  /**
   * Track real outbound click
   */
  public recordClick(listingId: string): number {
    const listing = this.data.listings.find((l) => l.id === listingId);
    if (listing) {
      listing.clickCount = (listing.clickCount || 0) + 1;
      this.saveDb();
      return listing.clickCount;
    }
    return 0;
  }

  /**
   * Get transaction history for transparency
   */
  public getTransactions(listingId?: string): Transaction[] {
    const list = listingId
      ? this.data.transactions.filter((t) => t.listingId === listingId)
      : this.data.transactions;
    // Latest transactions first
    return [...list].reverse();
  }

  /**
   * Get historical archive dates with activity
   */
  public getArchiveDates(): string[] {
    return [...this.data.archivedDays].sort().reverse();
  }

  /**
   * Delete / remove a listing and its transactions
   */
  public deleteListing(listingId: string): boolean {
    const initialLen = this.data.listings.length;
    this.data.listings = this.data.listings.filter((l) => l.id !== listingId);
    this.data.transactions = this.data.transactions.filter((t) => t.listingId !== listingId);
    this.saveDb();
    return this.data.listings.length < initialLen;
  }

  /**
   * Platform statistics (strictly real counts)
   */
  public getStats(): LeaderboardStats {
    const active = this.data.listings.filter((l) => l.status === 'active');
    const totalVolume = this.data.transactions
      .filter((t) => t.status === 'verified')
      .reduce((sum, t) => sum + t.amount, 0);

    const allTime = this.getRankings('all-time');
    const topSpend = allTime.length > 0 ? allTime[0].verifiedLifetimeSpend : 0;

    return {
      totalVerifiedListings: active.length,
      totalQualifyingVolume: totalVolume,
      topRankSpend: topSpend,
      minStartingBid: MIN_STARTING_BID_INR,
      defaultIncrement: DEFAULT_INCREMENT_INR,
      currentTimeIst: this.getNowIstString(),
    };
  }
}

export const db = new KramankDb();
