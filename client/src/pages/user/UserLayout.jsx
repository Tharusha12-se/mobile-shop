import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const UserLayout = ({ onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={onLogout} userType="user" />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer userType="user" />
    </div>
  );
};

export default UserLayout;