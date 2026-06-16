import { useState } from 'react';
import API from '../../api/axios';

const PatientHistory = () => {
  const [patientId, setPatientId] = useState('');
  const [history, setHistory] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const [historyRes, reportsRes] = await Promise.all([
        API.get(`/patients/${patientId}/history`),
        API.get(`/reports/${patientId}`),
      ]);
      setHistory(historyRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patient history');
      setHistory(null);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Patient History</h1>
        <p>Search and view patient medical history</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="patient-id">Patient ID</label>
            <input
              type="text"
              id="patient-id"
              className="form-control"
              placeholder="Enter patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {history && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3>Patient Information</h3>
            </div>
            <div className="profile-grid">
              <div>
                <div className="profile-field"><label>Name</label><p>{history.patient.name}</p></div>
                <div className="profile-field"><label>Email</label><p>{history.patient.email}</p></div>
              </div>
              <div>
                {history.profile && (
                  <>
                    <div className="profile-field"><label>Age</label><p>{history.profile.age || '—'}</p></div>
                    <div className="profile-field"><label>Blood Group</label><p>{history.profile.bloodGroup || '—'}</p></div>
                  </>
                )}
              </div>
              {history.profile?.pastConditions?.length > 0 && (
                <div>
                  <div className="profile-field">
                    <label>Past Conditions</label>
                    <div className="tags">
                      {history.profile.pastConditions.map((c, i) => (
                        <span key={i} className="tag">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {history.profile?.allergies?.length > 0 && (
                <div>
                  <div className="profile-field">
                    <label>Allergies</label>
                    <div className="tags">
                      {history.profile.allergies.map((a, i) => (
                        <span key={i} className="tag danger">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h3>Appointment History</h3>
              </div>
              {history.appointments.length === 0 ? (
                <div className="empty-state"><p>No appointments</p></div>
              ) : (
                history.appointments.map((appt) => (
                  <div key={appt._id} className="appointment-card">
                    <div className="appointment-info">
                      <h4>{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</h4>
                      <p>Dr. {appt.doctorId?.name} — {appt.doctorId?.specialization}</p>
                      <p>{appt.notes || 'No notes'}</p>
                    </div>
                    <span className={`status-badge status-${appt.status}`}>{appt.status.replace('_', ' ')}</span>
                  </div>
                ))
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Diagnostic Reports</h3>
              </div>
              {reports.length === 0 ? (
                <div className="empty-state"><p>No reports</p></div>
              ) : (
                reports.map((report) => (
                  <div key={report._id} className="report-card">
                    <div className="report-icon">{report.fileType === 'pdf' ? '📋' : '🖼️'}</div>
                    <div className="report-info">
                      <h4>{report.title}</h4>
                      <p>{new Date(report.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="report-actions">
                      <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientHistory;
