import { useState, useEffect } from 'react';
import API from '../../api/axios';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get('/appointments/my');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setActionLoading(id);
    try {
      await API.patch(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setActionLoading('');
    }
  };

  const handleRescheduleRequest = async (id) => {
    setActionLoading(id);
    try {
      await API.patch(`/appointments/${id}/reschedule-request`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request reschedule');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading appointments...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>View and manage all your appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <p>No appointments found. Book your first appointment!</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>Dr. {appt.doctorId?.name}</td>
                  <td>{appt.doctorId?.specialization || '—'}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.timeSlot}</td>
                  <td>
                    <span className={`status-badge status-${appt.status}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{appt.notes || '—'}</td>
                  <td>
                    <div className="btn-group">
                      {['pending', 'confirmed'].includes(appt.status) && (
                        <>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleRescheduleRequest(appt._id)}
                            disabled={actionLoading === appt._id}
                          >
                            Reschedule
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancel(appt._id)}
                            disabled={actionLoading === appt._id}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
