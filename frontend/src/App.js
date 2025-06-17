// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartContextProvider } from './context/CartContext';
import { AuthContextProvider } from './context/AuthContext';

import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FaqPage from './FaqPage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';
import ProductDetailPage from './ProductDetailPage';
import ShoppingCartPage from './ShoppingCartPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
import PageNotFound from './PageNotFound';

import CategoryPage from './CategoryPage';

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
import AddAdminPage from './AdminSide/DD_AddAdminPage';
// +++ IMPORT THE NEW ADMIN LOGIN PAGE +++
import AdminLoginPage from './AdminSide/AdminLoginPage';

import './index.css';

function App() {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />

          <Route path="products">
            <Route path='skimboards' element={<CategoryPage categoryName="Skimboards" />} />
            <Route path="t-shirts" element={<CategoryPage categoryName="T-Shirts" />} />
            <Route path="jackets" element={<CategoryPage categoryName="Jackets" />} />
            <Route path="boardshorts" element={<CategoryPage categoryName="Board Shorts" />} />
            <Route path="accessories" element={<CategoryPage categoryName="Accessories" />} />
          </Route>

          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="cart" element={<ShoppingCartPage />} />
          <Route path="place-order" element={<PlaceOrderPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />

          {/* Admin Routes */}
          {/* +++ ADD THE NEW ROUTE FOR THE ADMIN LOGIN PAGE +++ */}
          <Route path="admin-login" element={<AdminLoginPage />} />
          
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

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;