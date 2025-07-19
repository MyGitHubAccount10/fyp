// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartContextProvider } from './context/CartContext';

// --- Page Imports ---
// User-facing pages
import HomePage from './AAAHomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FaqPage from './FaqPage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import UserProfilePage from './UserProfilePage';
import ProductDetailPage from './ProductDetailPage';
import ShoppingCartPage from './ShoppingCartPage'; // ✅ FIX: Added the missing import
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
import CategoryPage from './CategoryPage';
import SearchPage from './SearchPage';
import CategoriesPage from './AACategoriesPage';
import PopularProductsPage from './AAPopularProductsPage';
import Customerise from './CustomisePage';
import PageNotFound from './PageNotFound';

// Admin-facing pages
import AdminLoginPage from './AdminSide/Z_AdminLoginPage';
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
import AdminSalesReportsPage from './AdminSide/SalesReportPage';
import CustomiseImagePage from './CustomiseImagePage';

// Promo management pages
import AllPromosPage from './AdminSide/E_AllPromosPage';
import AddPromoPage from './AdminSide/EE_AddPromoPage';
import EditPromoPage from './AdminSide/EEE_EditPromoPage';

import AdminProtectedRoute from './AdminProtectedRoute';

import './index.css';

function App() {
  return (
    <CartContextProvider>
      <Routes>
        {/* --- User Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />

        {/* New routes for category selection */}
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="popular-products" element={<PopularProductsPage />} />

        <Route path="products">
          <Route path='skimboards' element={<CategoryPage categoryName="Skimboards" />} />
          <Route path="t-shirts" element={<CategoryPage categoryName="T-Shirts" />} />
          <Route path="jackets" element={<CategoryPage categoryName="Jackets" />} />
          <Route path="boardshorts" element={<CategoryPage categoryName="Board Shorts" />} />
          <Route path="accessories" element={<CategoryPage categoryName="Accessories" />} />
        </Route>

        <Route path="product/:productId" element={<ProductDetailPage />} /> {/* ✅ FIX: Re-added this route */}
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="cart" element={<ShoppingCartPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="customise" element={<Customerise />} />
        <Route path="place-order" element={<PlaceOrderPage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />

        {/* --- Admin Routes --- */}
        <Route path="admin-login" element={<AdminLoginPage />} />
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
        <Route path="manage-promos" element={<AdminProtectedRoute><AllPromosPage /></AdminProtectedRoute>} />
        <Route path="add-promo" element={<AdminProtectedRoute><AddPromoPage /></AdminProtectedRoute>} />
        <Route path="edit-promo/:id" element={<AdminProtectedRoute><EditPromoPage /></AdminProtectedRoute>} />
        <Route path="customise-image" element={<CustomiseImagePage />} />

        {/* --- Catch-all 404 Route --- */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </CartContextProvider>
  );
}

export default App;