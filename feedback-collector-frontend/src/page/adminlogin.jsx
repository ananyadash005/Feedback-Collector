import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminlogin.css";
import { adminAPI, tokenAPI } from "../services/api";

/**
 * Admin Login Page
 * Authenticates with backend and stores JWT token
 */

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const hasToken = tokenAPI.isAuthenticated();
    
    if (isLoggedIn && hasToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await adminAPI.loginAdmin(email, password);

      if (response.success) {
        // Store JWT token
        tokenAPI.setToken(response.data.token);
        
        // Set admin login flag
        localStorage.setItem("isAdminLoggedIn", "true");

        // Redirect to admin dashboard
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Admin Email</label>
          <input
            type="email"
            placeholder="admin@feedback.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="helper-text">
          New admin? <Link to="/admin/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
