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
    <nav className='navbar'>
      {/* Left Section: Branding & Greeting */}
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

      {/* Center Section: Navigation Links */}
      <ul className="navbar-menu">
        <li>
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/aboutus" onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>
            About Us
          </Link>
        </li>
        <li className="navbar-item-dropdown">
          <div
            className={`navbar-link ${menu === "products" ? "active" : ""}`}
            onClick={() => handleLatestCategoryClick("All")}
          >
            Products <span className="dropdown-arrow">▼</span>
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
                if (count === 0) return null;
                return (
                  <div
                    key={index}
                    className="dropdown-category-item"
                    onClick={() => handleLatestCategoryClick(item.menu_name)}
                  >
                    <div className="category-info">
                      <img src={item.menu_image} alt="" className="category-img" />
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
          <Link to='/contactus' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>
            Contact Us
          </Link>
        </li>
      </ul>

      {/* Right Section: Actions */}
      <div className="navbar-right">
        {/* Cart Icon */}
        <Link to='/cart' className='navbar-cart'>
          <svg className="navbar-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          {getTotalCartAmount() > 0 && <span className="cart-badge"></span>}
        </Link>

        {/* Profile / Guard */}
        {!token ? (
          <button className="signin-btn" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
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
              <li onClick={() => navigate('/settings')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span>Settings</span>
              </li>
              <li onClick={() => navigate('/myorders')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>My Orders</span>
              </li>
              <li onClick={logout} className="logout-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar
