import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }

          if (!token) {
      navigate("/login");
      return;
    }

        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data); // backend returns populated product info
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="order-container">
      <h1>Your Orders</h1>

      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order #{order._id}</h3>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img
                      src={item.productId?.image || "https://via.placeholder.com/80"}
                      alt={item.productId?.name || "Product"}
                      className="order-item-image"
                    />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.productId?.name}</span>
                      <span className="order-item-qty">
                        Qty: {item.quantity} 
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="order-total">Total: ₹{order.totalAmount.toFixed(2)}</p>
              <p className="order-status">
                Status: <strong>{order.status}</strong>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders yet</p>
      )}

      <Link to="/shop">
        <button className="continue-shopping-btn">Continue Shopping</button>
      </Link>
    </div>
  );
};

export default Orders;
