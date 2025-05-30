import React from 'react';
import ShoppingCartPage from './ShoppingCartPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
import UserProfilePage from './UserProfilePage';

import AdminLayout from './AdminLayout';
import ManageProductsPage from './ManageProductsPage';
import AdminDashboard from './AdminDashboard'; // Import the new component
import AddProductPage from './AddProductPage';
import './AdminStyles.css'; // Ensure admin styles are imported

import './index.css';

function App() {
  //   // Example of simple conditional rendering (replace with react-router-dom in a real app)
  // const isAdminRoute = true; // Assume we are on an admin route for this example
  // const currentPage = isAdminRoute ? 'dashboard' : 'site'; // 'dashboard' or 'products'
  return (
    <div className="App">
      <AdminLayout pageTitle="Admin Dashboard">
        <AdminDashboard />
        <AddProductPage />
        {/* AddProductPage can be conditionally rendered based on the route */}
      </AdminLayout>


      <SignUpPage />
      <LoginPage />
      <UserProfilePage />
      <ShoppingCartPage />
      <PlaceOrderPage />
      <OrderHistoryPage />
      <AdminLayout pageTitle="Manage Products">
        <ManageProductsPage />
      </AdminLayout>
    </div>
  );
}

export default App;