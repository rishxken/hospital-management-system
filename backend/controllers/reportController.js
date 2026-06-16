const asyncHandler = require('express-async-handler');
const DiagnosticReport = require('../models/DiagnosticReport');
const Appointment = require('../models/Appointment');
const createNotification = require('../utils/createNotification');

// @desc    Upload a diagnostic report
// @route   POST /api/reports/upload
// @access  Doctor
const uploadReport = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, title } = req.body;

  if (!patientId || !appointmentId || !title) {
    res.status(400);
    throw new Error('Please provide patientId, appointmentId, and title');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Verify appointment belongs to this doctor
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctorId: req.user._id,
    patientId,
  });

  if (!appointment && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Invalid appointment or unauthorized');
  }

  // Determine file type
  const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';

  const report = await DiagnosticReport.create({
    patientId,
    doctorId: req.user._id,
    appointmentId,
    title,
    fileUrl: req.file.path,
    fileType,
  });

  // Notify patient
  await createNotification(
    patientId,
    `A new diagnostic report "${title}" has been uploaded by Dr. ${req.user.name}`,
    'report'
  );

  res.status(201).json(report);
});

// @desc    Get my reports (patient)
// @route   GET /api/reports/my
// @access  Patient
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await DiagnosticReport.find({ patientId: req.user._id })
    .populate('doctorId', 'name specialization')
    .populate('appointmentId', 'date timeSlot')
    .sort({ uploadedAt: -1 });

  res.json(reports);
});

// @desc    Get reports for a specific patient
// @route   GET /api/reports/:patientId
// @access  Doctor, Admin
const getPatientReports = asyncHandler(async (req, res) => {
  const reports = await DiagnosticReport.find({ patientId: req.params.patientId })
    .populate('doctorId', 'name specialization')
    .populate('appointmentId', 'date timeSlot')
    .sort({ uploadedAt: -1 });

  res.json(reports);
});

module.exports = {
  uploadReport,
  getMyReports,
  getPatientReports,
};
