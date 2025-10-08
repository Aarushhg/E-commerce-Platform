import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products locally based on search query
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        {/* Replace text with image */}
        <Link to="/">
          <img
            src="/shopix.png" // path to your logo
            alt="ShopIX Logo"
            style={{ height: "50px" }} // adjust size as needed
          />
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {searchQuery && searchResults.length > 0 && (
        <div className="search-suggestions">
          <ul>
            {searchResults.map((product) => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="nav-links">
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>

        {!isLoggedIn ? (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        ) : (
          <Link
            to="/login"
            onClick={handleLogout}
            className="login-btn logout-btn"
          >
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

