import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from '@/routes/auth.js';
import { runMigrations } from '@/database/migrate.js';
import { seedDatabase } from '@/database/seed.js';
import { closeDatabase } from '@/database/connection.js';

// Load environment variables
dotenv.config({ path: '.env' });

// Debug environment variables
console.log('Environment check:');
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred' 
        : err.message
    }
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await runMigrations();
    
    console.log('Seeding database...');
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 SConnect Admin Backend Server`);
      console.log(`📡 Running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: ${process.env.DATABASE_PATH || './data/admin.db'}`);
      console.log('\n📋 Available endpoints:');
      console.log('  GET  /health           - Health check');
      console.log('  POST /api/auth/login   - User login');
      console.log('  POST /api/auth/refresh - Refresh token');
      console.log('  POST /api/auth/logout  - User logout');
      console.log('  GET  /api/auth/me      - Current user info');
      console.log('\n👤 Default admin credentials:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

startServer();