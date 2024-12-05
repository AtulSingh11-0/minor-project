import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Apis/Api";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    paymentMethod: "cod", // default payment method
    cardDetails: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      if (!response.data.data.cart?.items?.length) {
        toast.error("Cart is empty");
        navigate("/cart");
        return;
      }
      setCart(response.data.data.cart);
    } catch (err) {
      toast.error("Failed to fetch cart");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { shippingAddress, paymentMethod, cardDetails } = formData;

    if (!shippingAddress.street || shippingAddress.street.trim().length < 5) {
      newErrors.street = "Street address must be at least 5 characters";
    }
    if (
      !shippingAddress.city ||
      !/^[a-zA-Z\s]{2,50}$/.test(shippingAddress.city.trim())
    ) {
      newErrors.city = "Enter a valid city name";
    }
    if (
      !shippingAddress.state ||
      !/^[a-zA-Z\s]{2,50}$/.test(shippingAddress.state.trim())
    ) {
      newErrors.state = "Enter a valid state name";
    }
    if (
      !shippingAddress.zipCode ||
      !/^\d{6}$/.test(shippingAddress.zipCode.trim())
    ) {
      newErrors.zipCode = "ZIP code must be 6 digits";
    }

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !/^\d{16}$/.test(cardDetails.cardNumber)) {
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      }
      if (!cardDetails.expiryMonth || !/^\d{2}$/.test(cardDetails.expiryMonth) || parseInt(cardDetails.expiryMonth) > 12) {
        newErrors.expiryMonth = "Enter a valid month (01-12)";
      }
      if (!cardDetails.expiryYear || !/^\d{2}$/.test(cardDetails.expiryYear)) {
        newErrors.expiryYear = "Enter a valid year";
      }
      if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = "Enter a valid CVV";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotals = () => {
    if (!cart?.totalAmount)
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    const subtotal = cart.totalAmount;
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const { total, shipping, tax } = calculateTotals();

      // Ensure all required fields are present and match backend expectations
      const orderPayload = {
        shippingAddress: {
          street: formData.shippingAddress.street.trim(),
          city: formData.shippingAddress.city.trim(),
          state: formData.shippingAddress.state.trim(),
          zipCode: formData.shippingAddress.zipCode.trim(),
        },
        paymentMethod: formData.paymentMethod,
        // Include all required order fields
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: total,
        shippingFee: shipping,
        tax: tax,
        paymentDetails: formData.paymentMethod === "card" ? {
          cardNumber: formData.cardDetails.cardNumber,
          expiryMonth: formData.cardDetails.expiryMonth,
          expiryYear: formData.cardDetails.expiryYear,
          cvv: formData.cardDetails.cvv,
        } : formData.paymentMethod === "cod" ? {
          codAmount: total
        } : {}
      };

      // Add authorization header
      const token = localStorage.getItem("jwt");
      const response = await api.post("/orders/create", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { order, requiresPrescription } = response.data.data;

      // Process payment
      if (formData.paymentMethod !== "cod") {
        const paymentPayload = {
          orderId: order._id,
          method: formData.paymentMethod,
          paymentDetails: orderPayload.paymentDetails
        };

        await api.post("/payments/process", paymentPayload);
      }

      if (requiresPrescription) {
        const prescriptionItems = cart.items.filter(
          (item) => item.product.requiresPrescription
        );
        navigate(`/upload-prescription/${order._id}`, {
          state: {
            items: prescriptionItems,
            orderId: order._id,
          },
        });
        toast.info("Please upload prescription for required items");
      } else {
        toast.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="checkout-loading">Loading...</div>;

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div style={{ color: "white" }} className="checkout-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Checkout</h2>

        <section className="shipping-section">
          <h3>Shipping Address</h3>
          <div className="form-group">
            <input
              type="text"
              name="shippingAddress.street"
              placeholder="Street Address"
              value={formData.shippingAddress.street}
              onChange={handleChange}
            />
            {errors.street && <span className="error">{errors.street}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="shippingAddress.city"
                placeholder="City"
                value={formData.shippingAddress.city}
                onChange={handleChange}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="shippingAddress.state"
                placeholder="State"
                value={formData.shippingAddress.state}
                onChange={handleChange}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="shippingAddress.zipCode"
                placeholder="ZIP Code"
                value={formData.shippingAddress.zipCode}
                onChange={handleChange}
              />
              {errors.zipCode && (
                <span className="error">{errors.zipCode}</span>
              )}
            </div>
          </div>
        </section>

        <section className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />
              Credit/Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={formData.paymentMethod === "wallet"}
                onChange={handleChange}
              />
              Digital Wallet
            </label>
          </div>

          {formData.paymentMethod === "card" && (
            <div className="card-details">
              <div className="form-group">
                <input
                  type="text"
                  name="cardDetails.cardNumber"
                  placeholder="Card Number"
                  value={formData.cardDetails.cardNumber}
                  onChange={handleChange}
                  maxLength="16"
                />
                {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="cardDetails.expiryMonth"
                    placeholder="MM"
                    value={formData.cardDetails.expiryMonth}
                    onChange={handleChange}
                    maxLength="2"
                  />
                  {errors.expiryMonth && <span className="error">{errors.expiryMonth}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="cardDetails.expiryYear"
                    placeholder="YY"
                    value={formData.cardDetails.expiryYear}
                    onChange={handleChange}
                    maxLength="2"
                  />
                  {errors.expiryYear && <span className="error">{errors.expiryYear}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="cardDetails.cvv"
                    placeholder="CVV"
                    value={formData.cardDetails.cvv}
                    onChange={handleChange}
                    maxLength="4"
                  />
                  {errors.cvv && <span className="error">{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (18%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </section>

        <button type="submit" className="place-order-btn" disabled={submitting}>
          {submitting ? "Processing..." : `Pay ${formData.paymentMethod === "cod" ? "(Cash on Delivery)" : ""} ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
