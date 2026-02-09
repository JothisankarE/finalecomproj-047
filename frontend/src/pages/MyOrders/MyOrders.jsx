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
    const normalizedStatus = status ? status.toLowerCase() : '';
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

  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/receipt", { orderId }, { responseType: 'blob' });
      // Create a URL for the blob
      const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `invoice-${orderId}.pdf`); // Filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(pdfUrl); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading receipt", error);
      alert("Could not download receipt. Please try again.");
    }
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className='my-orders-order'>
              <div className="order-main-info">
                <div className="order-icon-wrapper">
                  <img src={assets.parcel_icon} alt="" />
                </div>
                <div className="order-details">
                  <p className="order-items-list">{order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity
                    }
                    else {
                      return item.name + " x " + item.quantity + ", "
                    }
                  })}</p>
                  <div className="order-meta">
                    <span className="order-price">₹{order.amount}.00</span>
                    <span className="order-count">Items: {order.items.length}</span>
                  </div>
                </div>
              </div>

              <div className="order-status-section">
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  <span className="status-dot"></span>
                  <b>{order.status === 'Food Processing' ? 'Processing' : order.status}</b>
                </div>
              </div>

              <div className="order-actions">
                <button className="track-btn" onClick={() => handleTrackOrder(order)}>
                  <span className="btn-icon">📦</span> Track Order
                </button>
                <button className="receipt-btn" onClick={() => handleDownloadReceipt(order._id)}>
                  <span className="btn-icon">📄</span> Invoice
                </button>
              </div>
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
