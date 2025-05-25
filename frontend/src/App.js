import React from 'react';
import ShoppingCartPage from './ShoppingCartPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
import UserProfilePage from './UserProfilePage';
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
    </div>
  );
}

export default App;