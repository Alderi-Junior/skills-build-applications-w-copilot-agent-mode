import React, { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log('Fetching users from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((json) => {
        console.log('Users response:', json);
        setData(Array.isArray(json) ? json : json.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users fetch error:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const showDetails = (user) => setSelected(user);
  const closeModal = () => setSelected(null);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="card-title mb-0">Users</h2>
            <button className="btn btn-sm btn-primary">Refresh</button>
          </div>
          {loading && <p>Loading users...</p>}
          {error && <p className="text-danger">Error loading users.</p>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-secondary">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No users found.</td>
                    </tr>
                  ) : (
                    data.map((user) => (
                      <tr key={user.id || user._id || user.email}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.team?.name || user.team || 'No team assigned'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => showDetails(user)}>
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
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <dl className="row">
                  <dt className="col-sm-4">Name</dt>
                  <dd className="col-sm-8">{selected.name}</dd>
                  <dt className="col-sm-4">Email</dt>
                  <dd className="col-sm-8">{selected.email}</dd>
                  <dt className="col-sm-4">Team</dt>
                  <dd className="col-sm-8">{selected.team?.name || selected.team || 'No team assigned'}</dd>
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

export default Users;
