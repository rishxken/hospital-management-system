const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Patient
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, timeSlot, notes } = req.body;

  if (!doctorId || !date || !timeSlot) {
    res.status(400);
    throw new Error('Please provide doctorId, date, and timeSlot');
  }

  // Verify doctor exists and is active
  const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isActive: true });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found or inactive');
  }

  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId,
    date,
    timeSlot,
    notes: notes || '',
  });

  // Notify doctor
  await createNotification(
    doctorId,
    `New appointment request from ${req.user.name} on ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
    'appointment'
  );

  const populated = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  res.status(201).json(populated);
});

// @desc    Get my appointments (patient)
// @route   GET /api/appointments/my
// @access  Patient
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate('doctorId', 'name email specialization')
    .sort({ date: -1 });

  res.json(appointments);
});

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor
// @access  Doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.user._id })
    .populate('patientId', 'name email')
    .sort({ date: -1 });

  res.json(appointments);
});

// @desc    Confirm appointment
// @route   PATCH /api/appointments/:id/confirm
// @access  Doctor
const confirmAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Only the assigned doctor can confirm (admin bypass handled by role middleware)
  if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only confirm your own appointments');
  }

  appointment.status = 'confirmed';
  await appointment.save();

  // Notify patient
  await createNotification(
    appointment.patientId,
    `Your appointment on ${appointment.date.toLocaleDateString()} at ${appointment.timeSlot} has been confirmed`,
    'appointment'
  );

  const populated = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  res.json(populated);
});

// @desc    Cancel appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Doctor, Patient
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Patients can only cancel their own appointments
  if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only cancel your own appointments');
  }

  // Doctors can only cancel their own appointments
  if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only cancel your own appointments');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  // Notify the other party
  const notifyUserId = req.user.role === 'patient' ? appointment.doctorId : appointment.patientId;
  await createNotification(
    notifyUserId,
    `Appointment on ${appointment.date.toLocaleDateString()} at ${appointment.timeSlot} has been cancelled by ${req.user.name}`,
    'cancellation'
  );

  const populated = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  res.json(populated);
});

// @desc    Get all appointments (hospital-wide)
// @route   GET /api/appointments/all
// @access  Staff, Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization')
    .sort({ date: -1 });

  res.json(appointments);
});

// @desc    Request reschedule
// @route   PATCH /api/appointments/:id/reschedule-request
// @access  Patient
const requestReschedule = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only reschedule your own appointments');
  }

  appointment.status = 'reschedule_requested';
  await appointment.save();

  // Notify doctor
  await createNotification(
    appointment.doctorId,
    `${req.user.name} has requested to reschedule the appointment on ${appointment.date.toLocaleDateString()} at ${appointment.timeSlot}`,
    'appointment'
  );

  const populated = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  res.json(populated);
});

// @desc    Approve reschedule with new slot
// @route   PATCH /api/appointments/:id/reschedule
// @access  Doctor
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    res.status(400);
    throw new Error('Please provide new date and timeSlot');
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only reschedule your own appointments');
  }

  appointment.date = date;
  appointment.timeSlot = timeSlot;
  appointment.status = 'rescheduled';
  await appointment.save();

  // Notify patient
  await createNotification(
    appointment.patientId,
    `Your appointment has been rescheduled to ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
    'appointment'
  );

  const populated = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  res.json(populated);
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  confirmAppointment,
  cancelAppointment,
  getAllAppointments,
  requestReschedule,
  rescheduleAppointment,
};
