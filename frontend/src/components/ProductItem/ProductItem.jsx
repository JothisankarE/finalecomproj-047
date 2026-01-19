import React, { useContext } from 'react'
import './ProductItem.css'
import { StoreContext } from '../../Context/StoreContext';
// import { Link } from 'react-router-dom'; // No longer needed for this view

const ProductItem = ({ image, name, price, desc, id }) => {

    const { cartItems, addToCart, removeFromCart, url, setSelectedProduct } = useContext(StoreContext);

    return (
        <div className='item' onClick={() => setSelectedProduct({ id, name, price, description: desc, image })}>
            <div className='item-link'>
                <div className='item-img-container'>
                    <img className='item-image' src={url + "/images/" + image} alt={name} />
                </div>
            </div>
            <div className="item-info">
                <div className="item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="item-desc">{desc}</p>
                <p className="item-price">₹{price}</p>

                {!cartItems[id] ? (
                    <button className='add-to-cart' onClick={() => addToCart(id)}>
                        Add to Cart
                    </button>
                ) : (
                    <button className='remove-from-cart' onClick={() => removeFromCart(id)}>
                        Remove from Cart
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProductItem;


