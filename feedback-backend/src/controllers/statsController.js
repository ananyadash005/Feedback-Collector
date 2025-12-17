const Feedback = require('../models/Feedback');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Total feedbacks
    const totalFeedbacks = await Feedback.countDocuments();

    // Average rating
    const avgRatingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    const averageRating = avgRatingResult.length > 0 
      ? avgRatingResult[0].averageRating.toFixed(2) 
      : 0;

    // Feedbacks by product
    const feedbacksByProduct = await Feedback.aggregate([
      {
        $group: {
          _id: '$product',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Feedbacks by rating
    const feedbacksByRating = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Recent feedbacks (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentFeedbacks = await Feedback.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        totalFeedbacks,
        averageRating,
        recentFeedbacks,
        feedbacksByProduct,
        feedbacksByRating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get product-specific stats
// @route   GET /api/stats/product/:productName
// @access  Private/Admin
const getProductStats = async (req, res) => {
  try {
    const { productName } = req.params;

    const stats = await Feedback.aggregate([
      {
        $match: { product: productName },
      },
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this product',
      });
    }

    res.status(200).json({
      success: true,
      product: productName,
      data: stats[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getProductStats,
};
