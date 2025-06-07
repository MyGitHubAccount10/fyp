import React, { useState, useEffect } from 'react';
// AdminStyles.css is imported in AdminLayout.js and/or App.js, so no need to import here
// import './AdminStyles.css';

// Placeholder Icons
const BackIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
// Removed TruckIcon and specific CheckCircleIcon instances used previously for "Ship Order" etc.
// Reusing CheckCircleIcon for the general "Update Status" button
const CheckCircleIcon = ({ color = "currentColor", size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M22 11.08V12C21.4826 13.0053 20.8018 13.9424 19.9893 14.7549C19.1768 15.5674 18.2397 16.2482 17.2344 16.7656C16.2291 17.283 15.1652 17.6227 14.0759 17.7785C12.9866 17.9343 11.8814 17.9051 10.8001 17.6936C9.71877 17.4821 8.68465 17.0911 7.75764 16.5352C6.83063 15.9794 6.02532 15.2678 5.38696 14.4418C4.7486 13.6159 4.28824 12.6872 4.03539 11.7079C3.78254 10.7285 3.73932 9.71538 3.90829 8.72655C4.07726 7.73772 4.45368 6.79524 5.01003 5.96519C5.56638 5.13514 6.30019 4.43561 7.16315 3.92027M22 4L12 14.01L9 11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const PrinterIcon = ({ color = "currentColor", size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M6 9V2H18V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10H20C20.5304 10 21.0391 10.2107 21.4142 10.5858C21.7893 10.9609 22 11.4696 22 12V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="6" y="14" width="12" height="8" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const MailIcon = ({ color = "currentColor", size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 5L12 12L3 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const SaveIcon = ({ color = "currentColor", size = 18 }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H14L21 10V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 3V10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// Dummy Data for a specific order
const dummyOrderDetails = {
    id: 'TSU-1001',
    date: 'October 26, 2023, 02:30 PM',
    orderStatus: 'Processing', // Starting with Processing based on the second screenshot
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (Visa **** 1234)',
    customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
    },
    shippingAddress: {
        name: 'John Doe', // Often recipient name is different
        line1: '123 Bedok Street 43',
        line2: 'Blk 431 #04-104',
        postalCode: 'Bedok 523123', // Example combined format
    },
    shippingMethod: 'Standard Ground',
    billingAddress: '(Same as Shipping)', // Or a separate address object
    items: [
        { id: 101, image: '/images/skimboard.jpg', product: 'Custom Skimboard "The Wave"', sku: 'CUST-SKIM-001', quantity: 1, unitPrice: 150.00, total: 150.00, options: 'Color: Ocean Blue, Size: Large, Grip: Pro' },
        { id: 102, image: '/images/tshirt.png', product: 'This Side Up Classic T-Shirt', sku: 'TSU-TSH-BLKM', quantity: 1, unitPrice: 25.50, total: 25.50, options: 'Color: Black, Size: M' },
        // Add more items if needed
    ],
    summaryTotals: {
        subtotal: 175.50,
        shipping: 10.00,
        tax: 14.04, // Assuming 8% tax on subtotal + shipping? Or just subtotal? Replicating image calculation.
        grandTotal: 175.50, // This grand total looks incorrect based on other totals in the image, replicating image value for layout
    },
    fulfillment: {
        carrier: 'FedEx',
        trackingNumber: '12999AA10123456789', // Example tracking number
    },
    history: [
        { type: 'Shipment created', details: 'Tracking: 12999AA10123456789 (FedEx)', user: 'Admin User', timestamp: 'Oct 26, 2023, 03:00 PM', source: 'Admin User' },
        { type: 'Order status changed', details: 'from Processing to Shipped.', user: 'System', timestamp: 'Oct 26, 2023, 02:55 PM', source: 'System' },
        { type: 'Payment confirmed', details: '', user: 'System', timestamp: 'Oct 26, 2023, 02:31 PM', source: 'System' },
        { type: 'Order placed by customer', details: 'John Doe', user: 'John Doe', timestamp: 'Oct 26, 2023, 02:30 PM', source: 'Customer' },
         // Add more history items
    ]
};

// Possible order statuses for the dropdown
const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];


function OrderDetailsPage() {
    // In a real app, you would get orderId from URL params (e.g., using react-router-dom's useParams)
    // and fetch the order details based on that ID using useEffect.
    const orderId = dummyOrderDetails.id; // Hardcoded for demo

    const [trackingInfo, setTrackingInfo] = useState({
        newTrackingNumber: '',
        carrier: dummyOrderDetails.fulfillment.carrier || '', // Pre-fill if exists
    });
    const [internalNote, setInternalNote] = useState('');

     // State to hold the actual order data fetched from API (using dummy data for now)
     const [orderDetails, setOrderDetails] = useState(dummyOrderDetails);
     // State for the currently selected status in the dropdown
     const [selectedOrderStatus, setSelectedOrderStatus] = useState(dummyOrderDetails.orderStatus);


     // In a real app, fetch data when the component mounts or orderId changes
     useEffect(() => {
         console.log(`Fetching details for Order ID: ${orderId}`);
         // const fetchOrder = async () => {
         //     try {
         //          const response = await api.getOrderDetails(orderId);
         //          setOrderDetails(response.data); // Set state with fetched data
         //          setSelectedOrderStatus(response.data.orderStatus); // Initialize dropdown with fetched status
         //     } catch (error) {
         //          console.error("Failed to fetch order details:", error);
         //          // Handle error, e.g., show error message or redirect
         //     }
         // };
         // fetchOrder();
         console.log("Using dummy order data.");
          // Also initialize selected status if using dummy data
         setSelectedOrderStatus(dummyOrderDetails.orderStatus);

     }, [orderId]); // Re-fetch if orderId changes

    // Handler for Status Dropdown Change
    const handleStatusChange = (e) => {
        setSelectedOrderStatus(e.target.value);
    };

    // Handlers for Top Action Buttons
    const handleUpdateStatus = () => {
        console.log(`Updating Order Status to: ${selectedOrderStatus}`);
        // In a real app, make an API call to update the status
        // Update the orderDetails state with the new status if API call is successful
        // setOrderDetails(prev => ({ ...prev, orderStatus: selectedOrderStatus }));
        alert(`Order status updated to "${selectedOrderStatus}" (demo).`);
    };

    const handlePrintInvoice = () => console.log("Action: Print Invoice clicked");
    const handlePrintPackingSlip = () => console.log("Action: Print Packing Slip clicked");
    const handleResendConfirmation = () => console.log("Action: Resend Confirmation clicked");


    // Handler for Back button
    const handleBackToList = () => {
         console.log("Navigating back to orders list");
         // In a real app, use react-router-dom's navigate function
         // navigate('/admin/orders');
         window.history.back(); // Simple browser back for demo
    };

    // Handlers for Fulfillment section
    const handleTrackingInfoChange = (e) => {
        const { name, value } = e.target;
        setTrackingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateTracking = () => {
        console.log("Updating tracking:", trackingInfo);
        // In a real app, make an API call to update tracking
        alert(`Tracking updated for order ${orderId} (demo).`);
        // Update displayed tracking info if the API call is successful
        // setOrderDetails(prev => ({
        //    ...prev,
        //    fulfillment: { ...prev.fulfillment, carrier: trackingInfo.carrier, trackingNumber: trackingInfo.newTrackingNumber }
        // }));
    };

    // Handlers for Order Notes
    const handleInternalNoteChange = (e) => {
        setInternalNote(e.target.value);
    };

    const handleSaveNote = () => {
        console.log("Saving internal note:", internalNote);
        // In a real app, make an API call to add the note
        alert(`Note saved for order ${orderId} (demo).`);
        // In a real app, you might clear the note input and add the note to the history list
        setInternalNote('');
    };

    // Function to format history entry
    const formatHistoryEntry = (entry) => {
         // Removed bolding from the inner details text as it wasn't consistently bold in the image
         let text = `<strong>${entry.type}:</strong> `;
         if (entry.details) {
            text += entry.details + ' ';
         }
        text += `<br/><em>${entry.source} - ${entry.timestamp}</em>`;
        return <p key={entry.timestamp + entry.type} dangerouslySetInnerHTML={{ __html: text }}></p>; // Using dangerouslySetInnerHTML for bold/italic, be cautious
    };


    return (
        <div className="order-details-page"> {/* Page-specific class */}

             {/* Page Header Section (Title and Back Button) */}
             <div className="page-header-section">
                 {/* Page Title comes from AdminLayout, but replicating screenshot structure with internal title */}
                 {/* This title might be redundant if AdminLayout already provides it */}
                 {/* <h2 className="page-title">Order Details - #{orderId}</h2> */}
                  {/* Add the title here if AdminLayout doesn't provide the specific details format */}
                  <h2 className="page-title">Order Details - #{orderId}</h2>


                 <button onClick={handleBackToList} className="btn-back-to-products"> {/* Reusing class from Add Product Page */}
                     <BackIcon color="#555" />
                     Back to All Orders
                 </button>
            </div>

            {/* Top Action Buttons - UPDATED STRUCTURE */}
            <div className="order-details-actions">
                 {/* Status Dropdown */}
                 <select
                     className="status-dropdown" // Add specific class for styling
                     value={selectedOrderStatus}
                     onChange={handleStatusChange}
                 >
                     {orderStatuses.map(status => (
                         <option key={status} value={status}>{status}</option>
                     ))}
                 </select>

                 {/* Update Status Button */}
                 <button
                     onClick={handleUpdateStatus}
                     className="btn-order-action btn-secondary" // Secondary button style
                     // Disable if the selected status is the same as current
                     disabled={selectedOrderStatus === orderDetails.orderStatus}
                 >
                     <CheckCircleIcon /> Update Status
                 </button>

                 {/* Other Action Buttons */}
                 <button className="btn-order-action btn-secondary" onClick={handlePrintInvoice}><PrinterIcon /> Print Invoice</button> {/* Added Print Invoice */}
                 <button className="btn-order-action btn-secondary" onClick={handlePrintPackingSlip}><PrinterIcon /> Print Packing Slip</button>
                 <button className="btn-order-action btn-secondary" onClick={handleResendConfirmation}><MailIcon /> Resend Confirmation</button>

                 {/* Removed Ship Order and Mark as Paid buttons as they are replaced by the dropdown/update flow */}
            </div>

            {/* --- Main Content Sections Wrapped for Spacing --- */}
            <div className="order-details-content">

                 {/* Summary Section (Two Columns) - Each column is a card */}
                 <div className="summary-layout">
                     {/* Keep form-section-card on each summary column */}
                     <div className="summary-card form-section-card">
                         <h3 className="section-card-title">Order & Customer Summary</h3> {/* Reusing title style */}
                         <div className="summary-info">
                             <p><strong>Order ID:</strong> #{orderDetails.id}</p>
                             <p><strong>Order Date:</strong> {orderDetails.date}</p>
                             {/* Display current order status from state */}
                             <p><strong>Order Status:</strong> {orderDetails.orderStatus}</p>
                             <p><strong>Payment Status:</strong> {orderDetails.paymentStatus}</p> {/* Style this status text? */}
                             <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>

                             <br/> {/* Visual separator */}

                             <p><strong>Customer:</strong> {orderDetails.customer.name}</p>
                             <p><strong>Email:</strong> {orderDetails.customer.email}</p>
                             <p><strong>Phone:</strong> {orderDetails.customer.phone}</p>
                         </div>
                     </div>
                      {/* Keep form-section-card on each summary column */}
                     <div className="summary-card form-section-card">
                         <h3 className="section-card-title">Shipping & Billing</h3> {/* Reusing title style */}
                         <div className="summary-info">
                             <p><strong>Shipping Address:</strong></p>
                             <p>{orderDetails.shippingAddress.name}</p>
                             <p>{orderDetails.shippingAddress.line1}</p>
                             <p>{orderDetails.shippingAddress.line2}</p>
                             <p>{orderDetails.shippingAddress.postalCode}</p>
                             <p><strong>Shipping Method:</strong> {orderDetails.shippingMethod}</p>

                             <br/> {/* Visual separator */}

                              <p><strong>Billing Address:</strong></p>
                              {orderDetails.billingAddress === '(Same as Shipping)' ? (
                                 <p>(Same as Shipping)</p>
                              ) : (
                                 <>
                                    <p>{orderDetails.billingAddress.name}</p>
                                    <p>{orderDetails.billingAddress.line1}</p>
                                    <p>{orderDetails.billingAddress.line2}</p>
                                    <p>{orderDetails.billingAddress.postalCode}</p>
                                 </>
                              )}
                         </div>
                     </div>
                 </div>

                 {/* Items Ordered Section - Apply form-section-card directly */}
                 <div className="items-ordered-section form-section-card">
                     <h3 className="section-card-title">Items Ordered</h3> {/* Reusing title style */}
                     <div className="table-container"> {/* Wrap table for potential overflow */}
                        <table className="items-ordered-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                 {orderDetails.items.map(item => (
                                    <tr key={item.id}>
                                        <td><img src={item.image} alt={item.product} className="item-image" /></td> {/* Add item-image class */}
                                        <td>
                                            {item.product}
                                            {item.options && <div className="item-options">{item.options}</div>} {/* Style item-options */}
                                        </td>
                                         <td>{item.sku}</td>
                                         <td>{item.quantity}</td>
                                         <td>${item.unitPrice.toFixed(2)}</td>
                                         <td>${item.total.toFixed(2)}</td>
                                    </tr>
                                 ))}
                            </tbody>
                        </table>
                     </div>
                      {/* Summary Totals - ADDED STRONG TAGS */}
                     <div className="summary-totals">
                        <p><strong>Subtotal:</strong> <span>${orderDetails.summaryTotals.subtotal.toFixed(2)}</span></p>
                        <p><strong>Shipping:</strong> <span>${orderDetails.summaryTotals.shipping.toFixed(2)}</span></p>
                        <p><strong>Tax (8%):</strong> <span>${orderDetails.summaryTotals.tax.toFixed(2)}</span></p>
                        <p className="grand-total-row"><strong>Grand Total:</strong> <span>${orderDetails.summaryTotals.grandTotal.toFixed(2)}</span></p>
                     </div>
                 </div>

                 {/* Fulfillment & Tracking Section - Apply form-section-card directly */}
                  <div className="fulfillment-section form-section-card">
                     <h3 className="section-card-title">Fulfillment & Tracking</h3> {/* Reusing title style */}
                     <p>Carrier: <strong>{orderDetails.fulfillment.carrier || 'N/A'}</strong></p>
                     <p>Tracking Number: <strong>{orderDetails.fulfillment.trackingNumber || 'N/A'}</strong></p>

                     <div className="form-group fulfillment-form-group"> {/* Use form-group structure */}
                         <label htmlFor="newTrackingNumber" className="sr-only">Add/Update Tracking Number</label> {/* SR-only for accessibility if label isn't visually needed */}
                          <input
                             type="text"
                             id="newTrackingNumber"
                             name="newTrackingNumber"
                             value={trackingInfo.newTrackingNumber}
                             onChange={handleTrackingInfoChange}
                             placeholder="Enter new tracking number"
                             className="fulfillment-input"
                          />
                          {/* Carrier Select (Placeholder - might be needed based on image gap) */}
                          <select name="carrier" value={trackingInfo.carrier} onChange={handleTrackingInfoChange} className="fulfillment-carrier-select">
                              <option value="">Select Carrier</option>
                              <option value="FedEx">FedEx</option>
                              <option value="DHL">DHL</option>
                               {/* Add other carriers */}
                          </select>

                         <button onClick={handleUpdateTracking} className="btn-order-action btn-primary btn-update-tracking">Update Tracking</button> {/* Reusing btn style */}
                     </div>

                 </div>

                 {/* Order Notes & History Section - Apply form-section-card directly */}
                 <div className="notes-history-section form-section-card">
                     <h3 className="section-card-title">Order Notes & History</h3> {/* Reusing title style */}
                     <div className="order-history-list">
                         {/* Map over history items */}
                         {orderDetails.history.map(entry => formatHistoryEntry(entry))}
                     </div>

                  <div className="form-group">
                      <label htmlFor="internalNote">Add Internal Note:</label>
                      <textarea
                          id="internalNote"
                          value={internalNote}
                          onChange={handleInternalNoteChange}
                          placeholder="Type your note here..."
                          rows="3"
                      ></textarea> {/* Reusing textarea style */}
                  </div>
                  <div className="form-actions"> {/* Reusing form-actions style - may need specific vertical styling if buttons stack */}
                     <button onClick={handleSaveNote} className="btn-save-note">Save Note</button> {/* Add new button style */}
                 </div>
             </div>

            </div> {/* --- End Main Content Sections Wrapper --- */}


        </div> // End Page Container
    );
}

export default OrderDetailsPage;