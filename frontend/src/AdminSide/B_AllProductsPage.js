// src/AdminSide/B_AllProductsPage.js

import React, { useState, useEffect, useCallback } from 'react'; // +++ ADD useCallback
import AdminHeader from '../AdminHeader';
import { useNavigate, useLocation } from 'react-router-dom';

import './AdminStyles.css'; 

import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const initialProductsData = {
    lowStockItems: 0,
    outOfStockItems: 0,
};



function AllProductsPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const navigate = useNavigate();
    const location = useLocation();
    const [modalImage, setModalImage] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get the page number and filters from location state when returning from edit/add page
    useEffect(() => {
        if (location.state?.returnToPage) {
            setCurrentPage(location.state.returnToPage);
        }
        if (location.state?.filters) {
            const { searchTerm: savedSearchTerm, selectedCategory: savedCategory, selectedStatus: savedStatus } = location.state.filters;
            setSearchTerm(savedSearchTerm);
            setSelectedCategory(savedCategory);
            setSelectedStatus(savedStatus);
        }
    }, [location.state]);




// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/product`)
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/category`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
            .catch(err => {
                console.error("Failed to fetch categories:", err);
            });
    }, []);

    // Get product status helper function
    const getStatus = useCallback((product) => {
        if (product.warehouse_quantity === 0) return 'Out of Stock';
        if (product.warehouse_quantity <= product.threshold) return 'Limited Stock';
        return 'In Stock';
    }, []);

    // Real-time filtered products based on current filters (similar to AllOrdersPage pattern)
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = searchTerm === '' || 
                             product.product_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All Categories' || 
                               product.category === selectedCategory;

        const productStatus = getStatus(product);
        const matchesStatus = selectedStatus === 'All Statuses' || 
                             productStatus === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Pagination Logic based on filtered products (similar to AllOrdersPage pattern)
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleApplyFilters = () => {
        console.log("Applying filters:", { searchTerm, selectedCategory, selectedStatus });
        setCurrentPage(1); // Reset to first page on new filter
    };

    // Auto-apply filters when filter values change (similar to AllOrdersPage pattern)
    useEffect(() => {
        handleApplyFilters();
    }, [searchTerm, selectedCategory, selectedStatus]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const navigateToEditProduct = (productId) => { 
        navigate(`/edit-product/${productId}`, {
            state: { 
                returnToPage: currentPage,
                filters: {
                    searchTerm,
                    selectedCategory,
                    selectedStatus
                }
            }
        });
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm(`Are you sure you want to delete this product? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product/${productId}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`Failed to delete product: ${errorData.error || response.statusText}`);
                }
                setAllProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
                alert("✅ Product deleted successfully!");
            } catch (error) {
                console.error("Delete failed:", error);
                alert(` Failed to delete product: ${error.message}`);
            }
        }
    };

    const handleAddProduct = () => {
        navigate('/add-product', {
            state: { 
                returnToPage: currentPage,
                filters: {
                    searchTerm,
                    selectedCategory,
                    selectedStatus
                }
            }
        });
    }

    const getCategory = (categoryID) => {
        const category = categories.find(cat => cat._id === categoryID);
        return category ? category.category_name : 'Unknown';
    };

    const getProductStatusClass = (status) => {
        switch (status) {
            case 'In Stock': return 'status-in-stock';
            case 'Limited Stock': return 'status-limited-stock';
            case 'Out of Stock': return 'status-no-stock';
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
            setModalImage(`${process.env.REACT_APP_API_URL}/images/${images[imageIndex]}`);
        }
    };

    const goToPreviousImage = () => {
        if (!currentProduct) return;
        const images = getProductImages(currentProduct);
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        setCurrentImageIndex(newIndex);
        setModalImage(`${process.env.REACT_APP_API_URL}/images/${images[newIndex]}`);
    };

    const goToNextImage = () => {
        if (!currentProduct) return;
        const images = getProductImages(currentProduct);
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        setCurrentImageIndex(newIndex);
        setModalImage(`${process.env.REACT_APP_API_URL}/images/${images[newIndex]}`);
    };

    const closeModal = () => {
        setModalImage(null);
        setCurrentProduct(null);
        setCurrentImageIndex(0);
    };

