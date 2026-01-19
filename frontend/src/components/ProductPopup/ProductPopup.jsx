import React, { useContext } from 'react';
import './ProductPopup.css';
import { StoreContext } from '../../Context/StoreContext';

const ProductPopup = () => {
    const { selectedProduct, setSelectedProduct, addToCart, url } = useContext(StoreContext);

    if (!selectedProduct) return null;

    return (
        <div className="product-popup-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="product-popup" onClick={(e) => e.stopPropagation()}>
                <div className="product-popup-img">
                    <img src={url + "/images/" + selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="product-popup-info">
                    <div className="product-popup-header">
                        <h2>{selectedProduct.name}</h2>
                        <button className="close-popup-btn" onClick={() => setSelectedProduct(null)}>×</button>
                    </div>

                    <p className="product-popup-desc">{selectedProduct.description}</p>
                    <p className="product-popup-price">₹{selectedProduct.price}</p>

                    <div className="product-popup-actions">
                        <button className="popup-add-btn" onClick={() => addToCart(selectedProduct._id || selectedProduct.id)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;
