import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminregister.css";
import { adminAPI, tokenAPI } from "../services/api";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const hasToken = tokenAPI.isAuthenticated();

    if (isLoggedIn && hasToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await adminAPI.registerAdmin({ name, email, password });

      if (response.success) {
        tokenAPI.setToken(response.data.token);
        localStorage.setItem("isAdminLoggedIn", "true");
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <form className="admin-register-form" onSubmit={handleRegister}>
        <h2>Create Admin Account</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

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

        <div className="form-row">
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="helper-text">
          Already registered? <Link to="/admin/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
