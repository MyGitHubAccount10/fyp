// src/AdminSide/E_AllPromosPage.js

import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate, useLocation } from 'react-router-dom';

import './AdminStyles.css'; 

import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function AllPromosPage() {
    const [allPromos, setAllPromos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [currentPage, setCurrentPage] = useState(1);
    const [promosPerPage] = useState(10);
    const navigate = useNavigate();
    const location = useLocation();
    const [modalImage, setModalImage] = useState(null);
    const [currentPromo, setCurrentPromo] = useState(null);

    // Get the page number and filters from location state when returning from edit/add page
    useEffect(() => {
        if (location.state?.returnToPage) {
            setCurrentPage(location.state.returnToPage);
        }
        if (location.state?.filters) {
            const { searchTerm: savedSearchTerm, selectedStatus: savedStatus } = location.state.filters;
            setSearchTerm(savedSearchTerm);
            setSelectedStatus(savedStatus);
        }
    }, [location.state]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/promo`)
            .then(res => res.json())
            .then(data => {
                setAllPromos(data);
            })
            .catch(err => {
                console.error("Failed to fetch promos:", err);
            });
    }, []);

    // Get promo status helper function
    const getStatus = useCallback((promo) => {
        return promo.is_active ? 'Active' : 'Inactive';
    }, []);

    // Real-time filtered promos based on current filters
    const filteredPromos = allPromos.filter(promo => {
        const matchesSearch = searchTerm === '' || 
                             promo.promo_title.toLowerCase().includes(searchTerm.toLowerCase());

        const promoStatus = getStatus(promo);
        const matchesStatus = selectedStatus === 'All Statuses' || 
                             promoStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic based on filtered promos
    const indexOfLastPromo = currentPage * promosPerPage;
    const indexOfFirstPromo = indexOfLastPromo - promosPerPage;
    const currentPromos = filteredPromos.slice(indexOfFirstPromo, indexOfLastPromo);
    const totalPages = Math.ceil(filteredPromos.length / promosPerPage);

    const handleApplyFilters = () => {
        console.log("Applying filters:", { searchTerm, selectedStatus });
        setCurrentPage(1); // Reset to first page on new filter
    };

    // Auto-apply filters when filter values change
    useEffect(() => {
        handleApplyFilters();
    }, [searchTerm, selectedStatus]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const navigateToEditPromo = (promoId) => { 
        navigate(`/edit-promo/${promoId}`, {
            state: { 
                returnToPage: currentPage,
                filters: {
                    searchTerm,
                    selectedStatus
                }
            }
        });
    };

    const handleDeletePromo = async (promoId) => {
        const promoToDelete = allPromos.find(p => p._id === promoId);
        if (window.confirm(`Are you sure you want to delete "${promoToDelete?.promo_title}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo/${promoId}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`Failed to delete promo: ${errorData.error || response.statusText}`);
                }
                setAllPromos(prevPromos => prevPromos.filter(p => p._id !== promoId));
                alert("✅ Promo deleted successfully!");
            } catch (error) {
                console.error("Delete failed:", error);
                alert(`❌ Failed to delete promo: ${error.message}`);
            }
        }
    };

    const handleAddPromo = () => {
        navigate('/add-promo', {
            state: { 
                returnToPage: currentPage,
                filters: {
                    searchTerm,
                    selectedStatus
                }
            }
        });
    }

    const getPromoStatusClass = (status) => {
        switch (status) {
            case 'Active': return 'status-in-stock';
            case 'Inactive': return 'status-no-stock';
            default: return '';
        }
    };

    const openImagePreview = (promo) => {
        setCurrentPromo(promo);
        setModalImage(`${promo.promo_image}`);
    };

    const closeModal = () => {
        setModalImage(null);
        setCurrentPromo(null);
    };

    return (<>
        <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
            <AdminHeader />
        </div>
        <div className="manage-products-page">
            <div className="title-row">
                <h2>Homepage Promo Images</h2>
                <button onClick={handleAddPromo} className="add-new-btn">
                    <MdEdit size={18} color="white"/>
                    Add New Promo
                </button>
            </div>
            
            <div className='card'>
                <div className="card-input">
                    <input type="text" placeholder="Search by title..."  
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                    {/* All Statuses */}
                    <select style={{ flex: '1', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="All Statuses">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Promos Summary */}
            <div className="products-summary" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em', color: '#333' }}>Promo Images Overview</h3>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    <div>
                        <strong>Total Promos:</strong> <span style={{ color: '#007bff' }}>{allPromos.length}</span>
                    </div>
                    <div>
                        <strong>Active Promos:</strong> <span style={{ color: '#28a745' }}>{allPromos.filter(p => p.is_active).length}</span>
                    </div>
                    <div>
                        <strong>Filtered Results:</strong> <span style={{ color: '#ffc107' }}>{filteredPromos.length}</span>
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

            {modalImage && currentPromo && (
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
                    {/* Modal content */}
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
                        {/* Promo Image with Overlaid Title */}
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
                                alt={`${currentPromo.promo_title} preview`}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                            />
                            {/* Promo Title Overlay */}
                            <div className="modal-product-name-overlay">
                                {currentPromo.promo_title}
                            </div>
                        </div>
                        {/* Promo Details */}
                        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '15px', textAlign: 'center', color: '#fff' }}>
                            <p><strong>Link:</strong> {currentPromo.promo_link}</p>
                            <p><strong>Display Order:</strong> {currentPromo.display_order}</p>
                            <p><strong>Status:</strong> {getStatus(currentPromo)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Promos Table */}
            <div className="card" style={{ overflowX: 'auto'}}>
                <table className="my-table">
                    <thead>
                        <tr>
                            <th className="promo-image-col">Image</th>
                            <th className="promo-title-col">Title</th>
                            <th className="promo-link-col">Link</th>
                            <th className="promo-order-col">Display Order</th>
                            <th className="promo-status-col">Status</th>
                            <th className="promo-created-col">Created</th>
                            <th className="promo-action-col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentPromos.length > 0 ? (
                        currentPromos.map((promo) => (
                        <tr key={promo._id}>
                            <td className="promo-image-col">
                                <img
                                    src={`${promo.promo_image}`}
                                    alt={promo.promo_title}
                                    className="admin-product-image"
                                    onClick={() => openImagePreview(promo)}
                                    onError={(e) => (e.target.src = '/images/placeholder-product.jpg')}
                                />
                            </td>
                            <td className="promo-title-col" style={{ fontWeight: 'bold' }}>{promo.promo_title}</td>
                            <td className="promo-link-col">
                                <a href={promo.promo_link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                                    {promo.promo_link.length > 30 ? promo.promo_link.substring(0, 30) + '...' : promo.promo_link}
                                </a>
                            </td>
                            <td className="promo-order-col" style={{ textAlign: 'center' }}>{promo.display_order}</td>
                            <td className="promo-status-col">
                                <span className={getPromoStatusClass(getStatus(promo))}>
                                    {getStatus(promo)}
                                </span>
                            </td>
                            <td className="promo-created-col">{new Date(promo.createdAt).toLocaleDateString()}</td>
                            <td className="promo-action-col">
                                <div className="actionButton">
                                    <button className='editbutton' onClick={() => navigateToEditPromo(promo._id)} title="Edit Promo"><MdEdit size={39}/></button>
                                    <button className='deletebutton' onClick={() => handleDeletePromo(promo._id)} title="Delete Promo" ><IoMdTrash size={24} /></button>
                                </div>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                No promo images found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

export default AllPromosPage;
