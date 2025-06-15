import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filter, setFilter] = useState('all'); // all | active | posted_by_me
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
  }, [filter]);

  const fetchOpportunities = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`http://localhost:5000/admin/opportunities?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === 'success') {
        setOpportunities(res.data.opportunities);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    }
  };

  const handleDeactivate = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await axios.patch(`http://localhost:5000/admin/opportunity/${id}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status === 'success') {
        setOpportunities(prev =>
          prev.map(opp =>
            opp.id === id ? { ...opp, is_active: false } : opp
          )
        );
      }
    } catch (err) {
      console.error('Deactivation failed:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Posted Opportunities</h3>

      <div className="mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active Only</option>
          <option value="posted_by_me">Posted by Me</option>
        </select>
      </div>

      {opportunities.length === 0 ? (
        <p>No opportunities found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>CTC</th>
              <th>Stipend</th>
              <th>Deadline</th>
              <th>Posted At</th>
              <th>Status</th>
              <th>View Applicants</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp) => (
              <tr key={opp.id}>
                <td>{opp.title}</td>
                <td>{opp.company}</td>
                <td>{opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}</td>
                <td>{opp.ctc || 'N/A'} CTC</td>
                <td>{opp.stipend || 'N/A'} /month</td>
                <td>{opp.deadline}</td>
                <td>{opp.created_at}</td>
                <td>
                  {opp.is_active ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleDeactivate(opp.id)}
                    >
                      Active (Click to Close)
                    </button>
                  ) : (
                    <span className="badge bg-secondary">Closed</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/admin/opportunity/${opp.id}/applicants`)}
                  >
                    View Applicants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOpportunities;
