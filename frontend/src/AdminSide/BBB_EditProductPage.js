import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

import { FaAngleLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/category`);
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
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/product/${id}`);
                const data = await res.json();
                setFormData({
                    name: data.product_name || '',
                    description: data.description || '',
                    price: data.product_price || '',
                    stockQuantity: data.warehouse_quantity || '',
                    threshold: data.threshold || '',
                    images: [],
                    category: (typeof data.category === 'object' && data.category._id) ? data.category._id : data.category || '',
                });
                setExistingImageURLs([
                    `${process.env.REACT_APP_API_URL}/images/product/${data.product_image}`,
                    ...(data.product_image2 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image2}`] : []),
                    ...(data.product_image3 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image3}`] : []),
                    ...(data.product_image4 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image4}`] : []),
                    ...(data.product_image5 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image5}`] : []),
                    ...(data.product_image6 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image6}`] : []),
                    ...(data.product_image7 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image7}`] : []),
                    ...(data.product_image8 ? [`${process.env.REACT_APP_API_URL}/images/product/${data.product_image8}`] : [])
                ]);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                alert('❌ Could not load product details.');
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const filesArray = Array.from(files); // convert FileList to Array
            setFormData(prev => ({ ...prev, [name]: filesArray }));
            if (name === 'images' && filesArray.length > 0) {
                setImagesToReplace(true);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleClearImages = () => {
        setFormData(prev => ({ ...prev, images: [] }));
        setImagesToReplace(false);
        const fileInput = document.getElementById('imageUpload');
        if (fileInput) fileInput.value = '';
    };

    const handleDeleteImage = (index) => {
        setFormData(prev => {
            const newImages = Array.from(prev.images);
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imagesToReplace) {
            const confirmReplace = window.confirm(
                "⚠️ WARNING: You are about to replace the existing product images. " +
                "The current images will be permanently deleted from the server and cannot be recovered. " +
                "Do you want to continue?"
            );
            if (!confirmReplace) return;
        }

        if (!formData.name || !formData.description || !formData.price || !formData.stockQuantity || !formData.category) {
            alert('❌ Please fill in all required fields (Name, Description, Price, Stock Quantity, Category)');
            return;
        }

        const form = new FormData();
        form.append('product_name', formData.name);
        form.append('description', formData.description);
        form.append('product_price', Number(formData.price));
        form.append('warehouse_quantity', Number(formData.stockQuantity));
        form.append('threshold', Number(formData.threshold) || 5);
        form.append('category', formData.category);

        if (formData.images && formData.images.length > 0) {
            for (let i = 0; i < formData.images.length && i < 8; i++) {
                form.append('product_images', formData.images[i]);
            }
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/product/${id}`, {
                method: 'PATCH',
                body: form,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`Update failed: ${errorData.error || res.statusText}`);
            }

            alert(imagesToReplace
                ? '✅ Product updated successfully! Old images have been permanently deleted and replaced with new ones.'
                : '✅ Product updated successfully!'
            );
            navigate('/all-products', {
                state: {
                    returnToPage: location.state?.returnToPage,
                    filters: location.state?.filters
                }
            });
        } catch (err) {
            alert(`❌ Failed to update product: ${err.message}`);
        }
    };

    const handleBack = () => navigate('/all-products', {
        state: {
            returnToPage: location.state?.returnToPage,
            filters: location.state?.filters
        }
    });
    const handleCancel = () => handleBack();

    return (
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                <AdminHeader />
            </div>
            <div className="manage-products-page">
                <div className="title-row">
                    <h2>Edit Product</h2>
                    <button onClick={handleBack} className="add-new-btn">
                        <FaAngleLeft size={18} color="white" />
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
                            </div>

                            <div className="form-section-card">
                                <h3 className="section-card-title">Product Image</h3>
                                <div className="form-group">
                                    <label>Replace Images</label>
                                    {/* Show warning banner when images will be replaced */}
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
                                                {formData.images.length > 0 ? `${formData.images.length} file(s) selected (Max 8)` : 'No file chosen (Max 8 images)'}
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

                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {formData.images.map((file, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            userSelect: "none",
                                                            margin: "0 10px 10px 0",
                                                            cursor: "default",
                                                            position: "relative"
                                                        }}
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`New ${i + 1}`}
                                                            style={{
                                                                maxWidth: "100px",
                                                                border: "2px solid #007bff",
                                                                borderRadius: "4px"
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteImage(i)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '-8px',
                                                                right: '-8px',
                                                                backgroundColor: '#dc3545',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                color: 'white',
                                                                width: '20px',
                                                                height: '20px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold',
                                                                lineHeight: '18px',
                                                                padding: 0,
                                                            }}
                                                            aria-label={`Delete image ${i + 1}`}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
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
                                    )}
                                    <small className="form-text text-muted">
                                        {imagesToReplace
                                            ? "⚠️ Selecting new images will permanently delete the current images from the server and replace them with the new ones. This action cannot be undone. Maximum 8 images allowed."
                                            : "First image will be used as the main display image. Select new images to replace current ones. Maximum 8 images allowed."
                                        }
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="add-product-sidebar-panel">
                            <div className="form-section-card">
                                <h3 className="section-card-title">Product Category</h3>
                                <div className="form-group">
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
                                        <MdEdit size={18} color="white" />
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
