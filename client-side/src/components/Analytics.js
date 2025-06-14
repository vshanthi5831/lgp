import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/admin/analytics', {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Platform Analytics</h3>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Total Opportunities</h5>
              <p className="display-6">{stats.total_opportunities}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Total Applications</h5>
              <p className="display-6">{stats.total_applications}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Active Opportunities</h5>
              <p className="display-6">{stats.active_opportunities}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
