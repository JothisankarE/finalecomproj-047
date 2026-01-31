import React, { useState, useContext } from 'react';
import './SupportPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupportPopup = ({ setShowSupport }) => {
    const { url, token, userData, setToken } = useContext(StoreContext);
    const [loginMode, setLoginMode] = useState(!token);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [activeTab, setActiveTab] = useState('raise');
    const [recentTickets, setRecentTickets] = useState([]);

    const [formData, setFormData] = useState({
        name: userData?.name || '',
        mobile: '',
        issueType: 'Order Delivery',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    // Fetch tickets when tab changes
    const fetchTickets = async () => {
        try {
            const response = await axios.post(
                `${url}/api/chat/usertickets`,
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setRecentTickets(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch tickets");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error connecting to server");
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'history') {
            fetchTickets();
        }
    };

    const onLoginChange = (e) => {
        setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/user/login`, loginData);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setLoginMode(false);
                toast.success("Logged in successfully!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    const submitTicket = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const ticketMessage = `[TICKET RAISED]
Name: ${formData.name}
Mobile: ${formData.mobile}
Issue Type: ${formData.issueType}
Details: ${formData.message}`;

            await axios.post(
                `${url}/api/chat/save`,
                {
                    text: ticketMessage,
                    sender: 'user',
                    userName: formData.name,
                    issueType: formData.issueType
                },
                { headers: { token } }
            );

            // Show success state instead of closing immediately
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loginMode && !token) {
        return (
            <div className="support-popup-overlay">
                <div className="support-popup-container login-mode">
                    <div className="support-popup-header">
                        <h2>Login Required</h2>
                        <button onClick={() => setShowSupport(false)} className="close-btn">×</button>
                    </div>
                    <div className="support-form-content">
                        <div className="login-icon-wrapper">🔐</div>
                        <p className="login-message">Please login to raise a support ticket so we can track your request.</p>
                        <form onSubmit={handleLogin}>
                            <div className="form-group-modern">
                                <label>Email Address</label>
                                <input type="email" name="email" value={loginData.email} onChange={onLoginChange} required placeholder="Enter your email" />
                            </div>
                            <div className="form-group-modern">
                                <label>Password</label>
                                <input type="password" name="password" value={loginData.password} onChange={onLoginChange} required placeholder="Enter your password" />
                            </div>
                            <button type="submit" className="submit-btn-modern" disabled={loading}>
                                {loading ? "Logging in..." : "Login to Continue"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="support-popup-overlay">
                <div className="support-popup-container success-mode animate-pop-in">
                    <button onClick={() => setShowSupport(false)} className="close-btn-absolute">×</button>
                    <div className="success-content">
                        <div className="success-icon-animated">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h3>Complaint Raised!</h3>
                        <p>Thank you, <b>{formData.name}</b>. Your ticket has been successfully submitted.</p>
                        <div className="ticket-id-box">
                            <span>Ticket ID:</span>
                            <strong>#{Math.floor(Math.random() * 1000000)}</strong>
                        </div>
                        <div className="form-actions" style={{ justifyContent: 'center' }}>
                            <button className="cancel-btn" onClick={() => { setIsSubmitted(false); setActiveTab('history'); fetchTickets(); }}>View Ticket</button>
                            <button className="done-btn" onClick={() => setShowSupport(false)}>Done</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="support-popup-overlay">
            <div className="support-popup-container">
                <div className="support-popup-header-modern">
                    <div className="header-left">
                        <h2>Help Center</h2>
                        <span className="subtitle">We are here to help you</span>
                    </div>
                    <button onClick={() => setShowSupport(false)} className="close-btn-modern">×</button>
                </div>

                <div className="popup-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'raise' ? 'active' : ''}`}
                        onClick={() => handleTabChange('raise')}
                    >
                        Raise a Ticket
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => handleTabChange('history')}
                    >
                        Recent Tickets
                    </button>
                </div>

                {activeTab === 'raise' ? (
                    <form onSubmit={submitTicket} className="support-form-modern">
                        <div className="form-row">
                            <div className="form-group-modern">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChangeHandler}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="form-group-modern">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={onChangeHandler}
                                    placeholder="+91 9876543210"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-modern">
                            <label>Issue Type</label>
                            <div className="select-wrapper-modern">
                                <select name="issueType" value={formData.issueType} onChange={onChangeHandler}>
                                    <option value="Order Delivery">📦 Order Delivery</option>
                                    <option value="Payment Issue">💰 Payment & Refund</option>
                                    <option value="Account Related">👤 Account Settings</option>
                                    <option value="Product Quality">🛡️ Product Quality</option>
                                    <option value="Other">📝 Other Inquiry</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-modern">
                            <label>Issue Details</label>
                            <textarea
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={onChangeHandler}
                                placeholder="Please describe your issue in detail..."
                                required
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowSupport(false)}>Cancel</button>
                            <button type="submit" className="submit-btn-modern" disabled={loading}>
                                {loading ? (
                                    <span className="loader-dots">Submitting...</span>
                                ) : (
                                    <>Submit Ticket <span className="arrow">→</span></>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="ticket-history-list">
                        {recentTickets.length === 0 ? (
                            <div className="empty-tickets">
                                <span>🎫</span>
                                <p>No tickets found in your history.</p>
                            </div>
                        ) : (
                            recentTickets.map((ticket) => (
                                <div key={ticket._id} className="ticket-item-card">
                                    <div className="ticket-header">
                                        <span className="ticket-issue-type">{ticket.issueType || 'General Inquiry'}</span>
                                        <span className={`ticket-status-badge status-${ticket.status?.toLowerCase().replace(' ', '') || 'pending'}`}>
                                            {ticket.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="ticket-date">
                                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                    </div>
                                    <p className="ticket-message-preview">
                                        {ticket.messages && ticket.messages.length > 0
                                            ? ticket.messages[ticket.messages.length - 1].text.replace('[TICKET RAISED]', '').trim()
                                            : 'No messages'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportPopup;
