import { Database } from '../database/connection.js';

export interface ButtonData {
  id: string;
  name: string;
  display_text: string;
  icon?: string;
  color?: string;
  action_type: string;
  action_value?: string;
  description?: string;
  is_active: boolean;
  order_index: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateButtonRequest {
  name: string;
  display_text: string;
  icon?: string;
  color?: string;
  action_type: string;
  action_value?: string;
  description?: string;
  is_active?: boolean;
  order_index?: number;
}

export interface ButtonFilters {
  search?: string;
  is_active?: boolean;
  action_type?: string;
  page?: number;
  per_page?: number;
}

export class ButtonService {
  constructor(private db: Database) {}

  async getButtons(filters?: ButtonFilters): Promise<{ buttons: ButtonData[]; total: number }> {
    try {
      const page = filters?.page || 1;
      const perPage = filters?.per_page || 20;
      const offset = (page - 1) * perPage;

      let whereConditions: string[] = [];
      let params: any[] = [];

      if (filters?.search) {
        whereConditions.push('(name LIKE ? OR display_text LIKE ? OR description LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (filters?.is_active !== undefined) {
        whereConditions.push('is_active = ?');
        params.push(filters.is_active ? 1 : 0);
      }

      if (filters?.action_type) {
        whereConditions.push('action_type = ?');
        params.push(filters.action_type);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Get total count
      const countQuery = `SELECT COUNT(*) as count FROM buttons ${whereClause}`;
      const countResult = await this.db.get<{count: number}>(countQuery, params);
      const total = countResult?.count || 0;

      // Get buttons with pagination
      const query = `
        SELECT * FROM buttons 
        ${whereClause}
        ORDER BY order_index ASC, created_at DESC 
        LIMIT ? OFFSET ?
      `;
      const buttons = await this.db.all<ButtonData>(query, [...params, perPage, offset]);

      return { buttons: buttons || [], total };
    } catch (error) {
      console.error('Error fetching buttons:', error);
      throw error;
    }
  }

  async getButtonById(id: string): Promise<ButtonData | null> {
    try {
      const button = await this.db.get<ButtonData>('SELECT * FROM buttons WHERE id = ?', [id]);
      return button || null;
    } catch (error) {
      console.error('Error fetching button by ID:', error);
      throw error;
    }
  }

  async createButton(data: CreateButtonRequest, userId?: string): Promise<ButtonData> {
    try {
      const id = `btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      // Get next order index if not provided
      let orderIndex = data.order_index;
      if (orderIndex === undefined) {
        const maxOrder = await this.db.get<{max_order: number}>('SELECT MAX(order_index) as max_order FROM buttons');
        orderIndex = (maxOrder?.max_order || 0) + 1;
      }

      const button: ButtonData = {
        id,
        name: data.name,
        display_text: data.display_text,
        icon: data.icon,
        color: data.color,
        action_type: data.action_type,
        action_value: data.action_value,
        description: data.description,
        is_active: data.is_active ?? true,
        order_index: orderIndex,
        created_by: userId,
        created_at: now,
        updated_at: now
      };

      await this.db.run(`
        INSERT INTO buttons (
          id, name, display_text, icon, color, action_type, action_value, 
          description, is_active, order_index, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        button.id, button.name, button.display_text, button.icon, button.color,
        button.action_type, button.action_value, button.description, 
        button.is_active ? 1 : 0, button.order_index, button.created_by, 
        button.created_at, button.updated_at
      ]);

      return button;
    } catch (error) {
      console.error('Error creating button:', error);
      throw error;
    }
  }

  async updateButton(id: string, data: Partial<CreateButtonRequest>): Promise<ButtonData | null> {
    try {
      const existing = await this.getButtonById(id);
      if (!existing) {
        throw new Error('Button not found');
      }

      const updates: string[] = [];
      const params: any[] = [];

      if (data.name !== undefined) {
        updates.push('name = ?');
        params.push(data.name);
      }
      if (data.display_text !== undefined) {
        updates.push('display_text = ?');
        params.push(data.display_text);
      }
      if (data.icon !== undefined) {
        updates.push('icon = ?');
        params.push(data.icon);
      }
      if (data.color !== undefined) {
        updates.push('color = ?');
        params.push(data.color);
      }
      if (data.action_type !== undefined) {
        updates.push('action_type = ?');
        params.push(data.action_type);
      }
      if (data.action_value !== undefined) {
        updates.push('action_value = ?');
        params.push(data.action_value);
      }
      if (data.description !== undefined) {
        updates.push('description = ?');
        params.push(data.description);
      }
      if (data.is_active !== undefined) {
        updates.push('is_active = ?');
        params.push(data.is_active ? 1 : 0);
      }
      if (data.order_index !== undefined) {
        updates.push('order_index = ?');
        params.push(data.order_index);
      }

      if (updates.length === 0) {
        return existing;
      }

      updates.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(id);

      await this.db.run(`
        UPDATE buttons SET ${updates.join(', ')} WHERE id = ?
      `, params);

      return await this.getButtonById(id);
    } catch (error) {
      console.error('Error updating button:', error);
      throw error;
    }
  }

  async deleteButton(id: string): Promise<boolean> {
    try {
      const result = await this.db.run('DELETE FROM buttons WHERE id = ?', [id]);
      return (result.changes || 0) > 0;
    } catch (error) {
      console.error('Error deleting button:', error);
      throw error;
    }
  }

  async bulkUpdateButtons(updates: Array<{id: string; data: Partial<CreateButtonRequest>}>): Promise<ButtonData[]> {
    try {
      const results: ButtonData[] = [];
      
      for (const update of updates) {
        const result = await this.updateButton(update.id, update.data);
        if (result) {
          results.push(result);
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk updating buttons:', error);
      throw error;
    }
  }

  async reorderButtons(buttonIds: string[]): Promise<boolean> {
    try {
      for (let i = 0; i < buttonIds.length; i++) {
        await this.db.run('UPDATE buttons SET order_index = ?, updated_at = ? WHERE id = ?', [
          i + 1,
          new Date().toISOString(),
          buttonIds[i]
        ]);
      }
      return true;
    } catch (error) {
      console.error('Error reordering buttons:', error);
      throw error;
    }
  }
}