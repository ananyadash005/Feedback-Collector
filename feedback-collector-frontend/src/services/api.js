const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Feedback API endpoints
export const feedbackAPI = {
  // Submit feedback (public)
  submitFeedback: (feedbackData) =>
    apiCall('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    }),

  // Get all feedbacks (admin only)
  getAllFeedbacks: () =>
    apiCall('/feedback', {
      method: 'GET',
    }),

  // Get feedback by ID (admin only)
  getFeedbackById: (id) =>
    apiCall(`/feedback/${id}`, {
      method: 'GET',
    }),

  // Delete feedback (admin only)
  deleteFeedback: (id) =>
    apiCall(`/feedback/${id}`, {
      method: 'DELETE',
    }),

  // Filter feedbacks (admin only)
  filterFeedbacks: (filters) => {
    const params = new URLSearchParams();
    if (filters.product) params.append('product', filters.product);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.keyword) params.append('keyword', filters.keyword);

    return apiCall(`/feedback/filter?${params.toString()}`, {
      method: 'GET',
    });
  },
};

// Admin API endpoints
export const adminAPI = {
  // Register admin (setup only)
  registerAdmin: (adminData) =>
    apiCall('/admin/register', {
      method: 'POST',
      body: JSON.stringify(adminData),
    }),

  // Login admin
  loginAdmin: (email, password) =>
    apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Get admin profile
  getProfile: () =>
    apiCall('/admin/profile', {
      method: 'GET',
    }),

  // Get dashboard stats
  getDashboardStats: () =>
    apiCall('/admin/stats/dashboard', {
      method: 'GET',
    }),

  // Get product stats
  getProductStats: (productName) =>
    apiCall(`/admin/stats/product/${productName}`, {
      method: 'GET',
    }),
};

// Token management
export const tokenAPI = {
  setToken: (token) => {
    localStorage.setItem('adminToken', token);
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  removeToken: () => {
    localStorage.removeItem('adminToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
};
