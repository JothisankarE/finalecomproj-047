import React, { useContext, useEffect, useState, useCallback } from 'react';
import './NotificationPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import {
    FaBell, FaCheckCircle, FaTimesCircle,
    FaShippingFast, FaBox, FaTimes, FaReceipt, FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationPopup = ({ showNotifications, setShowNotifications }) => {
    const { url, token } = useContext(StoreContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [readIds, setReadIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem('notif_read') || '[]'); } catch { return []; }
    });
    const navigate = useNavigate();

    const generateNotifications = useCallback((orders) => {
        let notifs = [];
        const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

        sorted.forEach(order => {
            const orderId = order._id.slice(-6).toUpperCase();
            const dateStr = new Date(order.date).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const timeStr = new Date(order.date).toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit'
            });

            const status = order.status.toLowerCase();

            if (status.includes('cancelled')) {
                notifs.push({
                    type: 'cancelled', id: order._id + '_cancelled',
                    title: 'Order Cancelled',
                    message: `Order #${orderId} has been cancelled.`,
                    date: dateStr, time: timeStr, orderId: order._id, amount: order.amount
                });
            }
            if (status === 'delivered') {
                notifs.push({
                    type: 'delivered', id: order._id + '_delivered',
                    title: '✅ Order Delivered!',
                    message: `Order #${orderId} was delivered successfully. Enjoy your purchase!`,
                    date: dateStr, time: timeStr, orderId: order._id, amount: order.amount
                });
            }
            if (status.includes('out for delivery') || status.includes('out')) {
                notifs.push({
                    type: 'shipping', id: order._id + '_shipping',
                    title: '🚚 Out for Delivery',
                    message: `Order #${orderId} is on the way! Expected today.`,
                    date: dateStr, time: timeStr, orderId: order._id, amount: order.amount
                });
            }
            if (status.includes('processing') || status.includes('food processing')) {
                notifs.push({
                    type: 'processing', id: order._id + '_processing',
                    title: '⚙️ Order Processing',
                    message: `Order #${orderId} is being prepared for dispatch.`,
                    date: dateStr, time: timeStr, orderId: order._id, amount: order.amount
                });
            }

            // Always show order placed
            notifs.push({
                type: 'placed', id: order._id + '_placed',
                title: 'Order Placed',
                message: `Order #${orderId} confirmed — ₹${order.amount}`,
                date: dateStr, time: timeStr, orderId: order._id, amount: order.amount
            });
        });

        return notifs;
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                setNotifications(generateNotifications(response.data.data || []));
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [token, url, generateNotifications]);

    useEffect(() => {
        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications]);

    // Real-time polling every 30s while panel is open
    useEffect(() => {
        if (!showNotifications || !token) return;
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [showNotifications, token]);

    const markAllRead = () => {
        const ids = notifications.map(n => n.id);
        setReadIds(ids);
        localStorage.setItem('notif_read', JSON.stringify(ids));
    };

    const isUnread = (id) => !readIds.includes(id);
    const unreadCount = notifications.filter(n => isUnread(n.id)).length;

    const getIcon = (type) => {
        switch (type) {
            case 'cancelled': return <FaTimesCircle />;
            case 'delivered': return <FaCheckCircle />;
            case 'shipping': return <FaShippingFast />;
            case 'processing': return <FaReceipt />;
            default: return <FaBox />;
        }
    };

    const handleItemClick = (notif) => {
        // Mark this notif as read
        const newRead = [...new Set([...readIds, notif.id])];
        setReadIds(newRead);
        localStorage.setItem('notif_read', JSON.stringify(newRead));
        setShowNotifications(false);
        navigate('/myorders');
    };

    if (!showNotifications) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="notif-backdrop" onClick={() => setShowNotifications(false)} />

            {/* Panel */}
            <div className="notif-panel">

                {/* Header */}
                <div className="notif-panel-header">
                    <div className="notif-panel-title">
                        <FaBell className="notif-panel-bell" />
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="notif-unread-pill">{unreadCount} new</span>
                        )}
                    </div>
                    <div className="notif-panel-actions">
                        {unreadCount > 0 && (
                            <button className="notif-mark-read" onClick={markAllRead}>
                                Mark all read
                            </button>
                        )}
                        <button className="notif-close-btn" onClick={() => setShowNotifications(false)}>
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="notif-panel-body">
                    {loading ? (
                        <div className="notif-loading">
                            <FaSpinner className="notif-spinner" />
                            <p>Fetching notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="notif-empty">
                            <div className="notif-empty-icon">
                                <FaBell />
                            </div>
                            <h4>All caught up!</h4>
                            <p>You have no notifications yet.<br />Place an order to get started.</p>
                        </div>
                    ) : (
                        <div className="notif-list">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notif-item notif-item--${notif.type} ${isUnread(notif.id) ? 'notif-item--unread' : ''}`}
                                    onClick={() => handleItemClick(notif)}
                                >
                                    {/* Unread dot */}
                                    {isUnread(notif.id) && <span className="notif-dot" />}

                                    {/* Icon */}
                                    <div className={`notif-icon-wrap notif-icon-wrap--${notif.type}`}>
                                        {getIcon(notif.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="notif-content">
                                        <div className="notif-title-row">
                                            <h4>{notif.title}</h4>
                                            <span className="notif-time">{notif.time}</span>
                                        </div>
                                        <p className="notif-msg">{notif.message}</p>
                                        <span className="notif-date">{notif.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="notif-panel-footer">
                        <button onClick={() => { setShowNotifications(false); navigate('/myorders'); }}>
                            View all orders →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationPopup;
