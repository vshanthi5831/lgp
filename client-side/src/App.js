import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './context/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
const Home = () => (
  <div className="container mt-4">
    <h1>Welcome Home</h1>
  </div>
);

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
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          {/* Protected Admin Route */}
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
