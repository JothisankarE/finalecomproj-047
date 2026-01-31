import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './UPIPaymentPopup.css';

const UPIPaymentPopup = ({
    isOpen,
    onClose,
    onPaymentComplete,
    upiId,
    amount,
    merchantName = "ECommerce Store",
    orderId
}) => {
    const [countdown, setCountdown] = useState(300); // 5 minutes countdown
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

    // Generate UPI payment URL
    const generateUPIUrl = () => {
        // UPI URL format: upi://pay?pa=<payee-vpa>&pn=<payee-name>&am=<amount>&cu=<currency>&tn=<transaction-note>
        const payeeVPA = upiId; // The merchant's UPI ID (you can change this to your business UPI)
        const payeeName = encodeURIComponent(merchantName);
        const transactionNote = encodeURIComponent(`Payment for Order #${orderId}`);

        return `upi://pay?pa=${payeeVPA}&pn=${payeeName}&am=${amount}&cu=INR&tn=${transactionNote}`;
    };

    // Countdown timer
    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    // Format countdown as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePaymentConfirm = () => {
        setPaymentStatus('processing');
        // Simulate payment verification (in production, you'd verify with backend)
        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                onPaymentComplete();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="upi-popup-overlay" onClick={onClose}>
            <div className="upi-popup-container" onClick={(e) => e.stopPropagation()}>
                <button className="upi-popup-close" onClick={onClose}>×</button>

                <div className="upi-popup-header">
                    <div className="upi-logo">
                        <span className="upi-logo-icon">📱</span>
                        <span className="upi-logo-text">UPI Payment</span>
                    </div>
                    <h2>Scan to Pay</h2>
                </div>

                <div className="upi-popup-content">
                    {paymentStatus === 'success' ? (
                        <div className="payment-success">
                            <div className="success-icon">✓</div>
                            <h3>Payment Successful!</h3>
                            <p>Your order has been placed.</p>
                        </div>
                    ) : paymentStatus === 'processing' ? (
                        <div className="payment-processing">
                            <div className="spinner"></div>
                            <h3>Verifying Payment...</h3>
                            <p>Please wait while we confirm your payment.</p>
                        </div>
                    ) : (
                        <>
                            <div className="qr-code-container">
                                <QRCodeSVG
                                    value={generateUPIUrl()}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                    bgColor="#ffffff"
                                    fgColor="#1a1a2e"
                                />
                            </div>

                            <div className="payment-details">
                                <div className="detail-row">
                                    <span className="label">Amount</span>
                                    <span className="value amount">₹{amount}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Pay to</span>
                                    <span className="value">{upiId}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Order ID</span>
                                    <span className="value">#{orderId}</span>
                                </div>
                            </div>

                            <div className="timer-section">
                                <div className={`timer ${countdown < 60 ? 'warning' : ''}`}>
                                    <span className="timer-icon">⏱️</span>
                                    <span className="timer-text">Time remaining: {formatTime(countdown)}</span>
                                </div>
                                {countdown === 0 && (
                                    <p className="expired-text">QR Code expired. Please try again.</p>
                                )}
                            </div>

                            <div className="instructions">
                                <h4>How to pay:</h4>
                                <ol>
                                    <li>Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
                                    <li>Tap on "Scan QR Code"</li>
                                    <li>Scan this QR code</li>
                                    <li>Verify the amount and complete payment</li>
                                    <li>Click "I have paid" below after successful payment</li>
                                </ol>
                            </div>

                            <div className="upi-apps">
                                <span>Supported Apps:</span>
                                <div className="app-icons">
                                    <span className="app-icon" title="Google Pay">💳</span>
                                    <span className="app-icon" title="PhonePe">📲</span>
                                    <span className="app-icon" title="Paytm">💰</span>
                                    <span className="app-icon" title="BHIM">🏦</span>
                                </div>
                            </div>

                            <button
                                className="confirm-payment-btn"
                                onClick={handlePaymentConfirm}
                                disabled={countdown === 0}
                            >
                                I have completed the payment
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UPIPaymentPopup;
