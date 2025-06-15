import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/student/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data.applications);
      } catch (error) {
        toast.error('Failed to load applications');
      }
    };

    fetchApplications();
  }, []);

  const filteredApps = applications.filter(app =>
    filter === '' ? true : app.opportunity_type === filter
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Applications</h3>

      <div className="mb-3">
        <label className="form-label">Filter by Type:</label>
        <select className="form-select w-auto" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="internship">Internship</option>
          <option value="fulltime">Full Time</option>
          <option value="internship_with_ctc">Internship with Full Time</option>
        </select>
      </div>

      {filteredApps.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="list-group">
          {filteredApps.map((app, index) => (
            <li key={index} className="list-group-item">
              <h5 className="mb-1">{app.title}</h5>
              <p className="mb-1">Company: {app.company}</p>
              <p className="mb-1">Type: {app.opportunity_type}</p>
              <small>Applied on: {new Date(app.applied_on).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentApplications;
