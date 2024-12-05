import React from "react";
import { Link } from "react-router-dom";

const HomeLandingPage = () => {
  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/register" style={styles.navLink}>
              Register
            </Link>
          </li>
        </ul>
      </nav>
      <h1 style={styles.title}>Welcome to Our E-Commerce Store</h1>
      <p style={styles.description}>
        Discover amazing products at great prices! not login
      </p>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#333",
    padding: "10px 20px",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "flex-end",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "20px",
  },
  navLink: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  container: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "30px",
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  description: {
    fontSize: "18px",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "15px 30px",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default HomeLandingPage;
