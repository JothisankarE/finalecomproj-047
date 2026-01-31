import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import OrderTrackingPopup from '../../components/OrderTrackingPopup/OrderTrackingPopup';

const MyOrders = () => {

  const [data, setData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    setData(response.data.data || []);
  }

  useEffect(() => {
    if (token) {
      fetchOrders();

      // Polling for order status updates every 5 seconds
      const interval = setInterval(() => {
        fetchOrders();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [token])

  const getStatusClass = (status) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes('cancelled')) {
      return 'status-cancelled';
    }

    switch (normalizedStatus) {
      case 'food processing':
        return 'status-processing';
      case 'out for delivery':
        return 'status-out-for-delivery';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-processing';
    }
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className='my-orders-order'>
              <div className="order-icon-wrapper">
                <img src={assets.parcel_icon} alt="" />
              </div>
              <p className="order-items">{order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity
                }
                else {
                  return item.name + " x " + item.quantity + ", "
                }

              })}</p>
              <p className="order-price">₹{order.amount}.00</p>
              <p className="order-count">Items: {order.items.length}</p>

              <div className={`order-status ${getStatusClass(order.status)}`}>
                <span className="status-dot"></span>
                <b>{order.status === 'Food Processing' ? 'Processing' : order.status}</b>
              </div>

              <button className="track-btn" onClick={() => handleTrackOrder(order)}>Track Order</button>
            </div>
          )
        })}
      </div>

      <OrderTrackingPopup
        isOpen={!!trackingOrder}
        onClose={() => setTrackingOrder(null)}
        currentStatus={trackingOrder ? trackingOrder.status : ''}
      />
    </div>
  )
}

export default MyOrders
