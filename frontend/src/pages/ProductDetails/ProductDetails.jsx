import React, { useContext } from 'react';
import './ProductDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { food_list, addToCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Find the product by ID
  // Note: Ensure food_list has items with matching IDs. 
  // If IDs are strings in URL and something else in data, handle conversion.
  const product = food_list.find((item) => item._id === id);

  if (!product) {
    return <div className="product-details-error">Product not found. <button onClick={() => navigate('/')}>Go Back</button></div>;
  }

  return (
    <div className="product-details">
      <div className="product-details-img">
         <img src={url + "/images/" + product.image} alt={product.name} />
      </div>
      <div className="product-details-info">
        <h1>{product.name}</h1>
        <p className="price">₹{product.price}</p>
        <p className="desc">{product.description}</p>
        
        <div className="product-details-actions">
           <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>Add to Cart</button>
           <button className="back-btn" onClick={() => navigate('/')}>Back to Shop</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
