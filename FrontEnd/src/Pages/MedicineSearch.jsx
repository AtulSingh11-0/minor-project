import React, { useState, useEffect } from "react";
import api from "../Apis/Api";

const MedicineSearch = () => {
  const [search, setSearch] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState({}); // Track loading state per product
  const [addedProducts, setAddedProducts] = useState({}); // Add this state

  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(response.data.data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const validatePriceFilters = () => {
    const min = Number(advancedFilters.minPrice);
    const max = Number(advancedFilters.maxPrice);
    if (min && max && min > max) {
      setError("Minimum price cannot be greater than maximum price");
      return false;
    }
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validatePriceFilters()) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.get(`/products/search?query=${search}`, {
        params: {
          // search: search || undefined,
          ...advancedFilters,
        },
      });
      console.log(response);

      setProducts(response.data.data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setLoadingProducts((prev) => ({ ...prev, [productId]: true }));
    try {
      await api.post("/cart/add", {
        productId,
        quantity: 1,
      });
      setAddedProducts((prev) => ({ ...prev, [productId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product to cart");
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Search</h1>
      <form onSubmit={handleSearch} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="search">
            Name:
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
            placeholder="Search by product name"
          />
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={styles.toggleButton}
        >
          {showAdvanced ? "Hide Filters" : "Show Filters"}
        </button>
        {showAdvanced && (
          <div style={styles.advancedFilters}>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="category">
                Category:
              </label>
              <input
                type="text"
                id="category"
                value={advancedFilters.category}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                style={styles.input}
                placeholder="Optional"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="minPrice">
                Min Price:
              </label>
              <input
                type="number"
                id="minPrice"
                value={advancedFilters.minPrice}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value,
                  }))
                }
                style={styles.input}
                placeholder="Optional"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="maxPrice">
                Max Price:
              </label>
              <input
                type="number"
                id="maxPrice"
                value={advancedFilters.maxPrice}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                  }))
                }
                style={styles.input}
                placeholder="Optional"
              />
            </div>
          </div>
        )}
      </form>
      <div style={styles.results}>
        {isLoading ? (
          <p style={styles.loading}>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{product.name}</h3>
              <p style={styles.productDetails}>
                Category: {product.category || "N/A"}
              </p>
              <p style={styles.productDetails}>Price: ₹{product.price}</p>
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={
                  loadingProducts[product._id] || addedProducts[product._id]
                }
                style={{
                  ...styles.addToCartButton,
                  ...(loadingProducts[product._id] || addedProducts[product._id]
                    ? styles.buttonDisabled
                    : {}),
                  ...(addedProducts[product._id] && styles.addedButton),
                }}
              >
                {loadingProducts[product._id]
                  ? "Adding..."
                  : addedProducts[product._id]
                  ? "Added ✓"
                  : "Add to Cart"}
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noResults}>No products found</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Same styles from the original code
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
  },
  form: { display: "flex", flexDirection: "column" },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#ccc",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#444",
    color: "#fff",
  },
  button: {
    padding: "10px",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  toggleButton: {
    padding: "8px",
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  advancedFilters: {
    marginTop: "15px",
    padding: "15px",
    backgroundColor: "#444",
    borderRadius: "4px",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
  },
  results: {
    marginTop: "20px",
  },
  productCard: {
    backgroundColor: "#444",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  productTitle: {
    fontSize: "18px",
    color: "#fff",
  },
  productDetails: {
    fontSize: "14px",
    color: "#ccc",
  },
  loading: {
    textAlign: "center",
    color: "#ccc",
    padding: "20px",
  },
  noResults: {
    textAlign: "center",
    color: "#ccc",
    padding: "20px",
  },
  addToCartButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    width: "100%",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#45a049",
    },
    "&:disabled": {
      backgroundColor: "#666",
      cursor: "not-allowed",
    },
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  addedButton: {
    backgroundColor: "#45a049",
    cursor: "default",
  },
};

export default MedicineSearch;
