import React, { useState } from "react";
import axios from "axios";

const CreateOrder = () => {
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [codAmount, setCodAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("jwt"); // Assumes JWT is stored in localStorage
console.log(token);

      const response = await axios.post(
        "http://localhost:5000/api/v1/orders/create",
        {
          shippingAddress,
          paymentMethod,
          paymentDetails: { codAmount },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to create order. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "white" }}>
      <h2>Create Order</h2>
      <div>
        <h3>Shipping Address</h3>
        <label>
          Street:
          <input
            type="text"
            name="street"
            value={shippingAddress.street}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          State:
          <input
            type="text"
            name="state"
            value={shippingAddress.state}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Zip Code:
          <input
            type="text"
            name="zipCode"
            value={shippingAddress.zipCode}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <h3>Payment</h3>
        <label>
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Card</option>
            <option value="wallet">Wallet</option>
          </select>
        </label>
        <br />
        {paymentMethod === "cod" && (
          <label>
            COD Amount:
            <input
              type="number"
              value={codAmount}
              onChange={(e) => setCodAmount(parseFloat(e.target.value))}
            />
          </label>
        )}
      </div>

      <button onClick={handleCreateOrder} disabled={loading}>
        {loading ? "Creating Order..." : "Create Order"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateOrder;
