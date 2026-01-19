import React, { useEffect, useState } from 'react'
import './List.css'
import { url } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);

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

  useEffect(() => {
    fetchList();

    // Polling for inventory updates every 5 seconds
    const interval = setInterval(() => {
      fetchList();
    }, 5000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className='list flex-col'>
      <p className="title">Product Inventory</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock Status</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          const isLowStock = item.stock < 10;
          return (
            <div key={index} className='list-table-format'>
              <div className="product-images-cell">
                <img src={`${url}/images/` + item.image} alt={item.name} className="main-img" />
                {item.extraImages && item.extraImages.length > 0 && (
                  <div className="extra-images-row">
                    {item.extraImages.map((img, i) => (
                      <img key={i} src={`${url}/images/` + img} alt="extra" className="extra-img" />
                    ))}
                  </div>
                )}
              </div>
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <div>
                <span className={`stock-badge ${isLowStock ? 'low' : 'good'}`}>
                  {item.stock || 0} {isLowStock ? 'Low' : 'In Stock'}
                </span>
              </div>
              <p className='cursor' onClick={() => removeItem(item._id)}>
                <span role="img" aria-label="delete">🗑️</span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
