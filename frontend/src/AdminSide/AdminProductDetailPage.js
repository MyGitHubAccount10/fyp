// Copy Add product page(once add product page is done)




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../AdminHeader'; 



function AdminProductDetail() {
    const navigate = useNavigate();



    return (
        <div className="add-product-page"> {/* Page-specific class */}
            <AdminHeader />
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <h2>Product Detail Page</h2>
            <span>Yet to be finished</span>
            </div>
        </div> // End Page Container
    );
}

export default AdminProductDetail;