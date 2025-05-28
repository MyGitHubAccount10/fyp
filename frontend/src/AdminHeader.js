import React from 'react';
import './AdminStyles.css'; // Import admin styles

// Placeholder Icons
const ProfileIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const LogoutIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 16L21 12L17 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BackIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function AdminHeader({ pageTitle }) {
    // Simple link handlers (replace with actual routing/auth logic)
    const handleLogout = () => {
        console.log("Logging out...");
        // Perform logout action, e.g., redirect to login page
    };

    const handleBack = () => {
        console.log("Going back...");
        // Perform back action, e.g., navigate back using history
        window.history.back();
    };

    return (
        <header className="admin-header">
            <div className="header-left">
                 {/* Back button - shown contextually in a real app, but always visible here */}
                <button onClick={handleBack} className="header-link header-back-btn" title="Back">
                     <BackIcon color="#000" /> {/* Use black for header icons as per image */}
                </button>
                <h1 className="header-page-title">{pageTitle}</h1>
            </div>
            <div className="header-right">
                <span className="header-welcome">Welcome, Admin!</span>
                <a href="#" className="header-link" title="Profile">
                     <ProfileIcon color="#000" />
                     Profile
                </a>
                {/* Logout is a button as it performs an action */}
                <button onClick={handleLogout} className="header-link" title="Logout">
                     <LogoutIcon color="#000" />
                     Logout
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;