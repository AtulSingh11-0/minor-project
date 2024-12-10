import React, { useState, useEffect } from "react";
import api from "../../Apis/Api";
import { toast } from "react-toastify";

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    manufacturer: "",
    activeIngredients: [],
    stockQuantity: "",
    imageUrls: [],
    dosageForm: "tablet", // Default value
    requiresPrescription: false,
    sideEffects: [],
    contraindications: [],
    expiryDate: "",
    batchNumber: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await api.get("/products");
      // Filter out medicines with awaiting_prescription status
      const filteredMedicines = response.data.data.products.filter(
        medicine => medicine.orderStatus !== "awaiting_prescription"
      );
      setMedicines(filteredMedicines);
    } catch (err) {
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              name === "imageUrls" ? value :
              value
    }));
  };

  const handleArrayInput = (e, field) => {
    // Handle empty input case
    const value = e.target.value ? e.target.value.split(",").map(item => item.trim()) : [];
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      // Convert date string to ISO format
      expiryDate: new Date(formData.expiryDate).toISOString(),
      imageUrls: formData.imageUrls.toString().split(',').map(url => url.trim())
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, dataToSend);
        toast.success("Medicine updated successfully");
        alert("Medicine updated successfully");
      } else {
        await api.post("/products", dataToSend);
        toast.success("Medicine created successfully");
        alert("Medicine created successfully");
      }

      resetForm();
      fetchMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine._id);
    setFormData({
      ...medicine,
      // Format the date to YYYY-MM-DD for the input
      expiryDate: new Date(medicine.expiryDate).toISOString().split('T')[0],
      activeIngredients: medicine.activeIngredients || [],
      sideEffects: medicine.sideEffects || [],
      contraindications: medicine.contraindications || [],
      imageUrls: medicine.imageUrls || [],
    });
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?"))
      return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Medicine deleted successfully");
      fetchMedicines();
    } catch (err) {
      toast.error("Failed to delete medicine");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      category: "",
      manufacturer: "",
      requiresPrescription: false,
      imageUrls: [],
      activeIngredients: [], // Initialize empty arrays
      sideEffects: [],
      contraindications: [],
      dosageForm: "tablet",
      expiryDate: "",
      batchNumber: "",
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Medicine Management</h1>

      <button onClick={() => setIsCreating(true)} style={styles.addButton}>
        Add New Medicine
      </button>

      {isCreating && (
        <div style={styles.formContainer}>
          <h2>{editingId ? "Edit Medicine" : "Create New Medicine"}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Medicine Name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="manufacturer"
              placeholder="Manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <select
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleInputChange}
              style={styles.input}
              required
            >
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="liquid">Liquid</option>
              <option value="cream">Cream</option>
              <option value="injection">Injection</option>
              <option value="other">Other</option>
            </select>

            <input
              type="text"
              name="activeIngredients"
              placeholder="Active Ingredients (comma separated)"
              value={formData.activeIngredients?.join(", ") || ""} // Add null check
              onChange={(e) => handleArrayInput(e, "activeIngredients")}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="sideEffects"
              placeholder="Side Effects (comma separated)"
              value={formData.sideEffects?.join(", ") || ""} // Add null check
              onChange={(e) => handleArrayInput(e, "sideEffects")}
              style={styles.input}
            />

            <input
              type="text"
              name="contraindications"
              placeholder="Contraindications (comma separated)"
              value={formData.contraindications?.join(", ") || ""} // Add null check
              onChange={(e) => handleArrayInput(e, "contraindications")}
              style={styles.input}
            />

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="batchNumber"
              placeholder="Batch Number"
              value={formData.batchNumber}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="requiresPrescription"
                checked={formData.requiresPrescription}
                onChange={handleInputChange}
                id="prescription"
              />
              <label htmlFor="prescription">Requires Prescription</label>
            </div>
            <input
              type="text"
              name="imageUrls"
              placeholder="Image URLs (comma separated)"
              value={formData.imageUrls}
              onChange={handleInputChange}
              style={styles.input}
            />
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitButton}>
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.medicineGrid}>
        {medicines.map((medicine) => (
          <div key={medicine._id} style={styles.medicineCard}>
            {medicine.imageUrls?.[0] && (
              <img
                src={medicine.imageUrls[0]}
                alt={medicine.name}
                style={styles.medicineImage}
              />
            )}
            <div style={styles.medicineInfo}>
              <h3>{medicine.name}</h3>
              <p>{medicine.description}</p>
              <p>Price: ₹{medicine.price}</p>
              <p>Stock: {medicine.stockQuantity}</p>
              <p>Category: {medicine.category}</p>
              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(medicine)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(medicine._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
    color: "white",
    marginBottom: "30px",
  },
  loading: {
    textAlign: "center",
    color: "white",
    padding: "20px",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  textarea: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    minHeight: "100px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
  },
  fileInput: {
    color: "white",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  medicineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  medicineCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  medicineImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  medicineInfo: {
    padding: "15px",
    color: "white",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  editButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "5px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "5px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default MedicineManagement;
