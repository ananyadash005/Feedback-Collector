import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";



export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-inner">

        <h1 className="landing-title">Feedback Collector Application</h1>

        <p className="landing-subtitle">
          A simple tool to collect feedback.
          Follow the instructions below before continuing.
        </p>

        <div className="instructions-box">
          <h2> Instructions</h2>
          <ul className="instructions-list">
            <li>Enter your name, email, and feedback message.</li>
            <li>View all feedback entries on the next page.</li>
            <li>Filter feedback using keywords or date range.</li>
            <li>Delete feedback entries with confirmation.</li>
          </ul>
        </div>

        <button
          className="start-btn"
          onClick={() => navigate("/feedbackform")}
        >
          Go to Feedback App →
        </button>

        <footer className="landing-footer">
          {new Date().getFullYear()} © Developed by Ananya
        </footer>
      </div>
    </div>
  );
}
