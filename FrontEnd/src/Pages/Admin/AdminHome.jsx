import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3>Total Orders</h3>
          <p>150</p>
        </div>
        <div style={styles.statCard}>
          <h3>Active Users</h3>
          <p>1,234</p>
        </div>
        <div style={styles.statCard}>
          <h3>Total Products</h3>
          <p>567</p>
        </div>
        <div style={styles.statCard}>
          <h3>Revenue</h3>
          <p>₹45,678</p>
        </div>
        meAdminHome{" "}
      </div>

      <div style={styles.actionsContainer}>
        <button
          style={styles.actionButton}
          onClick={() => navigate("/admin/products")}
        >
          Manage Products
        </button>
        <button
          style={styles.actionButton}
          onClick={() => navigate("/admin/orders")}
        >
          View Orders
        </button>
        <button
          style={styles.actionButton}
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </button>
        <button
          style={styles.actionButton}
          onClick={() => navigate("/admin/prescriptions")}
        >
          Review Prescriptions
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    color: "white",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "#333",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  actionsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
  },
  actionButton: {
    padding: "1rem",
    fontSize: "1.1rem",
    backgroundColor: "#444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#555",
    },
  },
};

export default AdminHome;
