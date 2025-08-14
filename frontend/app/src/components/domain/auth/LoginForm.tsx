import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useLogin } from '@/hooks/auth/useLogin';
import { loginSchema, LoginFormData, loginFormDefaults } from '@/utils/auth/loginFormHelpers';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(true);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginFormDefaults,
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error handled by useLogin hook
    }
  };

  const fillDemoCredentials = () => {
    setValue('username', 'admin');
    setValue('password', 'admin123');
    setShowCredentials(false);
    
    // Add visual feedback
    if (usernameRef.current) usernameRef.current.focus();
    setTimeout(() => {
      if (passwordRef.current) passwordRef.current.focus();
    }, 300);
  };

  const inputVariants: Variants = {
    initial: { scale: 1, boxShadow: "0 0 0 0px rgba(147, 51, 234, 0)" },
    focused: { 
      scale: 1.02, 
      boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.2), 0 0 20px rgba(147, 51, 234, 0.1)"
    },
    error: {
      scale: [1, 1.02, 1],
      boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.3)"
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Demo credentials info */}
      <AnimatePresence>
        {showCredentials && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="backdrop-blur-sm bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/20 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SparklesIcon className="h-5 w-5 text-purple-300 mr-2" />
                </motion.div>
                <div className="text-sm text-white/90">
                  <p className="font-medium mb-1">Quick Demo Access:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white/10 px-2 py-1 rounded border border-white/20">admin</span>
                    <span className="bg-white/10 px-2 py-1 rounded border border-white/20">admin123</span>
                  </div>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Auto-fill
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Username field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.label 
            htmlFor="username" 
            className="block text-sm font-medium text-white/90 mb-2"
            animate={{ color: focusedField === 'username' ? '#a855f7' : 'rgba(255,255,255,0.9)' }}
          >
            Username
          </motion.label>
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate={
              errors.username ? "error" : 
              focusedField === 'username' ? "focused" : "initial"
            }
          >
            <input
              {...register('username')}
              ref={usernameRef}
              type="text"
              id="username"
              className="block w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all duration-300"
              placeholder="Enter your username"
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            />
          </motion.div>
          <AnimatePresence>
            {errors.username && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.username.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.label 
            htmlFor="password" 
            className="block text-sm font-medium text-white/90 mb-2"
            animate={{ color: focusedField === 'password' ? '#a855f7' : 'rgba(255,255,255,0.9)' }}
          >
            Password
          </motion.label>
          <motion.div 
            className="relative"
            variants={inputVariants}
            initial="initial"
            animate={
              errors.password ? "error" : 
              focusedField === 'password' ? "focused" : "initial"
            }
          >
            <input
              {...register('password')}
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="block w-full px-4 py-3 pr-12 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all duration-300"
              placeholder="Enter your password"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            <motion.button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: showPassword ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-white/60 hover:text-white/80" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-white/60 hover:text-white/80" />
                )}
              </motion.div>
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Remember me and forgot password */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div 
            className="flex items-center"
            whileHover={{ x: 2 }}
          >
            <motion.input
              {...register('rememberMe')}
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 rounded bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-white/80">
              Remember me
            </label>
          </motion.div>
          <motion.a 
            href="#" 
            className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors"
            whileHover={{ x: 2 }}
          >
            Forgot password?
          </motion.a>
        </motion.div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 backdrop-blur-sm"
          >
            <div className="flex">
              <motion.div 
                className="flex-shrink-0"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0] 
                }}
                transition={{ duration: 0.5 }}
              >
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Authentication Failed</h3>
                <p className="mt-1 text-sm text-red-200">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          animate={isLoading ? { 
            background: [
              "linear-gradient(45deg, #9333ea, #ec4899)",
              "linear-gradient(45deg, #ec4899, #9333ea)",
              "linear-gradient(45deg, #9333ea, #ec4899)"
            ]
          } : {}}
          transition={{ duration: isLoading ? 2 : 0.3, repeat: isLoading ? Infinity : 0 }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                />
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Authenticating...
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Access Dashboard
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            style={{ skewX: -20 }}
          />
        </motion.button>
      </motion.div>
    </motion.form>
  );
};