import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "./pages/SignUp";
import Orders from "./pages/Orders";
import SearchResults from "./pages/SearchResults";
import ProductList from "./components/ProductList";
import ProductDetails from "./pages/ProductDetails"; // ✅ Use the page version
import AddProduct from "./pages/AddProduct";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext"; // ✅ Wrap app with CartProvider
import "react-toastify/dist/ReactToastify.css"; // Ensure toast styles are imported

function App() {
  useEffect(() => {
    // Check backend connection
    fetch("http://localhost:5000/test-connection")
      .then((res) => res.text())
      .then((data) => console.log(data)) // Logs "MongoDB connection successful"
      .catch((err) => console.error("Error connecting to backend:", err));
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Dynamic route for single product details */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
