import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const banners = [
        {
            id: 1,
            title: "Traditional Dhotis",
            subtitle: "Flat 20% Off on Premium Cotton Dhotis",
            image: "/src/assets/header_banner.png", // Reusing ensuring it exists, or use another if available
            offer: "Limited Time Offer"
        },
        {
            id: 2,
            title: "Luxury Bed Spreads",
            subtitle: "Upgrade your bedroom with our new arrivals",
            image: "https://images.unsplash.com/photo-1522771753062-5a31a5052478?auto=format&fit=crop&w=1600&q=80", // Using a placeholder URL for variety if local not avail
            offer: "New Arrival Special"
        },
        {
            id: 3,
            title: "Soft Cotton Towels",
            subtitle: "Buy 2 Get 1 Free on all Bath Towels",
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=80",
            offer: "Bundle Deal"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic (Marquee effect)
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Scrolls every 5 seconds
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    return (
        <div className="header">
            <div
                className="header-carousel"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div className="ad-slide" key={banner.id}>
                        {/* Fallback to header_banner.png if external fails or just use it for all if preferred */}
                        <img
                            src={banner.id === 1 ? "/src/assets/header_banner.png" : banner.image}
                            alt={banner.title}
                            onError={(e) => { e.target.src = "/src/assets/header_banner.png" }}
                        />
                        <div className="ad-content">
                            <span className="offer-badge">{banner.offer}</span>
                            <h2>{banner.title}</h2>
                            <p>{banner.subtitle}</p>
                            <a href="#explore-menu" className="shop-now-btn">Shop Deal</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="carousel-nav">
                <button className="nav-btn prev" onClick={prevSlide}>❮</button>
                <button className="nav-btn next" onClick={nextSlide}>❯</button>
            </div>
        </div>
    );
}

export default Header;
