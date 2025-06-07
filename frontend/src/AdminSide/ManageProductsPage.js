import React, { useState } from 'react';
// No need to import AdminStyles here, it's imported in AdminLayout
import './AdminStyles.css';
import AdminHeader from '../AdminHeader'; // Assuming you have an AdminHeader component

// Placeholder Icons
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const TrashIcon = ({ size = 18, color = "currentColor" }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const CloseIcon = ({ size = 24, color = "currentColor" }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// Dummy product data
const dummyProducts = [
    { id: 1, image: '/images/placeholder-product.jpg', name: 'Pro Model Skimboard Large', sku: 'SKIM-PRO-LG-001', category: 'Skimboards', price: 350.00, stock: 25, status: 'Published' },
    { id: 2, image: '/images/placeholder-product.jpg', name: 'Skimboard Traction Wax', sku: 'ACC-WAX-001', category: 'Accessories', price: 15.00, stock: 150, status: 'Published' },
    { id: 3, image: '/images/placeholder-product.jpg', name: '[Placeholder]', sku: 'PLACE-001', category: 'Skimboards', price: 100.00, stock: 78, status: 'Draft' },
    // Add more dummy products if needed
];

function ManageProductsPage() {
    const [products, setProducts] = useState(dummyProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10); // Fixed number of products per page
    const [isSettingsSidebarVisible, setIsSettingsSidebarVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // Product currently being edited in sidebar

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Action Handlers
    const handleEditProduct = (product) => {
        console.log("Editing product:", product);
        setEditingProduct(product);
        setIsSettingsSidebarVisible(true);
    };

    const handleDeleteProduct = (productId) => {
        console.log("Deleting product with ID:", productId);
        // In a real app, show a confirmation modal and make an API call
        if (window.confirm(`Are you sure you want to delete product ID ${productId}?`)) {
             setProducts(products.filter(p => p.id !== productId));
             console.log("Product deleted (demo).");
             // Close sidebar if the deleted product is the one being edited
             if(editingProduct && editingProduct.id === productId) {
                 setIsSettingsSidebarVisible(false);
                 setEditingProduct(null);
             }
        }
    };

    const handleAddProduct = () => {
        console.log("Adding new product");
        // In a real app, open the sidebar/modal for a new product form
        setEditingProduct({ /* Structure for a new product */ id: null, image: '', name: '', sku: '', category: '', price: 0, stock: 0, status: 'Draft' });
        setIsSettingsSidebarVisible(true);
    }

    // Settings Sidebar Handlers
    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        console.log("Saving product settings:", editingProduct);
        // In a real app, make an API call to update/create the product
        if (editingProduct.id === null) {
            // Logic to add new product
             console.log("Creating new product (demo)");
             const newProduct = { ...editingProduct, id: products.length + 1, image: editingProduct.image || '/images/placeholder-product.jpg' }; // Assign temp ID and default image
             setProducts([...products, newProduct]);
        } else {
            // Logic to update existing product
            console.log("Updating existing product (demo)");
            setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        }

        alert('Product saved (demo).');
        setIsSettingsSidebarVisible(false);
        setEditingProduct(null);
    };

    const handleCancelSettings = () => {
        console.log("Cancelling settings edit.");
        setIsSettingsSidebarVisible(false);
        setEditingProduct(null); // Discard changes
    };

    // Filter/Search Logic (basic client-side demo)
    const handleFilter = () => {
        console.log("Filtering with:", { searchTerm, selectedCategory });
        // In a real app, this would likely trigger an API call with search/filter parameters
        let filtered = dummyProducts; // Start with full list for client-side filter

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setProducts(filtered);
        setCurrentPage(1); // Reset pagination on filter/search
    };

     // Trigger filter when search term or category changes (optional auto-filter)
    // useEffect(() => {
    //      handleFilter();
    // }, [searchTerm, selectedCategory]); // Add dummyProducts to dependency array if it can change

    return (<>
          <AdminHeader />
        <div className="manage-products-page"> {/* Add a class for page-specific styling */}
            <div className="page-header-section">
                <h2 className="page-title">Create a New Product</h2> {/* Title from the image */}
                <button onClick={handleAddProduct} className="btn-add-new">
                    <PencilIcon size={18} color="white" />
                    Add New Product
                </button>
            </div>

            <div className="search-filter-bar">
                <input
                    type="text"
                    placeholder="Search products"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All Categories">All Categories</option>
                    <option value="Skimboards">Skimboards</option>
                    <option value="Accessories">Accessories</option>
                    {/* Add other categories dynamically in a real app */}
                </select>
                {/* You can add an onClick to this button if you don't auto-filter */}
                <button onClick={handleFilter} className="btn-filter">Filter</button>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(product => (
                            <tr key={product.id}>
                                <td><img src={product.image} alt={product.name} className="product-image" /></td>
                                <td className="product-name">{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.category}</td>
                                <td>${product.price.toFixed(2)}</td> {/* Format price */}
                                <td>{product.stock}</td>
                                <td className={`status-cell status-${product.status.toLowerCase()}`}>{product.status}</td>
                                <td>
                                    <div className="action-icons">
                                        <button onClick={() => handleEditProduct(product)} title="Edit Product"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteProduct(product.id)} title="Delete Product" className="delete-btn"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {/* Placeholder row if products list is short */}
                         {currentProducts.length < 3 && Array.from({ length: 3 - currentProducts.length }).map((_, i) => (
                            <tr key={`placeholder-${i}`}>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                         ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>&lt;&lt; Prev</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next &gt;&gt;</button>
            </div>

            {/* Right Product Settings Sidebar */}
            <div className={`product-settings-sidebar ${isSettingsSidebarVisible ? 'visible' : ''}`}>
                <div className="sidebar-header">
                    <h3 className="sidebar-title">Product Settings</h3>
                    <button onClick={handleCancelSettings} className="close-btn" aria-label="Close settings">
                        <CloseIcon />
                    </button>
                </div>
                {editingProduct && ( // Only show form if a product is being edited
                    <form onSubmit={handleSaveSettings}>
                         {/* Add other fields like Name, SKU, Price, Stock, Category if needed */}
                        <div className="form-group">
                            <label htmlFor="visibility">Visibility</label>
                            <select id="visibility" name="status" value={editingProduct.status} onChange={handleSettingsChange}>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                {/* Add other statuses */}
                            </select>
                        </div>
                         {/* The image shows a second visibility dropdown, possibly a placeholder or error. Replicating the first one for layout */}
                         <div className="form-group">
                            <label htmlFor="visibility2">Visibility</label>
                            <select id="visibility2" name="status2" value={editingProduct.status} onChange={handleSettingsChange}> {/* Reusing status for demo */}
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>


                        <div className="form-actions">
                            <button type="button" onClick={handleCancelSettings} className="btn-cancel">Cancel</button>
                            <button type="submit" className="btn-save">
                                <PencilIcon size={18} color="white" />
                                Save Product
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    </>);
}

export default ManageProductsPage;