const Notification = require('../models/Notification');

const createNotification = async (userId, message, type) => {
  try {
    await Notification.create({ userId, message, type });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = createNotification;
