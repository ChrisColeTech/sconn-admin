import React from 'react';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome to the SConnect Admin Dashboard</p>
      <Button>Get Started</Button>
    </div>
  );
};
