// OrderDetailPage.js

import {React, useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { orderId } = useParams();
  const [modalImage, setModalImage] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Fetch order details and statuses
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Get admin user token
        const adminUser = JSON.parse(localStorage.getItem('admin_user'));
        if (!adminUser || !adminUser.token) {
          throw new Error('No admin user found');
        }        // Fetch order details and statuses in parallel
        const [orderResponse, statusesResponse, orderProductsResponse] = await Promise.all([
          fetch(`http://localhost:4000/api/order/${orderId}`, {
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
          }),          fetch(`http://localhost:4000/api/order-products/by-order/${orderId}`, {
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
        
        // Combine order data with products
        const orderWithProducts = {
          ...orderData,
          order_products: orderProductsData
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
      }

      const response = await fetch(`http://localhost:4000/api/order/${orderId}`, {
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
      }

      // Update local state
      setOrder(prev => ({
        ...prev,
        status_id: selectedStatusObj
      }));
      setSelectedStatus(newStatusName);
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status. Please try again.');
      // Reset to previous value
      setSelectedStatus(order?.status_id?.status_name || '');
    } finally {
      setStatusUpdating(false);
    }
  };
  const handleBack = () => {
    navigate('/all-orders');
  };
  const calculateSubtotal = () => {
    if (!order || !order.order_products) return '0.00';
    return order.order_products.reduce((sum, item) => sum + (parseFloat(item.order_unit_price || 0) * parseInt(item.order_qty || 0)), 0).toFixed(2);
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
    <div className="add-product-page">
            <AdminHeader />
        <div className="manage-products-page">

            <div className="title-row">
                <h2>Order Details</h2> {/* Title from the image */}
                <button onClick={handleBack} className="btn-add-new">
                    <BackIcon size={18} color="white" />
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
            )}            {/* Card: Order Items */}
            <div className="form-section-card">
              <h3 className="section-card-title">Items Ordered</h3>
              <div className="order-items-list">
                {order.order_products && order.order_products.length > 0 ? (
                  order.order_products.map((item, index) => (
                    <div key={index} className="order-item-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Product image */}
                      {item.product_id?.images && item.product_id.images.length > 0 ? (
                        <img
                          src={`http://localhost:4000/images/${item.product_id.images[0]}`}
                          alt={item.product_id?.product_name || 'Product'}
                          onClick={() => setModalImage(`http://localhost:4000/images/${item.product_id.images[0]}`)}
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
                      )}

                      <div style={{ flex: 1 }}>
                        <div>{item.product_id?.product_name || 'Unknown Product'}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Size: {item.order_size}</div>
                      </div>
                      <div>{item.order_qty} × ${parseFloat(item.order_unit_price || 0).toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
              <hr />
              <div className="order-total-row">
                <strong>Subtotal:</strong>
                <strong>${calculateSubtotal()}</strong>
              </div>
              <div className="order-total-row">
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
              <select
                className="category-select"
                value={selectedStatus}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={statusUpdating}
                style={{
                  flex: '1 1 150px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  opacity: statusUpdating ? 0.6 : 1
                }}
              >
                {availableStatuses.map(status => (
                  <option key={status._id} value={status.status_name}>
                    {status.status_name}
                  </option>
                ))}
              </select>
              {statusUpdating && <p style={{ fontSize: '12px', color: '#666' }}>Updating status...</p>}
            </div>            {/* Card: Customer Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Customer Information</h3>
              <p><strong>Name:</strong> {order.user_id ? `${order.user_id.first_name} ${order.user_id.last_name}` : 'Unknown Customer'}</p>
              <p><strong>Phone:</strong> {order.user_id?.phone_number || 'N/A'}</p>
              <p><strong>Email:</strong> {order.user_id?.email || 'N/A'}</p>
            </div>            {/* Card: Shipping Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Shipping Information</h3>
              <p><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
              <p><strong>Method:</strong> Standard Shipping</p>
            </div>

            {/* Card: Payment Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Payment</h3>
              <p><strong>Method:</strong> {order.payment_method || 'N/A'}</p>
              <p><strong>Total:</strong> ${parseFloat(order.total_amount || 0).toFixed(2)}</p>
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
