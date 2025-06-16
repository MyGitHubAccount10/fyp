// UserDetailPage.js

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

function UserDetailPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/all-customers');
  };

  // Dummy user data (replace with real data)
  const user = {
    id: 'U00123',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+65 9876 5432',
    createdAt: 'March 2, 2024',
    status: 'Active',
    address: '456 Marina Bay Sands, Tower 2, Singapore 018956',
    recentOrders: [
      { id: 'ORD123', date: 'June 1, 2025', total: '$89.90', status: 'Delivered' },
      { id: 'ORD124', date: 'May 18, 2025', total: '$129.50', status: 'Shipped' },
    ],
    notes: 'Frequent buyer. Eligible for loyalty rewards.'
  };

  return (
    <div className="add-product-page">
      <AdminHeader />
      <div className="manage-products-page" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Adding Admin Details</h2>
          <button onClick={handleBack} className="btn-add-new">
            <BackIcon size={18} color="white" />
            Back to All Users
          </button>
        </div>

        <form className="add-product-form">
          <div className="add-product-form-layout">

            {/* Left Column - User Info */}
            <div className="add-product-main-column">

              {/* Card: User Summary */}
              <div className="form-section-card">
                <h3 className="section-card-title">User Summary</h3>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Joined:</strong> {user.createdAt}</p>
                <p><strong>Status:</strong> <span className="badge badge-green">{user.status}</span></p>
              </div>

              {/* Card: Recent Orders */}
              <div className="form-section-card">
                <h3 className="section-card-title">Recent Orders</h3>
                <ul style={{ paddingLeft: '18px' }}>
                  {user.recentOrders.map((order, index) => (
                    <li key={index}>
                      <strong>{order.id}</strong> – {order.date} – {order.total} – <span className="badge badge-gray">{order.status}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column - Other Info */}
            <div className="add-product-sidebar-panel">

              {/* Card: Notes */}
              <div className="form-section-card">
                <h3 className="section-card-title">Internal Note</h3>
                <textarea
                  rows="4"
                  defaultValue={user.notes}
                  placeholder="Write a private note for internal use..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
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

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDetailPage;
