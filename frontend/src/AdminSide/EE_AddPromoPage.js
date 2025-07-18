// src/AdminSide/EE_AddPromoPage.js

import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminStyles.css';

import { FaAngleLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function AddPromoPage() {
    const [formData, setFormData] = useState({
        promo_title: '',
        promo_link: '/',
        display_order: 0,
        is_active: true,
        images: [] // For file inputs
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'file') {
            // Handle file inputs - limit to 1 file for promo
            const fileArray = Array.from(files).slice(0, 1);
            const limitedFiles = new DataTransfer();
            fileArray.forEach(file => limitedFiles.items.add(file));
            
            setFormData(prev => ({
                ...prev,
                [name]: limitedFiles.files
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.promo_title.trim()) {
            newErrors.promo_title = 'Promo title is required';
        }
        
        if (!formData.promo_link.trim()) {
            newErrors.promo_link = 'Promo link is required';
        }
        
        if (!formData.images || formData.images.length === 0) {
            newErrors.promo_image = 'Promo image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
            
            if (formData.images && formData.images.length > 0) {
                submitData.append('promo_image', formData.images[0]);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo`, {
                method: 'POST',
                body: submitData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create promo');
            }

            alert('✅ Promo created successfully!');
            navigate('/manage-promos', { state: location.state });
        } catch (error) {
            console.error('Error creating promo:', error);
            alert(`❌ Failed to create promo: ${error.message}`);
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

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>
            
            <div className="manage-products-page">
                <div className="title-row">
                    <h2>Create a New Promo</h2>
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
                                <h3 className="section-card-title">Create a New Promo</h3>
                                
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
                                    <label>Upload Image</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="promoImages"
                                            name="images"
                                            onChange={handleChange}
                                            className="file-input-hidden"
                                            accept="image/*"
                                        />
                                        {/* Custom styled file input button and text */}
                                        <label htmlFor="promoImages" className="file-input-label">
                                            <span className="file-input-button">Choose File</span>
                                            <span className="file-input-text">
                                                {formData.images && formData.images.length > 0
                                                    ? `${formData.images[0].name}`
                                                    : 'No File Chosen'}
                                            </span>
                                        </label>
                                        
                                        {errors.promo_image && <span className="error-message">{errors.promo_image}</span>}
                                        
                                        {/* Display selected image preview */}
                                        {formData.images && formData.images.length > 0 && (
                                            <div className="selected-file-names" style={{ marginTop: '15px' }}>
                                                <strong>Image Preview:</strong>
                                                <div style={{ marginTop: '10px' }}>
                                                    <img 
                                                        src={URL.createObjectURL(formData.images[0])} 
                                                        alt="Promo preview" 
                                                        style={{ 
                                                            maxWidth: '300px', 
                                                            maxHeight: '150px', 
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ddd'
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <small className="form-text text-muted">Recommended size: 1200x400px for best results</small>
                                </div>
                            </div>

                        </div> {/* End Left Column */}

                        {/* Right Column: Settings Panel */}
                        <div className="add-product-sidebar-panel">

                            {/* Card 4: Publish */}
                            <div className="form-section-card">
                                <h3 className="section-card-title">Create Promo</h3>
                                {/* Save and Cancel Buttons */}
                                <div className="form-actions-vertical">
                                    <button type="submit" className="btn-save-product" disabled={isSubmitting}>
                                        <MdEdit size={18} color="white" />
                                        {isSubmitting ? 'Creating...' : 'Save Promo'}
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

export default AddPromoPage;
