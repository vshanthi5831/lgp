import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OpportunityCard from './OpportunityCard';

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get('/api/student/opportunities', {
          withCredentials: true,
        });
        setOpportunities(res.data.opportunities || []);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      }
    };

    fetchOpportunities();
  }, []);

  const handleApply = async (opportunityId) => {
    try {
      await axios.post(
        `/api/student/apply/${opportunityId}`,
        {},
        { withCredentials: true }
      );
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying:', err);
      alert('Error submitting application.');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Available Opportunities</h3>
      {opportunities.length === 0 ? (
        <p>No active opportunities available.</p>
      ) : (
        opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onApply={() => handleApply(opp.id)}
          />
        ))
      )}
    </div>
  );
};

export default OpportunityList;
