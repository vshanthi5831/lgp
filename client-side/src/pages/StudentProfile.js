import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [editable, setEditable] = useState({
    contact: '',
    resume_url: '',
    domain_prefs: '',
    btech_aggregate: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/student/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStudent(response.data.student);
        setEditable({
          contact: response.data.student.contact || '',
          resume_url: response.data.student.resume_url || '',
          domain_prefs: response.data.student.domain_prefs || '',
          btech_aggregate: response.data.student.btech_aggregate || ''
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditable({
      ...editable,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');

    // optional client-side validation
    if (editable.btech_aggregate < 0 || editable.btech_aggregate > 100) {
      toast.error('BTech Aggregate must be between 0 and 100');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/student/profile',
        editable,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(response.data.message);
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;

  if (!student) return <div className="text-center mt-5">Student not found.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: '700px' }}>
        <div className="card-body">
          <h3 className="mb-4">Student Profile</h3>

          <p><strong>Full Name:</strong> {student.full_name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>USN:</strong> {student.usn}</p>
          <p><strong>Branch:</strong> {student.branch}</p>
          <p><strong>10th %:</strong> {student.tenth_percent}%</p>
          <p><strong>12th %:</strong> {student.twelfth_percent}%</p>

          <hr />

          <div className="mb-3">
            <label className="form-label"><strong>Contact</strong></label>
            <input
              className="form-control"
              name="contact"
              value={editable.contact}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Resume URL</strong></label>
            <input
              className="form-control"
              name="resume_url"
              value={editable.resume_url}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Domain Preferences</strong></label>
            <input
              className="form-control"
              name="domain_prefs"
              value={editable.domain_prefs}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>BTech Aggregate (%)</strong></label>
            <input
              className="form-control"
              name="btech_aggregate"
              type="number"
              step="0.01"
              value={editable.btech_aggregate}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="d-flex justify-content-end">
            {editing ? (
              <>
                <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
