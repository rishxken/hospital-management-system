import { useState, useEffect } from 'react';
import API from '../../api/axios';

const StaffDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, patRes, apptRes] = await Promise.all([
          API.get('/staff/doctors'),
          API.get('/staff/patients'),
          API.get('/staff/appointments'),
        ]);
        setDoctors(docRes.data);
        setPatients(patRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading dashboard...</div>;

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Staff Dashboard</h1>
        <p>Hospital operations overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{doctors.length}</h3>
            <p>Active Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🏥</div>
          <div className="stat-info">
            <h3>{patients.length}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">📅</div>
          <div className="stat-info">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">⏳</div>
          <div className="stat-info">
            <h3>{appointments.filter((a) => a.status === 'pending').length}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Appointments</h3>
        </div>
        {recentAppointments.length === 0 ? (
          <div className="empty-state"><p>No appointments</p></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.patientId?.name}</td>
                    <td>Dr. {appt.doctorId?.name}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.timeSlot}</td>
                    <td>
                      <span className={`status-badge status-${appt.status}`}>
                        {appt.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
