// UserDetailPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user details
        const userResponse = await fetch(`http://localhost:4000/api/user/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        // Fetch role information
        const roleResponse = await fetch(`http://localhost:4000/api/role/${userData.role_id}`);
        let roleName = 'Unknown';
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          roleName = roleData.role_name;
        }
          // Fetch user's orders (this might not work if orders API requires auth)
        // For now, we'll skip orders or implement a separate admin endpoint
        setRecentOrders([]); // Set empty for now
        
        setUser({
          ...userData,
          role_name: roleName
        });
        setNotes(''); // Initialize notes (you might want to store this in user data)
        setError('');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleBack = () => {
    navigate('/all-customers');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    // Here you would typically save the note to your backend
    alert("Note saved (functionality to be implemented in backend)");
  };

  if (loading) {
    return (
      <div className="add-product-page">
        <AdminHeader />
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="add-product-page">
        <AdminHeader />
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            {error || 'User not found'}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleBack} className="btn-add-new">
              <BackIcon size={18} color="white" />
              Back to All Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <AdminHeader />
      <div className="manage-products-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>User Details</h2>
          <button onClick={handleBack} className="btn-add-new">
            <BackIcon size={18} color="white" />
            Back to All Users
          </button>
        </div>

        <form className="add-product-form">
          <div className="add-product-form-layout">

            {/* Left Column - User Info */}
            <div className="add-product-main-column">              {/* Card: User Summary */}
              <div className="form-section-card">
                <h3 className="section-card-title">User Summary</h3>
                <p><strong>User ID:</strong> {user._id}</p>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone_number}</p>
                <p><strong>Role:</strong> {user.role_name}</p>
                <p><strong>Status:</strong> <span className={`badge ${user.status === 'banned' ? 'badge-red' : 'badge-green'}`}>{user.status || 'active'}</span></p>
                <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p><strong>Shipping Address:</strong> {user.shipping_address}</p>
              </div>

              {/* Card: Recent Orders */}
              <div className="form-section-card">
                <h3 className="section-card-title">Recent Orders</h3>
                {recentOrders.length > 0 ? (
                  <ul style={{ paddingLeft: '18px' }}>
                    {recentOrders.map((order, index) => (
                      <li key={index}>
                        <strong>{order._id}</strong> – {new Date(order.createdAt).toLocaleDateString()} – ${order.total_amount?.toFixed(2) || 'N/A'} – <span className="badge badge-gray">{order.status || 'Pending'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent orders found.</p>
                )}
              </div>

            </div>

            {/* Right Column - Other Info */}
            <div className="add-product-sidebar-panel">              {/* Card: Notes */}
              <div className="form-section-card">
                <h3 className="section-card-title">Internal Note</h3>
                <textarea
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write a private note for internal use..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}                />
                <button
                  className="btn-add-new"
                  style={{ marginTop: '8px' }}
                  onClick={handleSaveNote}
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
