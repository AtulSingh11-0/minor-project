import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Apis/Api";
import { toast } from "react-toastify";

const PendingPrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      const response = await api.get("/prescriptions/pending");
      setPrescriptions(response.data.data.prescriptions);
    } catch (err) {
      toast.error("Failed to fetch pending prescriptions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pending Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p style={styles.noData}>No pending prescriptions</p>
      ) : (
        <div style={styles.grid}>
          {prescriptions.map((prescription) => (
            <div key={prescription._id} style={styles.card}>
              <h3>Order #{prescription.order._id.slice(-8)}</h3>
              <p>Customer: {prescription.user.name}</p>
              <p>
                Date: {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
              <button
                style={styles.button}
                onClick={() =>
                  navigate(
                    `/admin/check-prescriptions/${prescription.order._id}`
                  )
                }
              >
                Review Prescription
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    color: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  loading: {
    textAlign: "center",
    color: "white",
    padding: "20px",
  },
  noData: {
    textAlign: "center",
    color: "#666",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default PendingPrescriptionsList;
