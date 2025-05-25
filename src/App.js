import React from 'react';
import ShoppingCartPage from './ShoppingCartPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PlaceOrderPage from './PlaceOrderPage';
import OrderHistoryPage from './OrderHistoryPage';
// import './index.css'; // Or your global stylesheet where Inter font might be imported

function App() {
  return (
    <div className="App">
      <SignUpPage />
      <LoginPage />
      <ShoppingCartPage />
      <PlaceOrderPage />
      <OrderHistoryPage />
    </div>
  );
}

export default App;