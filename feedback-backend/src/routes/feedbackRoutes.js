const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedbacks,
  getFeedbackById,
  deleteFeedback,
  filterFeedbacks,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public route - submit feedback
router.post('/', submitFeedback);

// Admin routes - protected
router.get('/', protect, getAllFeedbacks);
router.get('/filter', protect, filterFeedbacks);
router.get('/:id', protect, getFeedbackById);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
