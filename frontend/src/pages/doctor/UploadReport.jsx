import { useState, useEffect } from 'react';
import API from '../../api/axios';

const UploadReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: '',
    patientId: '',
    title: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await API.get('/appointments/doctor');
        // Only show confirmed/rescheduled appointments for report upload
        setAppointments(data.filter((a) => ['confirmed', 'rescheduled'].includes(a.status)));
      } catch (err) {
        console.error('Failed to load appointments');
      }
    };
    fetchAppointments();
  }, []);

  const handleAppointmentSelect = (e) => {
    const apptId = e.target.value;
    const appt = appointments.find((a) => a._id === apptId);
    setFormData({
      ...formData,
      appointmentId: apptId,
      patientId: appt?.patientId?._id || '',
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only PDF, JPEG, and PNG files are allowed');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.appointmentId || !formData.title || !file) {
      setError('Please fill in all fields and select a file');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('appointmentId', formData.appointmentId);
      data.append('patientId', formData.patientId);
      data.append('title', formData.title);
      data.append('file', file);

      await API.post('/reports/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Report uploaded successfully!');
      setFormData({ appointmentId: '', patientId: '', title: '' });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Upload Report</h1>
        <p>Upload a diagnostic report for a patient</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="appointment-select">Select Appointment</label>
            <select
              id="appointment-select"
              className="form-control"
              value={formData.appointmentId}
              onChange={handleAppointmentSelect}
              required
            >
              <option value="">Choose an appointment...</option>
              {appointments.map((appt) => (
                <option key={appt._id} value={appt._id}>
                  {appt.patientId?.name} — {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="report-title">Report Title</label>
            <input
              type="text"
              id="report-title"
              className="form-control"
              placeholder="e.g. Blood Test Results, X-Ray Report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload File (PDF, JPEG, PNG)</label>
            <div className="file-upload" onClick={() => document.getElementById('file-input').click()}>
              <input
                type="file"
                id="file-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <span className="upload-icon">📤</span>
              <p>{file ? file.name : 'Click to select a file'}</p>
            </div>
            {file && (
              <div className="file-preview">
                <span>{file.type.includes('pdf') ? '📋' : '🖼️'}</span>
                <span className="file-name">{file.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="upload-report-submit"
          >
            {loading ? <><span className="spinner"></span> Uploading...</> : 'Upload Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadReport;
