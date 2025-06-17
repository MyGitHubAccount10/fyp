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

const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.26 2.74 17.59 2.53 17.96 2.38C18.33 2.24 18.73 2.15 19.14 2.14C19.55 2.12 19.96 2.18 20.35 2.30C20.74 2.42 21.10 2.60 21.41 2.91C21.73 3.22 21.98 3.59 22.10 3.98C22.22 4.37 22.27 4.78 22.26 5.19C22.24 5.60 22.16 6.00 22.01 6.37C21.87 6.74 21.66 7.06 21.40 7.33L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        threshold: '',
        images: [],
        category: '',
    });

    const [existingImageURLs, setExistingImageURLs] = useState([]);
    const [imagesToReplace, setImagesToReplace] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/category');
                if (response.ok) {
                    const categoriesData = await response.json();
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/product/${id}`);
                const data = await res.json();
                setFormData({
                    name: data.product_name || '',
                    description: data.description || '',
                    price: data.product_price || '',
                    stockQuantity: data.warehouse_quantity || '',
                    threshold: data.threshold || '',
                    images: [],
                    category: data.category || '',
                });
                setExistingImageURLs([
                    `/images/${data.product_image}`,
                    ...(data.product_image2 ? [`/images/${data.product_image2}`] : []),
                    ...(data.product_image3 ? [`/images/${data.product_image3}`] : [])
                ]);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                alert('❌ Could not load product details.');
            }
        };

        fetchProduct();
    }, [id]);    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files }));
            // Mark that images are being replaced
            if (name === 'images' && files.length > 0) {
                setImagesToReplace(true);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleClearImages = () => {
        setFormData(prev => ({ ...prev, images: [] }));
        setImagesToReplace(false);
        // Clear the file input
        const fileInput = document.getElementById('imageUpload');
        if (fileInput) fileInput.value = '';
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // If images are being replaced, show confirmation dialog
        if (imagesToReplace) {
            const confirmReplace = window.confirm(
                "⚠️ WARNING: You are about to replace the existing product images. " +
                "The current images will be permanently deleted from the server and cannot be recovered. " +
                "Do you want to continue?"
            );
            
            if (!confirmReplace) {
                return; // User cancelled the operation
            }
        }
        
        // Frontend validation
        if (!formData.name || !formData.description || !formData.price || !formData.stockQuantity || !formData.category) {
            alert('❌ Please fill in all required fields (Name, Description, Price, Stock Quantity, Category)');
            return;
        }
        
        console.log('Form data before submission:', formData);
        
        const form = new FormData();
        // Use the same field names that work for create
        form.append('product_name', formData.name);
        form.append('description', formData.description);
        form.append('product_price', Number(formData.price));
        form.append('warehouse_quantity', Number(formData.stockQuantity));
        form.append('threshold', Number(formData.threshold) || 5);
        form.append('category', formData.category);        if (formData.images && formData.images.length > 0) {
            // Send multiple images - this will replace ALL existing images
            for (let i = 0; i < formData.images.length && i < 3; i++) {
                form.append('product_images', formData.images[i]);
            }
        }

        // Log all form data entries
        console.log('FormData entries:');
        for (let [key, value] of form.entries()) {
            console.log(key, value);
        }

        try {
            const res = await fetch(`/api/product/${id}`, {
                method: 'PATCH', // Use PATCH instead of PUT
                body: form,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Server response:', {
                    status: res.status,
                    statusText: res.statusText,
                    body: errorData
                });
                throw new Error(`Update failed: ${errorData.error || res.statusText}`);
            }            const result = await res.json();
            console.log('Product updated:', result);
              const successMessage = imagesToReplace 
                ? '✅ Product updated successfully! Old images have been permanently deleted and replaced with new ones.'
                : '✅ Product updated successfully!';
            alert(successMessage);
            navigate('/all-products');
        } catch (err) {
            console.error('Update error:', err);
            alert(`❌ Failed to update product: ${err.message}`);
        }
    };

    const handleBack = () => navigate('/all-products');
    const handleCancel = () => handleBack();

    return (
        <div className="add-product-page">
            <AdminHeader />
            <div className="manage-products-page" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Edit Product</h2>
                    <button onClick={handleBack} className="btn-add-new">
                        <BackIcon size={18} color="white" />
                        Back to All Products
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="add-product-form-layout">
                        {/* LEFT COLUMN */}
                        <div className="add-product-main-column">
                            <div className="form-section-card">
                                <h3 className="section-card-title">Edit Product</h3>


                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    rows="4" 
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        marginTop: '6px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }} />
                                </div>
                            </div>

                            <div className="form-section-card">
                                <h3 className="section-card-title">Product Data</h3>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                    type="number"
                                    name="price"
                                    value={parseFloat(formData.price || 0).toFixed(2)}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" required />
                                </div>
                                <div className="form-group">
                                    <label>Threshold</label>
                                    <input type="number" name="threshold" value={formData.threshold} onChange={handleChange} min="0" />
                                    <small className="form-text text-muted">Optional. Set a threshold for low stock alerts.</small>
                                </div>
                            </div>                            <div className="form-section-card">
                                <h3 className="section-card-title">Product Image</h3>
                                <div className="form-group">
                                    <label>Replace Images</label>                                    {/* Show warning banner when images will be replaced */}
                                    {imagesToReplace && (
                                        <div style={{
                                            backgroundColor: '#fff3cd',
                                            border: '1px solid #ffeaa7',
                                            borderRadius: '4px',
                                            padding: '12px',
                                            marginBottom: '15px',
                                            color: '#856404'
                                        }}>
                                            <strong>⚠️ Image Replacement Warning:</strong>
                                            <br />
                                            The current images will be permanently deleted and replaced with the new images when you save.
                                        </div>
                                    )}
                                    
                                    <div className="file-upload-area">
                                        <input type="file" name="images" multiple onChange={handleChange} className="file-input-hidden" id="imageUpload" accept="image/*" />
                                        <label htmlFor="imageUpload" className="file-input-label">
                                            <span className="file-input-button">Choose Files</span>
                                            <span className="file-input-text">
                                                {formData.images.length > 0 ? `${formData.images.length} file(s) selected` : 'No file chosen'}
                                            </span>
                                        </label>
                                        {formData.images.length > 0 && (
                                            <button 
                                                type="button" 
                                                onClick={handleClearImages}
                                                style={{
                                                    marginLeft: '10px',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Show preview of new images if any are selected */}
                                    {formData.images.length > 0 && (
                                        <div style={{ marginTop: '15px' }}>
                                            <h4 style={{ color: '#007bff', fontSize: '14px', marginBottom: '10px' }}>New Images (Will Replace Current):</h4>
                                            <div className="preview-images">
                                                {Array.from(formData.images).map((file, i) => (
                                                    <img 
                                                        key={i} 
                                                        src={URL.createObjectURL(file)} 
                                                        alt={`New ${i + 1}`} 
                                                        style={{ 
                                                            maxWidth: "100px", 
                                                            marginRight: "10px", 
                                                            marginTop: "5px",
                                                            border: "2px solid #007bff",
                                                            borderRadius: "4px"
                                                        }} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Show current images */}
                                    {existingImageURLs.length > 0 && (
                                        <div style={{ marginTop: '15px' }}>
                                            <h4 style={{ 
                                                color: imagesToReplace ? '#dc3545' : '#6c757d', 
                                                fontSize: '14px', 
                                                marginBottom: '10px' 
                                            }}>
                                                Current Images {imagesToReplace ? '(Will be deleted)' : ''}:
                                            </h4>
                                            <div className="preview-images">
                                                {existingImageURLs.map((url, i) => (
                                                    <img 
                                                        key={i} 
                                                        src={url} 
                                                        alt="Current" 
                                                        style={{ 
                                                            maxWidth: "100px", 
                                                            marginRight: "10px", 
                                                            marginTop: "5px",
                                                            opacity: imagesToReplace ? 0.5 : 1,
                                                            border: imagesToReplace ? "2px solid #dc3545" : "1px solid #ccc",
                                                            borderRadius: "4px"
                                                        }} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}                                    <small className="form-text text-muted">
                                        {imagesToReplace 
                                            ? "⚠️ Selecting new images will permanently delete the current images from the server and replace them with the new ones. This action cannot be undone." 
                                            : "First image will be used as the main display image. Select new images to replace current ones."
                                        }
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="add-product-sidebar-panel">
                            <div className="form-section-card">
                                <h3 className="section-card-title">Product Category</h3>                                <div className="form-group">
                                    <label htmlFor="productCategory">Category</label>
                                    <select name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    required
                                    style={{
                                        flex: '1 1 150px',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc'
                                            }}>
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-section-card">
                                <h3 className="section-card-title">Update Product</h3>
                                <div className="form-actions-vertical">
                                    <button type="submit" className="btn-save-product">
                                        <PencilIcon size={18} color="white" />
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductPage;
