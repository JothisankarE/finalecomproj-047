import React, { useContext } from 'react';
import './LatestProductsPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LatestProductsPopup = ({ setShowLatestProducts, category = "All", setCategory }) => {
    const { product_list, url, menu_list, setSelectedProduct } = useContext(StoreContext);
    const navigate = useNavigate();

    // Filter by category if not "All"
    const filteredProducts = category === "All"
        ? product_list
        : product_list.filter(item => item.category === category);

    // Get the latest 8 products from the filtered list
    const latestProducts = filteredProducts.slice(-8).reverse();

    const handleProductClick = (item) => {
        setSelectedProduct(item);
        // We choose NOT to close the latest popup so user can continue browsing after closing product details
        // Or if z-index is handled right, it will just be overlay on overlay.
    };

    return (
        <div className='latest-popup-overlay' onClick={(e) => e.target.className === 'latest-popup-overlay' && setShowLatestProducts(false)}>
            <div className='latest-popup-container'>
                <div className="lp-header">
                    <div className="lp-title">
                        <h2>Latest Arrivals</h2>
                        <span>Discover our newest collection</span>
                    </div>
                    <button className="lp-close-btn" onClick={() => setShowLatestProducts(false)}>
                        <FaTimes />
                    </button>
                </div>

                {/* Category Selection Bar */}
                <div className="lp-category-bar">
                    <button
                        className={`lp-category-chip ${category === "All" ? "active" : ""}`}
                        onClick={() => setCategory("All")}
                    >
                        All
                    </button>
                    {menu_list.map((item, index) => (
                        <button
                            key={index}
                            className={`lp-category-chip ${category === item.menu_name ? "active" : ""}`}
                            onClick={() => setCategory(item.menu_name)}
                        >
                            {item.menu_name}
                        </button>
                    ))}
                </div>

                <div className="lp-content">
                    <div className="latest-grid">
                        {latestProducts.length > 0 ? (
                            latestProducts.map((item) => (
                                <div key={item._id} className="latest-card" onClick={() => handleProductClick(item)}>
                                    <span className="new-badge">New</span>
                                    <div className="card-img">
                                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                                    </div>
                                    <div className="card-info">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="card-footer">
                                            <span className="price">₹{item.price}</span>
                                            <button className="view-btn">View Details</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-products-msg">
                                <p>No new arrivals found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestProductsPopup;
