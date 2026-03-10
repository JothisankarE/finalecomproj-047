import React, { useContext } from 'react';
import './AboutPopup.css';
import { StoreContext } from '../../Context/StoreContext';

const AboutPopup = () => {
    const { showAboutPopup, setShowAboutPopup } = useContext(StoreContext);

    if (!showAboutPopup) return null;

    return (
        <div className="about-popup-overlay" onClick={() => setShowAboutPopup(false)}>
            <div className="about-popup" onClick={(e) => e.stopPropagation()}>
                <div className="about-popup-header">
                    <h2>About Us</h2>
                    <button className="close-about-btn" onClick={() => setShowAboutPopup(false)}>×</button>
                </div>

                <div className="about-popup-content">
                    <p><strong>Gowri Handlooms Pvt Ltd</strong>, established in 1994, is a leading manufacturer of premium handcrafted textiles from Erode, India.</p>

                    <h3>Our Mission</h3>
                    <p>To create fabrics that blend tradition with modern elegance, ensuring top-notch quality for our global customers.</p>

                    <h3>Why Choose Us?</h3>
                    <p>From Bed Spreads to Dhotis, we obsess over every thread to deliver durability and comfort.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPopup;
