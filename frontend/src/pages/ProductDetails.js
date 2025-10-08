import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div>Loading product...</div>;

  // Add product to cart (requires login)
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("❌ Could not add to cart.");
    }
  };

  // Buy Now → redirect to checkout with this product only
  const buyNow = () => {
    // Store the Buy Now product temporarily in localStorage
    localStorage.setItem(
      "buyNowItem",
      JSON.stringify([{ productId: product, quantity: 1 }])
    );

    // Redirect to checkout (login check will happen on checkout page)
    navigate("/checkout");
  };

  return (
    <div className="product-details-container">
      <div className="product-image">
        <img
          src={product.image || "https://via.placeholder.com/400"}
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <h2>₹{product.price}</h2>
        <p>{product.description}</p>

        <div className="product-actions">
          <button className="add-to-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
          <button className="buy-now-btn" onClick={buyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
