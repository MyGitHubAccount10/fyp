import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartContextProvider } from './context/CartContext';
import { AuthContextProvider } from './context/AuthContext';

import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FaqPage from './FaqPage';
import SkimboardsPage from './SkimboardsPage';
import ShirtsPage from './ShirtsPage';
import JacketPage from './JacketPage';
import BoardShortsPage from './BoardShortsPage';
import AccessoriesPage from './AccessoriesPage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';
import ProductDetailPage from './ProductDetailPage';
import ShoppingCartPage from './ShoppingCartPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';

import AdminDashboard from './AdminSide/A_AdminDashboard';
import AllProductsPage from './AdminSide/B_AllProductsPage';
import AddProductPage from './AdminSide/BB_AddProductPage';
import AllOrdersPage from './AdminSide/C_AllOrdersPage';
import OrderDetailsPage from './AdminSide/CC_OrderDetailsPage';
import CustomerDetailsPage from './AdminSide/DDD_CustomerDetailsPage';
import AdminSettingsPage from './AdminSide/FAdminSettingsPage';
import AllCustomersPage from './AdminSide/D_AllCustomersPage';
import AdminProfilePage from './AdminSide/G_AdminProfilePage';
import EditProductPage from './AdminSide/BBB_EditProductPage';
import PageNotFound from './PageNotFound';
import AddAdminPage from './AdminSide/DD_AddAdminPage';
 //


import './index.css';

function App() {  return (
    <AuthContextProvider>
      <CartContextProvider>
        {/* Please use the respective paths for testing and add new path when necessary. */}
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="products">
            <Route path='skimboards' element={<SkimboardsPage />} />
            <Route path="t-shirts" element={<ShirtsPage />} />
            <Route path="jackets" element={<JacketPage />} />
            <Route path="boardshorts" element={<BoardShortsPage />} />
            <Route path="accessories" element={<AccessoriesPage />} />
          </Route>
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="cart" element={<ShoppingCartPage />} />
          <Route path="place-order" element={<PlaceOrderPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />

          {/* Admin Routes */}
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="all-products" element={<AllProductsPage />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="all-orders" element={<AllOrdersPage />} />
          <Route path="order-details" element={<OrderDetailsPage />} />
          <Route path="customer-details" element={<CustomerDetailsPage />} />
          <Route path="admin-settings" element={<AdminSettingsPage />} />
          <Route path="all-customers" element={<AllCustomersPage />} />
          <Route path="admin-profile" element={<AdminProfilePage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="add-admin" element={<AddAdminPage />} />

          {/* Catch-all route for 404 Not Found */}        <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;