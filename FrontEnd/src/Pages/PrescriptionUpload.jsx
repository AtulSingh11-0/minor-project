import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../Apis/Api";
import { toast } from "react-toastify";

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order details when component mounts
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.data.order);
      } catch (err) {
        toast.error("Failed to fetch order details");
        navigate("/orders");
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      toast.error("No order ID provided");
      navigate("/orders");
    }
  }, [orderId, navigate]);

  // File validation
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, and PDF files are allowed");
    }
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        validateFile(selectedFile);
        setFile(selectedFile);
        setError(null);

        // Show preview for images
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result);
          reader.readAsDataURL(selectedFile);
        } else {
          setPreview(null);
        }
      } catch (err) {
        setError(err.message);
        setFile(null);
        setPreview(null);
        toast.error(err.message);
      }
    }
  };

  // Upload handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append("prescriptionImage", file); // Make sure field name matches backend
  
    try {
      // Get JWT token
      const token = localStorage.getItem('jwt');
      
      await api.post(`/prescriptions/upload/${orderId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      toast.success("Prescription uploaded successfully!");
      navigate("/orders");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to upload prescription";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div style={styles.loading}>Loading order details...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Prescription</h2>

      {order.items && (
        <div style={styles.orderDetails}>
          <h3>Order #{orderId.slice(-8)}</h3>
          <div style={styles.itemsList}>
            <h4>Items Requiring Prescription:</h4>
            {order.items.filter(item => item.product.requiresPrescription).map((item) => (
              <div key={item.product._id} style={styles.item}>
                <span>{item.product.name}</span>
                <span>Quantity: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.uploadArea}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            id="prescription"
            style={styles.fileInput}
          />
          <label htmlFor="prescription" style={styles.fileLabel}>
            {file ? file.name : "Choose a file"}
          </label>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {preview && (
          <div style={styles.previewContainer}>
            <img src={preview} alt="Preview" style={styles.preview} />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !file} 
          style={{
            ...styles.submitButton,
            ...(loading || !file ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "Uploading..." : "Upload Prescription"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#333",
    borderRadius: "8px",
    color: "white"
  },
  loading: {
    textAlign: "center",
    color: "white",
    padding: "20px"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  orderDetails: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#444",
    borderRadius: "4px"
  },
  itemsList: {
    marginTop: "10px"
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #555"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  uploadArea: {
    position: "relative",
    textAlign: "center"
  },
  fileInput: {
    display: "none"
  },
  fileLabel: {
    display: "block",
    padding: "15px",
    backgroundColor: "#444",
    border: "2px dashed #666",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  error: {
    color: "#ff6b6b",
    textAlign: "center",
    padding: "10px"
  },
  previewContainer: {
    textAlign: "center"
  },
  preview: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "4px"
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px"
  },
  buttonDisabled: {
    backgroundColor: "#666",
    cursor: "not-allowed"
  }
};

export default PrescriptionUpload;
