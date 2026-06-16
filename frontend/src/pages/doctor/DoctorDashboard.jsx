import { useState, useEffect } from 'react';
import API from '../../api/axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await API.get('/appointments/doctor');
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading dashboard...</div>;

  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === today && ['confirmed', 'pending'].includes(a.status)
  );
  const pendingConfirmations = appointments.filter((a) => a.status === 'pending');
  const rescheduleRequests = appointments.filter((a) => a.status === 'reschedule_requested');

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Doctor Dashboard</h1>
        <p>Overview of your appointments and patient activity</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <h3>{todayAppointments.length}</h3>
            <p>Today&apos;s Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <h3>{pendingConfirmations.length}</h3>
            <p>Pending Confirmations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🔄</div>
          <div className="stat-info">
            <h3>{rescheduleRequests.length}</h3>
            <p>Reschedule Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{appointments.filter((a) => a.status === 'confirmed').length}</h3>
            <p>Confirmed Total</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Today&apos;s Schedule</h3>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🗓️</span>
              <p>No appointments today</p>
            </div>
          ) : (
            todayAppointments.map((appt) => (
              <div key={appt._id} className="appointment-card">
                <div className="appointment-info">
                  <h4>{appt.patientId?.name}</h4>
                  <p>{appt.timeSlot}</p>
                  <p>{appt.notes || 'No notes'}</p>
                </div>
                <span className={`status-badge status-${appt.status}`}>
                  {appt.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Pending Confirmations</h3>
          </div>
          {pendingConfirmations.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <p>All caught up!</p>
            </div>
          ) : (
            pendingConfirmations.slice(0, 5).map((appt) => (
              <div key={appt._id} className="appointment-card">
                <div className="appointment-info">
                  <h4>{appt.patientId?.name}</h4>
                  <p>{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</p>
                </div>
                <span className="status-badge status-pending">Pending</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
