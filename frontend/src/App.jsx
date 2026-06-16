import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MyProfile from './pages/patient/MyProfile';
import MyReports from './pages/patient/MyReports';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AppointmentList from './pages/doctor/AppointmentList';
import PatientHistory from './pages/doctor/PatientHistory';
import UploadReport from './pages/doctor/UploadReport';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import ManageDoctors from './pages/staff/ManageDoctors';
import AllAppointments from './pages/staff/AllAppointments';
import ManagePatients from './pages/staff/ManagePatients';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import SystemOverview from './pages/admin/SystemOverview';

const Unauthorized = () => (
  <div className="page-content">
    <div className="unauthorized-page">
      <span className="error-icon">🚫</span>
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <a href="/" className="btn btn-primary">Go Back</a>
    </div>
  </div>
);

const HomeRedirect = () => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (role) {
    case 'patient': return <Navigate to="/patient" replace />;
    case 'doctor': return <Navigate to="/doctor" replace />;
    case 'staff': return <Navigate to="/staff" replace />;
    case 'admin': return <Navigate to="/admin" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/book-appointment" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><BookAppointment /></ProtectedRoute>} />
        <Route path="/patient/my-appointments" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><MyAppointments /></ProtectedRoute>} />
        <Route path="/patient/my-profile" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><MyProfile /></ProtectedRoute>} />
        <Route path="/patient/my-reports" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><MyReports /></ProtectedRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><AppointmentList /></ProtectedRoute>} />
        <Route path="/doctor/patient-history" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><PatientHistory /></ProtectedRoute>} />
        <Route path="/doctor/upload-report" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><UploadReport /></ProtectedRoute>} />

        {/* Staff Routes */}
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/manage-doctors" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><ManageDoctors /></ProtectedRoute>} />
        <Route path="/staff/appointments" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><AllAppointments /></ProtectedRoute>} />
        <Route path="/staff/manage-patients" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><ManagePatients /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/system-overview" element={<ProtectedRoute allowedRoles={['admin']}><SystemOverview /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
