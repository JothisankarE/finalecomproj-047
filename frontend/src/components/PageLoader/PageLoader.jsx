import React, { useState, useEffect } from 'react';
import './PageLoader.css';

const PageLoader = ({ message = "Loading...", duration = 3000, onFinish }) => {

    // An array of "impressive" thoughts to cycle through
    const thoughts = [
        "Curating your experience...",
        "Gathering the finest items...",
        "Securing your connection...",
        "Almost there...",
        "Adding a touch of magic..."
    ];

    const [currentThought, setCurrentThought] = useState(0);

    useEffect(() => {
        // Cycle through thoughts every 1.5 seconds if no specific message is forced
        if (message === "Loading...") {
            const interval = setInterval(() => {
                setCurrentThought((prev) => (prev + 1) % thoughts.length);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [message]);

    return (
        <div className="page-loader-overlay">
            <div className="loader-content">
                <div className="modern-spinner"></div>
                <h2 className="loader-message">
                    {message === "Loading..." ? thoughts[currentThought] : message}
                </h2>
                <p className="loader-subtext">Hang tight, we're working on it!</p>
            </div>
        </div>
    );
};

export default PageLoader;
