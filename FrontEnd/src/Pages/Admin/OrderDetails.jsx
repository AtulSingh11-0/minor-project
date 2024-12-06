import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Apis/Api";
import { toast } from "react-toastify";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({
    status: "",
    location: "",
    description: "",
  });

  const validStatuses = [
    "pending", "awaiting_prescription", "processing",
    "confirmed", "packed", "shipped", "delivered", "cancelled"
  ];

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/admin/${orderId}`);
      setOrder(response.data.data.order);
    } catch (err) {
      toast.error("Failed to fetch order details");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!window.confirm("Are you sure you want to update the order status?")) return;

    setUpdating(true);
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: trackingInfo.status
      });

      // Update tracking info if provided
      if (trackingInfo.location || trackingInfo.description) {
        await api.post(`/tracking/${orderId}`, trackingInfo);
      }

      toast.success("Order updated successfully");
      fetchOrderDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const verifyPrescription = async (status, notes = "") => {
    if (!window.confirm(`Are you sure you want to ${status} this prescription?`)) return;

    setUpdating(true);
    try {
      await api.put(`/prescriptions/${order.prescription._id}/verify`, {
        status,
        notes
      });
      toast.success("Prescription verification updated");
      fetchOrderDetails();
    } catch (err) {
      toast.error("Failed to update prescription verification");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-details">
      <div className="header">
        <button onClick={() => navigate("/admin/orders")} className="back-button">
          ← Back to Orders
        </button>
        <h1>Order Details #{orderId.slice(-8)}</h1>
      </div>

      <div className="details-grid">
        <div className="customer-info">
          <h2>Customer Information</h2>
          <p>Name: {order.user?.name}</p>
          <p>Email: {order.user?.email}</p>
          <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="order-items">
          <h2>Order Items</h2>
          {order.items.map(item => (
            <div key={item._id} className="item">
              <span>{item.product.name}</span>
              <span>×{item.quantity}</span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="total">Total: ₹{order.totalAmount}</div>
        </div>

        <div className="status-management">
          <h2>Update Status</h2>
          <div className="form-group">
            <select
              value={trackingInfo.status}
              onChange={(e) => setTrackingInfo(prev => ({
                ...prev,
                status: e.target.value
              }))}
              disabled={updating}
            >
              <option value="">Select Status</option>
              {validStatuses.map(status => (
                <option key={status} value={status}>
                  {status.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Location"
              value={trackingInfo.location}
              onChange={(e) => setTrackingInfo(prev => ({
                ...prev,
                location: e.target.value
              }))}
            />

            <textarea
              placeholder="Description/Notes"
              value={trackingInfo.description}
              onChange={(e) => setTrackingInfo(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />

            <button
              onClick={updateOrderStatus}
              disabled={updating || !trackingInfo.status}
            >
              Update Status
            </button>
          </div>
        </div>

        {order.prescriptionRequired && (
          <div className="prescription-management">
            <h2>Prescription Management</h2>
            {order.prescription ? (
              <>
                <img
                  src={order.prescription.imageUrl}
                  alt="Prescription"
                  className="prescription-image"
                />
                <div className="verification-buttons">
                  <button
                    onClick={() => verifyPrescription("approved")}
                    disabled={updating}
                    className="approve-button"
                  >
                    Approve Prescription
                  </button>
                  <button
                    onClick={() => {
                      const notes = window.prompt("Enter rejection reason:");
                      if (notes) verifyPrescription("rejected", notes);
                    }}
                    disabled={updating}
                    className="reject-button"
                  >
                    Reject Prescription
                  </button>
                </div>
              </>
            ) : (
              <p>No prescription uploaded yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;