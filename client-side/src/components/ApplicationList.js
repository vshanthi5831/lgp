import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ApplicationList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/student/opportunities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (res.data.status === 'success') {
          setOpportunities(res.data.opportunities || []);
        } else {
          toast.error(res.data.message || 'Failed to fetch opportunities');
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        toast.error('Error fetching opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleClick = (id) => {
    navigate(`/student/apply/${id}`);
  };

  if (loading) return <div className="text-center mt-5">Loading opportunities...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Active Opportunities</h3>
      {opportunities.length === 0 ? (
        <p>No active opportunities available.</p>
      ) : (
        <div className="row">
          {opportunities.map((opp) => (
                <div key={opp.id} className="col-12 col-md-6 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => handleClick(opp.id)}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between mb-2">
                    <h5 className="card-title mb-0">{opp.title}</h5>
                    <span className="badge bg-primary">{opp.type}</span>
                  </div>
                  <h6 className="text-muted">{opp.company}</h6>

                  <p className="card-text mt-2" style={{ minHeight: '60px' }}>
                    {opp.description?.slice(0, 100) || 'No description provided'}...
                  </p>

                  <div className="d-flex justify-content-between align-items-end mt-auto">
                    <span className="badge bg-secondary">{opp.domain}</span>
                    <small className="text-muted bg-warning">Deadline: {opp.deadline}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
