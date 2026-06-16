const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const Appointment = require('../models/Appointment');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Create a user (including admin)
// @route   POST /api/admin/users
// @access  Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, specialization } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const userData = { name, email, password, role };
  if (role === 'doctor' && specialization) {
    userData.specialization = specialization;
  }

  const user = await User.create(userData);

  // If patient, create empty profile
  if (role === 'patient') {
    await PatientProfile.create({ userId: user._id });
  }

  res.status(201).json(user);
});

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle
// @access  Admin
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deactivating themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user,
  });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  // Clean up patient profile if applicable
  if (user.role === 'patient') {
    await PatientProfile.findOneAndDelete({ userId: user._id });
  }

  await User.findByIdAndDelete(user._id);

  res.json({ message: 'User deleted successfully' });
});

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalPatients, totalDoctors, totalStaff, totalAdmins] = await Promise.all([
    User.countDocuments({ role: 'patient' }),
    User.countDocuments({ role: 'doctor' }),
    User.countDocuments({ role: 'staff' }),
    User.countDocuments({ role: 'admin' }),
  ]);

  const [pending, confirmed, cancelled, rescheduleRequested, rescheduled] = await Promise.all([
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Appointment.countDocuments({ status: 'reschedule_requested' }),
    Appointment.countDocuments({ status: 'rescheduled' }),
  ]);

  res.json({
    users: {
      total: totalPatients + totalDoctors + totalStaff + totalAdmins,
      patients: totalPatients,
      doctors: totalDoctors,
      staff: totalStaff,
      admins: totalAdmins,
    },
    appointments: {
      total: pending + confirmed + cancelled + rescheduleRequested + rescheduled,
      pending,
      confirmed,
      cancelled,
      rescheduleRequested,
      rescheduled,
    },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  toggleUserActive,
  deleteUser,
  getStats,
};
