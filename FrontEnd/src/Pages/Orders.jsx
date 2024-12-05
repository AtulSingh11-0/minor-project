import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Apis/Api";
import { toast } from "react-toastify";

const TRACKING_STEPS = [
  { status: "pending", label: "Order Placed" },
  { status: "processing", label: "Processing" },
  { status: "packed", label: "Packed" },  
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" }
];

const OrderTrackingProgress = ({ currentStatus, updates }) => {
  const getCurrentStepIndex = () => {
    if (currentStatus === "cancelled") return -1;
    return TRACKING_STEPS.findIndex(step => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div style={trackingStyles.container}>
      <div style={{
        ...trackingStyles.progressLine,
        background: `linear-gradient(to right, 
          #4CAF50 ${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%, 
          rgba(255,255,255,0.2) ${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%)`
      }} />
      {TRACKING_STEPS.map((step, index) => {
        const update = updates?.find(u => u.status === step.status);
        const isCompleted = currentStepIndex > index;
        const isCurrent = currentStepIndex === index;
        const statusClass = isCompleted ? "completed" : isCurrent ? "current" : "pending";
        
        return (
          <div key={step.status} style={trackingStyles.stepContainer}>
            <div style={trackingStyles.point[statusClass]} title={update?.description || step.label}>
              {isCompleted && <span style={trackingStyles.checkmark}>✓</span>}
            </div>
            <div style={trackingStyles.stepLabel}>
              <div>{step.label}</div>
              {update && (
                <div style={trackingStyles.updateInfo}>
                  <small>{formatDate(update.timestamp)}</small>
                  {update.location && (
                    <small style={trackingStyles.location}>{update.location}</small>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const trackingStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '30px 0',
    padding: '0 20px',
    width: '100%',
  },
  progressLine: {
    position: 'absolute',
    top: '12px',
    left: '50px',
    right: '50px',
    height: '2px',
    zIndex: 1,
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
  point: {
    completed: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#4CAF50',
      border: '2px solid #45a049',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
    current: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#1e88e5',
      border: '2px solid #1565c0',
      boxShadow: '0 0 0 4px rgba(30, 136, 229, 0.2)',
      marginBottom: '8px',
    },
    pending: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#666',
      border: '2px solid #444',
      marginBottom: '8px',
    }
  },
  stepLabel: {
    fontSize: '0.8em',
    color: 'white',
    textAlign: 'center',
  },
  updateInfo: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.7em',
    color: '#aaa',
    marginTop: '4px',
  },
  location: {
    fontStyle: 'italic'
  },
  checkmark: {
    color: 'white',
    fontSize: '14px'
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [prescriptionUploads, setPrescriptionUploads] = useState({});
  const [cancellationReason, setCancellationReason] = useState("");
  const [trackingInfo, setTrackingInfo] = useState({});
  const [trackingLoading, setTrackingLoading] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchPrescriptionStatus();
  }, [orders]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAllTracking = async () => {
      orders.forEach((order) => {
        // Only fetch for non-cancelled and non-delivered orders
        if (!["cancelled", "delivered"].includes(order.orderStatus)) {
          fetchTrackingInfo(order._id, abortController.signal);
        }
      });
    };

    if (orders.length > 0) {
      fetchAllTracking();
    }

    return () => {
      abortController.abort();
    };
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionStatus = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await api.get("/prescriptions/my-prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create a map of orderId -> prescription status
      const uploads = {};
      response.data.data.prescriptions.forEach((prescription) => {
        if (prescription.order) {
          uploads[prescription.order._id || prescription.order] = prescription;
        }
      });
      setPrescriptionUploads(uploads);
    } catch (err) {
      console.error("Failed to fetch prescription status:", err);
    }
  };

  const fetchTrackingInfo = async (orderId, signal) => {
    setTrackingLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const token = localStorage.getItem("jwt");
      const response = await api.get(`/tracking/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (response.data.data.tracking) {
        setTrackingInfo((prev) => ({
          ...prev,
          [orderId]: response.data.data.tracking,
        }));
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error(`Failed to fetch tracking for order ${orderId}:`, err);
        setTrackingInfo((prev) => ({
          ...prev,
          [orderId]: null,
        }));
      }
    } finally {
      setTrackingLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const cancelOrder = async (orderId) => {
    const reason = prompt("Please enter reason for cancellation (optional):");
    if (reason === null) return; // User clicked cancel

    try {
      const token = localStorage.getItem("jwt");
      await api.put(
        `/orders/${orderId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order cancelled successfully");
      fetchOrders();
      fetchPrescriptionStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffd700",
      awaiting_prescription: "#ff8c00",
      processing: "#1e90ff",
      confirmed: "#32cd32",
      packed: "#9370db",
      shipped: "#4169e1",
      delivered: "#228b22",
      cancelled: "#dc143c",
    };
    return colors[status] || "#808080";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStatusText = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, and PDF files are allowed");
    }
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateFile(file);
        setUploadFile(file);
        setError(null);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result);
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      } catch (err) {
        setError(err.message);
        setUploadFile(null);
        setPreview(null);
        toast.error(err.message);
      }
    }
  };

  const handlePrescriptionUpload = async (orderId) => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("prescriptionImage", uploadFile);

    try {
      const token = localStorage.getItem("jwt");
      const response = await api.post(
        `/prescriptions/upload/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local prescription uploads state
      setPrescriptionUploads((prev) => ({
        ...prev,
        [orderId]: response.data.data.prescription,
      }));

      toast.success("Prescription uploaded successfully!");
      setSelectedOrderId(null);
      setUploadFile(null);
      setPreview(null);
      fetchOrders(); // Refresh orders list
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to upload prescription";
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading your orders...</p>
      </div>
    );

  if (error)
    return (
      <div style={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchOrders} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={styles.noOrders}>
          <p>No orders found</p>
          <button
            onClick={() => navigate("/Medicine-search")}
            style={styles.shopButton}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3>Order #{order._id.slice(-8)}</h3>
                <p>Placed on: {formatDate(order.createdAt)}</p>
              </div>
              <div
                style={styles.statusBadge(getStatusColor(order.orderStatus))}
              >
                {getStatusText(order.orderStatus)}
              </div>
            </div>

            <div style={styles.orderDetails}>
              {order.items.map((item) => (
                <div key={item._id} style={styles.item}>
                  <img
                    src={item.product.imageUrls?.[0] || "placeholder.jpg"}
                    alt={item.product.name}
                    style={styles.productImage}
                  />
                  <div style={styles.itemDetails}>
                    <h4>{item.product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.orderSummary}>
                <p>Total Amount: {formatPrice(order.totalAmount)}</p>
                <p>Payment Status: {getStatusText(order.paymentStatus)}</p>
                {order.trackingNumber && (
                  <p>Tracking Number: {order.trackingNumber}</p>
                )}
                {trackingInfo[order._id] && !trackingLoading[order._id] && (
                  <div style={styles.trackingInfo}>
                    <h4>Tracking Information</h4>
                    {trackingInfo[order._id] ? (
                      <>
                        <OrderTrackingProgress 
                          currentStatus={trackingInfo[order._id].currentStatus}
                          updates={trackingInfo[order._id].updates}
                        />
                        {trackingInfo[order._id].estimatedDelivery && (
                          <p style={styles.estimatedDelivery}>
                            Estimated Delivery: {formatDate(trackingInfo[order._id].estimatedDelivery)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p>No tracking information available</p>
                    )}
                  </div>
                )}
                {trackingLoading[order._id] && (
                  <div style={styles.trackingLoading}>
                    <p>Loading tracking information...</p>
                  </div>
                )}
              </div>
              <div style={styles.actionButtons}>
                {/* Show cancel button for all orders except delivered and cancelled */}
                {!["delivered", "cancelled"].includes(order.orderStatus) && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    style={styles.cancelButton}
                  >
                    Cancel Order
                  </button>
                )}

                {(order.prescriptionStatus === "pending" ||
                  order.orderStatus === "awaiting_prescription") &&
                  !prescriptionUploads[order._id] && (
                    <>
                      {selectedOrderId === order._id ? (
                        <div style={styles.uploadForm}>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            id={`prescription-${order._id}`}
                            style={styles.fileInput}
                          />
                          <label
                            htmlFor={`prescription-${order._id}`}
                            style={styles.fileLabel}
                          >
                            {uploadFile ? uploadFile.name : "Choose a file"}
                          </label>
                          {preview && (
                            <div style={styles.previewContainer}>
                              <img
                                src={preview}
                                alt="Preview"
                                style={styles.preview}
                              />
                            </div>
                          )}
                          <div style={styles.uploadActions}>
                            <button
                              onClick={() =>
                                handlePrescriptionUpload(order._id)
                              }
                              disabled={uploadLoading || !uploadFile}
                              style={{
                                ...styles.uploadButton,
                                ...(uploadLoading || !uploadFile
                                  ? styles.buttonDisabled
                                  : {}),
                              }}
                            >
                              {uploadLoading ? "Uploading..." : "Upload"}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrderId(null);
                                setUploadFile(null);
                                setPreview(null);
                              }}
                              style={styles.cancelUploadButton}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedOrderId(order._id)}
                          style={styles.uploadButton}
                        >
                          Upload Prescription
                        </button>
                      )}
                    </>
                  )}
                {prescriptionUploads[order._id] && (
                  <div style={styles.prescriptionStatus}>
                    <span>Prescription submitted</span>
                    {prescriptionUploads[order._id].verificationStatus ===
                      "pending" && (
                      <span style={styles.pendingVerification}>
                        (Pending verification)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "white",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "white",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: "20px",
  },
  noOrders: {
    textAlign: "center",
    padding: "20px",
    color: "white",
  },
  orderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    color: "white",
  },
  statusBadge: (color) => ({
    padding: "5px 10px",
    borderRadius: "4px",
    backgroundColor: color,
    color: "white",
    fontSize: "0.9em",
    fontWeight: "bold",
  }),
  orderDetails: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "15px 0",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    color: "white",
  },
  productImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "4px",
    marginRight: "15px",
  },
  itemDetails: {
    flex: 1,
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
    color: "white",
  },
  orderSummary: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#dc143c",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#b01030",
      transform: "scale(1.02)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  loadingContainer: {
    textAlign: "center",
    padding: "50px",
    color: "white",
  },
  loader: {
    border: "4px solid rgba(255, 255, 255, 0.1)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  errorContainer: {
    textAlign: "center",
    padding: "30px",
    color: "red",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "15px",
  },
  shopButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "15px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    maxWidth: "300px",
  },
  fileInput: {
    display: "none",
  },
  fileLabel: {
    padding: "8px 12px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    border: "2px dashed #666",
  },
  previewContainer: {
    maxWidth: "200px",
    margin: "10px 0",
  },
  preview: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
  },
  uploadActions: {
    display: "flex",
    gap: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#666",
    cursor: "not-allowed",
  },
  cancelUploadButton: {
    backgroundColor: "#dc143c",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  prescriptionStatus: {
    color: "#4CAF50",
    fontSize: "0.9em",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pendingVerification: {
    color: "#ffd700",
    fontStyle: "italic",
  },
  trackingInfo: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
  },
  estimatedDelivery: {
    marginTop: '15px',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '0.9em',
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Orders;
