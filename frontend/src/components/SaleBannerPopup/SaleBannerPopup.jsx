import React, { useState, useEffect, useRef } from 'react';
import './SaleBannerPopup.css';

const slides = [
    {
        id: 1,
        badge: '🔥 HOT DEAL',
        title: 'MEGA SALE',
        subtitle: 'Up to 70% OFF on Top Brands',
        cta: 'Shop Now',
        theme: 'slide-theme-1',
        emoji: '🛍️',
    },
    {
        id: 2,
        badge: '🚚 FREE DELIVERY',
        title: 'ZERO SHIPPING',
        subtitle: 'Free delivery on all orders above ₹499',
        cta: 'Order Now',
        theme: 'slide-theme-2',
        emoji: '📦',
    },
    {
        id: 3,
        badge: '💳 NO COST EMI',
        title: 'PAY EASY',
        subtitle: '0% Interest EMI on orders above ₹2000',
        cta: 'Explore Offers',
        theme: 'slide-theme-3',
        emoji: '💰',
    },
    {
        id: 4,
        badge: '⚡ TRENDING NOW',
        title: 'NEW ARRIVALS',
        subtitle: 'Fresh collections landing every day',
        cta: 'Discover',
        theme: 'slide-theme-4',
        emoji: '✨',
    },
];

const marqueeItems = [
    '🔥 Mega Sale — Up to 70% OFF',
    '🚚 Free Delivery on orders above ₹499',
    '💳 No Cost EMI Available',
    '⚡ Trending Collections — Shop Now',
    '🎁 Buy 2 Get 1 FREE on selected items',
    '🏷️ Flash Sale — Today Only!',
    '⭐ Premium Quality Guaranteed',
    '🔒 100% Secure Payments',
    '🌟 New Arrivals Every Day',
    '🤑 Exclusive Member Discounts',
];

const AUTO_CLOSE_SEC = 30;

const SaleBannerPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SEC);
    const slideInterval = useRef(null);
    const countdownInterval = useRef(null);
    const autoCloseTimer = useRef(null);
    const flagPoller = useRef(null);

    // Poll for login flag set by LoginPopup after successful login
    useEffect(() => {
        flagPoller.current = setInterval(() => {
            const flag = sessionStorage.getItem('showLoginBanner');
            if (flag === 'true') {
                sessionStorage.removeItem('showLoginBanner'); // consume flag immediately
                clearInterval(flagPoller.current);
                // Small delay so the login popup closes first
                setTimeout(() => {
                    setCurrentSlide(0);
                    setSecondsLeft(AUTO_CLOSE_SEC);
                    setIsVisible(true);
                }, 600);
            }
        }, 300);

        return () => clearInterval(flagPoller.current);
    }, []);

    // Auto-advance slides every 3 seconds
    useEffect(() => {
        if (!isVisible) return;
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(slideInterval.current);
    }, [isVisible]);

    // 30-second countdown + auto-close
    useEffect(() => {
        if (!isVisible) return;

        setSecondsLeft(AUTO_CLOSE_SEC);

        countdownInterval.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        autoCloseTimer.current = setTimeout(() => {
            triggerClose();
        }, AUTO_CLOSE_SEC * 1000);

        return () => {
            clearInterval(countdownInterval.current);
            clearTimeout(autoCloseTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    const triggerClose = () => {
        setIsClosing(true);
        clearInterval(countdownInterval.current);
        clearTimeout(autoCloseTimer.current);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 400);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        clearInterval(slideInterval.current);
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
    };

    if (!isVisible) return null;

    const slide = slides[currentSlide];
    const progressPercent = ((AUTO_CLOSE_SEC - secondsLeft) / AUTO_CLOSE_SEC) * 100;

    return (
        <div
            className={`sbp-overlay ${isClosing ? 'sbp-closing' : ''}`}
            onClick={(e) => e.target.classList.contains('sbp-overlay') && triggerClose()}
        >
            <div className={`sbp-modal ${isClosing ? 'sbp-modal-closing' : ''}`}>

                {/* Top Marquee Ticker */}
                <div className="sbp-marquee-bar">
                    <div className="sbp-marquee-track">
                        {[...marqueeItems, ...marqueeItems].map((item, i) => (
                            <span key={i} className="sbp-marquee-item">{item}</span>
                        ))}
                    </div>
                </div>

                {/* Close Button — shows live countdown */}
                <button className="sbp-close-btn" onClick={triggerClose} aria-label="Close banner">
                    <span className="sbp-close-count">{secondsLeft}</span>
                    <span className="sbp-close-x">✕</span>
                </button>

                {/* Slide Carousel */}
                <div className={`sbp-slide ${slide.theme}`}>
                    <div className="sbp-blob sbp-blob-1"></div>
                    <div className="sbp-blob sbp-blob-2"></div>
                    <div className="sbp-blob sbp-blob-3"></div>

                    <div className="sbp-slide-content" key={slide.id}>
                        <div className="sbp-slide-emoji">{slide.emoji}</div>
                        <span className="sbp-badge">{slide.badge}</span>
                        <h1 className="sbp-slide-title">{slide.title}</h1>
                        <p className="sbp-slide-subtitle">{slide.subtitle}</p>
                        <button className="sbp-cta-btn" onClick={triggerClose}>{slide.cta} →</button>
                    </div>
                </div>

                {/* Slide Dots */}
                <div className="sbp-dots">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`sbp-dot ${i === currentSlide ? 'sbp-dot-active' : ''}`}
                            onClick={() => goToSlide(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>

                {/* 30-second progress bar */}
                <div className="sbp-progress-bar-wrap">
                    <div
                        className="sbp-progress-bar"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                    <span className="sbp-progress-label">Closes in {secondsLeft}s</span>
                </div>

                {/* Bottom Marquee Strip */}
                <div className="sbp-bottom-strip">
                    <div className="sbp-bottom-strip-track">
                        {[...marqueeItems, ...marqueeItems].map((item, i) => (
                            <span key={i} className="sbp-strip-item">{item}</span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SaleBannerPopup;
