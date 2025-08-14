import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from './connection.js';
import type { AdminUser } from '@/types/auth.js';

export async function seedDatabase(): Promise<void> {
  const db = getDatabase();
  
  try {
    console.log('Seeding database with initial admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await db.get(
      'SELECT id FROM admin_users WHERE username = ?',
      ['admin']
    );
    
    if (existingAdmin) {
      console.log('Admin user already exists, skipping seed');
      return;
    }
    
    // Create default admin user
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash('admin123', 12);
    
    const adminUser: Partial<AdminUser> = {
      id: adminId,
      username: 'admin',
      email: 'admin@sconn-admin.local',
      passwordHash,
      roles: JSON.stringify(['admin']),
      permissions: JSON.stringify([
        'read:buttons', 'write:buttons', 'delete:buttons',
        'read:categories', 'write:categories', 'delete:categories',
        'read:users', 'write:users', 'delete:users',
        'read:settings', 'write:settings',
        'admin:system', 'admin:purge'
      ]),
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.run(
      `INSERT INTO admin_users (
        id, username, email, password_hash, roles, permissions, 
        is_active, last_login_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminUser.id,
        adminUser.username,
        adminUser.email,
        adminUser.passwordHash,
        adminUser.roles,
        adminUser.permissions,
        adminUser.isActive ? 1 : 0,
        adminUser.lastLoginAt,
        adminUser.createdAt?.toISOString(),
        adminUser.updatedAt?.toISOString()
      ]
    );
    
    console.log('Database seeded successfully!');
    console.log('Default admin credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Email: admin@sconn-admin.local');
    
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}