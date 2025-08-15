import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  description: string;
  index: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  positive,
  icon,
  description,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.8 + index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="text-3xl"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {icon}
        </motion.div>
        <motion.div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            positive
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + index * 0.1 }}
        >
          {change}
        </motion.div>
      </div>
      
      <motion.h3 
        className="text-white/90 text-sm font-medium mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 + index * 0.1 }}
      >
        {title}
      </motion.h3>
      
      <motion.div
        className="text-3xl font-bold text-white mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4 + index * 0.1 }}
      >
        {value}
      </motion.div>
      
      <motion.p 
        className="text-white/60 text-sm group-hover:text-white/80 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 + index * 0.1 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};