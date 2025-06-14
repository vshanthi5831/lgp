import PostOpportunity from '../components/PostOpportunity';
import Analytics from '../components/Analytics';
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Analytics />
      <PostOpportunity />
    </div>
  );
};

export default AdminDashboard;
