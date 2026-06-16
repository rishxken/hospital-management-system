import { useState, useEffect } from 'react';
import API from '../../api/axios';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, reportRes] = await Promise.all([
          API.get('/appointments/my'),
          API.get('/reports/my'),
        ]);
        setAppointments(apptRes.data);
        setReports(reportRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading dashboard...</div>;

  const upcomingAppointments = appointments
    .filter((a) => ['pending', 'confirmed', 'rescheduled'].includes(a.status))
    .slice(0, 5);

  const recentReports = reports.slice(0, 5);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Patient Dashboard</h1>
        <p>Welcome back! Here&apos;s an overview of your health activity.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{appointments.filter((a) => a.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <h3>{appointments.filter((a) => a.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📄</div>
          <div className="stat-info">
            <h3>{reports.length}</h3>
            <p>Reports</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Appointments</h3>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.map((appt) => (
              <div key={appt._id} className="appointment-card">
                <div className="appointment-info">
                  <h4>Dr. {appt.doctorId?.name}</h4>
                  <p>{appt.doctorId?.specialization || 'General'}</p>
                  <p>{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</p>
                </div>
                <span className={`status-badge status-${appt.status}`}>{appt.status.replace('_', ' ')}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Reports</h3>
          </div>
          {recentReports.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <p>No reports yet</p>
            </div>
          ) : (
            recentReports.map((report) => (
              <div key={report._id} className="report-card">
                <div className="report-icon">{report.fileType === 'pdf' ? '📋' : '🖼️'}</div>
                <div className="report-info">
                  <h4>{report.title}</h4>
                  <p>By Dr. {report.doctorId?.name} · {new Date(report.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="report-actions">
                  <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
