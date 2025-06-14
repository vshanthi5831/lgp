import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/student/applications', {
          withCredentials: true, // important if using session cookies
        });
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching student applications:', err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Applications</h3>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="table table-hover shadow">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Domain</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.opportunity.title}</td>
                <td>{app.opportunity.company}</td>
                <td>{app.opportunity.domain}</td>
                <td>{new Date(app.applied_on).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationList;
