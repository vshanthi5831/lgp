import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ApplyOpportunity = () => {
  const { opportunityId } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('You are not logged in!');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/student/opportunity/${opportunityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'success') {
          setOpportunity(response.data.opportunity);
          setApplied(response.data.already_applied || false);
        } else {
          toast.error(response.data.message || 'Failed to fetch opportunity');
        }
      } catch (error) {
        toast.error('Failed to load opportunity');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [opportunityId]);

  const handleApply = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('You are not logged in!');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/student/apply/${opportunityId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        toast.success(response.data.message);
        setApplied(true);
      } else {
        toast.error(response.data.message || 'Failed to apply');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error applying');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading opportunity details...</div>;
  if (!opportunity) return <div className="text-center mt-5">Opportunity not found.</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title">{opportunity.title}</h4>
            <span className="badge bg-primary">{opportunity.type}</span>
          </div>

          <h5 className="text-muted">{opportunity.company}</h5>
          <p className="mt-3">{opportunity.description}</p>

          <div className="row mt-4">
            <div className="col-md-6 mb-2">
              <strong>Domain:</strong>{' '}
              <span className="badge bg-secondary">{opportunity.domain}</span>
            </div>
            <div className="col-md-6 mb-2">
              <strong>Deadline:</strong>{' '}
              <span className="badge bg-warning text-dark">
                {new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            </div>
            {opportunity.ctc && (
              <div className="col-md-6 mb-2">
                <strong>CTC:</strong> ₹{opportunity.ctc}
              </div>
            )}
            {opportunity.stipend && (
              <div className="col-md-6 mb-2">
                <strong>Stipend:</strong> ₹{opportunity.stipend} / month
              </div>
            )}
            {opportunity.future_ctc_on_conversion && (
              <div className="col-md-6 mb-2">
                <strong>Future CTC on Conversion:</strong> ₹{opportunity.future_ctc_on_conversion}
              </div>
            )}
            {opportunity.duration_months && opportunity.type === 'internship' && (
              <div className="col-md-6 mb-2">
                <strong>Duration:</strong> {opportunity.duration_months} months
              </div>
            )}
          </div>

          <div className="text-end mt-4">
            <button
              className={`btn ${applied ? 'btn-success' : 'btn-primary'}`}
              onClick={handleApply}
              disabled={applied}
            >
              {applied ? '✅ Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyOpportunity;
