import React, { useEffect, useState } from 'react';
import './OrderTrackingPopup.css';
import { FaBox, FaTruck, FaHome, FaCheck, FaTimes } from 'react-icons/fa';

const OrderTrackingPopup = ({ isOpen, onClose, currentStatus }) => {

    if (!isOpen) return null;

    // Steps configuration
    const steps = [
        {
            name: 'Processing',
            subtitle: 'Seller is processing your order',
            icon: <FaBox />,
            statusKey: 'food processing'
        },
        {
            name: 'Out for delivery',
            subtitle: 'Order is on the way',
            icon: <FaTruck />,
            statusKey: 'out for delivery'
        },
        {
            name: 'Delivered',
            subtitle: 'Order has been delivered',
            icon: <FaHome />,
            statusKey: 'delivered'
        }
    ];

    // Determine active index
    // Note: status from backend might be mixed case, adjust appropriately
    const getStatusIndex = (status) => {
        if (!status) return 0;
        const normalizedStatus = status.toLowerCase();

        if (normalizedStatus.includes('processing')) return 0;
        if (normalizedStatus.includes('out')) return 1;
        if (normalizedStatus.includes('delivered')) return 2;
        if (normalizedStatus.includes('cancelled')) return -1;
        return 0; // Default
    };

    const activeIndex = getStatusIndex(currentStatus);
    const [progressWidth, setProgressWidth] = useState(0);

    // Animate progress line on mount
    useEffect(() => {
        // Calculate width: 0% for step 0, 50% for step 1, 100% for step 2
        // Assuming 3 steps -> 2 intervals
        if (activeIndex >= 0) {
            const width = (activeIndex / (steps.length - 1)) * 100;
            // Small delay to allow CSS transition to be visible
            setTimeout(() => setProgressWidth(width), 100);
        }
    }, [activeIndex]);

    return (
        <div className="tracking-popup-overlay" onClick={(e) => e.target.className === 'tracking-popup-overlay' && onClose()}>
            <div className="tracking-popup-container">
                <button className="close-tracking-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="tracking-header">
                    <h2>Track Order Status</h2>
                    <p>Refer to the status below for real-time updates</p>
                </div>

                <div className="tracking-stepper">
                    {/* Background Line */}
                    <div className="progress-line-bg"></div>

                    {/* Active Fill Line */}
                    <div className="progress-line-fill" style={{ width: `${progressWidth}%` }}></div>

                    {/* Steps */}
                    {steps.map((step, index) => {
                        const isCompleted = index <= activeIndex;
                        const isActive = index === activeIndex;

                        return (
                            <div key={index} className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                <div className="step-circle">
                                    {step.icon}
                                    <div className="step-check">
                                        <FaCheck />
                                    </div>
                                </div>
                                <span className="step-label">{step.name}</span>
                                <span className="step-subtitle">{step.subtitle}</span>
                            </div>
                        );
                    })}
                </div>

                {activeIndex === -1 && (
                    <div style={{ textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>
                        {currentStatus === 'Cancelled' ? 'This order has been cancelled.' : currentStatus}
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderTrackingPopup;
