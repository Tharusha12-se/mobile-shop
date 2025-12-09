import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/common/Header';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={onLogout} userType="admin" />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;