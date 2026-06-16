import { useState, useEffect } from 'react';
import API from '../../api/axios';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await API.get('/staff/appointments');
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filter);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>All Appointments</h1>
        <p>Hospital-wide appointment records</p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'cancelled', 'reschedule_requested', 'rescheduled'].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
            {status !== 'all' && ` (${appointments.filter((a) => a.status === status).length})`}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No appointments found</td></tr>
            ) : (
              filteredAppointments.map((appt) => (
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
                  <td>{appt.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointments;
