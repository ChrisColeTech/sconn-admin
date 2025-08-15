import React from 'react';
import { motion } from 'framer-motion';

export const FloatingOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
        style={{ left: '10%', top: '20%' }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-24 h-24 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-xl"
        style={{ right: '15%', top: '30%' }}
        animate={{
          x: [0, -25, 25, 0],
          y: [0, 25, -25, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-28 h-28 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"
        style={{ left: '60%', bottom: '20%' }}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};