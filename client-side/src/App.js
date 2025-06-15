import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './context/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import OpportunityForm from './pages/OpportunityForm';
import ApplyOpportunity from './components/ApplyOpportunity';
import AdminApplications from './pages/AdminApplications';
import OpportunityApplicants from './pages/OpportunityApplicants ';
import StudentProfile from './pages/StudentProfile';
import StudentApplications from './pages/StudentApplications.js';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Student Route */}
          <Route element={<PrivateRoute requiredRole="student" />}>
            <Route path="/student/opportunities" element={<StudentDashboard />} />
            <Route path="/student/apply/:opportunityId" element={<ApplyOpportunity />} />
            <Route path ="student/profile" element ={<StudentProfile />} />
            <Route path="/student/applications" element={<StudentApplications />} />

            



          </Route>

          {/* Protected Admin Route */}
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path ="/admin/opportunity/new" element={<OpportunityForm />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/opportunity/:id/applicants" element={<OpportunityApplicants />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
