import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './page/home'
import FeedbackForm from './components/feedbackform'
import AdminLogin from './page/adminlogin'
import AdminRegister from './page/adminregister'
import AdminDashboard from './page/admindashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/feedbackform" element={<FeedbackForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
