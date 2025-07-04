// OrderDetailPage.js

import {React, useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

import { FaAngleLeft } from "react-icons/fa";


function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [modalImage, setModalImage] = useState(null);  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');

  // Fetch order details and statuses
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Get admin user token
        const adminUser = JSON.parse(localStorage.getItem('admin_user'));
        if (!adminUser || !adminUser.token) {
          throw new Error('No admin user found');
        }        // Fetch order details, statuses, regular products, AND custom items
        const [orderResponse, statusesResponse, orderProductsResponse, customItemsResponse] = await Promise.all([
          fetch(`http://localhost:4000/api/orders/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminUser.token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:4000/api/status', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }),          
          fetch(`http://localhost:4000/api/order-products/by-order/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminUser.token}`,
              'Content-Type': 'application/json'
            }
          }),
          // Fetch custom items for this order
          fetch(`http://localhost:4000/api/customise/by-order/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminUser.token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }
        if (!statusesResponse.ok) {
          throw new Error('Failed to fetch statuses');
        }
        
        const orderData = await orderResponse.json();
        const statusData = await statusesResponse.json();
        const orderProductsData = orderProductsResponse.ok ? await orderProductsResponse.json() : [];
        const customItemsData = customItemsResponse.ok ? await customItemsResponse.json() : [];
        
        // Fix: Ensure custom items is always an array
        const customItemsArray = Array.isArray(customItemsData) ? customItemsData : (customItemsData ? [customItemsData] : []);
        
          // Combine order data with both products and custom items
        const orderWithProducts = {
          ...orderData,
          order_products: orderProductsData,
          custom_items: customItemsArray
        };
        
        setOrder(orderWithProducts);
        setAvailableStatuses(statusData);
        setSelectedStatus(orderData.status_id?.status_name || '');
        setError('');
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Handle status update
  const handleStatusUpdate = async (newStatusName) => {
    try {
      setStatusUpdating(true);
      
      // Find the status ID for the selected status name
      const selectedStatusObj = availableStatuses.find(status => status.status_name === newStatusName);
      if (!selectedStatusObj) {
        throw new Error('Invalid status selected');
      }

      // Get admin user token
      const adminUser = JSON.parse(localStorage.getItem('admin_user'));
      if (!adminUser || !adminUser.token) {
        throw new Error('No admin user found');
      }      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status_id: selectedStatusObj._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }      // Update local state
      setOrder(prev => ({
        ...prev,
        status_id: selectedStatusObj
      }));
      setSelectedStatus(newStatusName);
      
      // Show success message
      setStatusMessage('Order status updated successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setStatusMessage('Failed to update order status. Please try again.');
      setTimeout(() => setStatusMessage(''), 5000);
      // Reset to previous value
      setSelectedStatus(order?.status_id?.status_name || '');
    } finally {
      setStatusUpdating(false);
    }
  };
  const handleBack = () => {
    navigate('/all-orders');
  };  const calculateSubtotal = () => {
    if (!order) return '0.00';
    
    let total = 0;
    
    // Add regular products
    if (order.order_products && Array.isArray(order.order_products)) {
      total += order.order_products.reduce((sum, item) => sum + (parseFloat(item.order_unit_price || 0) * parseInt(item.order_qty || 0)), 0);
    }
    
    // Add custom items
    if (order.custom_items && Array.isArray(order.custom_items)) {
      total += order.custom_items.reduce((sum, item) => sum + parseFloat(item.customise_price || 0), 0);
    }
    
    return total.toFixed(2);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Shipped':
      case 'Delivered':
      case 'Completed':
        return 'badge badge-green';
      case 'Processing':
      case 'In Transit':
        return 'badge badge-yellow';
      case 'Cancelled':
        return 'badge badge-red';
      case 'Pending Payment':
      case 'Pending':
        return 'badge badge-blue';
      default:
        return 'badge badge-gray';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="add-product-page">
        <AdminHeader />
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading order details...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="add-product-page">
        <AdminHeader />
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2 style={{ color: 'red' }}>{error}</h2>
            <button onClick={handleBack} className="btn-add-new">Back to All Orders</button>
          </div>
        </div>
      </div>
    );
  }

  // No order found
  if (!order) {
    return (
      <div className="add-product-page">
        <AdminHeader />
        <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Order not found</h2>
            <button onClick={handleBack} className="btn-add-new">Back to All Orders</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
            <AdminHeader />
        <div className="manage-products-page">

            <div className="title-row">
                <h2>Order Details</h2> {/* Title from the image */}
                <button onClick={handleBack} className="add-new-btn">
                    <FaAngleLeft size={18} color="white" />
                    Back to All Orders
                </button>
            </div>

        <form className="add-product-form" >
        <div className="add-product-form-layout">

          {/* Left Column - Order Info */}
          <div className="add-product-main-column">            {/* Card: Order Summary */}
            <div className="form-section-card">
              <h3 className="section-card-title">Order Summary</h3>
              <p><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
              <p><strong>Date Placed:</strong> {new Date(order.order_date || order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Status:</strong> <span className="badge badge-green">{order.status_id?.status_name || 'Processing'}</span></p>
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
                  onClick={(e) => e.stopPropagation()}                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    maxWidth: '20vw',
                    maxHeight: '80vh',
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
                {/* Regular Products */}
                {order.order_products && Array.isArray(order.order_products) && order.order_products.length > 0 && 
                  order.order_products.map((item, index) => (
                    <div key={`product-${index}`} className="order-item-row" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '10px',
                      padding: '8px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}>                      {/* Product image */}
                      {item.product_id?.product_image ? (
                        <img
                          src={`/images/${item.product_id.product_image}`}
                          alt={item.product_id?.product_name || 'Product'}
                          onClick={() => setModalImage(`/images/${item.product_id.product_image}`)}
                          onError={(e) => {
                            console.log('Image failed to load:', `/images/${item.product_id.product_image}`);
                            console.log('Product data:', item.product_id);
                          }}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}>
                          No Image
                        </div>
                      )}<div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          wordWrap: 'break-word', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.product_id?.product_name || 'Unknown Product'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Size: {item.order_size}</div>
                      </div>
                      <div style={{ 
                        flexShrink: 0,
                        marginLeft: '10px',
                        textAlign: 'right',
                        minWidth: 'fit-content'
                      }}>
                        {item.order_qty} × ${parseFloat(item.order_unit_price || 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                }
                
                {/* Custom Items */}
                {order.custom_items && Array.isArray(order.custom_items) && order.custom_items.length > 0 && 
                  order.custom_items.map((item, index) => (
                    <div key={`custom-${index}`} className="order-item-row" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '10px',
                      padding: '8px',
                      backgroundColor: '#fff3cd',
                      borderRadius: '4px',
                      border: '1px solid #ffeaa7'
                    }}>
                      {/* Custom item images */}
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {item.top_image && (
                          <img
                            src={`/images/customise/${item.top_image}`}
                            alt="Custom Top Design"
                            onClick={() => setModalImage(`/images/customise/${item.top_image}`)}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              border: '1px solid #ddd'
                            }}
                          />
                        )}
                        {item.bottom_image && (
                          <img
                            src={`/images/customise/${item.bottom_image}`}
                            alt="Custom Bottom Design"
                            onClick={() => setModalImage(`/images/customise/${item.bottom_image}`)}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              border: '1px solid #ddd'
                            }}
                          />
                        )}
                        {!item.top_image && !item.bottom_image && (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px'
                          }}>
                            Custom
                          </div>
                        )}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          wordWrap: 'break-word', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold'
                        }}>
                          Custom Skimboard
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.board_type} • {item.board_shape} • {item.board_size}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.material} • {item.thickness}
                        </div>
                      </div>
                      
                      <div style={{ 
                        flexShrink: 0,
                        marginLeft: '10px',
                        textAlign: 'right',
                        minWidth: 'fit-content'
                      }}>
                        1 × ${parseFloat(item.customise_price || 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                }
                
                {/* Show "No items" only if both arrays are empty or invalid */}
                {((!order.order_products || !Array.isArray(order.order_products) || order.order_products.length === 0) && 
                  (!order.custom_items || !Array.isArray(order.custom_items) || order.custom_items.length === 0)) && (
                  <p>No items found for this order.</p>
                )}
              </div>              <hr />
              <div className="order-total-row" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '5px 0'
              }}>
                <strong>Subtotal:</strong>
                <strong>${calculateSubtotal()}</strong>
              </div>
              <div className="order-total-row" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '5px 0',
                fontSize: '16px'
              }}>
                <strong>Total:</strong>
                <strong>${parseFloat(order.total_amount || 0).toFixed(2)}</strong>
              </div>
            </div>


          </div>

          {/* Right Column - Customer & Payment */}
          <div className="add-product-sidebar-panel">              
            {/* Card: Shipping Status */}
            <div className="form-section-card">              
              <h3 className="section-card-title">Shipping Status</h3>              
              <div style={{ width: '100%', boxSizing: 'border-box', padding: '0', margin: '0' }}>
                <select
                  className="category-select"
                  value={selectedStatus}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={statusUpdating}
                  style={{
                    width: 'calc(100% - 2px)',
                    maxWidth: 'none',
                    minWidth: '0',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    opacity: statusUpdating ? 0.6 : 1,
                    boxSizing: 'border-box',
                    fontSize: '14px',
                    margin: '0'
                  }}
                >
                  {availableStatuses.map(status => (
                    <option key={status._id} value={status.status_name}>
                      {status.status_name}
                    </option>
                  ))}
                </select>
              </div>
              {statusUpdating && <p style={{ fontSize: '12px', color: '#666' }}>Updating status...</p>}
              {statusMessage && (
                <p style={{ 
                  fontSize: '12px', 
                  color: statusMessage.includes('successfully') ? '#28a745' : '#dc3545',
                  marginTop: '5px'
                }}>
                  {statusMessage}
                </p>
              )}
            </div>            {/* Card: Customer Info */}            <div className="form-section-card">
              <h3 className="section-card-title">Customer Information</h3>
              <p style={{ wordWrap: 'break-word' }}><strong>Name:</strong> {order.user_id?.full_name || 'Unknown Customer'}</p>
              <p style={{ wordWrap: 'break-word' }}><strong>Username:</strong> {order.user_id?.username || 'N/A'}</p>
              <p style={{ wordWrap: 'break-word' }}><strong>Phone:</strong> {order.user_id?.phone_number || 'N/A'}</p>
              <p style={{ wordWrap: 'break-word' }}><strong>Email:</strong> {order.user_id?.email || 'N/A'}</p>
            </div>            {/* Card: Shipping Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Shipping Information</h3>
              <p style={{ wordWrap: 'break-word', lineHeight: '1.5' }}><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
              <p><strong>Method:</strong> Standard Shipping</p>
            </div>{/* Card: Payment Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Payment</h3>
              <p><strong>Method:</strong> {order.payment_method || 'N/A'}</p>
              <p><strong>Total:</strong> ${parseFloat(order.total_amount || 0).toFixed(2)}</p>
            </div>

            {/* Card: Fulfillment & Tracking
            <div className="form-section-card">
              <h3 className="section-card-title">Fulfillment & Tracking</h3>
              <p><strong>Tracking Number:</strong> {order.tracking_number || 'Not assigned yet'}</p>
              <p><strong>Courier:</strong> {order.courier || 'To be determined'}</p>
              {order.tracking_number && (
                <button
                  className="btn-add-new"
                  style={{ marginTop: '10px' }}
                  onClick={() => window.open('https://www.ninjavan.co/en-sg/tracking', '_blank')}
                >
                  Track Package
                </button>
              )}
            </div> */}

          </div>

        </div>

      </form>
    </div>
  </div>
);

}

export default OrderDetailPage;
