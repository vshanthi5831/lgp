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

      // If type changes and is not internship, clear duration_months
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
    <div className="container mt-5">
      <h2>Create New Opportunity</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Title*</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Company*</label>
          <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Type*</label>
          <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="internship">Internship</option>
            <option value="fulltime">Full-Time</option>
            <option value="internship_with_ctc">Internship with CTC</option>
          </select>
        </div>

        {formData.type === 'internship' || formData.type === 'internship_with_ctc' && (
          <div className="mb-3">
            <label className="form-label">Duration (in months)*</label>
            <input
              type="number"
              name="duration_months"
              className="form-control"
              value={formData.duration_months}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Stipend</label>
          <input type="number" name="stipend" className="form-control" value={formData.stipend} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">CTC</label>
          <input type="number" name="ctc" className="form-control" value={formData.ctc} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Future CTC (On Conversion)</label>
          <input type="number" name="future_ctc_on_conversion" className="form-control" value={formData.future_ctc_on_conversion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Domain*</label>
          <input type="text" name="domain" className="form-control" value={formData.domain} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description*</label>
          <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline*</label>
          <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Create Opportunity</button>
      </form>
    </div>
  );
};

export default OpportunityForm;
