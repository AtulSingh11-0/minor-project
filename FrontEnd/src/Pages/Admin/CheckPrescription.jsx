import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Apis/Api";
import { toast } from "react-toastify";

const PrescriptionApproval = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (!response.data.data.order) {
        toast.error("Order not found");
        navigate("/admin/check-prescriptions");
        return;
      }
      setOrder(response.data.data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
      toast.error("Failed to fetch order details");
      navigate("/admin/check-prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success("Prescription processed successfully");
    navigate("/admin/check-prescriptions");
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this prescription?"))
      return;

    setUpdating(true);
    try {
      await api.put(`/prescriptions/${order.prescription._id}/verify`, {
        status: "approved",
      });
      handleSuccess();
    } catch (err) {
      toast.error("Failed to approve prescription");
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    const notes = window.prompt("Enter rejection reason:");
    if (!notes) return;

    setUpdating(true);
    try {
      await api.put(`/prescriptions/${order.prescription._id}/verify`, {
        status: "rejected",
        notes,
      });
      handleSuccess();
    } catch (err) {
      toast.error("Failed to reject prescription");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div style={styles.container}>
      <h1>Prescription Approval for Order #{orderId.slice(-8)}</h1>
      <div style={styles.orderDetails}>
        <h2>Ordered Medicines</h2>
        {order.items.map((item) => (
          <div key={item._id} style={styles.item}>
            <span>{item.product.name}</span>
            <span>Quantity: {item.quantity}</span>
          </div>
        ))}
      </div>
      <div style={styles.prescriptionContainer}>
        <h2>Prescription</h2>
        {order.prescription ? (
          <img
            src={order.prescription.imageUrl}
            alt="Prescription"
            style={styles.prescriptionImage}
          />
        ) : (
          <p>No prescription uploaded yet</p>
        )}
      </div>
      <div style={styles.actions}>
        <button
          onClick={handleApprove}
          disabled={updating}
          style={styles.approveButton}
        >
          Approve Prescription
        </button>
        <button
          onClick={handleReject}
          disabled={updating}
          style={styles.rejectButton}
        >
          Reject Prescription
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#333",
    borderRadius: "8px",
    color: "white",
  },
  orderDetails: {
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #555",
  },
  prescriptionContainer: {
    marginBottom: "20px",
  },
  prescriptionImage: {
    maxWidth: "100%",
    borderRadius: "4px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  approveButton: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  rejectButton: {
    padding: "12px",
    backgroundColor: "#dc143c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default PrescriptionApproval;
