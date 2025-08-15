import fs from 'fs';
import path from 'path';
import { getDatabase } from './connection.js';
import { migrateAnalytics, seedAnalyticsData } from './analytics-migrate.js';

export async function runMigrations(): Promise<void> {
  const db = getDatabase();
  
  try {
    console.log('Running database migrations...');
    
    // Run main schema
    const schemaPath = path.join(process.cwd(), 'src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      await db.run(statement);
    }
    
    // Run analytics migration
    console.log('Running analytics migrations...');
    await migrateAnalytics(db);
    
    // Seed analytics data
    console.log('Seeding analytics data...');
    await seedAnalyticsData(db);
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}