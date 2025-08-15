import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ButtonUsageData } from '@services/analytics/dashboardService';

interface UsageChartProps {
  data: ButtonUsageData[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.8 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-white">Button Usage Trends</h3>
        <motion.div
          className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-white/90 text-sm">Last 7 days</span>
        </motion.div>
      </div>
      
      <div className="h-64">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#ec4899' }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="rgba(236, 72, 153, 0.6)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'rgba(236, 72, 153, 0.6)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
            <motion.div
              className="text-white/60 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📊
              </motion.div>
              <p>No usage data available</p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};