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

<<<<<<< HEAD
  if (loading) return (
    <div className="flex justify-center items-center h-screen text-blue-600 text-xl">
      Loading...
    </div>
  );
=======
  if (loading) return <div style={styles.loading}>Loading...</div>;
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Pending Prescriptions
      </h1>
      {prescriptions.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No pending prescriptions
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
<<<<<<< HEAD
            <div 
              key={prescription._id} 
              className="bg-blue-50 rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Order #{prescription.order._id.slice(-8)}
                </h3>
                <p className="text-gray-700 mb-1">
                  Customer: {prescription.user.name}
                </p>
                <p className="text-gray-600 mb-4">
                  Date: {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
                
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={prescription.imageUrl} 
                    alt="Prescription"
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter notes (required for rejection)"
                    value={notes[prescription._id] || ""}
                    onChange={(e) => setNotes(prev => ({
                      ...prev,
                      [prescription._id]: e.target.value
                    }))}
                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    rows="3"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleVerification(prescription._id, "approved")}
                      disabled={updating[prescription._id]}
                      className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                        focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerification(prescription._id, "rejected")}
                      disabled={updating[prescription._id]}
                      className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                        focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Reject
                    </button>
                  </div>
=======
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
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default PendingPrescriptionsList;
=======
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
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
