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
  const [isEditing, setIsEditing] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [editForm, setEditForm] = useState({    full_name: '',
    username: '',
    email: '',
    phone_number: '',
    shipping_address: '',
    role_id: ''});

  // Fetch available roles
  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/role');
      if (response.ok) {
        const rolesData = await response.json();
        setAvailableRoles(rolesData);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Fetch user data function (extracted to be reusable)
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
        // Initialize edit form with user data
      setEditForm({
        full_name: userData.full_name || '',
        username: userData.username || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        shipping_address: userData.shipping_address || '',
        role_id: userData.role_id || ''
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
  // Fetch user data on component mount
  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchRoles();
    }
  }, [userId]);

  const handleBack = () => {
    navigate('/all-customers');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    setEditForm({
      full_name: user.full_name || '',
      username: user.username || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      shipping_address: user.shipping_address || '',
      role_id: user.role_id || ''
    });
  };const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refetch the complete user data after successful update
      await fetchUserData();
      setIsEditing(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
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
      <div className="manage-products-page">        <div className="title-row">
          <h2>User Details</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing ? (
              <button onClick={handleEdit} className="btn-add-new">
                Edit User
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="btn-add-new">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn-add-new" style={{ backgroundColor: '#6c757d' }}>
                  Cancel
                </button>
              </>
            )}
            <button onClick={handleBack} className="btn-add-new">
              <BackIcon size={18} color="white" />
              Back to All Users
            </button>
          </div>
        </div>

        <form className="add-product-form">
          <div className="add-product-form-layout">

            {/* Left Column - User Info */}
            <div className="add-product-main-column">              {/* Card: User Summary */}
              <div className="form-section-card">
                <h3 className="section-card-title">User Summary</h3>
                <p><strong>User ID:</strong> {user._id}</p>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Full Name:</strong> 
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px'
                      }}
                    />
                  ) : (
                    <span style={{ marginLeft: '10px' }}>{user.full_name}</span>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>Username:</strong> 
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px'
                      }}
                    />
                  ) : (
                    <span style={{ marginLeft: '10px' }}>{user.username}</span>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>Email:</strong> 
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px'
                      }}
                    />
                  ) : (
                    <span style={{ marginLeft: '10px' }}>{user.email}</span>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>Phone:</strong> 
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px'
                      }}
                    />
                  ) : (
                    <span style={{ marginLeft: '10px' }}>{user.phone_number}</span>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>Role:</strong> 
                  {isEditing ? (
                    <select
                      value={editForm.role_id}
                      onChange={(e) => handleInputChange('role_id', e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px'
                      }}
                    >
                      <option value="">Select Role</option>
                      {availableRoles.map(role => (
                        <option key={role._id} value={role._id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ marginLeft: '10px' }}>{user.role_name}</span>
                  )}
                </div>
                <p><strong>Status:</strong> <span className={`badge ${user.status === 'banned' ? 'badge-red' : 'badge-green'}`}>{user.status || 'active'}</span></p>
                <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <strong style={{ marginTop: '5px', minWidth: 'fit-content' }}>Shipping Address:</strong> 
                    {isEditing ? (
                      <textarea
                        value={editForm.shipping_address}
                        onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                        style={{
                          padding: '5px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          width: '100%',
                          maxWidth: '300px',
                          minHeight: '60px',
                          resize: 'vertical',
                          flex: 1
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1 }}>{user.shipping_address}</span>
                    )}
                  </div>
                </div>
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
