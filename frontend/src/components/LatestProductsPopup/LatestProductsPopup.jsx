import React, { useContext } from 'react';
import './LatestProductsPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LatestProductsPopup = ({ setShowLatestProducts, category = "All" }) => {
    const { product_list, url } = useContext(StoreContext);
    const navigate = useNavigate();

    // Filter by category if not "All"
    const filteredProducts = category === "All"
        ? product_list
        : product_list.filter(item => item.category === category);

    // Get the latest 8 products from the filtered list
    const latestProducts = filteredProducts.slice(-8).reverse();

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
        setShowLatestProducts(false);
    };

    return (
        <div className='latest-popup-overlay' onClick={(e) => e.target.className === 'latest-popup-overlay' && setShowLatestProducts(false)}>
            <div className='latest-popup-container'>
                <div className="lp-header">
                    <div className="lp-title">
                        <h2>{category === "All" ? "Latest Arrivals" : `${category} - New Arrivals`}</h2>
                        <span>Discover our newest collection</span>
                    </div>
                    <button className="lp-close-btn" onClick={() => setShowLatestProducts(false)}>
                        <FaTimes />
                    </button>
                </div>

                <div className="lp-content">
                    <div className="latest-grid">
                        {latestProducts.map((item) => (
                            <div key={item._id} className="latest-card" onClick={() => handleProductClick(item._id)}>
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestProductsPopup;
