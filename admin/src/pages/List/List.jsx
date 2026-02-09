import React, { useEffect, useState } from 'react'
import './List.css'
import { url } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeItem = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  const updatePriceValue = async (id) => {
    try {
      const response = await axios.post(`${url}/api/food/update-price`, {
        id: id,
        price: editPrice
      })
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingPriceId(null);
        await fetchList();
      } else {
        toast.error("Error updating price");
      }
    } catch (error) {
      toast.error("Network Error");
    }
  }

  const updateStockValue = async (id) => {
    try {
      const response = await axios.post(`${url}/api/food/update-stock`, {
        id: id,
        stock: editStock
      })
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingId(null);
        await fetchList();
      } else {
        toast.error("Error updating stock");
      }
    } catch (error) {
      toast.error("Network Error");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list'>
      <div className="list-header">
        <div className="list-header-left">
          <p className="title">Product Inventory</p>
          <span className="item-count-badge">{list.length} items found</span>
        </div>
      </div>

      <div className='list-table'>
        <div className="list-table-format title">
          <b>Preview</b>
          <b>Product Details</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock Status</b>
          <b>Actions</b>
        </div>
        {list.map((item, index) => {
          const isLowStock = item.stock < 10;
          return (
            <div key={index} className='list-table-format' style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="product-images-cell">
                <img src={`${url}/images/` + item.image} alt={item.name} className="main-img" />
              </div>

              <div className="product-info-cell">
                <p className="product-name">{item.name}</p>
              </div>

              <div className="category-cell">
                <span className="category-tag">{item.category}</span>
              </div>

              <div className="price-cell">
                {editingPriceId === item._id ? (
                  <div className="price-edit-container">
                    <input
                      type="number"
                      className="price-input"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      autoFocus
                    />
                    <button className="price-action-btn save" onClick={() => updatePriceValue(item._id)}>✓</button>
                    <button className="price-action-btn cancel" onClick={() => setEditingPriceId(null)}>✕</button>
                  </div>
                ) : (
                  <p
                    className="price-text clickable"
                    onClick={() => {
                      setEditingPriceId(item._id);
                      setEditPrice(item.price);
                    }}
                    title="Click to edit price"
                  >
                    ₹{item.price}
                  </p>
                )}
              </div>

              <div className="stock-cell">
                {editingId === item._id ? (
                  <div className="stock-edit-container">
                    <input
                      type="number"
                      className="stock-input"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      autoFocus
                    />
                    <button className="stock-action-btn save" onClick={() => updateStockValue(item._id)}>✓</button>
                    <button className="stock-action-btn cancel" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <span
                    className={`stock-badge ${isLowStock ? 'low' : 'good'}`}
                    onClick={() => {
                      setEditingId(item._id);
                      setEditStock(item.stock || 0);
                    }}
                    title="Click to edit stock"
                  >
                    <span className="stock-dot"></span>
                    {item.stock || 0} {isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                )}
              </div>

              <div className="actions-cell">
                <button className="delete-btn" onClick={() => removeItem(item._id)} title="Delete Product">
                  <span role="img" aria-label="delete">🗑️</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
