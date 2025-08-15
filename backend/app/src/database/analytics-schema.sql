-- Extended schema for SConnect Admin analytics and content management

-- Buttons Table
CREATE TABLE IF NOT EXISTS buttons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_text TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    action_type TEXT NOT NULL, -- 'navigate', 'external', 'function', etc.
    action_value TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_by TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users (id) ON DELETE SET NULL
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    parent_id TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_by TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES admin_users (id) ON DELETE SET NULL
);

-- Button-Category Relationships
CREATE TABLE IF NOT EXISTS button_categories (
    id TEXT PRIMARY KEY,
    button_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (button_id) REFERENCES buttons (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
    UNIQUE (button_id, category_id)
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'button_click', 'page_view', 'user_action', etc.
    resource_type TEXT, -- 'button', 'category', 'user', etc.
    resource_id TEXT,
    user_id TEXT,
    session_id TEXT,
    properties TEXT, -- JSON object with event properties
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users (id) ON DELETE SET NULL
);

-- Daily Analytics Summary
CREATE TABLE IF NOT EXISTS daily_analytics (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    total_button_clicks INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_user_actions INTEGER DEFAULT 0,
    total_active_users INTEGER DEFAULT 0,
    top_buttons TEXT, -- JSON array of top button IDs
    top_categories TEXT, -- JSON array of top category IDs
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (date)
);

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id TEXT PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_type TEXT NOT NULL, -- 'counter', 'gauge', 'histogram'
    tags TEXT, -- JSON object with metric tags
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics performance
CREATE INDEX IF NOT EXISTS idx_buttons_is_active ON buttons(is_active);
CREATE INDEX IF NOT EXISTS idx_buttons_created_at ON buttons(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_button_categories_button_id ON button_categories(button_id);
CREATE INDEX IF NOT EXISTS idx_button_categories_category_id ON button_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_resource_type ON analytics_events(resource_type);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);
CREATE INDEX IF NOT EXISTS idx_system_metrics_metric_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);