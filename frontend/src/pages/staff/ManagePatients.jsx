import { useState, useEffect } from 'react';
import API from '../../api/axios';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await API.get('/staff/patients');
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><span className="spinner"></span> Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Manage Patients</h1>
        <p>View all patient records</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search patients by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No patients found</td></tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.profile?.age || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{patient.profile?.gender || '—'}</td>
                  <td>{patient.profile?.bloodGroup || '—'}</td>
                  <td>{patient.profile?.phone || '—'}</td>
                  <td>
                    <span className={`status-badge ${patient.isActive ? 'status-active' : 'status-inactive'}`}>
                      {patient.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePatients;
