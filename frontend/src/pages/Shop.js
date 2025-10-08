import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // Get category from query params
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category"); // e.g., /shop?category=Electronics

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:5000/api/products";
        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!products.length) return <div className="p-4">No products found{category ? ` for "${category}"` : ""}</div>;

  return (
    <div className="shop-container">
      <h1>Shop {category ? `- ${category}` : ""}</h1>
      <div className="product-grid">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="product-card"
          >
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;
