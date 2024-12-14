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
          Authorization: "Bearer ${token}",
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
    <div className="flex mt-20 items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="checkout-form w-full max-w-7xl">
        <div className="w-full mx-auto shadow-form rounded-form p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Form Sections */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <section className="bg-background p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-primary border-b-2 border-secondary pb-2 mb-4">
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div className="form-group">
                  <input
                    type="text"
                    name="shippingAddress.street"
                    placeholder="Street Address"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    value={formData.shippingAddress.street}
                    onChange={handleChange}
                  />
                  {errors.street && <span className="text-error text-sm mt-1">{errors.street}</span>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      placeholder="City"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                    />
                    {errors.city && <span className="text-error text-sm mt-1">{errors.city}</span>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      placeholder="State"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      value={formData.shippingAddress.state}
                      onChange={handleChange}
                    />
                    {errors.state && <span className="text-error text-sm mt-1">{errors.state}</span>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="shippingAddress.zipCode"
                      placeholder="ZIP Code"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleChange}
                    />
                    {errors.zipCode && <span className="text-error text-sm mt-1">{errors.zipCode}</span>}
                  </div>
                </div>
              </div>
            </section>
            {/* ... (previous shipping address section remains the same) */}

            {/* Payment Method Section */}
            <section className="bg-background p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-primary border-b-2 border-secondary pb-2 mb-4">
                Payment Method
              </h3>
              <div className="flex space-x-4 mb-4">
                {['cod', 'card', 'wallet'].map((method) => (
                  <label key={method} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                      className="form-radio text-secondary focus:ring-secondary"
                    />
                    <span className="capitalize">{method === 'cod' ? 'Cash on Delivery' : method}</span>
                  </label>
                ))}
              </div>

              {/* Fixed Height Container for Card Details */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden 
                ${formData.paymentMethod === "card" 
                  ? "max-h-96 opacity-100 visible" 
                  : "max-h-0 opacity-0 invisible"}`}>
                <div className="p-4 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="cardDetails.cardNumber"
                      placeholder="Card Number"
                      maxLength="16"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      value={formData.cardDetails.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && <span className="text-error text-sm">{errors.cardNumber}</span>}

                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="cardDetails.expiryMonth"
                        placeholder="MM"
                        maxLength="2"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        value={formData.cardDetails.expiryMonth}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        name="cardDetails.expiryYear"
                        placeholder="YY"
                        maxLength="2"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        value={formData.cardDetails.expiryYear}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        name="cardDetails.cvv"
                        placeholder="CVV"
                        maxLength="4"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        value={formData.cardDetails.cvv}
                        onChange={handleChange}
                      />
                    </div>
                    {(errors.expiryMonth || errors.expiryYear || errors.cvv) && (
                      <div className="text-error text-sm">
                        {errors.expiryMonth || errors.expiryYear || errors.cvv}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary (remains the same) */}
          <div className="md:col-span-1 bg-white p-6 py-12 rounded-lg mx-5 shadow-xl sticky top-20 max-w-lg h-fit">
            {/* ... (previous order summary section remains the same) */}
            <h3 className="text-xl font-semibold text-primary border-b-2 border-secondary pb-2 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 mt-8 bg-blue-600 text-white text-md font-semibold rounded-lg shadow-md w-full hover:bg-blue-500 transition duration-3000"
              >
                {submitting
                  ? "Processing..."
                  : `Pay ${formData.paymentMethod === "cod" ? "(Cash on Delivery)" : ""} ₹${total.toFixed(2)}`}
              </button>
          </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;