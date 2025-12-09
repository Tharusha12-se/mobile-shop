import React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import Products from './Products';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import Categories from './Categories';
import Profile from './Profile';

const UserRoutes = () => {
  return (
    <>
      <Route path="home" element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="categories" element={<Categories />} />
      <Route path="profile" element={<Profile />} />
    </>
  );
};

export default UserRoutes;