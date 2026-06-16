import { useState, useEffect } from 'react';
import API from '../../api/axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM',
  ];

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (id) => {
    setActionLoading(id);
    try {
      await API.patch(`/appointments/${id}/confirm`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm');
    } finally {
      setActionLoading('');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
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

  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.timeSlot) {
      alert('Please select date and time');
      return;
    }
    setActionLoading(rescheduleModal);
    try {
      await API.patch(`/appointments/${rescheduleModal}/reschedule`, rescheduleData);
      setRescheduleModal(null);
      setRescheduleData({ date: '', timeSlot: '' });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reschedule');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>Manage your patient appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <p>No appointments</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
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
                  <td>{appt.patientId?.name}</td>
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
                      {appt.status === 'pending' && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleConfirm(appt._id)}
                          disabled={actionLoading === appt._id}
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status === 'reschedule_requested' && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setRescheduleModal(appt._id)}
                        >
                          Reschedule
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(appt.status) && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancel(appt._id)}
                          disabled={actionLoading === appt._id}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="modal-overlay" onClick={() => setRescheduleModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reschedule Appointment</h2>
            <div className="form-group">
              <label htmlFor="reschedule-date">New Date</label>
              <input
                type="date"
                id="reschedule-date"
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reschedule-time">New Time Slot</label>
              <select
                id="reschedule-time"
                className="form-control"
                value={rescheduleData.timeSlot}
                onChange={(e) => setRescheduleData({ ...rescheduleData, timeSlot: e.target.value })}
              >
                <option value="">Select time...</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setRescheduleModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleReschedule}>Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
