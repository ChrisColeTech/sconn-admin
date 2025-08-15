import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardAnalytics } from '@hooks/domain/dashboard';
import { 
  DashboardHeader, 
  MetricsGrid, 
  UsageChart, 
  ActivityFeed, 
  FloatingOrbs 
} from '@components/domain/dashboard';

export const DashboardPage: React.FC = () => {
  const { data: analytics, isLoading, error } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white/80 text-center">
          <p className="text-xl mb-2">Failed to load analytics</p>
          <p className="text-sm text-white/60">Please check your connection</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white/80">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingOrbs />
      
      <div className="relative z-10 p-6 space-y-8">
        <DashboardHeader />
        
        <MetricsGrid analytics={analytics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UsageChart data={analytics.buttonUsageData} />
          <ActivityFeed activities={analytics.recentActivity} />
        </div>
      </div>
    </div>
  );
};
