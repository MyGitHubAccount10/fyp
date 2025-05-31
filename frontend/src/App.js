import React from 'react';
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

import AdminLayout from './AdminLayout';
import ManageProductsPage from './ManageProductsPage';
import AdminDashboard from './AdminDashboard';
import AddProductPage from './AddProductPage';
import AllOrdersPage from './AllOrdersPage';
import OrderDetailsPage from './OrderDetailsPage';
import './AdminStyles.css';

import './index.css';

function App() {
  //   // Example of simple conditional rendering (replace with react-router-dom in a real app)
  // const isAdminRoute = true; // Assume we are on an admin route for this example
  // const currentPage = isAdminRoute ? 'dashboard' : 'site'; // 'dashboard' or 'products'
  return (
    <div className="App">
      {/* NOTE FROM RALPH: I commented out the admin pages because I wanted to test the user pages and the admin sidebar and navbar overlaps litterally every single page and is fixed in place, not moving along with the pages */}

      {/* <AdminLayout pageTitle="Admin Dashboard"> */}
        {/* <AdminDashboard />
        <AddProductPage />
        <AllOrdersPage />
        <OrderDetailsPage /> */}
        {/* AddProductPage can be conditionally rendered based on the route */}
      {/* </AdminLayout> */}


      <SignUpPage />
      <LoginPage />
      <HomePage />
      <ProductDetailPage />
      <ShoppingCartPage />
      <PlaceOrderPage />
      <OrderHistoryPage />
      <UserProfilePage />
      <AboutPage />
      <ContactPage />
      <FaqPage />
      {/* <AdminLayout pageTitle="Manage Products"> */}
        {/* <ManageProductsPage /> */}
      {/* </AdminLayout> */}
    </div>
  );
}

export default App;