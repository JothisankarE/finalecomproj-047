import React, { useContext } from 'react';
import './CategoryDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import ProductItem from '../../components/ProductItem/ProductItem';

const CategoryDetails = () => {
    const { categoryName } = useParams();
    const { product_list, menu_list } = useContext(StoreContext);
    const navigate = useNavigate();

    // Find category info if available
    const categoryInfo = menu_list.find(item => item.menu_name === categoryName);

    // Filter products for this category
    const categoryProducts = product_list.filter(item => item.category === categoryName);

    return (
        <div className="category-details">
            <div className="category-header">
                <h1>{categoryName} Collection</h1>
                <p>Explore our premium range of {categoryName}. Quality craftsmanship for your comfort.</p>
                <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
            </div>

            <div className="category-products">
                {categoryProducts.length > 0 ? (
                    categoryProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            desc={item.description}
                            stock={item.stock}
                        />
                    ))
                ) : (
                    <div className="no-products">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryDetails;
