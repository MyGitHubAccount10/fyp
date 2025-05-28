import React from 'react';
import ShoppingCartPage from './ShoppingCartPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
import UserProfilePage from './UserProfilePage';

import AdminLayout from './AdminLayout';
import ManageProductsPage from './ManageProductsPage';
import './index.css';

function App() {
  return (
    <div className="App">
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