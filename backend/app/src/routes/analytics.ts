import { Router } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { authMiddleware } from '../middleware/auth';
import { Database } from 'sqlite3';

export function createAnalyticsRoutes(db: Database): Router {
  const router = Router();
  const analyticsService = new AnalyticsService(db);

  // Get dashboard metrics
  router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
      const metrics = await analyticsService.getDashboardMetrics();
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard metrics'
      });
    }
  });

  // Track analytics event
  router.post('/track', authMiddleware, async (req, res) => {
    try {
      const { eventType, resourceType, resourceId, properties } = req.body;
      const userId = req.user?.id;

      await analyticsService.trackEvent(eventType, resourceType, resourceId, properties, userId);
      
      res.json({
        success: true,
        message: 'Event tracked successfully'
      });
    } catch (error) {
      console.error('Event tracking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  });

  return router;
}