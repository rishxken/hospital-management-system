const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  toggleUserActive,
  deleteUser,
  getStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:id/toggle', toggleUserActive);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
