import React from 'react';
import { Routes, Route } from 'react-router-dom';

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

import AdminDashboard from './AdminDashboard';
import ManageProductsPage from './ManageProductsPage';
import AddProductPage from './AddProductPage';
import AllOrdersPage from './AllOrdersPage';
import OrderDetailsPage from './OrderDetailsPage';
import CustomerDetailsPage from './CustomerDetailsPage';
import AdminSettingsPage from './AdminSettingsPage';


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
        <Route path="products">
          <Route path='skimboards' element={<SkimboardsPage />} />
          <Route path="t-shirts" element={<ShirtsPage />} />
          <Route path="jackets" element={<JacketPage />} />
          <Route path="boardshorts" element={<BoardShortsPage />} />
          <Route path="accessories" element={<AccessoriesPage />} />
        </Route>
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