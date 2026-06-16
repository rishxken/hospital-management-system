import { useState, useEffect } from 'react';
import API from '../../api/axios';

const SystemOverview = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to load system overview');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading...</div>;

  if (!stats) return <div className="page-content"><div className="alert alert-error">Failed to load</div></div>;

  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>System Overview</h1>
        <p>Comprehensive view of hospital system metrics</p>
      </div>

      <div className="dashboard-grid">
        {/* Users Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3>Users Breakdown</h3>
            <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{stats.users.total} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Patients', count: stats.users.patients, color: '#2563eb' },
              { label: 'Doctors', count: stats.users.doctors, color: '#10b981' },
              { label: 'Staff', count: stats.users.staff, color: '#f59e0b' },
              { label: 'Admins', count: stats.users.admins, color: '#ec4899' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    {item.count} ({getPercentage(item.count, stats.users.total)}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${getPercentage(item.count, stats.users.total)}%`,
                      background: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3>Appointments Breakdown</h3>
            <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{stats.appointments.total} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Pending', count: stats.appointments.pending, color: '#f59e0b' },
              { label: 'Confirmed', count: stats.appointments.confirmed, color: '#10b981' },
              { label: 'Cancelled', count: stats.appointments.cancelled, color: '#ef4444' },
              { label: 'Reschedule Requested', count: stats.appointments.rescheduleRequested, color: '#6366f1' },
              { label: 'Rescheduled', count: stats.appointments.rescheduled, color: '#2563eb' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    {item.count} ({getPercentage(item.count, stats.appointments.total)}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${getPercentage(item.count, stats.appointments.total)}%`,
                      background: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Status */}
        <div className="card">
          <div className="card-header">
            <h3>Account Status</h3>
          </div>
          <div className="stats-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
              <div className="stat-icon green">✅</div>
              <div className="stat-info">
                <h3>{activeUsers}</h3>
                <p>Active Accounts</p>
              </div>
            </div>
            <div className="stat-card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
              <div className="stat-icon red">🚫</div>
              <div className="stat-info">
                <h3>{inactiveUsers}</h3>
                <p>Inactive Accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Registrations</h3>
          </div>
          {users.slice(0, 5).map((user) => (
            <div key={user._id} className="appointment-card">
              <div className="appointment-info">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
