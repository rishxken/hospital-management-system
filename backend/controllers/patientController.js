const asyncHandler = require('express-async-handler');
const PatientProfile = require('../models/PatientProfile');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get own patient profile
// @route   GET /api/patients/profile
// @access  Patient
const getProfile = asyncHandler(async (req, res) => {
  const profile = await PatientProfile.findOne({ userId: req.user._id })
    .populate('userId', 'name email');

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile);
});

// @desc    Update own patient profile
// @route   PUT /api/patients/profile
// @access  Patient
const updateProfile = asyncHandler(async (req, res) => {
  const { age, gender, bloodGroup, phone, address, pastConditions, allergies } = req.body;

  const profile = await PatientProfile.findOne({ userId: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  if (age !== undefined) profile.age = age;
  if (gender !== undefined) profile.gender = gender;
  if (bloodGroup !== undefined) profile.bloodGroup = bloodGroup;
  if (phone !== undefined) profile.phone = phone;
  if (address !== undefined) profile.address = address;
  if (pastConditions !== undefined) profile.pastConditions = pastConditions;
  if (allergies !== undefined) profile.allergies = allergies;

  const updated = await profile.save();
  res.json(updated);
});

// @desc    Get patient history (doctor must have appointment with patient)
// @route   GET /api/patients/:id/history
// @access  Doctor, Admin
const getPatientHistory = asyncHandler(async (req, res) => {
  const patientId = req.params.id;

  // Verify patient exists
  const patient = await User.findOne({ _id: patientId, role: 'patient' });
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  // Doctor access guard: check that an appointment exists between this doctor and patient
  if (req.user.role === 'doctor') {
    const hasAppointment = await Appointment.findOne({
      doctorId: req.user._id,
      patientId: patientId,
    });
    if (!hasAppointment) {
      res.status(403);
      throw new Error('You can only view history of patients you have appointments with');
    }
  }

  const profile = await PatientProfile.findOne({ userId: patientId });
  const appointments = await Appointment.find({ patientId })
    .populate('doctorId', 'name specialization')
    .sort({ date: -1 });

  res.json({
    patient: {
      _id: patient._id,
      name: patient.name,
      email: patient.email,
    },
    profile,
    appointments,
  });
});

// @desc    Get all patients
// @route   GET /api/patients/all
// @access  Staff, Admin
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await User.find({ role: 'patient' }).select('-password');
  res.json(patients);
});

// @desc    Delete patient account
// @route   DELETE /api/patients/:id
// @access  Admin
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await User.findOne({ _id: req.params.id, role: 'patient' });

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  // Delete profile and user
  await PatientProfile.findOneAndDelete({ userId: patient._id });
  await User.findByIdAndDelete(patient._id);

  res.json({ message: 'Patient account deleted successfully' });
});

module.exports = {
  getProfile,
  updateProfile,
  getPatientHistory,
  getAllPatients,
  deletePatient,
};
