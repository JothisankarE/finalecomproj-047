import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import cartImage from '../../../src/Assets1/basket.webp'
import profileImage from '../../../src/Assets1/profile_1.jpg'

const Navbar = ({ setShowLogin, setShowSupport, setShowLatestProducts, setLatestPopupCategory, setShowNotifications }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, userData, url, profileImagePreview, menu_list, product_list, setSelectedCategory } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

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
    <nav className='navbar' id='navbar'>
      {/* Logo Section */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" onClick={() => setMenu("home")}>
          <img src={assets.mat_logo} alt="MAT Logo" className="navbar-logo" />
        </Link>
        {token && userData.name && (
          <div className="navbar-greeting">
            <span className="greeting-text">{getGreeting()}, <b>{userData.name.split(' ')[0]}!</b></span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <ul className="navbar-menu">
        <li>
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <a href="/aboutus" onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>
            About Us
          </a>
        </li>
        <li className="navbar-item-dropdown" onMouseEnter={() => setMenu("products")}>
          <div
            className={`navbar-link ${menu === "products" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleLatestCategoryClick("All");
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 20px', fontSize: '15px', fontWeight: '500', color: '#4a5568' }}
          >
            Products <span style={{ fontSize: '10px' }}>▼</span>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-grid">
              <div
                className="dropdown-category-item"
                onClick={() => handleLatestCategoryClick("All")}
              >
                <div className="category-info">
                  <span className="category-name">All Products</span>
                </div>
                <span className="category-count">{product_list.length}</span>
              </div>

              {menu_list.map((item, index) => {
                const count = product_list.filter(p => p.category === item.menu_name).length;
                if (count === 0) return null; // Optional: hide empty categories
                return (
                  <div
                    key={index}
                    className="dropdown-category-item"
                    onClick={() => handleLatestCategoryClick(item.menu_name)}
                  >
                    <div className="category-info">
                      <img src={item.menu_image} alt={item.menu_name} className="category-img" />
                      <span className="category-name">{item.menu_name}</span>
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </li>
        <li>
          <a href='#contactus' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>
            Contact Us
          </a>
        </li>

      </ul>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Cart Icon */}
        <Link to='/cart' className='navbar-cart'>
          <img src={cartImage} alt="Cart" />
          {getTotalCartAmount() > 0 && <span className="cart-badge"></span>}
        </Link>

        {/* Auth Section */}
        {!token ? (
          <button className="signin-btn" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className='navbar-profile'>
            <img src={profileImagePreview ? profileImagePreview : (userData.image ? `${url}/images/${userData.image}` : profileImage)} alt="Profile" className="profile-img" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={() => navigate('/settings')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span>Settings</span>
              </li>
              <li onClick={() => setShowNotifications(true)}>
                <img src={assets.bag_icon} style={{ filter: 'grayscale(100%)', opacity: 0.6 }} alt="" />
                <span>Notifications</span>
              </li>
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <span>My Orders</span>
              </li>
              <li onClick={logout} className="logout-item">
                <img src={assets.logout_icon} alt="" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
