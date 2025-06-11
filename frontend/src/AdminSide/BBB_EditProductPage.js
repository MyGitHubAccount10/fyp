import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

function EditProductPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const existingProduct = location.state?.product || {};

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     productType: 'Select Category',
//     price: '',
//     stockQuantity: '',
//     lowStockThreshold: '',
//     images: [],
//     status: 'Draft',
//     visibility: 'Public',
//     category: '',
//   });

//   useEffect(() => {
//     if (existingProduct) {
//       setFormData({
//         ...formData,
//         ...existingProduct,
//         images: [], // Do not pre-fill file inputs
//       });
//     }
//   }, [existingProduct]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'file' ? files : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Edited Product Data:", formData);
//     alert("Product updated (demo): Check console for data.");
//     navigate('/manage-products');
//   };

//   const handleCancel = () => navigate('/manage-products');

  return (
    // <div className="add-product-page">
    //   <AdminHeader />
    //   <div style={{ paddingLeft: '100px', paddingRight: '100px' }}>
    //     <div className="page-header-section">
    //       <h2>Edit Product</h2>
    //       <button className="btn-back-to-products" onClick={handleCancel}>
    //         <BackIcon color="#555" /> Back to All Products
    //       </button>
    //     </div>

    //     <form onSubmit={handleSubmit} className="add-product-form-layout">
    //       <div className="add-product-main-column">
    //         <div className="form-section-card">
    //           <h3 className="section-card-title">Edit Product Information</h3>
    //           <div className="form-group">
    //             <label htmlFor="productName">Product Name</label>
    //             <input type="text" id="productName" name="name" value={formData.name} onChange={handleChange} required />
    //           </div>

    //           <div className="form-group">
    //             <label htmlFor="productDescription">Description</label>
    //             <textarea id="productDescription" name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
    //           </div>
    //         </div>

    //         <div className="form-section-card">
    //           <h3 className="section-card-title">Product Data</h3>
    //           <div className="form-group">
    //             <label htmlFor="productPrice">Price</label>
    //             <input type="number" id="productPrice" name="price" step="0.01" value={formData.price} onChange={handleChange} required />
    //           </div>

    //           <div className="form-group">
    //             <label htmlFor="stockQuantity">Stock Quantity</label>
    //             <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" required />
    //           </div>

    //           <div className="form-group">
    //             <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
    //             <input type="number" id="lowStockThreshold" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} min="0" />
    //           </div>
    //         </div>

    //         <div className="form-section-card">
    //           <h3 className="section-card-title">Update Product Image</h3>
    //           <div className="form-group">
    //             <label>Upload New Images (optional)</label>
    //             <div className="file-upload-area">
    //               <input type="file" id="productImages" name="images" multiple onChange={handleChange} className="file-input-hidden" />
    //               <label htmlFor="productImages" className="file-input-label">
    //                 <span className="file-input-button">Choose Files</span>
    //                 <span className="file-input-text">
    //                   {formData.images?.length > 0 ? `${formData.images.length} file(s) selected` : 'No File Chosen'}
    //                 </span>
    //               </label>
    //             </div>
    //             <small className="form-text text-muted">New image will replace the current one if uploaded.</small>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="add-product-sidebar-panel">
    //         <div className="form-section-card">
    //           <h3 className="section-card-title">Product Category</h3>
    //           <div className="form-group">
    //             <label htmlFor="productCategory">Category</label>
    //             <select id="productCategory" name="category" value={formData.category} onChange={handleChange} required>
    //               <option value="" disabled>Select Category</option>
    //               <option value="Skimboards">Skimboards</option>
    //               <option value="T-Shirts">T-Shirts</option>
    //               <option value="Jackets">Jackets</option>
    //               <option value="Board Shorts">Board Shorts</option>
    //               <option value="Accessories">Accessories</option>
    //             </select>
    //           </div>
    //         </div>

    //         <div className="form-section-card">
    //           <h3 className="section-card-title">Save Changes</h3>
    //           <div className="form-actions-vertical">
    //             <button type="submit" className="btn-save-product">
    //               <PencilIcon size={18} color="white" />
    //               Save Changes
    //             </button>
    //             <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
    //           </div>
    //         </div>
    //       </div>
    //     </form>
    //   </div>
    // </div>

<div>
    <AdminHeader />
    <div>Need data</div>
</div>
  );
}

export default EditProductPage;
