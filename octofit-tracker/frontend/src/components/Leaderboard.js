import React, { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log('Fetching leaderboard from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((json) => {
        console.log('Leaderboard response:', json);
        setData(Array.isArray(json) ? json : json.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard fetch error:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const showDetails = (entry) => setSelected(entry);
  const closeModal = () => setSelected(null);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Leaderboard</h2>
          {loading && <p>Loading leaderboard...</p>}
          {error && <p className="text-danger">Error loading leaderboard.</p>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No leaderboard data found.</td>
                    </tr>
                  ) : (
                    data.map((entry, index) => (
                      <tr key={entry.id || entry._id || `${entry.user?.name}-${entry.score}`}>
                        <td>{index + 1}</td>
                        <td>{entry.user?.name || entry.user || 'Unknown'}</td>
                        <td>{entry.score}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => showDetails(entry)}>
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
                <h5 className="modal-title">Leaderboard Entry</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <dl className="row">
                  <dt className="col-sm-4">User</dt>
                  <dd className="col-sm-8">{selected.user?.name || selected.user || 'Unknown'}</dd>
                  <dt className="col-sm-4">Score</dt>
                  <dd className="col-sm-8">{selected.score}</dd>
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

export default Leaderboard;
