// OrderDetailPage.js

import {React, useState, useEffect} from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [modalImage, setModalImage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [order, setOrder] = useState(null);
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
          fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminUser.token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/status`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }),          
          fetch(`${process.env.REACT_APP_API_URL}/api/order-products/by-order/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminUser.token}`,
              'Content-Type': 'application/json'
            }
          }),
          // Fetch custom items for this order
          fetch(`${process.env.REACT_APP_API_URL}/api/customise/by-order/${orderId}`, {
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
      }      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
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
      const errorMessage = error.message.includes('Insufficient stock') 
        ? error.message 
        : 'Failed to update order status. Please try again.';
      setStatusMessage(errorMessage);
      setTimeout(() => setStatusMessage(''), 5000);
      // Reset to previous value
      setSelectedStatus(order?.status_id?.status_name || '');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Image modal functions
  const getProductImages = (product) => {
    const images = [];
    if (product.product_image) images.push(product.product_image);
    if (product.product_image2) images.push(product.product_image2);
    if (product.product_image3) images.push(product.product_image3);
    if (product.product_image4) images.push(product.product_image4);
    if (product.product_image5) images.push(product.product_image5);
    if (product.product_image6) images.push(product.product_image6);
    if (product.product_image7) images.push(product.product_image7);
    if (product.product_image8) images.push(product.product_image8);
    return images;
  };

  const getCustomItemImages = (customItem) => {
    const images = [];
    if (customItem.top_image) images.push({ image: customItem.top_image, label: 'Top' });
    if (customItem.bottom_image) images.push({ image: customItem.bottom_image, label: 'Bottom' });
    return images;
  };

  const openImagePreview = (product, imageIndex = 0) => {
    setCurrentProduct(product);
    setCurrentImageIndex(imageIndex);
    const images = getProductImages(product);
    if (images.length > 0) {
      setModalImage(`${images[imageIndex]}`);
    }
  };

  const goToPreviousImage = () => {
    if (!currentProduct) return;
    
    if (currentProduct.isCustomItem) {
      const images = currentProduct.customImages;
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      setCurrentImageIndex(newIndex);
      setModalImage(`${images[newIndex].image}`);
    } else {
      const images = getProductImages(currentProduct);
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      setCurrentImageIndex(newIndex);
      setModalImage(`${images[newIndex]}`);
    }
  };

  const goToNextImage = () => {
    if (!currentProduct) return;
    
    if (currentProduct.isCustomItem) {
      const images = currentProduct.customImages;
      const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setModalImage(`${images[newIndex].image}`);
    } else {
      const images = getProductImages(currentProduct);
      const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setModalImage(`${images[newIndex]}`);
    }
  };

  const closeModal = () => {
    setModalImage(null);
    setCurrentProduct(null);
    setCurrentImageIndex(0);
  };

  const openCustomImagePreview = (customItem, imageIndex = 0) => {
    const images = getCustomItemImages(customItem);
    if (images.length === 0) return;
    
    // Create a fake product object for custom items with custom image structure
    const fakeProduct = {
      product_name: "Custom Skimboard",
      isCustomItem: true,
      customImages: images,
      product_image: images[imageIndex].image // Set the current image
    };
    
    setCurrentProduct(fakeProduct);
    setCurrentImageIndex(imageIndex);
    setModalImage(`${images[imageIndex].image}`);
  };

  const handleBack = () => {
    navigate('/all-orders', {
      state: {
        returnToPage: location.state?.returnToPage,
        filters: location.state?.filters
      }
    });
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
      case 'Delivered':
        return 'badge badge-green';
      case 'Processing':
      case 'Order Placed':
        return 'badge badge-yellow';
      case 'In Transit':
        return 'badge badge-blue';
      case 'Cancelled':
      case 'Rejected':
      case 'Returned to Sender':
      case 'Attempted Delivery':
        return 'badge badge-red';

      default:
        return 'badge badge-gray';
    }
  };

  // Loading state
  if (loading) {
    return (<>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
      <div className="add-product-page">
      
            <div className="manage-products-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading order details...</h2>
          </div>
        </div>
      </div>
    </>);
  }

  // Error state
  if (error) {
    return (
      <div className="add-product-page">
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
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
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
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
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
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
          <div className="add-product-main-column">
            {/* Card: Order Summary */}
            <div className="form-section-card">
              <h3 className="section-card-title">Order Summary</h3>
              <p><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
              <p><strong>Date Placed:</strong> {new Date(order.order_date || order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Status:</strong> <span className={getStatusBadgeClass(order.status_id?.status_name)}>{order.status_id?.status_name || 'Processing'}</span></p>
            </div>

            {/* Image Modal Preview */}
            {modalImage && currentProduct && (
                // Black Background
                <div className="modal-overlay" 
                        onClick={closeModal} 
                        style={{ position: 'fixed', 
                                 top: 0, 
                                 left: 0, 
                                 width: '100vw', 
                                 height: '100vh', 
                                 backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 justifyContent: 'center', 
                                 zIndex: 1000 }}>
                    {/* The X button */}
                    <button type="button" onClick={closeModal} 
                            style={{ position: 'absolute', 
                                     top: '20px', 
                                     right: '20px', 
                                     background: 'rgba(0, 0, 0, 0.5)', 
                                     border: 'none', 
                                     borderRadius: '50%', 
                                     width: '40px', 
                                     height: '40px', 
                                     display: 'flex', 
                                     alignItems: 'center', 
                                     justifyContent: 'center', 
                                     cursor: 'pointer', 
                                     zIndex: 1001 }}>
                        <IoClose size={28} color='white' />
                    </button>
                    {/* Left and Right Arrow And the name, pic, page num for modal content */}
                    <div style={{ position: 'relative', 
                         borderRadius: '8px',
                         width: '70vw', 
                         height: '70vh', 
                         display: 'flex', 
                         flexDirection: 'column', 
                         alignItems: 'center', 
                         justifyContent: 'center', 
                         padding: '20px', 
                         boxSizing: 'border-box' }}>
                        {((currentProduct.isCustomItem ? currentProduct.customImages.length : getProductImages(currentProduct).length) > 1) && (
                            <>
                                <button type="button" onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1002, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}><FaAngleLeft size={24} color="white" /></button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); goToNextImage(); }} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1002, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}><FaAngleRight size={24} color="white" /></button>
                            </>
                        )}
                        {/* Product Image with Overlaid Name */}
                        <div onClick={(e) => e.stopPropagation()} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: 'fit-content',
                            height: 'fit-content',
                            maxWidth: '90%',
                            maxHeight: '80%',
                            position: 'relative',
                            margin: 'auto'
                        }}>
                            <img
                                src={modalImage}
                                alt={`${currentProduct.product_name} preview ${currentImageIndex + 1}`}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                            />
                            {/* Product Name Overlay - only for regular products */}
                            {!currentProduct.isCustomItem && (
                                <div className="modal-product-name-overlay">
                                    {currentProduct.product_name}
                                </div>
                            )}
                        </div>
                        
                        {/* Custom item label below image */}
                        {currentProduct.isCustomItem && currentProduct.customImages && (
                            <div style={{ 
                                marginTop: '10px', 
                                fontSize: '16px', 
                                fontWeight: 'bold', 
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                {currentProduct.customImages[currentImageIndex]?.label || ''}
                            </div>
                        )}
                        {/* Thumbnail Navigation */}
                        {((currentProduct.isCustomItem ? currentProduct.customImages.length : getProductImages(currentProduct).length) > 1) && (
                            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '8px', marginTop: '15px', alignItems: 'center' }}>
                                {currentProduct.isCustomItem 
                                    ? currentProduct.customImages.map((_, index) => (
                                        <button type="button" key={index} onClick={() => { 
                                            setCurrentImageIndex(index); 
                                            setModalImage(`${currentProduct.customImages[index].image}`); 
                                        }} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: index === currentImageIndex ? '#007bff' : '#ccc', cursor: 'pointer', transition: 'background-color 0.2s' }} />
                                    ))
                                    : getProductImages(currentProduct).map((_, index) => (
                                        <button type="button" key={index} onClick={() => { 
                                            setCurrentImageIndex(index); 
                                            setModalImage(`${getProductImages(currentProduct)[index]}`); 
                                        }} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: index === currentImageIndex ? '#007bff' : '#ccc', cursor: 'pointer', transition: 'background-color 0.2s' }} />
                                    ))
                                }
                                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                                    {currentImageIndex + 1} of {currentProduct.isCustomItem ? currentProduct.customImages.length : getProductImages(currentProduct).length}
                                </span>
                            </div>
                        )}
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
                    }}>
                      {/* Product image */}
                      {item.product_id?.product_image ? (
                        <img
                          src={`${item.product_id.product_image}`}
                          alt={item.product_id?.product_name || 'Product'}
                          onClick={() => openImagePreview(item.product_id, 0)}
                          onError={(e) => {
                            console.log('Image failed to load:', `${item.product_id.product_image}`);
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
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          wordWrap: 'break-word', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.product_id?.product_name || 'Unknown Product'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.order_type} • {item.order_shape} • {item.order_size}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.order_material} • {item.order_thickness}
                        </div>
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
                            src={`${item.top_image}`}
                            alt="Custom Top Design"
                            onClick={() => openCustomImagePreview(item, 0)}
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
                            src={`${item.bottom_image}`}
                            alt="Custom Bottom Design"
                            onClick={() => openCustomImagePreview(item, item.top_image ? 1 : 0)}
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
              </div>
              <hr />
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
            </div>            {/* Card: Customer Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Customer Information</h3>
              <p style={{ wordWrap: 'break-word' }}><strong>Name:</strong> {order.user_id?.full_name || 'Unknown Customer'}</p>
              <p style={{ wordWrap: 'break-word' }}><strong>Username:</strong> {order.user_id?.username || 'N/A'}</p>
              <p style={{ wordWrap: 'break-word' }}><strong>Phone:</strong> {order.user_id?.phone_number || 'N/A'}</p>
              <p style={{ wordWrap: 'break-word' }}><strong>Email:</strong> {order.user_id?.email || 'N/A'}</p>
            </div>

            {/* Card: Shipping Info */}
            <div className="form-section-card">
              <h3 className="section-card-title">Shipping Information</h3>
              <p style={{ wordWrap: 'break-word', lineHeight: '1.5' }}><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
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
