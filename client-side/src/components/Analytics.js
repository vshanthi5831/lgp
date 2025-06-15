import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');  // or wherever your JWT is stored

      const res = await axios.get('http://localhost:5000/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 'success') {
        setStats(res.data);
      } else {
        console.error('Analytics fetch failed:', res.data.message);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err.response?.data || err.message);
    }
  };

  fetchAnalytics();
}, []);


  if (!stats) return <p>Loading analytics...</p>;

  const pieData = {
  labels: ['Dream (18L+)', 'High (14-18L)', 'Good (8-14L)', 'IT (3-8L)'],
  datasets: [
    {
      label: 'FTE Applications',
      data: stats.fte_distribution || [0, 0, 0, 0],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
      borderWidth: 1,
    },
  ],
};


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
          <div className="mt-5">
            <h5>FTE Applications by Payment Type</h5>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;