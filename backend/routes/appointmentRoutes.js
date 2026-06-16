const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  confirmAppointment,
  cancelAppointment,
  getAllAppointments,
  requestReschedule,
  rescheduleAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('patient'), bookAppointment);
router.get('/my', protect, authorizeRoles('patient'), getMyAppointments);
router.get('/doctor', protect, authorizeRoles('doctor'), getDoctorAppointments);
router.get('/all', protect, authorizeRoles('staff'), getAllAppointments);
router.patch('/:id/confirm', protect, authorizeRoles('doctor'), confirmAppointment);
router.patch('/:id/cancel', protect, authorizeRoles('doctor', 'patient'), cancelAppointment);
router.patch('/:id/reschedule-request', protect, authorizeRoles('patient'), requestReschedule);
router.patch('/:id/reschedule', protect, authorizeRoles('doctor'), rescheduleAppointment);

module.exports = router;
