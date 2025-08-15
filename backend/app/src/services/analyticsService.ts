import { Database } from '../database/connection.js';

export interface DashboardMetrics {
  totalButtons: number;
  totalCategories: number;
  totalAdminUsers: number;
  systemHealth: number;
  recentActivity: ActivityEvent[];
  buttonUsageData: ButtonUsageData[];
}

export interface ActivityEvent {
  id: string;
  action: string;
  time: string;
  icon: string;
  details?: string;
}

export interface ButtonUsageData {
  date: string;
  clicks: number;
  views: number;
}

export class AnalyticsService {
  constructor(private db: Database) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Get total buttons
      const buttonCount = await this.db.get<{count: number}>('SELECT COUNT(*) as count FROM buttons WHERE is_active = 1');
      
      // Get total categories  
      const categoryCount = await this.db.get<{count: number}>('SELECT COUNT(*) as count FROM categories WHERE is_active = 1');
      
      // Get total admin users
      const userCount = await this.db.get<{count: number}>('SELECT COUNT(*) as count FROM admin_users WHERE is_active = 1');
      
      // Get recent activity from audit logs
      const recentActivity = await this.db.all<any>(`
        SELECT 
          id,
          action,
          resource_type,
          resource_id,
          details,
          created_at
        FROM audit_logs 
        ORDER BY created_at DESC 
        LIMIT 10
      `);

      // Get button usage data for last 7 days
      const buttonUsageData = await this.db.all<ButtonUsageData>(`
        SELECT 
          date,
          total_button_clicks as clicks,
          total_page_views as views
        FROM daily_analytics 
        WHERE date >= date('now', '-7 days')
        ORDER BY date ASC
      `);

      // Format recent activity
      const formattedActivity: ActivityEvent[] = recentActivity.map((activity: any) => ({
        id: activity.id,
        action: this.formatActivityAction(activity.action, activity.resource_type, activity.resource_id),
        time: this.formatTimeAgo(activity.created_at),
        icon: this.getActivityIcon(activity.action, activity.resource_type),
        details: activity.details ? JSON.parse(activity.details) : undefined
      }));

      return {
        totalButtons: buttonCount?.count || 0,
        totalCategories: categoryCount?.count || 0, 
        totalAdminUsers: userCount?.count || 0,
        systemHealth: 99.9, // Could be calculated from system metrics
        recentActivity: formattedActivity,
        buttonUsageData: buttonUsageData || []
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  async trackEvent(eventType: string, resourceType?: string, resourceId?: string, properties?: any, userId?: string): Promise<void> {
    try {
      const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await this.db.run(`
        INSERT INTO analytics_events (id, event_type, resource_type, resource_id, user_id, properties)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [eventId, eventType, resourceType, resourceId, userId, JSON.stringify(properties || {})]);
      
      // Update daily analytics
      await this.updateDailyAnalytics(eventType);
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  private async updateDailyAnalytics(eventType: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    let updateField = '';
    switch (eventType) {
      case 'button_click':
        updateField = 'total_button_clicks = total_button_clicks + 1';
        break;
      case 'page_view':
        updateField = 'total_page_views = total_page_views + 1';
        break;
      default:
        updateField = 'total_user_actions = total_user_actions + 1';
    }

    await this.db.run(`
      INSERT INTO daily_analytics (id, date, total_button_clicks, total_page_views, total_user_actions, total_active_users)
      VALUES (?, ?, 0, 0, 0, 0)
      ON CONFLICT(date) DO UPDATE SET
        ${updateField},
        updated_at = CURRENT_TIMESTAMP
    `, [`daily-${today}`, today]);
  }

  private formatActivityAction(action: string, resourceType?: string, resourceId?: string): string {
    switch (action) {
      case 'create':
        return `Created ${resourceType}: ${resourceId}`;
      case 'update':
        return `Updated ${resourceType}: ${resourceId}`;
      case 'delete':
        return `Deleted ${resourceType}: ${resourceId}`;
      case 'login':
        return 'Admin user logged in';
      case 'logout':
        return 'Admin user logged out';
      default:
        return `${action} performed`;
    }
  }

  private formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  }

  private getActivityIcon(action: string, resourceType?: string): string {
    if (resourceType === 'button') return '🔘';
    if (resourceType === 'category') return '📁';
    if (resourceType === 'user') return '👤';
    
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'login': return '🔐';
      case 'logout': return '🚪';
      default: return '📝';
    }
  }
}