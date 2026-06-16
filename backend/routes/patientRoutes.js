const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getPatientHistory,
  getAllPatients,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/profile', protect, authorizeRoles('patient'), getProfile);
router.put('/profile', protect, authorizeRoles('patient'), updateProfile);
router.get('/all', protect, authorizeRoles('staff'), getAllPatients);
router.get('/:id/history', protect, authorizeRoles('doctor'), getPatientHistory);
router.delete('/:id', protect, authorizeRoles('admin'), deletePatient);

module.exports = router;
