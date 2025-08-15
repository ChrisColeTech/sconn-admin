import { Database } from './connection.js';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function migrateAnalytics(db: Database): Promise<void> {
  try {
    const analyticsSchema = readFileSync(join(__dirname, 'analytics-schema.sql'), 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = analyticsSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      await db.run(statement);
    }
    
    console.log('✅ Analytics tables created successfully');
  } catch (error) {
    console.error('Analytics migration failed:', error);
    throw error;
  }
}

export async function seedAnalyticsData(db: Database): Promise<void> {
  try {
    // Seed sample buttons
    const buttons = [
      {
        id: 'btn-1',
        name: 'home',
        display_text: 'Home',
        icon: 'home',
        color: '#6366f1',
        action_type: 'navigate',
        action_value: '/home',
        description: 'Navigate to home screen'
      },
      {
        id: 'btn-2', 
        name: 'profile',
        display_text: 'Profile',
        icon: 'user',
        color: '#8b5cf6',
        action_type: 'navigate',
        action_value: '/profile',
        description: 'View user profile'
      },
      {
        id: 'btn-3',
        name: 'settings',
        display_text: 'Settings',
        icon: 'settings',
        color: '#06b6d4',
        action_type: 'navigate', 
        action_value: '/settings',
        description: 'App settings'
      }
    ];

    for (const button of buttons) {
      await db.run(`
        INSERT OR IGNORE INTO buttons (id, name, display_text, icon, color, action_type, action_value, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [button.id, button.name, button.display_text, button.icon, button.color, button.action_type, button.action_value, button.description]);
    }

    // Seed sample categories
    const categories = [
      {
        id: 'cat-1',
        name: 'navigation',
        display_name: 'Navigation',
        description: 'Primary navigation buttons',
        icon: 'navigation',
        color: '#6366f1'
      },
      {
        id: 'cat-2',
        name: 'actions',
        display_name: 'Actions',
        description: 'Action buttons for user interactions',
        icon: 'zap',
        color: '#8b5cf6'
      }
    ];

    for (const category of categories) {
      await db.run(`
        INSERT OR IGNORE INTO categories (id, name, display_name, description, icon, color)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [category.id, category.name, category.display_name, category.description, category.icon, category.color]);
    }

    // Seed sample analytics events
    const events = [
      {
        id: 'evt-1',
        event_type: 'button_click',
        resource_type: 'button',
        resource_id: 'btn-1',
        properties: JSON.stringify({ screen: 'home', timestamp: Date.now() })
      },
      {
        id: 'evt-2', 
        event_type: 'page_view',
        resource_type: 'page',
        resource_id: 'dashboard',
        properties: JSON.stringify({ referrer: 'login', timestamp: Date.now() })
      }
    ];

    for (const event of events) {
      await db.run(`
        INSERT OR IGNORE INTO analytics_events (id, event_type, resource_type, resource_id, properties)
        VALUES (?, ?, ?, ?, ?)
      `, [event.id, event.event_type, event.resource_type, event.resource_id, event.properties]);
    }

    // Seed today's analytics summary
    const today = new Date().toISOString().split('T')[0];
    await db.run(`
      INSERT OR REPLACE INTO daily_analytics (id, date, total_button_clicks, total_page_views, total_user_actions, total_active_users)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [`daily-${today}`, today, 247, 156, 89, 15]);

    console.log('✅ Analytics sample data seeded successfully');
  } catch (error) {
    console.error('Analytics seeding failed:', error);
    throw error;
  }
}