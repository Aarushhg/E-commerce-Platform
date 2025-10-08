import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart
  const handleAddToCart = async (product) => {
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

      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("❌ Could not add product to cart.");
    }
  };

  // Open product details page
  const openProductPage = (id) => {
    navigate(`/product/${id}`);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to ShopIX</h1>
        <p>Discover the best products at amazing prices!</p>
        <Link to="/shop">
          <button className="shop-now">Shop Now</button>
        </Link>
      </header>

      {/* Categories */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-list">
          {["Electronics", "Fashion", "Home & Kitchen", "Sports"].map((cat) => (
            <div
              key={cat}
              className="category"
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                onClick={() => openProductPage(product._id)}
                style={{ cursor: "pointer" }}
              />
              <h3
                onClick={() => openProductPage(product._id)}
                style={{ cursor: "pointer" }}
              >
                {product.name}
              </h3>
              <p>₹{product.price}</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
