<<<<<<< Updated upstream
import React from 'react'

const AdminDashboard = () => {
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard
=======
import React from 'react';
import Analytics from '../components/Analytics';

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Analytics />

      {/* You can later add links/buttons for posting new opportunities here */}
      {/* Example:
      <div className="mt-4">
        <Link to="/admin/create-opportunity" className="btn btn-primary">
          Post New Opportunity
        </Link>
      </div>
      */}
    </div>
  );
};

export default AdminDashboard;
>>>>>>> Stashed changes
