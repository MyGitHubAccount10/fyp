// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartContextProvider } from './context/CartContext';

// --- Page Imports ---
// User-facing pages
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
import CategoryPage from './CategoryPage';
import SearchPage from './SearchPage'; // ✅ 1. Import the new SearchPage component
import Customerise from './CustomisePage'; // Customise page
import PageNotFound from './PageNotFound';

// Admin-facing pages
import AdminLoginPage from './AdminSide/AdminLoginPage';
import AdminDashboard from './AdminSide/A_AdminDashboard';
import AllProductsPage from './AdminSide/B_AllProductsPage';
import AddProductPage from './AdminSide/BB_AddProductPage';
import EditProductPage from './AdminSide/BBB_EditProductPage';
import AllOrdersPage from './AdminSide/C_AllOrdersPage';
import OrderDetailsPage from './AdminSide/CC_OrderDetailsPage';
import AllCustomersPage from './AdminSide/D_AllCustomersPage';
import CustomerDetailsPage from './AdminSide/DDD_CustomerDetailsPage';
import AddAdminPage from './AdminSide/DD_AddAdminPage';
import AdminSettingsPage from './AdminSide/FAdminSettingsPage';
import AdminProfilePage from './AdminSide/G_AdminProfilePage';
import AdminSalesReportsPage from './AdminSide/SalesReportPage'; // If you have a sales reports page

// ✅ 1. Import the new protected route component
import AdminProtectedRoute from './AdminProtectedRoute'; // Make sure this path is correct

import './index.css';

function App() {
  return (
    <CartContextProvider>
      <Routes>
        {/* --- User Routes --- */}
        {/* These routes are accessible to everyone */}
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
        <Route path="search" element={<SearchPage />} /> {/* ✅ 2. Add the route for the search page */}
        <Route path="customise" element={<Customerise />} />
        <Route path="place-order" element={<PlaceOrderPage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />

        {/* --- Admin Routes --- */}
        {/* The admin login page is public, so it is NOT wrapped */}
        <Route path="admin-login" element={<AdminLoginPage />} />

        {/* ✅ 2. Wrap all other admin routes inside the AdminProtectedRoute component. */}
        {/* This acts as a gatekeeper, checking for the correct admin role. */}        
        <Route path="admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="all-products" element={<AdminProtectedRoute><AllProductsPage /></AdminProtectedRoute>} />
        <Route path="add-product" element={<AdminProtectedRoute><AddProductPage /></AdminProtectedRoute>} />
        <Route path="edit-product/:id" element={<AdminProtectedRoute><EditProductPage /></AdminProtectedRoute>} />        
        <Route path="all-orders" element={<AdminProtectedRoute><AllOrdersPage /></AdminProtectedRoute>} />
        <Route path="order-details/:orderId" element={<AdminProtectedRoute><OrderDetailsPage /></AdminProtectedRoute>} />
        <Route path="all-customers" element={<AdminProtectedRoute><AllCustomersPage /></AdminProtectedRoute>} />
        <Route path="customer-details/:userId" element={<AdminProtectedRoute><CustomerDetailsPage /></AdminProtectedRoute>} />
        <Route path="add-admin" element={<AdminProtectedRoute><AddAdminPage /></AdminProtectedRoute>} />
        <Route path="admin-settings" element={<AdminProtectedRoute><AdminSettingsPage /></AdminProtectedRoute>} />
        <Route path="admin-profile" element={<AdminProtectedRoute><AdminProfilePage /></AdminProtectedRoute>} />
        <Route path="sales-report" element={<AdminProtectedRoute><AdminSalesReportsPage /></AdminProtectedRoute>} />

        {/* --- Catch-all 404 Route --- */}
        {/* This should always be the last route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </CartContextProvider>
  );
}

export default App;