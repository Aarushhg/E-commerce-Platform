import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query"); // 'query' from URL

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products locally based on searchQuery
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!filteredProducts.length)
    return (
      <div className="p-4">
        No products found for "{searchQuery}"
      </div>
    );

  return (
    <div className="search-results">
      <h2>Search results for "{searchQuery}"</h2>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
            </Link>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
