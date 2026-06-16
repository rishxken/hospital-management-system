import { useState, useEffect } from 'react';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading dashboard...</div>;

  if (!stats) return <div className="page-content"><div className="alert alert-error">Failed to load system statistics</div></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System-wide statistics and overview</p>
      </div>

      <h2 className="section-title">User Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <h3>{stats.users.total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🏥</div>
          <div className="stat-info">
            <h3>{stats.users.patients}</h3>
            <p>Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{stats.users.doctors}</h3>
            <p>Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">👤</div>
          <div className="stat-info">
            <h3>{stats.users.staff}</h3>
            <p>Staff</p>
          </div>
        </div>
      </div>

      <h2 className="section-title">Appointment Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <h3>{stats.appointments.total}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <h3>{stats.appointments.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{stats.appointments.confirmed}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">❌</div>
          <div className="stat-info">
            <h3>{stats.appointments.cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
