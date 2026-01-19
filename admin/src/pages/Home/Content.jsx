import React, { useEffect, useState } from "react";
import './Content.css';
import axios from 'axios';
import { url } from '../../assets/assets';

const Content = () => {
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({
    products: 124,
    orders: 45,
    revenue: "1,24,000"
  });

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`${url}/api/user/activity`);
      if (response.data.success) {
        setActivity(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching activity", error);
    }
  };

  return (
    <main className="dashboard-container">
      <div className="dashboard-header animate-slide-down">
        <h2>Admin Dashboard</h2>
        <p>Overview of your store's performance</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon products-icon">📦</div>
          <div>
            <h3>Total Products</h3>
            <p className="stat-number">{stats.products}</p>
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon orders-icon">🛒</div>
          <div>
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.orders}</p>
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-icon revenue-icon">💰</div>
          <div>
            <h3>Revenue (₹)</h3>
            <p className="stat-number">{stats.revenue}</p>
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="stat-icon users-icon">👥</div>
          <div>
            <h3>Active Users</h3>
            <p className="stat-number">12</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section animate-slide-up">
        <h3>Recent Customer Activity</h3>
        <div className="activity-table">
          <div className="activity-header regular">
            <span>User</span>
            <span>Email</span>
            <span>Last Login</span>
          </div>
          {activity.length > 0 ? (
            activity.map((user, index) => {
              const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date();
              return (
                <div key={index} className="activity-row regular">
                  <div className="user-info">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div className="user-name-wrapper">
                      <span>{user.name}</span>
                      {isSuspended && <span className="suspended-badge">Suspended</span>}
                    </div>
                  </div>
                  <span>{user.email}</span>
                  <span>{new Date(user.lastLogin).toLocaleString()}</span>
                </div>
              );
            })
          ) : (
            <div className="no-activity">
              <p>No recent activity found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Content;
