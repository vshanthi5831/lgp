<<<<<<< Updated upstream
import React from 'react'

const StudentDashboard = () => {
  return (
    <div>StudentDashboard</div>
  )
}

export default StudentDashboard
=======
import React from 'react';
import ApplicationList from '../components/ApplicationList.js'; // adjust path if needed

const StudentDashboard = () => {
  return (
    <div className="container mt-4">
      <h2>Student Dashboard</h2>
      <p>Welcome! Here you can view your applications.</p>
      <ApplicationList /> {/* ✅ Application list shown below */}
    </div>
  );
};

export default StudentDashboard;
>>>>>>> Stashed changes
