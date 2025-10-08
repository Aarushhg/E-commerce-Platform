import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token
        if (!token) return; // User not logged in

        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []); // Assuming backend returns { items: [...] }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to add products to cart");

      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items);
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.put(
        "http://localhost:5000/api/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items);
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
