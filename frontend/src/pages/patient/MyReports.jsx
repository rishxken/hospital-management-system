import { useState, useEffect } from 'react';
import API from '../../api/axios';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get('/reports/my');
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading reports...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>My Reports</h1>
        <p>View all your diagnostic reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-icon">📄</span>
            <p>No diagnostic reports yet</p>
          </div>
        </div>
      ) : (
        <div className="card">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-icon">{report.fileType === 'pdf' ? '📋' : '🖼️'}</div>
              <div className="report-info">
                <h4>{report.title}</h4>
                <p>
                  By Dr. {report.doctorId?.name}
                  {report.doctorId?.specialization && ` (${report.doctorId.specialization})`}
                </p>
                <p>
                  Appointment: {report.appointmentId?.date
                    ? new Date(report.appointmentId.date).toLocaleDateString()
                    : '—'} at {report.appointmentId?.timeSlot || '—'}
                </p>
                <p>Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}</p>
              </div>
              <div className="report-actions">
                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                  View Report
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
