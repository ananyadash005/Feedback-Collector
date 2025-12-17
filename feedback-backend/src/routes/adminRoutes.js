const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require('../controllers/adminController');
const { getDashboardStats, getProductStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);

// Stats routes
router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/stats/product/:productName', protect, getProductStats);

module.exports = router;
