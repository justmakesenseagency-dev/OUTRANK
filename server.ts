import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, MIN_STARTING_BID_INR, DEFAULT_INCREMENT_INR } from './server/db.ts';
import { LeaderboardViewMode, ListingCategory } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // Rankings endpoint
  app.get('/api/rankings', (req: Request, res: Response) => {
    try {
      const view = (req.query.view as LeaderboardViewMode) || 'all-time';
      const category = req.query.category as ListingCategory | undefined;
      const archiveDate = req.query.archiveDate as string | undefined;

      const listings = db.getRankings(view, category, archiveDate);
      const todayIst = db.getTodayIst();
      const nowIst = db.getNowIstString();

      res.json({
        listings,
        total: listings.length,
        view,
        category: category || null,
        archiveDate: archiveDate || null,
        todayIst,
        nowIst,
      });
    } catch (err: any) {
      console.error('Error fetching rankings:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch rankings' });
    }
  });

  // Single listing detail
  app.get('/api/listings/:id', (req: Request, res: Response) => {
    try {
      const listing = db.getListingById(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      const transactions = db.getTransactions(listing.id);
      res.json({ listing, transactions });
    } catch (err: any) {
      console.error('Error fetching listing:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch listing' });
    }
  });

  // Outbid quote calculation (authoritative, never trusts browser calculations)
  app.post('/api/outbid/quote', (req: Request, res: Response) => {
    try {
      const { listingId, targetRank, targetListingId, customTargetSpend } = req.body;
      const quote = db.calculateOutbidQuote({
        listingId,
        targetRank: targetRank ? parseInt(targetRank, 10) : undefined,
        targetListingId,
        customTargetSpend: customTargetSpend ? parseInt(customTargetSpend, 10) : undefined,
      });
      res.json(quote);
    } catch (err: any) {
      console.error('Error calculating outbid quote:', err);
      res.status(400).json({ error: err.message || 'Failed to calculate quote' });
    }
  });

  // Submit new listing
  app.post('/api/listings', (req: Request, res: Response) => {
    try {
      const {
        title,
        tagline,
        description,
        websiteUrl,
        category,
        logoUrl,
        founderName,
        founderEmail,
        twitterHandle,
        bidAmount,
        paymentMethod = 'upi',
      } = req.body;

      if (!title || !tagline || !description || !websiteUrl || !category || !founderName || !founderEmail) {
        return res.status(400).json({ error: 'All core fields are required' });
      }

      const numericBid = parseInt(bidAmount, 10);
      if (isNaN(numericBid) || numericBid < MIN_STARTING_BID_INR) {
        return res.status(400).json({
          error: `Minimum starting bid is ₹${MIN_STARTING_BID_INR}. Received ₹${numericBid || 0}.`,
        });
      }

      const result = db.createListing({
        title,
        tagline,
        description,
        websiteUrl,
        category,
        logoUrl,
        founderName,
        founderEmail,
        twitterHandle,
        bidAmount: numericBid,
        paymentMethod,
      });

      res.status(201).json(result);
    } catch (err: any) {
      console.error('Error creating listing:', err);
      res.status(400).json({ error: err.message || 'Failed to create listing' });
    }
  });

  // Outbid on existing listing
  app.post('/api/listings/:id/outbid', (req: Request, res: Response) => {
    try {
      const { targetCumulativeSpend, paymentMethod = 'upi' } = req.body;
      const numericTarget = parseInt(targetCumulativeSpend, 10);

      if (isNaN(numericTarget) || numericTarget <= 0) {
        return res.status(400).json({ error: 'Valid target spend amount is required' });
      }

      const result = db.outbidListing({
        listingId: req.params.id,
        targetCumulativeSpend: numericTarget,
        paymentMethod,
      });

      res.json(result);
    } catch (err: any) {
      console.error('Error outbidding listing:', err);
      res.status(400).json({ error: err.message || 'Failed to outbid listing' });
    }
  });

  // Delete / remove a listing
  app.delete('/api/listings/:id', (req: Request, res: Response) => {
    try {
      const success = db.deleteListing(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json({ success: true, message: 'Listing removed successfully' });
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      res.status(500).json({ error: err.message || 'Failed to remove listing' });
    }
  });

  // Real click tracking redirect
  app.get('/api/r/:id', (req: Request, res: Response) => {
    try {
      const listing = db.getListingById(req.params.id);
      if (!listing) {
        return res.status(404).send('Listing not found');
      }
      db.recordClick(listing.id);
      return res.redirect(listing.websiteUrl);
    } catch (err: any) {
      console.error('Error tracking click redirect:', err);
      res.status(500).send('Redirect error');
    }
  });

  // Direct click count recording (for in-app clicks)
  app.post('/api/track-click/:id', (req: Request, res: Response) => {
    try {
      const count = db.recordClick(req.params.id);
      res.json({ success: true, clickCount: count });
    } catch (err: any) {
      console.error('Error tracking click:', err);
      res.status(500).json({ error: 'Failed to record click' });
    }
  });

  // Platform stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    try {
      const stats = db.getStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: 'Failed to fetch platform stats' });
    }
  });

  // Recent transactions log
  app.get('/api/transactions', (req: Request, res: Response) => {
    try {
      const listingId = req.query.listingId as string | undefined;
      const transactions = db.getTransactions(listingId);
      res.json({ transactions, total: transactions.length });
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  // Available archive dates
  app.get('/api/archive-dates', (_req: Request, res: Response) => {
    try {
      const dates = db.getArchiveDates();
      res.json({ dates });
    } catch (err: any) {
      console.error('Error fetching archive dates:', err);
      res.status(500).json({ error: 'Failed to fetch archive dates' });
    }
  });

  // ----------------------------------------------------
  // VITE DEV SERVER / PRODUCTION STATIC SERVING
  // ----------------------------------------------------
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kramank] Server running on port ${PORT} (Asia/Kolkata: ${db.getNowIstString()})`);
  });
}

startServer();
