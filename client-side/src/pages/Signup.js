import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    usn: '',
    contact: '',
    branch: '',
    tenth_percent: '',
    twelfth_percent: '',
    btech_aggregate: '',
    resume_url: '',
    domain_prefs: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === 'student') {
        payload.usn = form.usn;
        payload.contact = form.contact;
        payload.branch = form.branch;
        payload.tenth_percent = form.tenth_percent;
        payload.twelfth_percent = form.twelfth_percent;
        payload.btech_aggregate = form.btech_aggregate;
        payload.resume_url = form.resume_url;
        payload.domain_prefs = form.domain_prefs;
      }

      const res = await axios.post('http://localhost:5000/register', payload);

      if (res.data.status === 'success') {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '600px' }}>
        <h3 className="mb-3 text-center">Signup</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Register As</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.role === 'student' && (
            <>
              <div className="mb-3">
                <label className="form-label">USN</label>
                <input
                  type="text"
                  className="form-control"
                  name="usn"
                  value={form.usn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  className="form-control"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">10th %</label>
                <input
                  type="number"
                  className="form-control"
                  name="tenth_percent"
                  value={form.tenth_percent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">12th %</label>
                <input
                  type="number"
                  className="form-control"
                  name="twelfth_percent"
                  value={form.twelfth_percent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">B.Tech Aggregate</label>
                <input
                  type="number"
                  className="form-control"
                  name="btech_aggregate"
                  value={form.btech_aggregate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Resume URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="resume_url"
                  value={form.resume_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Domain Preferences (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="domain_prefs"
                  value={form.domain_prefs}
                  onChange={handleChange}
                  placeholder="e.g., Web, ML, Android"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
