import React, { useContext } from 'react';
import './LatestProducts.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LatestProducts = () => {
    const { product_list, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || "All";

    // Filter by category if not "All"
    const filteredProducts = category === "All"
        ? product_list
        : product_list.filter(item => item.category === category);

    // Reverse to show latest first
    const latestProducts = [...filteredProducts].reverse();

    return (
        <div className='latest-products-page'>
            <div className='latest-products-container'>
                <div className="lp-header-section">
                    <h2>{category === "All" ? "Latest Arrivals" : `${category} - New Arrivals`}</h2>
                    <span>Discover our newest collection</span>
                </div>

                <div className="latest-grid">
                    {latestProducts.length > 0 ? (
                        latestProducts.map((item) => (
                            <div key={item._id} className="latest-card" onClick={() => navigate(`/product/${item._id}`)}>
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
                        <div className="no-products">
                            <p>No new arrivals found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LatestProducts;
