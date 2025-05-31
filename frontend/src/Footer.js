import React from 'react';

const footer = () => {
    return (
        <>
        <footer className="footer">
            <div className="footer-column">
            <strong>#THISSIDEUP</strong>
            <div className="social-icons">
                <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
                <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
            </div>
            </div>
            <div className="footer-column">
            <strong>Customer Service</strong>
            <a href="#">Contact</a><br />
            <a href="#">FAQ</a><br />
            <a href="#">About</a>
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