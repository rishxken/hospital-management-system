const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, specialization } = req.body;

  // Prevent public admin registration
  if (role === 'admin') {
    res.status(403);
    throw new Error('Admin accounts cannot be created via registration');
  }

  // Validate required fields
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create user
  const userData = { name, email, password, role };
  if (role === 'doctor' && specialization) {
    userData.specialization = specialization;
  }

  const user = await User.create(userData);

  // If patient, create empty profile
  if (role === 'patient') {
    await PatientProfile.create({ userId: user._id });
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    specialization: user.specialization,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account has been deactivated. Contact admin.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    specialization: user.specialization,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

module.exports = { register, login, getMe };
