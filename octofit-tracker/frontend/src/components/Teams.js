import React, { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function Teams() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log('Fetching teams from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((json) => {
        console.log('Teams response:', json);
        setData(Array.isArray(json) ? json : json.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams fetch error:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const showDetails = (team) => setSelected(team);
  const closeModal = () => setSelected(null);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Teams</h2>
          {loading && <p>Loading teams...</p>}
          {error && <p className="text-danger">Error loading teams.</p>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-info">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">No teams found.</td>
                    </tr>
                  ) : (
                    data.map((team) => (
                      <tr key={team.id || team._id || team.name}>
                        <td>{team.name}</td>
                        <td>{team.description || 'No description available.'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => showDetails(team)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog details-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <dl className="row">
                  <dt className="col-sm-4">Name</dt>
                  <dd className="col-sm-8">{selected.name}</dd>
                  <dt className="col-sm-4">Description</dt>
                  <dd className="col-sm-8">{selected.description || 'No description provided.'}</dd>
                </dl>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </div>
      )}
    </div>
  );
}

export default Teams;
