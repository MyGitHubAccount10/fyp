// src/AdminSide/EEE_EditPromoPage.js

import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './AdminStyles.css';

import { FaAngleLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function EditPromoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [formData, setFormData] = useState({
        promo_title: '',
        promo_link: '/',
        display_order: 0,
        is_active: true,
        images: [] // For file inputs
    });
    const [existingImageURL, setExistingImageURL] = useState('');
    const [imageToReplace, setImageToReplace] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch promo');
                }
                const promo = await response.json();
                setFormData({
                    promo_title: promo.promo_title,
                    promo_link: promo.promo_link,
                    display_order: promo.display_order,
                    is_active: promo.is_active,
                    images: []
                });
                setExistingImageURL(`${process.env.REACT_APP_API_URL}/images/promo/${promo.promo_image}`);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching promo:', error);
                alert('❌ Failed to load promo data');
                navigate('/manage-promos');
            }
        };

        fetchPromo();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files }));
            // Mark that image is being replaced
            if (name === 'images' && files.length > 0) {
                setImageToReplace(true);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleClearImage = () => {
        setFormData(prev => ({ ...prev, images: [] }));
        setImageToReplace(false);
        // Clear the file input
        const fileInput = document.getElementById('imageUpload');
        if (fileInput) fileInput.value = '';
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.promo_title.trim()) {
            newErrors.promo_title = 'Promo title is required';
        }
        
        if (!formData.promo_link.trim()) {
            newErrors.promo_link = 'Promo link is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // If image is being replaced, show confirmation dialog
        if (imageToReplace) {
            const confirmReplace = window.confirm(
                '⚠️ Are you sure you want to replace the current image? This action cannot be undone and will permanently delete the current image from the server.'
            );
            if (!confirmReplace) {
                return;
            }
        }
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('promo_title', formData.promo_title);
            submitData.append('promo_link', formData.promo_link);
            submitData.append('display_order', formData.display_order);
            submitData.append('is_active', formData.is_active);
            
            // Only append image if a new one was selected
            if (formData.images && formData.images.length > 0) {
                submitData.append('promo_image', formData.images[0]);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo/${id}`, {
                method: 'PATCH',
                body: submitData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update promo');
            }

            alert('✅ Promo updated successfully!');
            navigate('/manage-promos', { state: location.state });
        } catch (error) {
            console.error('Error updating promo:', error);
            alert(`❌ Failed to update promo: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/manage-promos', { state: location.state });
    };

    const handleCancel = () => {
        handleBack();
    };

    if (isLoading) {
        return (
            <>
                <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                    <AdminHeader />
                </div>
                <div className="manage-products-page">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h3>Loading promo data...</h3>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>
            
            <div className="manage-products-page">
                <div className="title-row">
                    <h2>Edit Promo</h2>
                    <button onClick={handleBack} className="add-new-btn">
                        <FaAngleLeft size={18} color="white" />
                        Back to All Promos
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="add-product-form-layout">
                        {/* Left Column: Main Promo Details */}
                        <div className="add-product-main-column">

                            {/* Card 1: Promo Information */}
                            <div className="form-section-card">
                                <h3 className="section-card-title">Edit Promo</h3>
                                
                                {/* Promo Title Input field */}
                                <div className="form-group">
                                    <label>Promo Title</label>
                                    <input
                                        type="text"
                                        id="promoTitle"
                                        name="promo_title"
                                        value={formData.promo_title}
                                        onChange={handleChange}
                                        placeholder="e.g., Summer Sale Banner"
                                        required
                                        className={errors.promo_title ? 'error' : ''}
                                    />
                                    {errors.promo_title && <span className="error-message">{errors.promo_title}</span>}
                                </div>
                                
                                {/* Promo Link Input field */}
                                <div className="form-group">
                                    <label htmlFor="promoLink">Promo Link</label>
                                    <input
                                        type="text"
                                        id="promoLink"
                                        name="promo_link"
                                        value={formData.promo_link}
                                        onChange={handleChange}
                                        placeholder="e.g., /product/123 or /contact"
                                        required
                                        className={errors.promo_link ? 'error' : ''}
                                    />
                                    {errors.promo_link && <span className="error-message">{errors.promo_link}</span>}
                                    <small className="form-text text-muted">Enter the destination URL when users click the promo image</small>
                                </div>
                            </div>

                            {/* Card 2: Promo Settings */}
                            <div className="form-section-card">
                                <h3 className="section-card-title">Promo Settings</h3>

                                {/* Display Order */}
                                <div className="form-group">
                                    <label htmlFor="displayOrder">Display Order</label>
                                    <input
                                        type="number"
                                        id="displayOrder"
                                        name="display_order"
                                        value={formData.display_order}
                                        onChange={handleChange}
                                        placeholder="e.g., 0"
                                        min="0"
                                    />
                                    <small className="form-text text-muted">Lower numbers appear first in the slideshow (0 = first)</small>
                                </div>
                                
                                {/* Active Status */}
                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Active (will show on homepage)
                                    </label>
                                </div>
                            </div>

                            {/* Card 3: Promo Image */}
                            <div className="form-section-card">
                                <h3 className="section-card-title">Promo Image</h3>
                                <div className="form-group">
                                    <label>Upload New Image (Optional)</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            name="images"
                                            onChange={handleChange}
                                            accept="image/*"
                                        />
                                        
                                        {/* Clear button when image is selected */}
                                        {imageToReplace && (
                                            <button
                                                type="button"
                                                onClick={handleClearImage}
                                                className="clear-image-btn"
                                                style={{
                                                    marginTop: '10px',
                                                    marginLeft: '0',
                                                    padding: '8px 15px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    width: '100%',
                                                    maxWidth: '120px'
                                                }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                        
                                        {/* Show current image */}
                                        {existingImageURL && (
                                            <div style={{ marginTop: '15px' }}>
                                                <h4 style={{ 
                                                    color: imageToReplace ? '#dc3545' : '#6c757d', 
                                                    fontSize: '14px', 
                                                    marginBottom: '10px' 
                                                }}>
                                                    Current Image {imageToReplace ? '(Will be deleted)' : ''}:
                                                </h4>
                                                <div className="preview-images">
                                                    <img 
                                                        src={existingImageURL} 
                                                        alt="Current promo" 
                                                        className="responsive-promo-preview"
                                                        style={{ 
                                                            maxWidth: "100%", 
                                                            width: "100%",
                                                            maxHeight: "200px",
                                                            objectFit: "cover",
                                                            opacity: imageToReplace ? 0.5 : 1,
                                                            border: imageToReplace ? "2px solid #dc3545" : "1px solid #ccc",
                                                            borderRadius: "4px"
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Display new image preview */}
                                        {formData.images && formData.images.length > 0 && (
                                            <div style={{ marginTop: '15px' }}>
                                                <h4 style={{ 
                                                    color: '#007bff', 
                                                    fontSize: '14px', 
                                                    marginBottom: '10px' 
                                                }}>
                                                    New Image Preview:
                                                </h4>
                                                <div className="preview-images">
                                                    <img 
                                                        src={URL.createObjectURL(formData.images[0])} 
                                                        alt="New promo preview" 
                                                        className="responsive-promo-preview"
                                                        style={{ 
                                                            maxWidth: "100%", 
                                                            width: "100%",
                                                            maxHeight: "200px",
                                                            objectFit: "cover",
                                                            border: "2px solid #007bff",
                                                            borderRadius: "4px"
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <small className="form-text text-muted">
                                        {imageToReplace 
                                            ? "⚠️ Selecting a new image will permanently delete the current image from the server and replace it with the new one. This action cannot be undone." 
                                            : "Leave empty to keep current image. Recommended size: 1600x900px for best results."
                                        }
                                    </small>
                                </div>
                            </div>

                        </div> {/* End Left Column */}

                        {/* Right Column: Settings Panel */}
                        <div className="add-product-sidebar-panel">

                            {/* Card 4: Update */}
                            <div className="form-section-card">
                                <h3 className="section-card-title">Update Promo</h3>
                                {/* Save and Cancel Buttons */}
                                <div className="form-actions-vertical">
                                    <button type="submit" className="btn-save-product" disabled={isSubmitting}>
                                        <MdEdit size={18} color="white" />
                                        {isSubmitting ? 'Updating...' : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={handleCancel} className="btn-cancel-product" disabled={isSubmitting}>
                                        Cancel
                                    </button>
                                </div>
                            </div>

                        </div> {/* End Right Column */}

                    </div>
                </form>
            </div>
        </>
    );
}

export default EditPromoPage;