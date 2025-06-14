// src/components/PostOpportunity.js
import React, { useState } from 'react';
import axios from 'axios';

const PostOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'internship',
    stipend: '',
    ctc: '',
    future_ctc_on_conversion: '',
    domain: '',
    description: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/create-opportunity', formData, {
        withCredentials: true,
      });
      alert('Opportunity created!');
      setFormData({
        title: '',
        company: '',
        type: 'internship',
        stipend: '',
        ctc: '',
        future_ctc_on_conversion: '',
        domain: '',
        description: '',
        deadline: ''
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create opportunity.');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Post New Opportunity</h4>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Company</label>
            <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Type</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
              <option value="internship">Internship</option>
              <option value="fulltime">Fulltime</option>
              <option value="internship_with_ctc">Internship + CTC</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Domain</label>
            <input type="text" name="domain" className="form-control" value={formData.domain} onChange={handleChange} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Stipend</label>
            <input type="text" name="stipend" className="form-control" value={formData.stipend} onChange={handleChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label>CTC</label>
            <input type="text" name="ctc" className="form-control" value={formData.ctc} onChange={handleChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label>Future CTC</label>
            <input type="text" name="future_ctc_on_conversion" className="form-control" value={formData.future_ctc_on_conversion} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Deadline</label>
            <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleChange} required />
          </div>
          <div className="col-12 mb-3">
            <label>Description</label>
            <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Post Opportunity</button>
      </form>
    </div>
  );
};

export default PostOpportunity;
