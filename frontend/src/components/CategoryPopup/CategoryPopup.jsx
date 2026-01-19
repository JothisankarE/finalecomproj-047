import React, { useContext } from 'react';
import './CategoryPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import ProductItem from '../ProductItem/ProductItem';

const CategoryPopup = () => {
    const { selectedCategory, setSelectedCategory, product_list, menu_list } = useContext(StoreContext);

    if (!selectedCategory) return null;

    const categoryProducts = product_list.filter(item => item.category === selectedCategory);
    const categoryItem = menu_list.find(item => item.menu_name === selectedCategory);

    const categoryDescriptions = {
        "Dhoti": "Traditional attire representing elegance and culture. Our Dhotis are woven from the finest cotton, ensuring comfort and durability for every occasion.",
        "Lungi": "Experience the comfort of our premium lungis, available in vibrant checks and patterns. Perfect for daily wear with breathable fabric quality.",
        "Bed Spread": "Transform your bedroom with our luxurious bed spreads. Soft textures and beautiful designs to give your home a cozy feel.",
        "Bed Covers": "Protect and beautify your bedding with our durable bed covers. Easy to wash and designed to last.",
        "Towels": "Highly absorbent and soft towels made from 100% cotton. Gentle on your skin and quick to dry.",
        "Pillow Covers": "Add a touch of style to your sleep with our decorative and soft pillow covers.",
        "HandKerchiefs": "Classic cotton handkerchiefs, soft and essential for everyday use."
    };

    const categorySpecs = {
        "Dhoti": { size: "1.27m x 3.65m / 1.27m x 1.80m", material: "100% Pure Cotton", type: "Double & Single" },
        "Lungi": { size: "2.00m / 2.25m", material: "Cotton / Poly-Cotton", type: "Stitched / Unstitched" },
        "Bed Spread": { size: "90x100 inches (Queen) / 108x108 inches (King)", material: "Cotton / Chenille", type: "Geometric / Floral" },
        "Bed Covers": { size: "Standard Single / Double", material: "Heavy Cotton", type: "Protective" },
        "Towels": { size: "30x60 inches (Bath) / 16x24 inches (Hand)", material: "Terry Cotton", type: "Super Absorbent" },
        "Pillow Covers": { size: "17x27 inches", material: "Cotton Blend", type: "Decorative" },
        "HandKerchiefs": { size: "40x40 cm", material: "Soft Cotton", type: "Unisex" }
    };

    const description = categoryDescriptions[selectedCategory] || `Explore our premium selection of ${selectedCategory}.`;
    const specs = categorySpecs[selectedCategory] || { size: "Standard", material: "Premium Quality", type: "Various" };

    return (
        <div className="category-popup-overlay" onClick={() => setSelectedCategory(null)}>
            <div className="category-popup" onClick={(e) => e.stopPropagation()}>
                <div className="category-popup-header">
                    <h2>{selectedCategory}</h2>
                    <button className="close-category-btn" onClick={() => setSelectedCategory(null)}>×</button>
                </div>

                <div className="category-popup-content">
                    {/* Category Image */}
                    {categoryItem && (
                        <div className="category-popup-img-container">
                            <img src={categoryItem.menu_image} alt={selectedCategory} />
                        </div>
                    )}

                    {/* Description */}
                    <div className="category-desc">
                        <p>{description}</p>
                    </div>

                    {/* Extra Details / Specs */}
                    <div className="category-popup-details">
                        <h4>Product Specifications</h4>
                        <p><strong>Available Sizes:</strong> {specs.size}</p>
                        <p><strong>Material:</strong> {specs.material}</p>
                        <p><strong>Type:</strong> {specs.type}</p>
                        <p><strong>Total Items:</strong> {categoryProducts.length} Designs Available</p>
                    </div>

                    <div className="category-popup-products">
                        {categoryProducts.length > 0 ? (
                            categoryProducts.map((item, index) => (
                                <ProductItem
                                    key={index}
                                    id={item._id}
                                    name={item.name}
                                    price={item.price}
                                    desc={item.description}
                                    image={item.image}
                                />
                            ))
                        ) : (
                            <div className="category-popup-empty">
                                <p>No products available in this category yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPopup;