// ------          -------------RETURN ---------------------------------------
// ------  -----     -----------RETURN ---------------------------------------
// ------  -----     ----------RETURN ---------------------------------------
// ------  ---     -------------RETURN ---------------------------------------
// ------  --     ----------RETURN ---------------------------------------
// ------      ------------RETURN ---------------------------------------
// ------  ----------------RETURN ---------------------------------------
// ------      ------------RETURN ---------------------------------------
// ------  --     --------RETURN ---------------------------------------
// ------  -----    -------RETURN ---------------------------------------
// ------  -------    -----RETURN ---------------------------------------
// ------  --------    ---RETURN ---------------------------------------



    return (<>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
        <AdminHeader />
            </div>
        <div className="manage-products-page">
            <div className="title-row">
                <h2>Products</h2>
                <button onClick={handleAddProduct} className="add-new-btn">
                    <MdEdit size={18} color="white"/>
                    Add New Product
                </button>
            </div>
            
            <div className='card'>
                <div className="card-input">
                    <input type="text" placeholder="Search by name..."  
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                    {/* All Categories */}
                    <select
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '10px',
                            }}>
                        <option value="All Categories">All Categories</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.category_name}</option>
                        ))}
                    </select>
                    {/* All Statuses */}
                    <select style={{ flex: '1', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="All Statuses">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Summary */}
            <div className="products-summary" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em', color: '#333' }}>Products Overview</h3>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    <div>
                        <strong>Total Products:</strong> <span style={{ color: '#007bff' }}>{allProducts.length}</span>
                    </div>
                    <div>
                        <strong>Filtered Results:</strong> <span style={{ color: '#28a745' }}>{filteredProducts.length}</span>
                    </div>
                </div>
            </div>

            <div className="pagination-controls" 
                style={{ display: "flex", 
                         justifyContent: "space-between",  
                         alignItems: "center", 
                         padding: "16px 0", 
                         flexWrap: "wrap", 
                         gap: "12px" }}>
                <span style={{ fontSize: "16px" }}>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">{'<< Prev'}</button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">{'Next >>'}</button>
                </div>
            </div>

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
                    <button onClick={closeModal} 
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
                        {getProductImages(currentProduct).length > 1 && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1002, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}><FaAngleLeft size={24} color="white" /></button>
                                <button onClick={(e) => { e.stopPropagation(); goToNextImage(); }} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1002, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'} onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}><FaAngleRight size={24} color="white" /></button>
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
                                // --- FIX #2: The Image Alt Text Warning ---
                                // Changed from a potentially redundant description to one that is concise.
                                alt={`${currentProduct.product_name} preview ${currentImageIndex + 1}`}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                            />
                            {/* Product Name Overlay */}
                            <div style={{ 
                                position: 'absolute',
                                bottom: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                textAlign: 'center',
                                maxWidth: '80%',
                                backdropFilter: 'blur(4px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                {currentProduct.product_name}
                            </div>
                        </div>
                        {/* Thumbnail Navigation */}
                        {getProductImages(currentProduct).length > 1 && (
                            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '8px', marginTop: '15px', alignItems: 'center' }}>
                                {getProductImages(currentProduct).map((_, index) => (
                                    <button key={index} onClick={() => { setCurrentImageIndex(index); setModalImage(`${process.env.REACT_APP_API_URL}/images/${getProductImages(currentProduct)[index]}`); }} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: index === currentImageIndex ? '#007bff' : '#ccc', cursor: 'pointer', transition: 'background-color 0.2s' }} />
                                ))}
                                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>{currentImageIndex + 1} of {getProductImages(currentProduct).length}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Products Table */}
            <div className="card" style={{ overflowX: 'auto'}}>
                <table className="my-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/images/${product.product_image}`}
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
                            <td>
                                <div className="actionButton">
                                    <button className='editbutton' onClick={() => navigateToEditProduct(product._id)} title="Edit Product"><MdEdit size={39}/></button>
                                    <button className='deletebutton' onClick={() => handleDeleteProduct(product._id)} title="Delete Product" ><IoMdTrash size={24} /></button>
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