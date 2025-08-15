import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '@/services/authService.js';
import { authenticateToken } from '@/middleware/auth.js';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password, rememberMe } = loginSchema.parse(req.body);
    
    const result = await authService.login({ username, password, rememberMe });
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors
        }
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Login failed';
    const statusCode = message === 'Invalid credentials' ? 401 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 401 ? 'INVALID_CREDENTIALS' : 'LOGIN_ERROR',
        message
      }
    });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    
    const result = await authService.refreshToken({ refreshToken });
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors
        }
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Token refresh failed';
    const statusCode = message.includes('Invalid or expired') ? 401 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 401 ? 'INVALID_REFRESH_TOKEN' : 'REFRESH_ERROR',
        message
      }
    });
  }
});

// POST /auth/logout
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: 'Logout failed'
      }
    });
  }
});

// GET /auth/me - Get current user info
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user!.sub,
        username: req.user!.username,
        email: req.user!.email,
        roles: req.user!.roles,
        permissions: req.user!.permissions
      }
    }
  });
});

export default router;