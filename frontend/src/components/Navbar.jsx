import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const getNavLinks = () => {
    switch (role) {
      case 'patient':
        return [
          { to: '/patient', label: 'Dashboard' },
          { to: '/patient/book-appointment', label: 'Book Appointment' },
          { to: '/patient/my-appointments', label: 'My Appointments' },
          { to: '/patient/my-profile', label: 'My Profile' },
          { to: '/patient/my-reports', label: 'My Reports' },
        ];
      case 'doctor':
        return [
          { to: '/doctor', label: 'Dashboard' },
          { to: '/doctor/appointments', label: 'Appointments' },
          { to: '/doctor/patient-history', label: 'Patient History' },
          { to: '/doctor/upload-report', label: 'Upload Report' },
        ];
      case 'staff':
        return [
          { to: '/staff', label: 'Dashboard' },
          { to: '/staff/manage-doctors', label: 'Manage Doctors' },
          { to: '/staff/appointments', label: 'All Appointments' },
          { to: '/staff/manage-patients', label: 'Manage Patients' },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/manage-users', label: 'Manage Users' },
          { to: '/admin/system-overview', label: 'System Overview' },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <Link to={`/${role}`}>
          <span className="brand-icon">HMS</span>
        </Link>
      </div>

      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-actions">
        <NotificationBell />
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className={`role-badge role-${role}`}>{role}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" id="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
