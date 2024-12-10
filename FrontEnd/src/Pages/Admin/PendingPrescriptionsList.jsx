import React, { useState, useEffect } from "react";
import api from "../../Apis/Api";
import { toast } from "react-toastify";

const PendingPrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      const response = await api.get("/prescriptions/pending");
      console.log(response);

      setPrescriptions(response.data.data.prescriptions);
    } catch (err) {
      toast.error("Failed to fetch pending prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (prescriptionId, status) => {
    if (!prescriptionId || !status) return;
    
    if (status === "rejected" && !notes[prescriptionId]) {
      toast.error("Please provide rejection notes");
      return;
    }

    setUpdating(prev => ({ ...prev, [prescriptionId]: true }));

    try {
      await api.put(`/prescriptions/${prescriptionId}/verify`, {
        status,
        notes: notes[prescriptionId] || ""
      });
      toast.success(`Prescription ${status} successfully`);
      fetchPendingPrescriptions();
    } catch (err) {
      toast.error(`Failed to ${status} prescription`);
    } finally {
      setUpdating(prev => ({ ...prev, [prescriptionId]: false }));
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
              <img 
                src={prescription.imageUrl} 
                alt="Prescription"
                style={styles.prescriptionImage}
              />
              <div style={styles.verificationForm}>
                <textarea
                  placeholder="Enter notes (required for rejection)"
                  value={notes[prescription._id] || ""}
                  onChange={(e) => setNotes(prev => ({
                    ...prev,
                    [prescription._id]: e.target.value
                  }))}
                  style={styles.notesInput}
                />
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleVerification(prescription._id, "approved")}
                    disabled={updating[prescription._id]}
                    style={{...styles.button, ...styles.approveButton}}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(prescription._id, "rejected")}
                    disabled={updating[prescription._id]}
                    style={{...styles.button, ...styles.rejectButton}}
                  >
                    Reject
                  </button>
                </div>
              </div>
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
  prescriptionImage: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    marginTop: "10px",
    borderRadius: "4px",
  },
  verificationForm: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  notesInput: {
    width: "100%",
    minHeight: "80px",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#444",
    border: "1px solid #555",
    color: "white",
    resize: "vertical",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#dc143c",
  },
};

export default PendingPrescriptionsList;
