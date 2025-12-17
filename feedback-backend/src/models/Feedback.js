const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    product: {
      type: String,
      required: [true, 'Product is required'],
      enum: [
        'Microsoft Word',
        'Microsoft Excel',
        'Microsoft PowerPoint',
        'Microsoft Teams',
        'Microsoft OneDrive',
        'Microsoft Azure',
      ],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [5, 'Message must be at least 5 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for preventing duplicate feedback for same email + product
feedbackSchema.index({ email: 1, product: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
