import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './dashboard/DashboardPage';
import { LoginPage } from './auth/LoginPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Error routes */}
      <Route path="/unauthorized" element={<div>Unauthorized access</div>} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};
