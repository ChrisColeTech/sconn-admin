import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orbs] = useState<FloatingOrb[]>([
    { id: 1, x: 20, y: 20, size: 120, color: 'from-purple-500/30 to-pink-500/30', duration: 20 },
    { id: 2, x: 70, y: 60, size: 80, color: 'from-blue-500/20 to-cyan-500/20', duration: 25 },
    { id: 3, x: 10, y: 80, size: 100, color: 'from-indigo-500/25 to-purple-500/25', duration: 30 },
    { id: 4, x: 80, y: 30, size: 60, color: 'from-pink-500/20 to-rose-500/20', duration: 35 },
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Floating orbs */}
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className={`absolute rounded-full bg-gradient-to-r ${orb.color} blur-xl`}
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Mouse-following gradient */}
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-1000"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Left side - Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-md text-white relative">
          {/* Glassmorphism card */}
          <motion.div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ 
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ 
                    filter: [
                      "drop-shadow(0 0 0px rgba(255,255,255,0.5))",
                      "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
                      "drop-shadow(0 0 0px rgba(255,255,255,0.5))"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </motion.svg>
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                SConnect Admin
              </motion.h1>
              
              <motion.p 
                className="text-white/80 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Advanced administration interface with real-time analytics, 
                intelligent automation, and enterprise-grade security.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {[
                { icon: "⚡", text: "Lightning-fast Performance" },
                { icon: "🛡️", text: "Enterprise Security" },
                { icon: "📊", text: "Real-time Analytics" },
                { icon: "🎯", text: "Intelligent Automation" }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.text}
                  className="flex items-center group cursor-default"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.span 
                    className="text-2xl mr-3"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <span className="text-white/90 group-hover:text-white transition-colors">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Auth Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-8 lg:p-12 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <motion.div 
            className="lg:hidden text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-white">SConnect Admin</h1>
          </motion.div>

          {/* Form header */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            {subtitle && (
              <p className="text-white/70 text-lg">{subtitle}</p>
            )}
          </motion.div>

          {/* Glassmorphism form container */}
          <motion.div 
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ 
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transition: { duration: 0.3 }
            }}
          >
            {children}
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p>© 2025 SConnect Admin. Enterprise-grade security.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};