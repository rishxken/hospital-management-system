const express = require('express');
const router = express.Router();
const {
  addDoctor,
  removeDoctor,
  getStaffAppointments,
  getStaffPatients,
  getDoctors,
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public-ish route for listing doctors (any authenticated user can see doctors)
router.get('/doctors', protect, getDoctors);

// Staff-only routes
router.post('/doctors', protect, authorizeRoles('staff'), addDoctor);
router.delete('/doctors/:id', protect, authorizeRoles('staff'), removeDoctor);
router.get('/appointments', protect, authorizeRoles('staff'), getStaffAppointments);
router.get('/patients', protect, authorizeRoles('staff'), getStaffPatients);

module.exports = router;
