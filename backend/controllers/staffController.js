const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors
// @route   GET /api/staff/doctors
// @access  All authenticated
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor', isActive: true }).select('-password');
  res.json(doctors);
});

// @desc    Add a doctor
// @route   POST /api/staff/doctors
// @access  Staff, Admin
const addDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, specialization } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const doctor = await User.create({
    name,
    email,
    password,
    role: 'doctor',
    specialization: specialization || null,
  });

  res.status(201).json(doctor);
});

// @desc    Remove a doctor
// @route   DELETE /api/staff/doctors/:id
// @access  Staff, Admin
const removeDoctor = asyncHandler(async (req, res) => {
  const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  await User.findByIdAndDelete(doctor._id);
  res.json({ message: 'Doctor removed successfully' });
});

// @desc    Get all appointments (staff view)
// @route   GET /api/staff/appointments
// @access  Staff, Admin
const getStaffAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization')
    .sort({ date: -1 });

  res.json(appointments);
});

// @desc    Get all patients (staff view)
// @route   GET /api/staff/patients
// @access  Staff, Admin
const getStaffPatients = asyncHandler(async (req, res) => {
  const patients = await User.find({ role: 'patient' }).select('-password');

  // Attach profiles
  const patientIds = patients.map((p) => p._id);
  const profiles = await PatientProfile.find({ userId: { $in: patientIds } });

  const patientsWithProfiles = patients.map((patient) => {
    const profile = profiles.find(
      (p) => p.userId.toString() === patient._id.toString()
    );
    return {
      ...patient.toObject(),
      profile: profile || null,
    };
  });

  res.json(patientsWithProfiles);
});

module.exports = {
  getDoctors,
  addDoctor,
  removeDoctor,
  getStaffAppointments,
  getStaffPatients,
};
