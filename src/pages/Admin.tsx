import React from 'react';
import LoginActivityDashboard from '../components/LoginActivityDashboard';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor login activities and user statistics</p>
        </div>
        
        <LoginActivityDashboard />
      </div>
    </div>
  );
};

export default Admin;
