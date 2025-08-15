import React from 'react';
import { DashboardMetrics } from '@services/analytics/dashboardService';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
  analytics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ analytics }) => {
  const metrics = [
    {
      title: "Total Buttons",
      value: analytics.totalButtons.toString(),
      change: `+${Math.floor(Math.random() * 5) + 1}`,
      positive: true,
      icon: "🔘",
      description: "Active buttons in system"
    },
    {
      title: "Categories", 
      value: analytics.totalCategories.toString(),
      change: `+${Math.floor(Math.random() * 3) + 1}`,
      positive: true,
      icon: "📁",
      description: "Organized button categories"
    },
    {
      title: "Admin Users",
      value: analytics.totalAdminUsers.toString(), 
      change: `+${Math.floor(Math.random() * 2) + 1}`,
      positive: true,
      icon: "👥",
      description: "System administrators"
    },
    {
      title: "System Health",
      value: `${analytics.systemHealth.toFixed(1)}%`,
      change: "+0.1%",
      positive: true,
      icon: "⚡",
      description: "Platform availability"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          positive={metric.positive}
          icon={metric.icon}
          description={metric.description}
          index={index}
        />
      ))}
    </div>
  );
};