import React from 'react';
import { motion } from 'framer-motion';
import { ActivityEvent } from '@services/analytics/dashboardService';

interface ActivityFeedProps {
  activities: ActivityEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const displayActivities = activities && activities.length > 0 
    ? activities.slice(0, 4)
    : Array.from({ length: 4 }, (_, index) => ({
        id: `placeholder-${index}`,
        action: 'No recent activity',
        time: 'System is ready',
        icon: '📝'
      }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 2.0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Recent Admin Activity</h3>
      
      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4 + index * 0.1 }}
            className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            <motion.span 
              className="text-2xl mr-4"
              whileHover={{ scale: 1.2 }}
            >
              {activity.icon}
            </motion.span>
            <div className="flex-1">
              <p className="text-white/90 font-medium">{activity.action}</p>
              <p className="text-white/60 text-sm">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};