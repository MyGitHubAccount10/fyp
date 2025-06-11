// OrderDetailPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

const BackIcon = ({ color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function OrderDetailPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/all-orders');
  };

  // Dummy order data (replace with real data or props)
  const order = {
    orderId: '123456',
    datePlaced: 'June 10, 2025',
    status: 'Paid',
    customer: {
      name: 'John Doe',
      phone: '+65 1234 5678',
      email: 'john@example.com',
    },
    shipping: {
      address: '123 Orchard Road, #04-05, Singapore 238888',
      method: 'Standard Shipping (3-5 days)',
    },
    payment: {
      method: 'Credit Card (Visa)',
      total: '$189.90',
    },
    items: [
      { name: 'Wave Skimboard', price: 129.9, quantity: 1 },
      { name: 'Board Shorts', price: 60.0, quantity: 1 }
    ]
  };

  const calculateSubtotal = () =>
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="add-product-page">
      <AdminHeader />

      <div style={{ paddingLeft: '100px', paddingRight: '100px' }}>
        <div className='page-header-section'>
          <h2>Order Details</h2>
          <button className="btn-back-to-products" onClick={handleBack}>
            <BackIcon color="#555" />
            Back to Orders
          </button>
        </div>

        <div className="add-product-form-layout">

          {/* Left Column - Order Info */}
          <div className="add-product-main-column">

            {/* Card: Order Summary */}
            <div className="form-section-card">
              <h3 className="section-card-title">Order Summary</h3>
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Date Placed:</strong> {order.datePlaced}</p>
              <p><strong>Status:</strong> <span className="badge badge-green">{order.status}</span></p>
            </div>

            {/* Card: Order Items */}
            <div className="form-section-card">
              <h3 className="section-card-title">Items Ordered</h3>
              <div className="order-items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div>{item.name}</div>
                    <div>{item.quantity} × ${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="order-total-row">
                <strong>Subtotal:</strong>
                <strong>${calculateSubtotal()}</strong>
              </div>
            </div>

          </div>

          {/* Right Column - Customer & Payment */}
          <div className="add-product-sidebar-panel">
            
            {/* Card: Shipping Status */}
            <div className="form-section-card">
              <h3 className="section-card-title">Shipping Status</h3>
                <select
                    className="category-select"
                    style={{
                        flex: '1 1 150px',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #ccc'
                    }}
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                    <option value="Refunded">Refunded</option>
                </select>

            </div>

            {/* Card: Customer Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Customer Information</h3>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
            </div>

            {/* Card: Shipping Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Shipping Information</h3>
              <p><strong>Address:</strong> {order.shipping.address}</p>
              <p><strong>Method:</strong> {order.shipping.method}</p>
            </div>

            {/* Card: Payment Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Payment</h3>
              <p><strong>Method:</strong> {order.payment.method}</p>
              <p><strong>Total:</strong> {order.payment.total}</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
