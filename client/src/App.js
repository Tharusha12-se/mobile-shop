import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './pages/user/UserLayout';
import AdminLayout from './pages/admin/AdminLayout';
import UserRoutes from './pages/user/UserRoutes';
import AdminRoutes from './pages/admin/AdminRoutes';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <Login onLogin={handleLogin} />
        } />
        
        <Route path="/user/*" element={
          isAuthenticated && userRole === 'user' ? 
          <UserLayout onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        }>
          {UserRoutes()}
        </Route>
        
        <Route path="/admin/*" element={
          isAuthenticated && userRole === 'admin' ? 
          <AdminLayout onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        }>
          {AdminRoutes()}
        </Route>
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;