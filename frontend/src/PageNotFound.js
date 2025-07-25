import React from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// Correctly named function
function PageNotFound() {
    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
            <Header />
            </div>
            {/* --- Main Content --- */}
            {/* Improved styling for better vertical and horizontal centering */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px',
                minHeight: '60vh' // Ensures content is centered in the viewport
            }}>
                <h2 style={{ fontSize: '3rem', margin: '0' }}>404</h2>
                <h3 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Page Not Found</h3>
                <p>The page you are looking for does not exist or has been moved.</p>
            </div>
            <Footer />
        </>
    );
}

// Correct export
export default PageNotFound;