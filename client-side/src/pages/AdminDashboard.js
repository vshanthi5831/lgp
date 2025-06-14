import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.data.status === 'success') {
        setAnalytics(response.data.data);
        console.log(response.data.data);
      } else {
        console.error('Backend responded with error:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, []);


  if (loading || !analytics) {
    return <div className="text-center mt-5">Loading analytics...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Welcome, {user?.admin?.full_name || 'Admin'}</h2>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card text-bg-primary h-100 shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Total Opportunities</h5>
              <h2>{analytics.total_opportunities}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card text-bg-success h-100 shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Active Opportunities</h5>
              <h2>{analytics.active_opportunities}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card text-bg-warning h-100 shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Total Applications</h5>
              <h2>{analytics.total_applications}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card text-bg-info h-100 shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Today’s Applications</h5>
              <h2>{analytics.deadline_today}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
