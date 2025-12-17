import { Navigate } from 'react-router-dom';
import { tokenAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
  const hasToken = tokenAPI.isAuthenticated();

  if (!isLoggedIn || !hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
