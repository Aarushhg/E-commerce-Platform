import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      // POST request to backend
      const res = await axios.post('http://localhost:5000/api/products', formData);
      toast.success(`Product "${res.data.name}" added successfully!`);

      // Clear form
      setFormData({ name: '', price: '', image: '', category: '', description: '' });
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'price', 'image', 'category', 'description'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'price' ? 'number' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required={field !== 'description'} // description can be optional
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
