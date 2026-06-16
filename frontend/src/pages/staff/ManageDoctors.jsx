import { useState, useEffect } from 'react';
import API from '../../api/axios';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialization: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDoctors = async () => {
    try {
      const { data } = await API.get('/staff/doctors');
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await API.post('/staff/doctors', formData);
      setSuccess('Doctor added successfully!');
      setFormData({ name: '', email: '', password: '', specialization: '' });
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await API.delete(`/staff/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove doctor');
    }
  };

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Manage Doctors</h1>
        <p>Add, view, and remove doctors from the system</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Doctor'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="doc-name">Full Name</label>
              <input type="text" id="doc-name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="doc-email">Email</label>
              <input type="email" id="doc-email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="doc-password">Password</label>
              <input type="password" id="doc-password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label htmlFor="doc-spec">Specialization</label>
              <input type="text" id="doc-spec" name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} placeholder="e.g. Cardiology" />
            </div>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Doctor'}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>Dr. {doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.specialization || '—'}</td>
                <td>
                  <span className={`status-badge ${doc.isActive ? 'status-active' : 'status-inactive'}`}>
                    {doc.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemove(doc._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDoctors;
