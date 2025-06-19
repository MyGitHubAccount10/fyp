// src/AdminSide/B_AllProductsPage.js

import React, { useState, useEffect, useCallback } from 'react'; // +++ ADD useCallback
import AdminHeader from '../AdminHeader';
import { useNavigate } from 'react-router-dom';

import './AdminStyles.css'; 

// ... (No changes to Icons) ...
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}><path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const TrashIcon = ({ size = 18, color = "currentColor" }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}><path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ChevronLeftIcon = ({ size = 24, color = "white" }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}><path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ChevronRightIcon = ({ size = 24, color = "white" }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}><path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CloseIcon = ({ size = 24, color = "white" }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}><path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);


function AllProductsPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const Navigate = useNavigate();
    const [modalImage, setModalImage] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetch('/api/product')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
                setProducts(data);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
            });
    }, []);

    useEffect(() => {
        fetch('/api/category')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
            .catch(err => {
                console.error("Failed to fetch categories:", err);
            });
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleEditProduct = (product) => {
        Navigate(`/edit-product/${product._id}`);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm(`Are you sure you want to delete this product? This action cannot be undone.`)) {
            try {
                const response = await fetch(`/api/product/${productId}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`Failed to delete product: ${errorData.error || response.statusText}`);
                }
                setAllProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
                setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
                alert("✅ Product deleted successfully!");
            } catch (error) {
                console.error("Delete failed:", error);
                alert(`❌ Failed to delete product: ${error.message}`);
            }
        }
    };

    const handleAddProduct = () => {
        Navigate('/add-product');
    }

    // --- FIX #1: The useEffect Dependency Warning ---
    // Step 1: Wrap the handleFilter function in useCallback.
    // List its dependencies: allProducts, searchTerm, selectedCategory, and selectedStatus.
    const getStatus = useCallback((product) => {
        if (product.warehouse_quantity === 0) return 'No Stock';
        if (product.warehouse_quantity <= product.threshold) return 'Limited Stock';
        return 'In Stock';
    }, []);

    const handleFilter = useCallback(() => {
        let filtered = allProducts;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (selectedStatus !== 'All Statuses') {
            filtered = filtered.filter(product => getStatus(product) === selectedStatus);
        }

        setProducts(filtered);
        setCurrentPage(1);
    }, [allProducts, searchTerm, selectedCategory, selectedStatus, getStatus]); // Dependencies of handleFilter

    // Step 2: Now you can safely add handleFilter to the useEffect dependency array.
    useEffect(() => {
        handleFilter();
    }, [handleFilter]); // <-- The missing dependency is now included and stable.

    const getCategory = (categoryID) => {
        const category = categories.find(cat => cat._id === categoryID);
        return category ? category.category_name : 'Unknown';
    };

    const getProductStatusClass = (status) => {
        switch (status) {
            case 'In Stock': return 'status-in-stock';
            case 'Limited Stock': return 'status-limited-stock';
            case 'No Stock': return 'status-no-stock';
            default: return '';
        }
    };

    const getProductImages = (product) => {
        const images = [];
        if (product.product_image) images.push(product.product_image);
        if (product.product_image2) images.push(product.product_image2);
        if (product.product_image3) images.push(product.product_image3);
        return images;
    };

    const openImagePreview = (product, imageIndex = 0) => {
        setCurrentProduct(product);
        setCurrentImageIndex(imageIndex);
        const images = getProductImages(product);
        if (images.length > 0) {
            setModalImage(`/images/${images[imageIndex]}`);
        }
    };

    const goToPreviousImage = () => {
        if (!currentProduct) return;
        const images = getProductImages(currentProduct);
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        setCurrentImageIndex(newIndex);
        setModalImage(`/images/${images[newIndex]}`);
    };

    const goToNextImage = () => {
        if (!currentProduct) return;
        const images = getProductImages(currentProduct);
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        setCurrentImageIndex(newIndex);
        setModalImage(`/images/${images[newIndex]}`);
    };

    const closeModal = () => {
        setModalImage(null);
        setCurrentProduct(null);
        setCurrentImageIndex(0);
    };

    return (<>
        <AdminHeader />
        <div className="manage-products-page" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>All Products</h2>
                <button onClick={handleAddProduct} className="btn-add-new">
                    <PencilIcon size={18} color="white" />
                    Add New Product
                </button>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '3 1 300px', boxSizing: 'border-box' }}>
                    <input type="text" placeholder="Search by name..." className="search-input" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flex: '1 1 400px', gap: '10px', flexWrap: 'wrap' }}>
                    <select className="category-select" style={{ flex: '1 1 150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="All Categories">All Categories</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.category_name}</option>
                        ))}
                    </select>
                    <select className="category-select" style={{ flex: '1 1 150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="All Statuses">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="No Stock">No Stock</option>
                    </select>
                </div>
            </div>

            <div className="pagination-controls" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", flexWrap: "wrap", gap: "12px" }}>
                <span style={{ fontSize: "16px" }}>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">{'<< Prev'}</button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">{'Next >>'}</button>
                </div>
            </div>

            {modalImage && currentProduct && (
                <div className="modal-overlay" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0, 0, 0, 0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1001 }}>
                        <CloseIcon size={20} />
                    </button>                
                    <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', backgroundColor: 'white', borderRadius: '8px', width: '70vw', height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
                        {getProductImages(currentProduct).length > 1 && (
                            <>
                                <button onClick={goToPreviousImage} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1002, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}><ChevronLeftIcon size={24} /></button>
                                <button onClick={goToNextImage} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1002, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}><ChevronRightIcon size={24} /></button>
                            </>
                        )}
                        <h3 style={{ margin: '0 0 15px 0', textAlign: 'center', color: '#333' }}>{currentProduct.product_name}</h3>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '0' }}>
                            <img
                                src={modalImage}
                                // --- FIX #2: The Image Alt Text Warning ---
                                // Changed from a potentially redundant description to one that is concise.
                                alt={`${currentProduct.product_name} preview ${currentImageIndex + 1}`}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                            />
                        </div>
                        {getProductImages(currentProduct).length > 1 && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '15px', alignItems: 'center' }}>
                                {getProductImages(currentProduct).map((_, index) => (
                                    <button key={index} onClick={() => { setCurrentImageIndex(index); setModalImage(`/images/${getProductImages(currentProduct)[index]}`); }} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: index === currentImageIndex ? '#007bff' : '#ccc', cursor: 'pointer', transition: 'background-color 0.2s' }} />
                                ))}
                                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>{currentImageIndex + 1} of {getProductImages(currentProduct).length}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th className="action-column">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    src={`/images/${product.product_image}`}
                                    alt={product.product_name}
                                    className="admin-product-image"
                                    onClick={() => openImagePreview(product, 0)}
                                    onError={(e) => (e.target.src = '/images/placeholder-product.jpg')}
                                />
                            </td>
                            <td>{product.product_name}</td>
                            <td>{getCategory(product.category)}</td>
                            <td>${product.product_price.toFixed(2)}</td>
                            <td>{product.warehouse_quantity}</td>
                            <td>
                                <span className={getProductStatusClass(getStatus(product))}>
                                    {getStatus(product)}
                                </span>
                            </td>
                            <td className="action-column">
                                <div className="action-icons">
                                    <button onClick={() => handleEditProduct(product)} title="Edit Product"><PencilIcon /></button>
                                    <button onClick={() => handleDeleteProduct(product._id)} title="Delete Product" className="delete-btn"><TrashIcon /></button>
                                </div>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                No products found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

export default AllProductsPage;