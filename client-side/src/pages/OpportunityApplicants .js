import React, { useEffect, useState , useContext} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OpportunityApplicants = () => {
  const { id } = useParams(); // Opportunity ID
  const [opportunity, setOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user} = useContext(AuthContext);

  useEffect(() => {
    const fetchOpportunityAndApplicants = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://localhost:5000/admin/opportunity/${id}/applicants`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.status === 'success') {
          setOpportunity(res.data.opportunity);
          setApplicants(res.data.applicants);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityAndApplicants();
  }, [id]);


  const handleDownloadExcel = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(
      `http://localhost:5000/admin/opportunity/${opportunity.id}/applicants/excel`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for downloading binary files
      }
    );

    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Filename: Internship_CompanyX_internship.xlsx
    const filename = `${opportunity.title}_${opportunity.company}_${opportunity.type}.xlsx`;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading Excel:', err);
    alert('Failed to download the Excel sheet.');
  }
};




  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>Opportunity & Applicants</h3>

      {/* Opportunity Details */}
      {opportunity ? (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{opportunity.title}</h5>
            <p className="card-text"><strong>Company:</strong> {opportunity.company}</p>
            <p className="card-text"><strong>Type:</strong> {opportunity.type}</p>
            <p className="card-text"><strong>CTC:</strong> {opportunity.ctc || 'N/A'}</p>
            <p className="card-text"><strong>Stipend:</strong> {opportunity.stipend || 'N/A'}</p>
            <p className="card-text"><strong>Deadline:</strong> {opportunity.deadline}</p>
            <p className="card-text"><strong>Status:</strong> 
              <span className={`badge bg-${opportunity.is_active ? 'success' : 'secondary'} ms-2`}>
                {opportunity.is_active ? 'Active' : 'Closed'}
              </span>
            </p>
            <p className="card-text"><strong>Posted At:</strong> {opportunity.created_at}</p>
          </div>
        </div>
      ) : (
        <p className="text-danger">Opportunity not found.</p>
      )}

      {/* Applicants Table */}
      <h5 className="mt-4">Applicants</h5>
      {applicants.length === 0 ? (
        <p>No students have applied for this opportunity.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>USN</th>
              <th>Branch</th>
              <th>Email</th>
              <th>Resume</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.full_name}</td>
                <td>{student.usn}</td>
                <td>{student.branch}</td>
                <td>{student.email}</td>
                <td>
                  <a href={student.resume_url} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </td>
                <td>{new Date(student.applied_on).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {opportunity && opportunity.posted_by == user.admin_id && (
        <div className="text-end mt-4">
            <button
            className="btn btn-success"
            onClick={handleDownloadExcel}
            >
            Download Excel Sheet
            </button>
        </div>
        )}

    </div>
  );
};

export default OpportunityApplicants;
