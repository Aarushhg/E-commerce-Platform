import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCartOrBuyNow = async () => {
      try {
        // Check if there is a Buy Now product
        const buyNowItem = localStorage.getItem("buyNowItem");
        if (buyNowItem) {
          setCheckoutProducts(JSON.parse(buyNowItem));
          setLoading(false);
          return;
        }

        // Otherwise, fetch regular cart
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data || res.data.length === 0) {
          navigate("/404"); // redirect if no items
        } else {
          setCheckoutProducts(res.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setLoading(false);
        navigate("/404"); // redirect to 404 if fetch fails
      }
    };

    fetchCartOrBuyNow();
  }, [token, navigate]);

  const getTotalPrice = () =>
    checkoutProducts.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!formData.name || !formData.address) {
      alert("Please fill in all the details.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/orders",
        { amount: getTotalPrice() * 100 }, // in paise
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id: order_id, currency, amount } = orderRes.data;

      const options = {
        key: "rzp_test_GTJMRW7eJdFppG",
        amount,
        currency,
        name: "My E-commerce Store",
        description: "Order Payment",
        order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  customerName: formData.name,
                  address: formData.address,
                  items: checkoutProducts.map(({ productId, quantity }) => ({
                    productId: productId._id,
                    name: productId.name,
                    price: productId.price,
                    quantity,
                  })),
                  totalAmount: getTotalPrice(),
                  clearCart: localStorage.getItem("buyNowItem") ? false : true, // only clear cart if it's not a Buy Now
                },
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              alert("✅ Payment Successful!");

              // Clear regular cart if this was a normal checkout
              if (!localStorage.getItem("buyNowItem")) {
                await axios.delete("http://localhost:5000/api/cart/clear", {
                  headers: { Authorization: `Bearer ${token}` },
                });
              }

              // Remove Buy Now temporary item
              localStorage.removeItem("buyNowItem");

              navigate("/orders");
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#FFCC00" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if (loading) return <div className="p-4">Loading checkout...</div>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-items">
        {checkoutProducts.map(({ productId, quantity }) => (
          <div key={productId._id} className="checkout-item">
            <span>{productId.name}</span>
            <span>
              ₹{productId.price} x {quantity}
            </span>
          </div>
        ))}
      </div>
      <h3>Total: ₹{getTotalPrice().toFixed(2)}</h3>

      <div className="checkout-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <button className="checkout-button" onClick={handlePayment}>
        Pay with Razorpay
      </button>
    </div>
  );
};

export default Checkout;
