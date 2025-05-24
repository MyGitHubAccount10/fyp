import React from 'react';
import ShoppingCartPage from './ShoppingCartPage';
import LoginPage from './LoginPage';
// import './index.css'; // Or your global stylesheet where Inter font might be imported

function App() {
  return (
    <div className="App">
      <LoginPage />
      <ShoppingCartPage />
    </div>
  );
}

export default App;