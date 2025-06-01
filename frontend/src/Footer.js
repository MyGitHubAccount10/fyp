import React from 'react';
import { NavLink } from 'react-router-dom';

const footer = () => {
    return (
        <>
        <footer className="footer">
            <div className="footer-column">
            <strong>#THISSIDEUP</strong>
            <div className="social-icons">
                <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
                <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
            </div>
            </div>
            <div className="footer-column">
            <strong>Customer Service</strong>
                <NavLink to="/about">About</NavLink><br />
                <NavLink to="/contact">Contact</NavLink><br />
                <NavLink to="/faq">FAQ</NavLink>
            </div>
            <div className="footer-column">
            <strong>Handcrafted in Singapore</strong>
            Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited community of adventure seekers and champion an active, sun-soaked lifestyle.
            </div>
        </footer>
        </>
    );
}

export default footer;