
import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';


// Placeholder Icons (reusing from AdminHeader/ManageProducts)
import { FaAngleLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";



function AddProductPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        lowStockThreshold: '',
        images: [], // For file inputs
        status: 'Draft', // Default from screenshot
        visibility: 'Public', // Default from screenshot
        category: '', // For the Organisation section dropdown
    });    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Fetching categories...');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/category`);
                console.log('Categories response:', response.status, response.statusText);
                if (response.ok) {
                    const categoriesData = await response.json();
                    console.log('Categories loaded:', categoriesData);
                    setCategories(categoriesData);
                } else {
                    console.error('Failed to fetch categories:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'radio') {
            // Handle radio buttons: set productType based on the selected radio's value
            setFormData(prev => ({
                 ...prev,
                 productType: value,
             }));        } else if (type === 'file') {
            // Handle file inputs - limit to 8 files
            const fileArray = Array.from(files).slice(0, 8);
            const limitedFiles = new DataTransfer();
            fileArray.forEach(file => limitedFiles.items.add(file));
            
            setFormData(prev => ({
                ...prev,
                [name]: limitedFiles.files, // Store limited FileList object
            }));}
        else {
            // Handle other input types (text, number, select, textarea)
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!formData.name || !formData.description || !formData.price || !formData.stockQuantity || !formData.category) {
            alert('❌ Please fill in all required fields (Name, Description, Price, Stock Quantity, Category)');
            return;
        }

        if (!formData.images || formData.images.length === 0) {
            alert('❌ Please select at least one product image');
            return;
        }

        console.log('Form data before submission:', formData);

        const form = new FormData();
        form.append('name', formData.name); // Changed to match controller
        form.append('description', formData.description);
        form.append('price', Number(formData.price)); // Changed to match controller
        form.append('stockQuantity', Number(formData.stockQuantity)); // Changed to match controller
        form.append('lowStockThreshold', Number(formData.lowStockThreshold) || 5); // Changed to match controller
        form.append('category', formData.category);        if (formData.images && formData.images.length > 0) {
            // Send multiple images
            for (let i = 0; i < formData.images.length && i < 8; i++) {
                form.append('product_images', formData.images[i]);
            }
            console.log('Image files:', Array.from(formData.images).slice(0, 8));
        }

        // Log all form data entries
        console.log('FormData entries:');
        for (let [key, value] of form.entries()) {
            console.log(key, value);
        }        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product`, {
                method: 'POST',
                body: form,
            });            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    body: errorData
                });
                throw new Error(`Server error (${response.status}): ${errorData.error || response.statusText || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log('Product uploaded:', result);
            alert('✅ Product successfully uploaded!');
            // Navigate back with preserved state
            navigate('/all-products', {
                state: {
                    returnToPage: location.state?.returnToPage,
                    filters: location.state?.filters
                }
            });
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`❌ Failed to upload product: ${error.message}`);
        }
    };

    // Function to handle back navigation

    const handleBack = () => {
        navigate('/all-products', {
            state: {
                returnToPage: location.state?.returnToPage,
                filters: location.state?.filters
            }
        });
    };

    const handleCancel = () => {
        console.log("Cancelling product creation.");
        // In a real app, potentially show a "discard changes?" modal
        handleBack(); // Go back to the list page
    };


    return (
        <> {/* Page-specific class */}
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
        <AdminHeader />
            </div>
            
        <div className="manage-products-page">
            <div className="title-row">
                <h2>Create a New Product</h2>
                <button onClick={handleBack} className="add-new-btn">
                    <FaAngleLeft size={18} color="white" />
                    Back to All Products
                </button>
            </div>

            <form onSubmit={handleSubmit} > {/* Use form element to wrap inputs */}

                <div className="add-product-form-layout">
                 {/* Left Column: Main Product Details */}
                <div className="add-product-main-column">

                     {/* Card 1: Product Information */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Create a New Product</h3> {/* Title within this card, seems redundant with page title? Replicating screenshot. */}
                        {/* Product Name Input field */}
                        <div className="form-group">
                            <label>Product Name</label>
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
                        {/* Low Stock Threshold */}
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
                                required
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
                                </label>                                 {/* Display selected file names */}
                                 {formData.images && formData.images.length > 0 && (
                                     <div className="selected-file-names" style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                         <strong>Selected files:</strong>
                                         {Array.from(formData.images).slice(0, 8).map((file, index) => (
                                            <div key={file.name} style={{ marginLeft: '10px' }}>
                                                {index + 1}. {file.name} 
                                                {index === 0 && <span style={{ color: '#007bff' }}> (Main image)</span>}
                                            </div>
                                         ))}
                                         {formData.images.length > 8 && (
                                             <div style={{ marginLeft: '10px', color: '#ff6b6b' }}>
                                                 Note: Only first 8 images will be uploaded
                                             </div>
                                         )}
                                     </div>
                                 )}
                            </div>
                            <small className="form-text text-muted">You can select up to 8 images. The first image will be the main display image.</small>{/* Reusing text-muted class */}
                        </div>
                     </div>

                </div> {/* End Left Column */}

                 {/* Right Column: Settings Panel */}
                <div className="add-product-sidebar-panel">

                     {/* Card 4: Category */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Product Category</h3>
                         <div className="form-group">
                            <label htmlFor="productCategory">Category</label>                            <select
                                id="productCategory"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{
                                    flex: '1 1 150px',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc'
                    }}
                            >
                                <option value="" disabled>Select Category</option> {/* Placeholder option */}
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                     {/* Card 5: Publish */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Upload Product</h3>
                         {/* Save and Cancel Buttons */}
                        <div className="form-actions-vertical"> {/* Use a vertical layout for buttons */}
                            <button type="submit" className="btn-save-product">
                                 <MdEdit size={18} color="white" />
                                 Save Product
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
                        </div>
                    </div>


                </div> {/* End Right Column */}

                </div>

            </form> {/* End Form */}
        </div> 
        </>
    );
}

export default AddProductPage;