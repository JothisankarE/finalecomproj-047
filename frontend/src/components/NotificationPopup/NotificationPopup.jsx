import React, { useContext, useEffect, useState } from 'react';
import './NotificationPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { FaBell, FaCheckCircle, FaTimesCircle, FaShippingFast, FaBox, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationPopup = ({ showNotifications, setShowNotifications }) => {
    const { url, token } = useContext(StoreContext);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Fetch orders and generate notifications on mount or when popup opens
    useEffect(() => {
        if (showNotifications && token) {
            fetchNotifications();
        }
    }, [showNotifications, token]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                const orders = response.data.data;
                const generatedNotifications = generateNotifications(orders);
                setNotifications(generatedNotifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Helper to generate notification objects from order data
    const generateNotifications = (orders) => {
        let notifs = [];

        // Sort orders by date descending
        const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedOrders.forEach(order => {
            const orderId = order._id.slice(-6);

            // Notification for Order Status
            if (order.status.toLowerCase().includes('cancelled')) {
                notifs.push({
                    type: 'cancelled',
                    title: 'Order Cancelled',
                    message: `Order #${orderId} was cancelled: ${order.status.replace('Cancelled', '').replace('-', '').trim() || 'Request Denied'}`,
                    time: new Date(order.date).toLocaleDateString(), // Ideally backend provides status update time
                    read: false,
                    id: order._id + '_status'
                });
            } else if (order.status.toLowerCase() === 'delivered') {
                notifs.push({
                    type: 'delivered',
                    title: 'Order Delivered',
                    message: `Order #${orderId} has been successfully delivered. Enjoy!`,
                    time: new Date(order.date).toLocaleDateString(),
                    read: false,
                    id: order._id + '_status'
                });
            } else if (order.status.toLowerCase().includes('out')) {
                notifs.push({
                    type: 'shipping',
                    title: 'Out for Delivery',
                    message: `Good news! Order #${orderId} is out for delivery.`,
                    time: new Date(order.date).toLocaleDateString(),
                    read: false,
                    id: order._id + '_status'
                });
            }

            // Notification for Order Placement (Always show recently placed orders)
            notifs.push({
                type: 'placed',
                title: 'Order Placed',
                message: `Order #${orderId} successfully placed. Total: ₹${order.amount}`,
                time: new Date(order.date).toLocaleDateString(),
                read: true, // Mark older ones as technically 'read' in UI logic if we had it
                id: order._id + '_placed'
            });
        });

        return notifs;
    };

    const getIcon = (type) => {
        switch (type) {
            case 'cancelled': return <FaTimesCircle className="notif-icon cancelled" />;
            case 'delivered': return <FaCheckCircle className="notif-icon delivered" />;
            case 'shipping': return <FaShippingFast className="notif-icon shipping" />;
            default: return <FaBox className="notif-icon placed" />;
        }
    };

    if (!showNotifications) return null;

    return (
        <div className="notif-popup-overlay" onClick={(e) => e.target.className === 'notif-popup-overlay' && setShowNotifications(false)}>
            <div className="notif-popup-container">
                <div className="notif-header">
                    <h3>Notifications <span className="notif-count">{notifications.length}</span></h3>
                    <button className="notif-close-btn" onClick={() => setShowNotifications(false)}>
                        <FaTimes />
                    </button>
                </div>

                <div className="notif-list">
                    {notifications.length === 0 ? (
                        <div className="no-notifs">
                            <FaBell className="empty-bell" />
                            <p>No new notifications</p>
                        </div>
                    ) : (
                        notifications.map((notif, index) => (
                            <div key={index} className={`notif-item ${notif.type}`} onClick={() => {
                                setShowNotifications(false);
                                navigate('/myorders');
                            }}>
                                <div className="notif-icon-wrapper">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="notif-content">
                                    <div className="notif-top">
                                        <h4>{notif.title}</h4>
                                        <span className="notif-time">{notif.time}</span>
                                    </div>
                                    <p>{notif.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
