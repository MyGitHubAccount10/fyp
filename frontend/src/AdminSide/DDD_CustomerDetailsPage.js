// UserDetailPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

import { FaAngleLeft } from "react-icons/fa";


function UserDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  
  // Get permission info from navigation state
  const canEdit = location.state?.canEdit ?? true; // Default to true for backward compatibility
  const currentUserRole = location.state?.currentUserRole;
  const targetUserRole = location.state?.targetUserRole;
  const [editForm, setEditForm] = useState({    full_name: '',
    username: '',
    email: '',
    phone_number: '',
    shipping_address: '',
    role_id: ''});  // Fetch user's recent orders
  const fetchUserOrders = async (userId) => {
    try {
      // Get admin user data from localStorage
      const adminUser = JSON.parse(localStorage.getItem('admin_user'));
      const token = adminUser?.token;
      
      if (!token) {
        console.log('No admin token found');
        setRecentOrders([]);
        return;
      }

      // For now, we'll fetch all orders and filter by user ID
      // In a production app, you might want a specific endpoint for admin to get user orders
      const response = await fetch('http://localhost:4000/api/orders/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });      if (response.ok) {
        const allOrders = await response.json();
        // Filter orders for this specific user and get the most recent 5
        // Add null checks to handle orders without populated user_id
        const userOrders = allOrders
          .filter(order => order.user_id && order.user_id._id === userId)
          .slice(0, 5); // Get only the 5 most recent orders
        setRecentOrders(userOrders);
      } else {
        console.log('Could not fetch orders - response status:', response.status);
        setRecentOrders([]);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setRecentOrders([]);
    }
  };

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
        roleName = roleData.role_name;      }
        // Fetch user's orders
        await fetchUserOrders(userId);
        
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
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="add-product-page">
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            {error || 'User not found'}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleBack} className="btn-add-new">
              <FaAngleLeft size={18} color="white" />
              Back to All Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
            <div style={{ position: 'sticky', zIndex: 1000}}>
                <AdminHeader />
            </div>  
      <div className="manage-products-page">        
        <div className="title-row">
          <div>
            <h2>User Details</h2>
            {!canEdit && (
              <p style={{ 
                color: '#856404', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                padding: '8px 12px',
                margin: '10px 0',
                fontSize: '14px'
              }}>
                <strong>Read-Only Access:</strong> You can view this user's information but cannot make changes. 
                Only Super Admins can edit {targetUserRole} users.
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing ? (
              canEdit ? (
                <button onClick={handleEdit} className="add-new-btn">
                  Edit User
                </button>
              ) : (
                <div style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '4px',
                  color: '#6c757d',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  View Only - Edit restricted for {targetUserRole} users
                </div>
              )
            ) : (
              <>
                <button onClick={handleSave} className="add-new-btn">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="add-new-btn" style={{ backgroundColor: '#6c757d' }}>
                  Cancel
                </button>
              </>
            )}
            <button onClick={handleBack} className="add-new-btn">
              <FaAngleLeft size={18} color="white" />
              Back to All Users
            </button>
          </div>
        </div>

{/* ----------------------------------------- */}
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
                      disabled={currentUserRole === 'Admin'} // Disable if current user is Admin
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px',
                        opacity: currentUserRole === 'Admin' ? 0.6 : 1,
                        cursor: currentUserRole === 'Admin' ? 'not-allowed' : 'pointer'
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
                  {isEditing && currentUserRole === 'Admin' && (
                    <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '4px' }}>
                      Only Super Admins can change user roles
                    </div>
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



            </div>

            {/* Right Column - Other Info */}
            <div className="add-product-sidebar-panel">              
              {/* Card: Recent Orders */}
              <div className="form-section-card">
                <h3 className="section-card-title">Recent Orders</h3>                {recentOrders.length > 0 ? (
                  <ul style={{ paddingLeft: '18px' }}>
                    {recentOrders.map((order, index) => (
                      <li key={order._id || index} style={{ marginBottom: '8px' }}>
                        <div>
                          <strong>Order #{order._id?.slice(-8) || 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          Amount: ${order.total_amount?.toFixed(2) || 'N/A'}
                        </div>
                        <div style={{ fontSize: '14px' }}>
                          Status: <span className={`badge ${order.status_id?.status_name === 'Completed' ? 'badge-green' : 'badge-gray'}`}>
                            {order.status_id?.status_name || 'Pending'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent orders found.</p>
                )}
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDetailPage;
