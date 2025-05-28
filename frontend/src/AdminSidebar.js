import React from 'react';
import './AdminStyles.css'; // Import admin styles

// Assuming logo is in public/images/admin-logo.png or similar
const adminLogo = '/images/this-side-up-admin-logo.png'; // Replace with your actual admin logo path

// Placeholder for icons (you might replace these with SVG components or an icon library)
const DashboardIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H10ZM10 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ProductsIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 21.7893 20.2107 21.4142 20.5858 21.0391C20.9609 20.664 21.1716 20.1554 21.1716 19.625V6L18 2H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CustomDesignsIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 19.5L18 14L12.5 8.5L7 14L12.5 19.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.5 19.5L18 14L12.5 8.5L7 14L12.5 19.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; // Example placeholder
const OrdersIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; // Example placeholder
const CustomersIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SalesReportsIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; // Example placeholder
const InventoryIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; // Example placeholder
const CategoriesIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V9C2 9.53043 2.21071 10.0391 2.58579 10.4142C2.96086 10.7893 3.46957 11 4 11H10C10.5304 11 11.0391 10.7893 11.4142 10.4142C11.7893 10.0391 12 9.53043 12 9V5C12 4.46957 11.7893 3.96086 11.4142 3.58579C11.0391 3.21071 10.5304 3 10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 3H14C13.4696 3 12.9609 3.21071 12.5858 3.58579C12.2107 3.96086 12 4.46957 12 5V9C12 9.53043 12.2107 10.0391 12.5858 10.4142C12.9609 10.7893 13.4696 11 14 11H20C20.5304 11 21.0391 10.7893 21.4142 10.4142C21.7893 10.0391 22 9.53043 22 9V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 13H4C3.46957 13 2.96086 13.2107 2.58579 13.5858C2.21071 13.9609 2 14.4696 2 15V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H10C10.5304 21 11.0391 20.7893 11.4142 20.4142C11.7893 20.0391 12 19.5304 12 19V15C12 14.4696 11.7893 13.9609 11.4142 13.5858C11.0391 13.2107 10.5304 13 10 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 13H14C13.4696 13 12.9609 13.2107 12.5858 13.5858C12.2107 13.9609 12 14.4696 12 15V19C12 19.5304 12.2107 20.0391 12.5858 20.4142C12.9609 20.7893 13.4696 21 14 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V15C22 14.4696 21.7893 13.9609 21.4142 13.5858C21.0391 13.2107 20.5304 13 20 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; // Example placeholder
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.03 16.17L16.82 17.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.04001 16.82L8.83001 15.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.17 15.03L4.96001 16.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.82 7.04001L15.03 8.83001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.96001 7.04001L3.17001 8.83001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.83001 7.04001L7.04001 8.83001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; // Example placeholder

const AngleLeftIcon = ({ size = 24, color = "currentColor" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M15 18L9 12L15 6"/>
    </svg>
);


function AdminSidebar({ isMinimized, toggleSidebar }) {
    // In a real app, 'active' state would come from routing (e.g., react-router-dom's useLocation)
    const activeItem = 'Products'; // Hardcoded active item for demo

    const menuItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, link: '#' },
        { name: 'Products', icon: <ProductsIcon />, link: '#products' }, // Example link
        { name: 'Custom Designs', icon: <CustomDesignsIcon />, link: '#' },
        { name: 'Orders', icon: <OrdersIcon />, link: '#' },
        { name: 'Customers', icon: <CustomersIcon />, link: '#' },
        { name: 'Sales Reports', icon: <SalesReportsIcon />, link: '#' },
        { name: 'Inventory', icon: <InventoryIcon />, link: '#' },
        { name: 'Categories & Apparel', icon: <CategoriesIcon />, link: '#' },
        { name: 'Settings', icon: <SettingsIcon />, link: '#' },
    ];

    return (
        <div className={`admin-sidebar ${isMinimized ? 'minimized' : ''}`}>
            <div className="sidebar-header">
                <a href="/admin" className="sidebar-logo"> {/* Example link to admin home */}
                     {/* Replace with your SVG logo if preferred */}
                    <img src={adminLogo} alt="This Side Up Admin" />
                    <span>This Side Up<br/>Admin Panel</span>
                </a>
                <button onClick={toggleSidebar} className="sidebar-toggle-btn" aria-label="Toggle Sidebar">
                    <AngleLeftIcon color="#adb5bd" size={20} />
                </button>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <a
                                href={item.link}
                                className={item.name === activeItem ? 'active' : ''}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default AdminSidebar;