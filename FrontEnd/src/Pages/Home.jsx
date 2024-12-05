import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome Back to Our E-Commerce Store!</h1>
      <p style={styles.description}>
        Here are some amazing products for you! login
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: "50px",
    backgroundColor: "#fff",
    color: "#333",
    textAlign: "center",
  },
  title: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  description: {
    fontSize: "18px",
    marginBottom: "30px",
  },
};

export default Home;
