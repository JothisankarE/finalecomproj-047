import React, { useState, useEffect } from 'react';
import './SaleBannerPopup.css';

const SaleBannerPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show immediately on mount (page load)
        setIsVisible(true);

        // Hide after 60 seconds (1 minute)
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="sale-banner-overlay">
            <div className="sale-banner-content">
                <button className="close-banner-btn" onClick={() => setIsVisible(false)}>×</button>

                <div className="sale-banner-image-container">
                    <div className="sale-graphic-text">
                        <h3>Limited Time Offer</h3>
                        <h1>MEGA SALE</h1>
                        <p>UP TO 50% OFF</p>
                        <button className="shop-now-btn" onClick={() => setIsVisible(false)}>SHOP NOW</button>
                    </div>
                </div>

                <div className="sale-banner-footer">
                    <div className="footer-item">
                        <span className="footer-dot"></span>
                        Premium Quality
                    </div>
                    <div className="footer-item">
                        <span className="footer-dot"></span>
                        Free Shipping
                    </div>
                    <div className="footer-item">
                        <span className="footer-dot"></span>
                        Secure Payment
                    </div>
                    <div className="footer-item">
                        <span className="footer-dot"></span>
                        24/7 Support
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleBannerPopup;
