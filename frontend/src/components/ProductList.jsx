import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map(product => (
        <Link key={product._id} to={`/product/${product._id}`}>
          <div className="border p-4 rounded shadow hover:shadow-lg transition">
            <img
              src={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-700">₹{product.price}</p>
            <p className="text-sm">{product.category}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
