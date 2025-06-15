import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-5 text-center" style={{ maxWidth: '600px', borderRadius: '20px' }}>
        <h1 className="mb-3">🚀 Welcome to Placement Portal</h1>
        <p className="lead text-muted mb-4">
          Your one-stop platform for managing internships, jobs, and applications.
        </p>

        {!token ? (
          <div className="d-grid gap-2 col-6 mx-auto">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        ) : (
          <div className="d-grid gap-2 col-8 mx-auto">
            <button className="btn btn-success" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                localStorage.removeItem('authToken');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        )}

        <hr className="my-4" />
        <p className="small text-muted">Empowering campus placements with ease and speed.</p>
      </div>
    </div>
  );
};

export default Home;
