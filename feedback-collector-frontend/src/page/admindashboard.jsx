import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./admindashboard.css";
import { feedbackAPI, tokenAPI } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TOOLS = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Microsoft Teams",
  "Microsoft OneDrive",
  "Microsoft Azure",
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTools, setExpandedTools] = useState({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await feedbackAPI.getAllFeedbacks();
        
        if (response.success && response.data) {
          setFeedbacks(response.data);
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError(err.message || "Failed to fetch feedbacks");
        
        if (err.message?.includes('Not authorized') || err.message?.includes('token')) {
          localStorage.removeItem('isAdminLoggedIn');
          tokenAPI.removeToken();
          navigate('/admin/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  // 🔍 Read filters from query params
  const toolParam = searchParams.get("tool");
  const ratingParam = searchParams.get("rating");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  // 🔎 Apply filters
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      if (toolParam && f.product !== toolParam) return false;
      if (ratingParam && f.rating !== Number(ratingParam)) return false;

      if (startDateParam) {
        if (new Date(f.createdAt) < new Date(startDateParam)) return false;
      }
      if (endDateParam) {
        if (new Date(f.createdAt) > new Date(endDateParam)) return false;
      }

      return true;
    });
  }, [feedbacks, toolParam, ratingParam, startDateParam, endDateParam]);

  // 📊 Metrics
  const totalFeedbacks = filteredFeedbacks.length;

  const averageRating =
    totalFeedbacks === 0
      ? 0
      : (
          filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
          totalFeedbacks
        ).toFixed(1);

  // 📊 Tool-wise summary
  const toolSummary = TOOLS.map((tool) => {
    const toolFeedbacks = filteredFeedbacks.filter(
      (f) => f.product === tool
    );

    const avg =
      toolFeedbacks.length === 0
        ? 0
        : (
            toolFeedbacks.reduce((s, f) => s + f.rating, 0) /
            toolFeedbacks.length
          ).toFixed(1);

    return {
      tool,
      count: toolFeedbacks.length,
      avgRating: avg,
    };
  });

  // 📈 Chart.js Data
  const chartData = {
    labels: toolSummary.map((t) => t.tool),
    datasets: [
      {
        label: "Feedback Count",
        data: toolSummary.map((t) => t.count),
        backgroundColor: "#1e40af",
        borderColor: "#1e3a8a",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "#2563eb",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#0f172a',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 12,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#0f172a',
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          padding: 8
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: true,
          drawOnChartArea: true
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#0f172a',
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          padding: 8,
          stepSize: 1
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: true,
          drawOnChartArea: true
        }
      }
    }
  };

  // 🔁 Update query params
  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (!value) delete params[key];
    else params[key] = value;
    setSearchParams(params);
  };

  // 🔽 Toggle details for a tool
  const toggleTool = (toolName) => {
    setExpandedTools((prev) => ({ ...prev, [toolName]: !prev[toolName] }));
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      {/* Loading State */}
      {loading && <p>Loading feedbacks...</p>}

      {/* Error State */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 🔍 Filters */}
      <div className="filters">
        <select onChange={(e) => updateParam("tool", e.target.value)}>
          <option value="">All Tools</option>
          {TOOLS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select onChange={(e) => updateParam("rating", e.target.value)}>
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>

        <input
          type="date"
          onChange={(e) => updateParam("startDate", e.target.value)}
        />
        <input
          type="date"
          onChange={(e) => updateParam("endDate", e.target.value)}
        />
      </div>

      {/* 📊 Metrics */}
      <div className="metrics">
        <div className="metric-card">
          <p>Total Feedbacks</p>
          <h3>{totalFeedbacks}</h3>
        </div>

        <div className="metric-card">
          <p>Average Rating</p>
          <h3>{averageRating}</h3>
        </div>
      </div>

      {/* 📈 Chart */}
      <h3 className="section-title">Feedback Distribution</h3>
      <Bar data={chartData} options={chartOptions} />

      {/* 📋 Tool Summary */}
      <h3 className="section-title">Tool-wise Summary</h3>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Tool</th>
            <th>Feedback Count</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {toolSummary.map((t) => {
            const isOpen = !!expandedTools[t.tool];
            const toolFeedbacks = filteredFeedbacks.filter(
              (f) => f.product === t.tool
            );
            return (
              <React.Fragment key={t.tool}>
                <tr
                  onClick={() => toggleTool(t.tool)}
                  style={{ cursor: "pointer" }}
                  title={isOpen ? "Click to hide details" : "Click to show details"}
                >
                  <td>{t.tool}</td>
                  <td>{t.count}</td>
                  <td>{t.avgRating}</td>
                </tr>
                {isOpen && (
                  <tr className="details-row">
                    <td colSpan={3}>
                      <div style={{ padding: "8px 4px" }}>
                        {toolFeedbacks.length === 0 ? (
                          <p style={{ margin: 0, opacity: 0.8 }}>
                            No feedback available for {t.tool}.
                          </p>
                        ) : (
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              background: "#fff",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <thead>
                              <tr style={{ background: "#f9fafb" }}>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e5e7eb" }}>Name</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e5e7eb" }}>Email</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e5e7eb" }}>Rating</th>
                                <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e5e7eb" }}>Message</th>
                              </tr>
                            </thead>
                            <tbody>
                              {toolFeedbacks.map((f) => (
                                <tr key={f._id}>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>{f.name}</td>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>{f.email}</td>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>{f.rating} ⭐</td>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>{f.message}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
