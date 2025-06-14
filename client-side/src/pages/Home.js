import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'student') {
      navigate('/student-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  return null; // optional: you can return a spinner/loading state here
};

export default Home;
