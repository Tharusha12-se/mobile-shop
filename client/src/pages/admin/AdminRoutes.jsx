import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Products from './Products';
import Orders from './Orders';
import Users from './Users';
import Categories from './Categories';

const AdminRoutes = () => {
  return (
    <>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="users" element={<Users />} />
      <Route path="categories" element={<Categories />} />
    </>
  );
};

export default AdminRoutes;