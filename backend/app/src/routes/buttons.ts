import { Router } from 'express';
import { Database } from '../database/connection.js';
import { ButtonService } from '../services/buttonService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all routes protected by authentication
router.use(authenticateToken);

export function createButtonRoutes(db: Database) {
  const buttonService = new ButtonService(db);

  // GET /api/buttons - Get all buttons with filters and pagination
  router.get('/', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        is_active: req.query.is_active ? req.query.is_active === 'true' : undefined,
        action_type: req.query.action_type as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        per_page: req.query.per_page ? parseInt(req.query.per_page as string) : 20
      };

      const result = await buttonService.getButtons(filters);
      
      res.json({
        success: true,
        data: {
          buttons: result.buttons,
          pagination: {
            total: result.total,
            page: filters.page,
            per_page: filters.per_page,
            total_pages: Math.ceil(result.total / filters.per_page)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching buttons:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch buttons'
      });
    }
  });

  // GET /api/buttons/:id - Get button by ID
  router.get('/:id', async (req, res) => {
    try {
      const button = await buttonService.getButtonById(req.params.id);
      
      if (!button) {
        return res.status(404).json({
          success: false,
          error: 'Button not found'
        });
      }

      res.json({
        success: true,
        data: button
      });
    } catch (error) {
      console.error('Error fetching button:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch button'
      });
    }
  });

  // POST /api/buttons - Create new button
  router.post('/', async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      const button = await buttonService.createButton(req.body, userId);
      
      res.status(201).json({
        success: true,
        data: button
      });
    } catch (error) {
      console.error('Error creating button:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create button'
      });
    }
  });

  // PUT /api/buttons/:id - Update button
  router.put('/:id', async (req, res) => {
    try {
      const button = await buttonService.updateButton(req.params.id, req.body);
      
      if (!button) {
        return res.status(404).json({
          success: false,
          error: 'Button not found'
        });
      }

      res.json({
        success: true,
        data: button
      });
    } catch (error) {
      console.error('Error updating button:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update button'
      });
    }
  });

  // DELETE /api/buttons/:id - Delete button
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await buttonService.deleteButton(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Button not found'
        });
      }

      res.json({
        success: true,
        message: 'Button deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting button:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete button'
      });
    }
  });

  // POST /api/buttons/bulk-update - Bulk update buttons
  router.post('/bulk-update', async (req, res) => {
    try {
      const { updates } = req.body;
      const buttons = await buttonService.bulkUpdateButtons(updates);
      
      res.json({
        success: true,
        data: buttons
      });
    } catch (error) {
      console.error('Error bulk updating buttons:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk update buttons'
      });
    }
  });

  // POST /api/buttons/reorder - Reorder buttons
  router.post('/reorder', async (req, res) => {
    try {
      const { buttonIds } = req.body;
      const success = await buttonService.reorderButtons(buttonIds);
      
      res.json({
        success,
        message: 'Buttons reordered successfully'
      });
    } catch (error) {
      console.error('Error reordering buttons:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reorder buttons'
      });
    }
  });

  return router;
}

export default router;