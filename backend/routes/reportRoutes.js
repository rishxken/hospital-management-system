const express = require('express');
const router = express.Router();
const {
  uploadReport,
  getMyReports,
  getPatientReports,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/upload', protect, authorizeRoles('doctor'), upload.single('file'), uploadReport);
router.get('/my', protect, authorizeRoles('patient'), getMyReports);
router.get('/:patientId', protect, authorizeRoles('doctor'), getPatientReports);

module.exports = router;
