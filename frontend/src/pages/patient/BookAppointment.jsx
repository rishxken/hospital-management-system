import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM',
  ];

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { data } = await API.get('/staff/doctors');
        setDoctors(data);
      } catch (err) {
        console.error('Could not load doctors list');
      }
    };
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.doctorId || !formData.date || !formData.timeSlot) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await API.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      setTimeout(() => navigate('/patient/my-appointments'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Schedule a new appointment with a doctor</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doctorId">Select Doctor</label>
            <select
              id="doctorId"
              name="doctorId"
              className="form-control"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} — {doc.specialization || 'General'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                min={today}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeSlot">Time Slot</label>
              <select
                id="timeSlot"
                name="timeSlot"
                className="form-control"
                value={formData.timeSlot}
                onChange={handleChange}
                required
              >
                <option value="">Select time...</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              placeholder="Describe your symptoms or reason for visit"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="book-appointment-submit"
          >
            {loading ? <><span className="spinner"></span> Booking...</> : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
