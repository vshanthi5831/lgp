import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link className="navbar-brand" to="/">NXT Step</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
            </>
          )}

          {user?.role === 'student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/opportunities">Apply</Link> {/* Apply for new opportunities */}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/applications">My Applications</Link> {/* View submitted applications with filters */}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/profile">Profile</Link> {/* Edit/view profile */}
                </li>
                <li className="nav-item">
                  <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}


          {user?.role === 'admin' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/opportunity/new">Post Job</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/applications">Applications</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
