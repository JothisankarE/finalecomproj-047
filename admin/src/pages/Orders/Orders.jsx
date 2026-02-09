import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    } else {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
      toast.success("Status Updated");
    } else {
      toast.error("Error updating status");
    }
  };



  useEffect(() => {
    fetchAllOrders();

    // Polling for new orders every 5 seconds
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='order'>
      <h3>Order Management</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <div className="order-item-header">
              <img src={assets.parcel_icon} alt="Parcel" />
              <span className="order-role">Order #{order._id.slice(-6)}</span>
            </div>

            <div className="order-item-body">
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  return `${item.name} x ${item.quantity}${index < order.items.length - 1 ? ', ' : ''}`;
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street}, {order.address.city}</p>
                <p>{order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>📞 {order.address.phone}</p>
            </div>

            <div className="order-item-footer">
              <div className="order-actions-container">
                <span className="order-price">₹{order.amount}</span>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>{order.items.length} Items</span>
              </div>

              <div className="order-status-wrapper">
                <label className="status-label">Order Status</label>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className={`order-status-select ${order.status.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <option value="Food Processing">Processing</option>
                  <option value="Out for delivery">On Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <optgroup label="Cancellation">
                    <option value="Cancelled">Cancelled</option>
                    <option value="Cancelled - Out of Stock">Cancelled (Stock Out)</option>
                    <option value="Cancelled - Request Denied">Cancelled (Denied)</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>No orders found.</p>}
    </div>
  );
};

export default Order;
