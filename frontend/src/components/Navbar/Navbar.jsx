import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import profileImage from '../../../src/Assets1/profile_1.jpg'
import axios from 'axios'
import { FaBell } from 'react-icons/fa'
import PageLoader from '../PageLoader/PageLoader'

const Navbar = ({ setShowLogin, setShowSupport, setShowLatestProducts, setLatestPopupCategory, setShowNotifications, showNotifications }) => {

  const [menu, setMenu] = useState("home");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutLoader, setShowLogoutLoader] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getTotalCartAmount, token, setToken, userData, url, profileImagePreview, menu_list, product_list } = useContext(StoreContext);
  const navigate = useNavigate();

  // ---- Poll orders every 30s to update unread notification count ----
  useEffect(() => {
    if (!token) { setUnreadCount(0); return; }

    const fetchUnreadCount = async () => {
      try {
        const res = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        if (res.data.success) {
          const orders = res.data.data || [];
          const count = orders.filter(o =>
            o.status.toLowerCase() === 'delivered' ||
            o.status.toLowerCase().includes('out') ||
            o.status.toLowerCase().includes('cancelled')
          ).length + orders.length;
          setUnreadCount(count);
        }
      } catch (e) { }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const logout = () => {
    setMobileOpen(false);
    setShowLogoutLoader(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      setToken("");
      setShowLogoutLoader(false);
      navigate('/');
    }, 1500);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLatestCategoryClick = (category) => {
    setLatestPopupCategory(category);
    setShowLatestProducts(true);
    setMenu("products");
  };

  return (
    <>
      {/* Full-screen loader during logout */}
      <PageLoader visible={showLogoutLoader} type="logout" />

      {/* ── DESKTOP NAVBAR ──────────────────────────────────────── */}
      <nav className='navbar'>

        {/* Left: Logo + Greeting */}
        <div className="navbar-left">
          <Link to="/" onClick={() => setMenu("home")}>
            <img src={assets.mat_logo} alt="Logo" className="navbar-logo" />
          </Link>
          {token && userData.name && (
            <div className="navbar-greeting">
              <span className="greeting-text">
                {getGreeting()},
                <b>{userData.name.split(' ')[0]}!</b>
              </span>
            </div>
          )}
        </div>

        {/* Centre: Nav Links (hidden on mobile) */}
        <ul className="navbar-menu">
          <li>
            <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          </li>
          <li>
            <Link to="/aboutus" onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>About Us</Link>
          </li>
          <li className="navbar-item-dropdown">
            <div className={`navbar-link ${menu === "products" ? "active" : ""}`} onClick={() => handleLatestCategoryClick("All")}>
              Products <span className="dropdown-arrow">▼</span>
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-grid">
                <div className="dropdown-category-item" onClick={() => handleLatestCategoryClick("All")}>
                  <div className="category-info"><span className="category-name">All Products</span></div>
                  <span className="category-count">{product_list.length}</span>
                </div>
                {menu_list.map((item, index) => {
                  const count = product_list.filter(p => p.category === item.menu_name).length;
                  if (count === 0) return null;
                  return (
                    <div key={index} className="dropdown-category-item" onClick={() => handleLatestCategoryClick(item.menu_name)}>
                      <div className="category-info">
                        <img src={item.menu_image} alt="" className="category-img" />
                        <span className="category-name">{item.menu_name}</span>
                      </div>
                      <span className="category-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </li>
          <li>
            <Link to='/contactus' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Contact Us</Link>
          </li>
        </ul>

        {/* Right: Cart, Bell, Profile/Sign-in, Hamburger */}
        <div className="navbar-right">

          {/* Cart */}
          <Link to='/cart' className='navbar-cart'>
            <svg className="navbar-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getTotalCartAmount() > 0 && <span className="cart-badge"></span>}
          </Link>

          {/* Notification Bell */}
          {token && (
            <button
              className={`navbar-bell ${unreadCount > 0 ? 'navbar-bell--active' : ''}`}
              onClick={() => { setShowNotifications(prev => !prev); setUnreadCount(0); }}
              title="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
          )}

          {/* Profile / Sign-in (desktop) */}
          {!token ? (
            <button className="signin-btn" onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <div className='navbar-profile'>
              <div className="profile-img-container">
                <img
                  src={profileImagePreview ? profileImagePreview : (userData.image ? `${url}/images/${userData.image}` : profileImage)}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
              <ul className='navbar-profile-dropdown'>
                <li onClick={() => { setShowNotifications(prev => !prev); setUnreadCount(0); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Notifications</span>
                  {unreadCount > 0 && <span className="dropdown-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </li>
                <li onClick={() => navigate('/settings')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>Settings</span>
                </li>
                <li onClick={() => navigate('/myorders')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>My Orders</span>
                </li>
                <li onClick={logout} className="logout-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}

          {/* Hamburger (mobile only) */}
          <button
            className={`navbar-hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ── MOBILE BACKDROP ──────────────────────────────────────── */}
      <div
        className={`navbar-mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE DRAWER ────────────────────────────────────────── */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className={menu === 'home' ? 'active' : ''}
          onClick={() => { setMenu('home'); setMobileOpen(false); }}>🏠 Home</Link>

        <Link to="/aboutus" className={menu === 'about' ? 'active' : ''}
          onClick={() => { setMenu('about'); setMobileOpen(false); }}>ℹ️ About Us</Link>

        <div className="navbar-mobile-link"
          onClick={() => { handleLatestCategoryClick('All'); setMobileOpen(false); }}>🛍️ Products</div>

        <Link to="/contactus" className={menu === 'contact' ? 'active' : ''}
          onClick={() => { setMenu('contact'); setMobileOpen(false); }}>📞 Contact Us</Link>

        {token && (
          <Link to="/myorders" onClick={() => { setMenu(''); setMobileOpen(false); }}>📦 My Orders</Link>
        )}
        {token && (
          <Link to="/settings" onClick={() => { setMenu(''); setMobileOpen(false); }}>⚙️ Settings</Link>
        )}

        <div className="navbar-mobile-divider" />

        {!token ? (
          <button className="navbar-mobile-signin"
            onClick={() => { setShowLogin(true); setMobileOpen(false); }}>
            Sign In
          </button>
        ) : (
          <button className="navbar-mobile-signin" style={{ background: '#d92d20' }}
            onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar
