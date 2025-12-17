import React, { useState, useEffect } from "react";
import "./feedbackform.css";
import { feedbackAPI } from "../services/api";

/**
 * User-side Feedback Form
 * Submits feedback to backend API
 */

const PRODUCTS = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Microsoft Teams",
  "Microsoft OneDrive",
  "Microsoft Azure",
];

export default function FeedbackForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    product: "",
    rating: 0,
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z .]{2,}$/.test(form.name)) {
      newErrors.name =
        "Minimum 2 characters. Only letters, space and dot allowed";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Invalid email format";
    }

    // Product validation
    if (!form.product) {
      newErrors.product = "Please select a product";
    }

    // Rating validation
    if (form.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      const feedbackData = {
        name: form.name.trim(),
        email: form.email.trim(),
        product: form.product,
        rating: form.rating,
        message: form.message.trim() || "No additional message",
      };

      const response = await feedbackAPI.submitFeedback(feedbackData);

      if (response.success) {
        setSuccessMessage("Feedback submitted successfully!");

        // Reset form
        setForm({
          name: "",
          email: "",
          product: "",
          rating: 0,
          message: "",
        });
        setErrors({});

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to submit feedback";
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>User Feedback Form</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {errors.submit && (
        <p className="error-text" style={{ textAlign: "center" }}>
          {errors.submit}
        </p>
      )}

      {/* Name */}
      <div className="form-group">
        <label>
          Name <span>*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          disabled={loading}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>
          Email <span>*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          disabled={loading}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      {/* Product */}
      <div className="form-group">
        <label>
          Select Tools (Microsoft) <span>*</span>
        </label>
        <select
          value={form.product}
          onChange={(e) =>
            setForm({ ...form, product: e.target.value })
          }
          disabled={loading}
        >
          <option value="">-- Select Product --</option>
          {PRODUCTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.product && <p className="error-text">{errors.product}</p>}
      </div>

      {/* Rating */}
      <div className="form-group">
        <label>
          Rating <span>*</span>
        </label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${form.rating >= star ? "active" : ""}`}
              onClick={() => !loading && setForm({ ...form, rating: star })}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              ⭐
            </span>
          ))}
        </div>
        {errors.rating && <p className="error-text">{errors.rating}</p>}
      </div>

      {/* Message - Optional */}
      <div className="form-group">
        <label className="optional-label">
          Message / Suggestion
        </label>
        <textarea
          rows="4"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
          disabled={loading}
          placeholder="Share your thoughts (optional)"
        />
        {errors.message && <p className="error-text">{errors.message}</p>}
      </div>

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
