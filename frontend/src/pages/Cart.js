import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch cart for logged-in user
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity of a product
  const updateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/cart",
        { productId, action: type }, // increase or decrease
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartProducts(res.data);
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  // Remove product from cart
  const removeProduct = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartProducts(res.data);
    } catch (err) {
      console.error("Failed to remove product:", err);
    }
  };

  // Calculate total price
  const getTotalPrice = () =>
    cartProducts.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartProducts.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="cart-image"
              />
              <div className="cart-details">
                <span className="cart-title">{item.productId.name}</span>
                <span className="cart-price">
                  ₹{item.productId.price.toFixed(2)}
                </span>
                <div className="cart-quantity">
                  <button
                    onClick={() => updateQuantity(item.productId._id, "decrease")}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId._id, "increase")}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeProduct(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3 className="cart-total">
            Total: ₹{getTotalPrice().toFixed(2)}
          </h3>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
