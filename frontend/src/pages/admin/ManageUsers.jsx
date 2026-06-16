import { useState, useEffect } from 'react';
import API from '../../api/axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'patient', specialization: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      const payload = { ...formData };
      if (payload.role !== 'doctor') delete payload.specialization;
      await API.post('/admin/users', payload);
      setSuccess('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'patient', specialization: '' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/admin/users/${id}/toggle`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = filter === 'all' ? users : users.filter((u) => u.role === filter);

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>Create, activate/deactivate, and delete users across all roles</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'patient', 'doctor', 'staff', 'admin'].map((role) => (
            <button
              key={role}
              className={`btn btn-sm ${filter === role ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
              {role !== 'all' && ` (${users.filter((u) => u.role === role).length})`}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create User'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user-name">Full Name</label>
              <input type="text" id="user-name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="user-email">Email</label>
              <input type="email" id="user-email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="user-password">Password</label>
              <input type="password" id="user-password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label htmlFor="user-role">Role</label>
              <select id="user-role" name="role" className="form-control" value={formData.role} onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {formData.role === 'doctor' && (
              <div className="form-group">
                <label htmlFor="user-spec">Specialization</label>
                <input type="text" id="user-spec" name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} />
              </div>
            )}
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
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
              <th>Role</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                <td>{user.specialization || '—'}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggle(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
