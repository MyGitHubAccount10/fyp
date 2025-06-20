// OrderDetailPage.js

import {React, useState} from 'react';
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
  const [modalImage, setModalImage] = useState(null);

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
      { name: 'Wave Skimboard', price: 129.9, quantity: 1, imageUrl: 'https://d3lezz6q2gd25j.cloudfront.net/6dwy4phae1mpytb3n30xvo9fqonq' },
      { name: 'Tropical T Shirt', price: 19.99, quantity: 2, imageUrl: 'https://d3lezz6q2gd25j.cloudfront.net/qy9r377pw26ktvxgm0avwlskao8d' },
      { name: 'Jacket', price: 29.99, quantity: 1, imageUrl: 'https://d3lezz6q2gd25j.cloudfront.net/sg6ic0qzfwlqsmr7pxpwthmd54wr' },
      { name: 'Board Shorts', price: 60.0, quantity: 1, imageUrl: 'https://d3lezz6q2gd25j.cloudfront.net/oy8m7wqde3rehmf7vtr7ezf3jc3s' },
      { name: 'Accessories', price: 20.0, quantity: 1, imageUrl: 'https://d3lezz6q2gd25j.cloudfront.net/jjkr7x3pcz2gs7cnhcrrb1aju6lj' }
    ]
  };

  const calculateSubtotal = () =>
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="add-product-page">
            <AdminHeader />
        <div className="manage-products-page">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Order Details</h2> {/* Title from the image */}
                <button onClick={handleBack} className="btn-add-new">
                    <BackIcon size={18} color="white" />
                    Back to All Orders
                </button>
            </div>

        <form className="add-product-form" >
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

            {/* Image Modal Preview */}
            {modalImage && (
              <div
                className="modal-overlay"
                onClick={() => setModalImage(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}
              >
                {/* Modal Content */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    maxWidth: '25vw',
                    maxHeight: '25vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={modalImage}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Card: Order Items */}
            <div className="form-section-card">
              <h3 className="section-card-title">Items Ordered</h3>
              <div className="order-items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Clickable thumbnail image */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onClick={() => setModalImage(item.imageUrl)}
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      />

                    <div style={{ flex: 1 }}>{item.name}</div>
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

            {/* Card: Fulfillment & Tracking
            <div className="form-section-card">
              <h3 className="section-card-title">Fulfillment & Tracking</h3>
              <p><strong>Tracking Number:</strong> TRKSG123456789</p>
              <p><strong>Courier:</strong> Ninja Van</p>
              <button
                className="btn-add-new"
                style={{ marginTop: '10px' }}
                onClick={() => window.open('https://www.ninjavan.co/en-sg/tracking', '_blank')}
              >
                Track Package
              </button>
            </div> */}


          </div>

        </div>

      </form>

      <form className="add-product-form-layout">
        <div className="add-product-main-column">
          <div className="form-section-card">
            <h3 className="section-card-title">Fulfillment & Tracking</h3>
            <p><strong>Tracking Number:</strong> TRKSG123456789</p>
            <p><strong>Courier:</strong> Ninja Van</p>
            <button
              className="btn-add-new"
              style={{ marginTop: '10px' }}
              onClick={() => window.open('https://www.ninjavan.co/en-sg/tracking', '_blank')}
            >
              Track Package
            </button>
          </div>


          {/* Card: Order Notes & History */}
          <div className="form-section-card">
            <h3 className="section-card-title">Order Notes & History</h3>

            {/* Internal Note */}
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="internalNote" style={{ fontWeight: 'bold' }}>Internal Note:</label>
              <textarea
                id="internalNote"
                rows="3"
                placeholder="Write a private note for internal use..."
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '6px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              ></textarea>
              <button
                className="btn-add-new"
                style={{ marginTop: '8px' }}
                onClick={(e) => {
                  e.preventDefault();
                  alert("Note saved (not really, just a placeholder)");
                }}
              >
                Save Note
              </button>
            </div>

            {/* History log */}
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>Order History:</p>
              <ul style={{ paddingLeft: '18px' }}>
                <li>June 12, 2025 - Status changed to <strong>Shipped</strong></li>
                <li>June 11, 2025 - Tracking number added</li>
                <li>June 10, 2025 - Order placed</li>
              </ul>
            </div>
          </div>





{/* --------------------- */}

        </div>
      </form>
    </div>

  </div>
);

}

export default OrderDetailPage;
