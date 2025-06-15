import React, { useState } from 'react';
import axios from 'axios';

const OpportunityForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: '',
    stipend: '',
    ctc: '',
    future_ctc_on_conversion: '',
    duration_months: '',
    domain: '',
    description: '',
    deadline: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'type' && value !== 'internship') {
        updated.duration_months = '';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/admin/create-opportunity',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setMessage('Opportunity created successfully!');
        setFormData({
          title: '',
          company: '',
          type: '',
          stipend: '',
          ctc: '',
          future_ctc_on_conversion: '',
          duration_months: '',
          domain: '',
          description: '',
          deadline: ''
        });
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '600px', borderRadius: '15px' }}>
        <h3 className="text-center mb-4">Create Opportunity</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Title*', name: 'title', type: 'text' },
            { label: 'Company*', name: 'company', type: 'text' },
          ].map((field, i) => (
            <div className="mb-3" key={i}>
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                className="form-control"
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Type*</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="internship">Internship</option>
              <option value="fulltime">Full-Time</option>
              <option value="internship_with_ctc">Internship with CTC</option>
            </select>
          </div>

          {formData.type === 'internship' && (
            <div className="mb-3">
              <label className="form-label">Duration (months)*</label>
              <input
                type="number"
                name="duration_months"
                className="form-control"
                min="1"
                value={formData.duration_months}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {[
            { label: 'Stipend', name: 'stipend' },
            { label: 'CTC', name: 'ctc' },
            { label: 'Future CTC (On Conversion)', name: 'future_ctc_on_conversion' },
          ].map((field, i) => (
            <div className="mb-3" key={i}>
              <label className="form-label">{field.label}</label>
              <input
                type="number"
                name={field.name}
                className="form-control"
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Domain*</label>
            <input
              type="text"
              name="domain"
              className="form-control"
              value={formData.domain}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description*</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Deadline*</label>
            <input
              type="date"
              name="deadline"
              className="form-control"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Create Opportunity</button>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
