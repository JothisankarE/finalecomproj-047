import React, { useContext } from 'react'
import './ProductItem.css'
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductItem = ({ image, name, price, desc, id, stock }) => {

    const { cartItems, addToCart, removeFromCart, url, setSelectedProduct } = useContext(StoreContext);
    const navigate = useNavigate();

    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= 10;
    const cartQuantity = cartItems?.[id] || 0;
    const exceedsStock = cartQuantity >= stock;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isOutOfStock) {
            toast.error("This product is out of stock!");
            return;
        }
        if (exceedsStock) {
            toast.warning(`Only ${stock} items available in stock!`);
            return;
        }
        addToCart(id);
    }

    return (
        <div className='item' onClick={() => setSelectedProduct({ id, name, price, description: desc, image, stock })}>
            <div className='item-link'>
                <div className='item-img-container'>
                    <img className='item-image' src={url + "/images/" + image} alt={name} />
                    {isOutOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
                    {isLowStock && !isOutOfStock && <div className="low-stock-badge">Only {stock} left!</div>}
                </div>
            </div>
            <div className="item-info">
                <div className="item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="item-desc">{desc}</p>
                <p className="item-price">₹{price}</p>

                {!cartItems?.[id] ? (
                    <button
                        className={`add-to-cart ${isOutOfStock ? 'disabled' : ''}`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                ) : (
                    <div className="cart-controls">
                        {exceedsStock && (
                            <p className="stock-warning">⚠️ Limited stock available!</p>
                        )}
                        <button className='remove-from-cart' onClick={(e) => { e.stopPropagation(); removeFromCart(id); }}>
                            Remove from Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductItem;


