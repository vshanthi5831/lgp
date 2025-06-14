import React from 'react';

const OpportunityCard = ({ opportunity, onApply }) => {
  const {
    title,
    company,
    type,
    stipend,
    ctc,
    future_ctc_on_conversion,
    domain,
    description,
    deadline,
  } = opportunity;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title} <span className="badge bg-info text-dark ms-2">{type}</span></h5>
        <h6 className="card-subtitle mb-2 text-muted">{company}</h6>
        <p className="card-text">{description}</p>

        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item"><strong>Domain:</strong> {domain}</li>
          {stipend && <li className="list-group-item"><strong>Stipend:</strong> {stipend}</li>}
          {ctc && <li className="list-group-item"><strong>CTC:</strong> {ctc}</li>}
          {future_ctc_on_conversion && (
            <li className="list-group-item">
              <strong>Future CTC on Conversion:</strong> {future_ctc_on_conversion}
            </li>
          )}
          <li className="list-group-item"><strong>Deadline:</strong> {deadline}</li>
        </ul>

        {onApply && (
          <button className="btn btn-success" onClick={onApply}>
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
