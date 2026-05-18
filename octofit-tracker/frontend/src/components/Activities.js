import React, { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log('Fetching activities from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((json) => {
        console.log('Activities response:', json);
        setData(Array.isArray(json) ? json : json.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities fetch error:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const showDetails = (activity) => setSelected(activity);
  const closeModal = () => setSelected(null);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Activities</h2>
          {loading && <p>Loading activities...</p>}
          {error && <p className="text-danger">Error loading activities.</p>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No activities found.</td>
                    </tr>
                  ) : (
                    data.map((activity) => (
                      <tr key={activity.id || activity._id || `${activity.type}-${activity.date}`}>
                        <td>{activity.id || activity._id || 'N/A'}</td>
                        <td>{activity.user?.name || activity.user || 'Unknown'}</td>
                        <td>{activity.type}</td>
                        <td>{activity.duration}</td>
                        <td>{activity.date}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => showDetails(activity)}>
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
          <div className="modal-dialog modal-lg details-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <dl className="row">
                  <dt className="col-sm-3">ID</dt>
                  <dd className="col-sm-9">{selected.id || selected._id || 'N/A'}</dd>
                  <dt className="col-sm-3">User</dt>
                  <dd className="col-sm-9">{selected.user?.name || selected.user || 'Unknown'}</dd>
                  <dt className="col-sm-3">Type</dt>
                  <dd className="col-sm-9">{selected.type}</dd>
                  <dt className="col-sm-3">Duration</dt>
                  <dd className="col-sm-9">{selected.duration}</dd>
                  <dt className="col-sm-3">Date</dt>
                  <dd className="col-sm-9">{selected.date}</dd>
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

export default Activities;
