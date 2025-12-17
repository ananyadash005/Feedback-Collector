const express = require('express');
const cors = require('cors');
const path = require('path');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Feedback Collector API is running...' });
});

app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../public')));

// All remaining requests return the React app, so it can handle routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
