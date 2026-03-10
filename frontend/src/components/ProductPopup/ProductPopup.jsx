import React, { useContext } from 'react';
import './ProductPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductPopup = () => {
    const { selectedProduct, setSelectedProduct, addToCart, cartItems, url } = useContext(StoreContext);
    const navigate = useNavigate();

    if (!selectedProduct) return null;

    const stock = selectedProduct.stock || 0;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= 10;
    const cartQuantity = cartItems[selectedProduct._id || selectedProduct.id] || 0;
    const exceedsStock = cartQuantity >= stock;

    const handleAddToCart = async () => {
        if (isOutOfStock) {
            toast.error("This product is out of stock!");
            return;
        }
        if (exceedsStock) {
            toast.warning(`Only ${stock} items available in stock!`);
            return;
        }
        await addToCart(selectedProduct._id || selectedProduct.id);
        setSelectedProduct(null);
        navigate('/cart');
    }

    return (
        <div className="product-popup-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="product-popup" onClick={(e) => e.stopPropagation()}>
                <div className="product-popup-img">
                    <img src={url + "/images/" + selectedProduct.image} alt={selectedProduct.name} />
                    {isOutOfStock && <div className="popup-out-of-stock">Out of Stock</div>}
                    {isLowStock && !isOutOfStock && <div className="popup-low-stock">Only {stock} left!</div>}
                </div>
                <div className="product-popup-info">
                    <div className="product-popup-header">
                        <h2>{selectedProduct.name}</h2>
                        <button className="close-popup-btn" onClick={() => setSelectedProduct(null)}>×</button>
                    </div>

                    <p className="product-popup-desc">{selectedProduct.description}</p>
                    <p className="product-popup-price">₹{selectedProduct.price}</p>

                    {exceedsStock && !isOutOfStock && (
                        <p className="popup-stock-warning">⚠️ Limited stock available! You have {cartQuantity} in your cart.</p>
                    )}

                    <div className="product-popup-actions">
                        <button
                            className={`popup-add-btn ${isOutOfStock || exceedsStock ? 'disabled' : ''}`}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || exceedsStock}
                        >
                            {isOutOfStock ? 'Out of Stock' : exceedsStock ? 'Max Quantity Reached' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;
