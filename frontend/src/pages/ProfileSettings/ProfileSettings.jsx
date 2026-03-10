import React, { useContext, useEffect, useState } from 'react';
import './ProfileSettings.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileSettings = ({ setShowSupport }) => {
    const { userData, updateUserProfile, url, token, setProfileImagePreview } = useContext(StoreContext);
    const [image, setImage] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        if (userData.name) {
            setNewName(userData.name);
        }
    }, [userData.name]);

    useEffect(() => {
        return () => {
            setProfileImagePreview(null);
        }
    }, [])

    // Greeting logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const fetchUserOrders = async () => {
        if (token) {
            try {
                const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
                if (response.data.success) {
                    setOrders(response.data.data.reverse());
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
    }

    useEffect(() => {
        fetchUserOrders();
    }, [token]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", newName || userData.name || "User");
        if (userData.address) formData.append("address", userData.address);
        if (userData.theme) formData.append("theme", userData.theme);
        if (image) {
            formData.append("image", image);
        }
        await updateUserProfile(formData);
        setImage(null);
        setProfileImagePreview(null);
        setIsEditingName(false);
    };

    const statusWorkflow = [
        { name: "Processing", icon: "📦" },
        { name: "Out for delivery", icon: "🚚" },
        { name: "Delivered", icon: "🏠" }
    ];

    return (
        <div className='profile-settings-page'>
            {/* Header Area */}
            <div className="settings-hero">
                <div className="hero-content">
                    <h2>{getGreeting()}, {userData.name ? userData.name.split(' ')[0] : 'Guest'}!</h2>
                    <p>Manage your account, track activity, and discover rewards.</p>
                </div>
            </div>

            <div className="settings-main-grid">
                {/* Left Sidebar Menu */}
                <div className="settings-sidebar">
                    <div className="sidebar-section">
                        <h4>Account Settings</h4>
                        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                            <i className="fi fi-rr-user"></i> My Profile
                        </button>
                        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                            <i className="fi fi-rr-box-alt"></i> My Orders
                        </button>
                    </div>

                    <div className="sidebar-section">
                        <h4>My Activity</h4>
                        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
                            <i className="fi fi-rr-star"></i> Reviews
                        </button>
                        <button className={activeTab === 'qa' ? 'active' : ''} onClick={() => setActiveTab('qa')}>
                            <i className="fi fi-rr-interrogation"></i> Questions & Answers
                        </button>
                    </div>

                    <div className="sidebar-section">
                        <h4>Offers & Support</h4>
                        <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => setActiveTab('coupons')}>
                            <i className="fi fi-rr-ticket"></i> My Coupons
                        </button>
                        <button className={activeTab === 'help' ? 'active' : ''} onClick={() => setActiveTab('help')}>
                            <i className="fi fi-rr-customer-service"></i> Help Center
                        </button>
                        <button className={activeTab === 'ticket' ? 'active' : ''} onClick={() => setShowSupport(true)}>
                            <i className="fi fi-rr-envelope-plus"></i> Raise a Ticket
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="tab-pane active fade-in">
                            <div className="profile-info-header">
                                <h3>Personal Profile</h3>
                                <p>Update your photo and personal details here.</p>
                            </div>

                            <div className="profile-card-modern">
                                <div className="profile-photo-upload-wrapper">
                                    <div className="profile-avatar-container">
                                        <img
                                            src={image ? URL.createObjectURL(image) : (userData.image ? `${url}/images/${userData.image}` : assets.profile_icon)}
                                            alt="User Avatar"
                                            className="main-avatar"
                                        />
                                        <label htmlFor="photo-upload" className="camera-btn-floating">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                <circle cx="12" cy="13" r="4"></circle>
                                            </svg>
                                        </label>
                                        <input type="file" id="photo-upload" hidden onChange={handleImageChange} accept="image/*" />
                                    </div>

                                    <div className="profile-text-info">
                                        <div className="name-edit-wrapper">
                                            {isEditingName ? (
                                                <input
                                                    type="text"
                                                    className="edit-name-input"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    autoFocus
                                                    onBlur={() => { if (newName === userData.name) setIsEditingName(false) }}
                                                />
                                            ) : (
                                                <div className="name-display-row">
                                                    <h2 className="user-displayName">{userData.name || 'Anonymous User'}</h2>
                                                    <button className="small-edit-btn" onClick={() => setIsEditingName(true)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="user-displayEmail">{userData.email}</p>

                                        {(image || (newName !== userData.name)) && (
                                            <div className="update-actions fade-in">
                                                <button className="save-profile-btn" onClick={handleUpdateProfile}>
                                                    Apply Changes
                                                </button>
                                                <button className="cancel-selection-btn" onClick={() => {
                                                    setImage(null);
                                                    setProfileImagePreview(null);
                                                    setNewName(userData.name);
                                                    setIsEditingName(false);
                                                }}>Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="additional-info-grid">
                                <div className="info-box">
                                    <label>Account Status</label>
                                    <div className="status-verify">
                                        <span className="verify-icon">✓</span>
                                        Verified Member
                                    </div>
                                </div>
                                <div className="info-box">
                                    <label>Member Since</label>
                                    <p>{new Date(userData.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="tab-pane active fade-in">
                            <div className="tracking-section">
                                <h3>Active Tracking</h3>
                                {orders.length > 0 ? (
                                    <div className="order-tracking-card">
                                        <div className="card-header">
                                            <div className="order-info-brief">
                                                <span className="order-label">ORDER ID</span>
                                                <span className="order-value">#{orders[0]._id.slice(-8)}</span>
                                            </div>
                                            <div className="order-info-brief">
                                                <span className="order-label">ESTIMATED DELIVERY</span>
                                                <span className="order-value">Within 3-5 Days</span>
                                            </div>
                                            <div className="status-badge-container">
                                                <span className="status-badge-glow">{orders[0].status}</span>
                                            </div>
                                        </div>

                                        <div className="tracking-visual">
                                            <div className="progress-track-line">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(statusWorkflow.findIndex(s => s.name === orders[0].status) + 1) * 33}%` }}
                                                ></div>
                                            </div>
                                            <div className="steps-container">
                                                {statusWorkflow.map((step, index) => {
                                                    const isChecked = statusWorkflow.findIndex(s => s.name === orders[0].status) >= index;
                                                    return (
                                                        <div key={step.name} className={`tracking-step ${isChecked ? 'completed' : ''}`}>
                                                            <div className="step-icon-circle">
                                                                <span className="step-emoji">{step.icon}</span>
                                                                {isChecked && <div className="check-mark">✓</div>}
                                                            </div>
                                                            <span className="step-label">{step.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="order-item-mini-preview">
                                            <p>Package includes <b>{orders[0].items.length} items</b> totaling <b>₹{orders[0].amount}</b></p>
                                            <button className="view-details-btn" onClick={() => setActiveTab('orders')}>View Details</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-icon">📂</div>
                                        <p>No active orders found in your history.</p>
                                        <button className="shop-btn-blue" onClick={() => window.location.href = '/#explore-menu'}>Start Shopping</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="tab-pane active fade-in">
                            <div className="activity-card">
                                <h3>My Reviews</h3>
                                <div className="empty-activity">
                                    <img src={assets.bag_icon} alt="Empty" style={{ width: '60px', opacity: 0.2 }} />
                                    <p>You haven't reviewed any products yet.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'qa' && (
                        <div className="tab-pane active fade-in">
                            <div className="activity-card">
                                <h3>Questions & Answers</h3>
                                <div className="empty-activity">
                                    <p>Your questions and answers will appear here.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'coupons' && (
                        <div className="tab-pane active fade-in">
                            <div className="coupons-section-modern">
                                <h3>My Rewards & Coupons</h3>
                                <div className="coupons-container">
                                    <div className="premium-coupon-card">
                                        <div className="coupon-left-part">
                                            <div className="discount-circle">
                                                <span className="percent">10</span>
                                                <span className="off-text">% OFF</span>
                                            </div>
                                        </div>
                                        <div className="coupon-main-part">
                                            <div className="coupon-details">
                                                <h4>Welcome Reward</h4>
                                                <p>Valid on all products over ₹500</p>
                                                <div className="expiry-tag">Expires in 15 days</div>
                                            </div>
                                            <div className="coupon-action">
                                                <div className="promo-code">WELCOME10</div>
                                                <button className="copy-btn" onClick={() => { navigator.clipboard.writeText('WELCOME10'); toast.success('Code copied!') }}>COPY</button>
                                            </div>
                                        </div>
                                        <div className="coupon-stub">
                                            <span className="stub-text">COUPON</span>
                                        </div>
                                    </div>

                                    <div className="premium-coupon-card locked">
                                        <div className="coupon-left-part">
                                            <div className="discount-circle">
                                                <span className="percent">25</span>
                                                <span className="off-text">% OFF</span>
                                            </div>
                                        </div>
                                        <div className="coupon-main-part">
                                            <div className="coupon-details">
                                                <h4>Loyalty Bonus</h4>
                                                <p>Unlock after 5 successful orders</p>
                                                <div className="lock-reason">3 orders remaining</div>
                                            </div>
                                            <div className="coupon-action">
                                                <div className="promo-code masked">••••••••</div>
                                                <button className="copy-btn disabled">LOCKED</button>
                                            </div>
                                        </div>
                                        <div className="coupon-stub">
                                            <span className="stub-text">LOCKED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <div className="tab-pane active fade-in">
                            <div className="help-center-modern">
                                <h3>Help & Support</h3>
                                <div className="help-grid-modern">
                                    <div className="support-card-premium">
                                        <div className="support-icon-box blue">📦</div>
                                        <h4>Orders & Shipping</h4>
                                        <p>Need updates on your delivery or want to return an item?</p>
                                        <button className="support-action-link">Track Orders →</button>
                                    </div>
                                    <div className="support-card-premium">
                                        <div className="support-icon-box green">💰</div>
                                        <h4>Payments & Refunds</h4>
                                        <p>Problem with a payment or waiting for a refund?</p>
                                        <button className="support-action-link">Get Help →</button>
                                    </div>
                                    <div className="support-card-premium">
                                        <div className="support-icon-box orange">🛠️</div>
                                        <h4>Account Settings</h4>
                                        <p>Update your email, password or privacy settings.</p>
                                        <button className="support-action-link">Manage →</button>
                                    </div>
                                    <div className="support-card-premium">
                                        <div className="support-icon-box purple">💬</div>
                                        <h4>Contact Us</h4>
                                        <p>Talk to our support team for any other queries.</p>
                                        <button className="support-action-link" onClick={() => setShowSupport(true)}>Chat Now →</button>
                                    </div>
                                </div>
                                <div className="faq-teaser">
                                    <h4>Frequently Asked Questions</h4>
                                    <div className="faq-simple-item">
                                        <p>How long does delivery take?</p>
                                        <span>+</span>
                                    </div>
                                    <div className="faq-simple-item">
                                        <p>What is your return policy?</p>
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
