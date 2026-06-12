const express = require('express');
const {
  getDashboardAnalytics,
  getUsers,
  toggleBlockUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply check to ensure only Admins can access these routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);

module.exports = router;
