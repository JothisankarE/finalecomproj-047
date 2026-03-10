import React, { useContext } from 'react'
import './ProductDisplay.css'
import ProductItem from '../ProductItem/ProductItem'
import { StoreContext } from '../../Context/StoreContext'
import { menu_list } from '../../assets/assets'

const ProductDisplay = ({ category, setCategory }) => {

  const { product_list } = useContext(StoreContext);

  const filteredProducts = product_list.filter(item =>
    category === "All" || category === item.category
  );

  return (
    <div className='display' id='display'>

      {/* ---- Section Header ---- */}
      <div className="display-header">
        <span className="display-tag">Products</span>
        <h2>Our Products</h2>
        <p className="display-subtitle">Discover our finest handcrafted textile collection</p>
      </div>

      {/* ---- Category Tabs ---- */}
      <div className="category-tabs-wrap">
        <div className="category-tabs">
          <button
            className={`cat-tab ${category === "All" ? "cat-tab--active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All Products
          </button>
          {menu_list.map((item, index) => (
            <button
              key={index}
              className={`cat-tab ${category === item.menu_name ? "cat-tab--active" : ""}`}
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
            >
              {item.menu_name}
            </button>
          ))}
        </div>
        <div className="cat-underline" />
      </div>

      {/* ---- Product Grid ---- */}
      {filteredProducts.length > 0 ? (
        <div className='display-list'>
          {filteredProducts.map((item) => (
            <ProductItem
              key={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
              id={item._id}
              stock={item.stock}
            />
          ))}
        </div>
      ) : (
        <div className="display-empty">
          <p>No products found in this category.</p>
        </div>
      )}

    </div>
  )
}

export default ProductDisplay
