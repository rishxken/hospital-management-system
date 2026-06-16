import { useState, useEffect } from 'react';
import API from '../../api/axios';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/patients/profile');
      setProfile(data);
      setFormData({
        age: data.age || '',
        gender: data.gender || '',
        bloodGroup: data.bloodGroup || '',
        phone: data.phone || '',
        address: data.address || '',
        pastConditions: (data.pastConditions || []).join(', '),
        allergies: (data.allergies || []).join(', '),
      });
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        pastConditions: formData.pastConditions
          ? formData.pastConditions.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        allergies: formData.allergies
          ? formData.allergies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await API.put('/patients/profile', payload);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading profile...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and update your personal health information</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Personal Information</h3>
          {!editing && (
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" className="form-control" value={formData.age} onChange={handleChange} min="0" max="150" />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group</label>
                <select id="bloodGroup" name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select...</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" className="form-control" value={formData.address} onChange={handleChange} placeholder="Your address" />
            </div>
            <div className="form-group">
              <label htmlFor="pastConditions">Past Conditions (comma-separated)</label>
              <input type="text" id="pastConditions" name="pastConditions" className="form-control" value={formData.pastConditions} onChange={handleChange} placeholder="e.g. Diabetes, Hypertension" />
            </div>
            <div className="form-group">
              <label htmlFor="allergies">Allergies (comma-separated)</label>
              <input type="text" id="allergies" name="allergies" className="form-control" value={formData.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Peanuts" />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-grid">
            <div>
              <div className="profile-field"><label>Name</label><p>{profile?.userId?.name || '—'}</p></div>
              <div className="profile-field"><label>Email</label><p>{profile?.userId?.email || '—'}</p></div>
              <div className="profile-field"><label>Age</label><p>{profile?.age || '—'}</p></div>
              <div className="profile-field"><label>Gender</label><p style={{ textTransform: 'capitalize' }}>{profile?.gender || '—'}</p></div>
            </div>
            <div>
              <div className="profile-field"><label>Blood Group</label><p>{profile?.bloodGroup || '—'}</p></div>
              <div className="profile-field"><label>Phone</label><p>{profile?.phone || '—'}</p></div>
              <div className="profile-field"><label>Address</label><p>{profile?.address || '—'}</p></div>
            </div>
            <div>
              <div className="profile-field">
                <label>Past Conditions</label>
                <div className="tags">
                  {profile?.pastConditions?.length > 0
                    ? profile.pastConditions.map((c, i) => <span key={i} className="tag">{c}</span>)
                    : <p>None</p>}
                </div>
              </div>
            </div>
            <div>
              <div className="profile-field">
                <label>Allergies</label>
                <div className="tags">
                  {profile?.allergies?.length > 0
                    ? profile.allergies.map((a, i) => <span key={i} className="tag danger">{a}</span>)
                    : <p>None</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
