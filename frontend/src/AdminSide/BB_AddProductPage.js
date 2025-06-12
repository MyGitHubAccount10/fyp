//hold

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader'; 


// Placeholder Icons (reusing from AdminHeader/ManageProducts)
const BackIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


function AddProductPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        productType: 'Select Category', // Assuming 'Select Category' is the default radio option
        price: '',
        stockQuantity: '',
        lowStockThreshold: '',
        images: [], // For file inputs
        status: 'Draft', // Default from screenshot
        visibility: 'Public', // Default from screenshot
        category: '', // For the Organisation section dropdown
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'radio') {
            // Handle radio buttons: set productType based on the selected radio's value
            setFormData(prev => ({
                 ...prev,
                 productType: value,
             }));
        } else if (type === 'file') {
            // Handle file inputs
            setFormData(prev => ({
                ...prev,
                [name]: files, // Store FileList object
            }));
        }
        else {
            // Handle other input types (text, number, select, textarea)
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Product Data:', formData);
        // In a real application, you would send this data to your backend API
        alert('Product saved (demo): Check console for data.');

        // Optional: Reset form after submission
        // setFormData({
        //     name: '', description: '', productType: 'Select Category',
        //     price: '', stockQuantity: '', lowStockThreshold: '', images: [],
        //     status: 'Draft', visibility: 'Public', category: '',
        // });
    };

    const handleBack = () => {
        navigate('/all-orders');
    };

    const handleCancel = () => {
        console.log("Cancelling product creation.");
        // In a real app, potentially show a "discard changes?" modal
        handleBack(); // Go back to the list page
    };


    return (
        <div className="add-product-page"> {/* Page-specific class */}
            <AdminHeader />
        <div className="manage-products-page" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Create a New Product</h2> {/* Title from the image */}
                <button onClick={handleBack} className="btn-add-new">
                    <BackIcon size={18} color="white" />
                    Back to All Products
                </button>
            </div>

            <form onSubmit={handleSubmit} className="add-product-form-layout"> {/* Use form element to wrap inputs */}

                 {/* Left Column: Main Product Details */}
                <div className="add-product-main-column">

                     {/* Card 1: Product Information */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Create a New Product</h3> {/* Title within this card, seems redundant with page title? Replicating screenshot. */}
                        {/* Product Name Input field */}
                        <div className="form-group">
                            <label htmlFor="productName">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Wave Skimboard"
                                required
                            />
                        </div>
                        {/* Product Description Input field */}
                        <div className="form-group">
                            <label htmlFor="productDescription">Description</label>
                            <textarea
                                id="productDescription"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the product..."
                                rows="4" // Adjust rows as needed
                                required
                            ></textarea>
                        </div>
                    </div>

                     {/* Card 2: Product Data */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Product Data</h3>

                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="productPrice">Price</label>
                             <input
                                type="number" // Use type="number" for price/stock
                                id="productPrice"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g., 199.90"
                                step="0.01" // Allow decimal values for price
                                required
                            />
                        </div>
                        {/* Stock/Warehouse Quantity */}
                         <div className="form-group">
                            <label htmlFor="stockQuantity">Stock Quantity</label>
                             <input
                                type="number"
                                id="stockQuantity"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                placeholder="e.g., 50"
                                min="0"
                                required
                            />
                        </div>
                        {/* Low stock threshold */}
                        <div className="form-group">
                            <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
                             <input
                                type="number"
                                id="lowStockThreshold"
                                name="lowStockThreshold"
                                value={formData.lowStockThreshold}
                                onChange={handleChange}
                                placeholder="e.g., 5"
                                min="0"
                            />
                        </div>
                    </div>

                     {/* Card 3: Product Image */}
                     <div className="form-section-card">
                        <h3 className="section-card-title">Product Image</h3>
                         <div className="form-group">
                            <label>Upload Images (select multiple)</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="productImages"
                                    name="images"
                                    multiple // Allow multiple file selection
                                    onChange={handleChange}
                                    className="file-input-hidden" // Hide default input
                                />
                                {/* Custom styled file input button and text */}
                                <label htmlFor="productImages" className="file-input-label">
                                    <span className="file-input-button">Choose Files</span>
                                     <span className="file-input-text">
                                        {formData.images && formData.images.length > 0
                                            ? `${formData.images.length} file(s) selected`
                                            : 'No File Chosen'}
                                    </span>
                                </label>
                                 {/* Display selected file names if needed */}
                                 {/* {formData.images && formData.images.length > 0 && (
                                     <div className="selected-file-names">
                                         {Array.from(formData.images).map((file, index) => (
                                            <span key={file.name}>{file.name}{index < formData.images.length - 1 ? ', ' : ''}</span>
                                         ))}
                                     </div>
                                 )} */}
                            </div>
                            <small className="form-text text-muted">First image selected will be the main display image.</small> {/* Reusing text-muted class */}
                        </div>
                     </div>

                </div> {/* End Left Column */}

                 {/* Right Column: Settings Panel */}
                <div className="add-product-sidebar-panel">

                     {/* Card 4: Category */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Product Category</h3>
                         <div className="form-group">
                            <label htmlFor="productCategory">Category</label>
                            <select
                                id="productCategory"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Category</option> {/* Placeholder option */}
                                <option value="Skimboards">Skimboards</option>
                                <option value="T-Shirts">T-Shirts</option>
                                <option value="Jackets">Jackets</option>
                                <option value="Board Shorts">Board Shorts</option>
                                <option value="Accessories">Accessories</option>
                                {/* Add other categories dynamically */}
                            </select>
                        </div>
                    </div>


                     {/* Card 5: Publish */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Upload Product</h3>
                         {/* Save and Cancel Buttons */}
                        <div className="form-actions-vertical"> {/* Use a vertical layout for buttons */}
                            <button type="submit" className="btn-save-product">
                                 <PencilIcon size={18} color="white" />
                                 Save Product
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
                        </div>
                    </div>


                </div> {/* End Right Column */}

            </form> {/* End Form */}

        </div> // End Page Container

        </div>
    );
}

export default AddProductPage;