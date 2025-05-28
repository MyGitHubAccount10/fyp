import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import './AdminStyles.css';

function AdminLayout({ pageTitle, children }) {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarMinimized(!isSidebarMinimized);
    };

    return (
        <div className="admin-body-wrapper"> {/* This wraps the sidebar and main content */}
            <AdminHeader pageTitle={pageTitle} />
            <div className={`admin-layout-container ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}> {/* Contains sidebar and main+right content */}
                <AdminSidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />
                {/* The main content area where pages like ManageProductsPage will be rendered */}
                <div className="admin-main-content">
                    {children} {/* This is where the specific page component is rendered */}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;