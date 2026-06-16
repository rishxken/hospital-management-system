const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get own notifications
// @route   GET /api/notifications
// @access  All authenticated
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  All authenticated
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();

  res.json(notification);
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  All authenticated
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ message: 'All notifications marked as read' });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
