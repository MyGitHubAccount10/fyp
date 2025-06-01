import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ShoppingCartPage from './ShoppingCartPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
import UserProfilePage from './UserProfilePage';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FaqPage from './FaqPage';
import ProductDetailPage from './ProductDetailPage';


import ManageProductsPage from './ManageProductsPage';
import AdminDashboard from './AdminDashboard';
import AddProductPage from './AddProductPage';
import AllOrdersPage from './AllOrdersPage';
import OrderDetailsPage from './OrderDetailsPage';
import AdminSettingsPage from './AdminSettingsPage';
// <<<<<<< HEAD
import CustomerDetailsPage from './CustomerDetailsPage';
import './AdminStyles.css'; // Ensure admin styles are imported
// =======
// import './AdminStyles.css';
// >>>>>>> d58112eb88cb039475a106e4920ba2374c6cebe0

import './index.css';

function App() {
  //   // Example of simple conditional rendering (replace with react-router-dom in a real app)
  // const isAdminRoute = true; // Assume we are on an admin route for this example
  // const currentPage = isAdminRoute ? 'dashboard' : 'site'; // 'dashboard' or 'products'
  return (
    <>
      {/* Please use the respective paths for testing and add new path when necessary. */}
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={<UserProfilePage />} />        
        <Route path="product-detail" element={<ProductDetailPage />} />
        <Route path="cart" element={<ShoppingCartPage />} />
        <Route path="place-order" element={<PlaceOrderPage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />

        {/* Admin Routes */}
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="manage-products" element={<ManageProductsPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="all-orders" element={<AllOrdersPage />} />
        <Route path="order-details" element={<OrderDetailsPage />} />
        <Route path="customer-details" element={<CustomerDetailsPage />} />
        <Route path="admin-settings" element={<AdminSettingsPage />} />

      </Routes>
    </>
    
  );
}

export default App;