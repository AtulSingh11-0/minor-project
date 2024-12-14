import React, { useState, useEffect } from "react";
import api from "../../Apis/Api";
import { toast } from "react-toastify";

const MedicineManagement = () => {
  // Constants
  const CATEGORIES = ["prescription", "otc", "healthcare", "supplies"];

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
<<<<<<< HEAD
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const itemsPerPage = 6;

  // Filtering and Search States
  const [tempFilters, setTempFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    requiresPrescription: "",
  });

  const [activeFilters, setActiveFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    requiresPrescription: "",
  });

  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState(null);

=======
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    manufacturer: "",
    activeIngredients: [],
    stockQuantity: "",
    imageUrls: [],
    dosageForm: "tablet", 
    requiresPrescription: false,
    sideEffects: [],
    contraindications: [],
    expiryDate: "",
    batchNumber: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, [currentPage, activeFilters]);

  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const response = await api.get("/products", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          category: activeFilters.category || undefined,
          minPrice: activeFilters.minPrice || undefined,
          maxPrice: activeFilters.maxPrice || undefined,
          requiresPrescription: activeFilters.requiresPrescription || undefined,
          search: search || undefined,
        },
      }); 

      const { products, pagination } = response.data.data;
      setMedicines(products);
      setTotalMedicines(pagination.total);
      setTotalPages(pagination.pages);
      
=======
      const response = await api.get("/products");
      // Filter out medicines with awaiting_prescription status
      const filteredMedicines = response.data.data.products.filter(
        medicine => medicine.orderStatus !== "awaiting_prescription"
      );
      setMedicines(filteredMedicines);
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch medicines");
      setError(err.response?.data?.message || "Failed to fetch medicines");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Category Change Handler
  const handleCategoryChange = (category) => {
    setTempFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
  };

  // Price Change Handler
  const handlePriceChange = (field, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply Filters
  const handleApplyFilters = async () => {
    setIsFilterLoading(true);
    setActiveFilters(tempFilters);
    setCurrentPage(1); // Reset to first page
    await fetchMedicines();
    setIsFilterLoading(false);
  };

  // Clear Filters
  const handleClearFilters = async () => {
    const clearedFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      requiresPrescription: "",
    };
    setTempFilters(clearedFilters);
    setActiveFilters(clearedFilters);
    setCurrentPage(1);
    setSearch("");
    await fetchMedicines();
  };

  // Search Handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validatePriceFilters()) return;

    setError(null);
    setLoading(true);
    setCurrentPage(1); // Reset to first page on new search

    try {
      if(!search.trim()){
        await fetchMedicines();
        return;
      }

      const response = await api.get("/products/search", {
        params: {
          query: search,
          page: 1,
          limit: itemsPerPage,
          category: activeFilters.category || undefined,
          minPrice: activeFilters.minPrice || undefined,
          maxPrice: activeFilters.maxPrice || undefined,
        },
      });

      const { products, pagination } = response.data.data;
      setMedicines(products || []);
      setTotalPages(pagination.pages);
      setTotalMedicines(pagination.total);
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Validate Price Filters
  const validatePriceFilters = () => {
    const min = Number(activeFilters.minPrice);
    const max = Number(activeFilters.maxPrice);
    if (min && max && min > max) {
      toast.error("Minimum price cannot be greater than maximum price");
      setError("Minimum price cannot be greater than maximum price");
      return false;
    }
    return true;
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Existing methods remain the same
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
<<<<<<< HEAD
      [name]:
        type === "checkbox" ? checked : name === "imageUrls" ? value : value,
=======
      [name]: type === "checkbox" ? checked : 
              name === "imageUrls" ? value :
              value
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
    }));
  };

  const handleArrayInput = (e, field) => {
<<<<<<< HEAD
    const value = e.target.value
      ? e.target.value.split(",").map((item) => item.trim())
      : [];
=======
    // Handle empty input case
    const value = e.target.value ? e.target.value.split(",").map(item => item.trim()) : [];
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
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
<<<<<<< HEAD
      expiryDate: new Date(formData.expiryDate).toISOString(),
      imageUrls: formData.imageUrls
        .toString()
        .split(",")
        .map((url) => url.trim()),
=======
      // Convert date string to ISO format
      expiryDate: new Date(formData.expiryDate).toISOString(),
      imageUrls: formData.imageUrls.toString().split(',').map(url => url.trim())
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
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

  const scrollToTop = () => {
    window.scrollTo(0, 0); 
  };

  const handleEdit = (medicine) => {
    scrollToTop()
    setEditingId(medicine._id);
    setFormData({
      ...medicine,
<<<<<<< HEAD
      expiryDate: new Date(medicine.expiryDate).toISOString().split("T")[0],
=======
      // Format the date to YYYY-MM-DD for the input
      expiryDate: new Date(medicine.expiryDate).toISOString().split('T')[0],
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
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
<<<<<<< HEAD
      activeIngredients: [],
=======
      activeIngredients: [], // Initialize empty arrays
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
      sideEffects: [],
      contraindications: [],
      dosageForm: "tablet",
      expiryDate: "",
      batchNumber: "",
    });
    setEditingId(null);
    setIsCreating(false);
  };

  // Pagination Component
  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );

  // Filter Section Component
  const FilterSection = () => (
    <div className="mb-6">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {/* Search Input */}
        {/* <form onSubmit={handleSearch} className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow p-2 border rounded-l-md"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 rounded-r-md"
            disabled={loading}
          >
            Search
          </button>
        </form> */}
        
        {/* Advanced Filters Toggle */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-gray-200 px-4 py-2 rounded-md"
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {/* Category Filters */}
            <div className="flex gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-2 rounded-md ${
                    tempFilters.category === category 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Price Filters */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={tempFilters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="p-2 border rounded-md w-24"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={tempFilters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="p-2 border rounded-md w-24"
              />
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleApplyFilters}
              disabled={isFilterLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isFilterLoading ? "Applying..." : "Apply Filters"}
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-200 px-4 py-2 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-blue-600 text-xl">
      Loading...
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Medicine Management
      </h1>

      {/* Filter Section */}
      <FilterSection />

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="mb-6 text-center">
        <button 
          onClick={() => setIsCreating(true)} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New Medicine
        </button>
      </div>


      {/* Existing form code remains the same */}
      {isCreating && (
<<<<<<< HEAD
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            {editingId ? "Edit Medicine" : "Create New Medicine"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
=======
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
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
              <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows="3"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="number"
                name="stockQuantity"
                placeholder="Stock Quantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="text"
                name="manufacturer"
                placeholder="Manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <select
                name="dosageForm"
                value={formData.dosageForm}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                value={formData.activeIngredients?.join(", ") || ""}
                onChange={(e) => handleArrayInput(e, "activeIngredients")}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="text"
                name="sideEffects"
                placeholder="Side Effects (comma separated)"
                value={formData.sideEffects?.join(", ") || ""}
                onChange={(e) => handleArrayInput(e, "sideEffects")}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="text"
                name="contraindications"
                placeholder="Contraindications (comma separated)"
                value={formData.contraindications?.join(", ") || ""}
                onChange={(e) => handleArrayInput(e, "contraindications")}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="text"
                name="batchNumber"
                placeholder="Batch Number"
                value={formData.batchNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onChange={handleInputChange}
                  id="prescription"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="prescription" className="text-gray-700">
                  Requires Prescription
                </label>
              </div>
              <input
                type="text"
                name="imageUrls"
                placeholder="Image URLs (comma separated)"
                value={formData.imageUrls}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none col-span-full"
              />
            </div>
<<<<<<< HEAD
            <div className="flex space-x-4 mt-6">
              <button 
                type="submit" 
                className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
=======
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
>>>>>>> 642309f27f01b6ab603c8c3e58b011781f376ad0
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medicines Grid - Made more responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.length > 0 ? (
          medicines.map((medicine) => (
            <div 
              key={medicine._id} 
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all hover:scale-105"
            >
              {medicine.imageUrls?.[0] && (
                <img
                  src={medicine.imageUrls[0]}
                  alt={medicine.name}
                  className="w-48 mx-auto h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {medicine.name}
                </h3>
                <p className="text-gray-600 mb-2">{medicine.description}</p>
                <p className="text-blue-700 font-bold mb-1">
                  Price: ₹{medicine.price}
                </p>
                <p className="text-gray-700 mb-1">
                  Stock: {medicine.stockQuantity}
                </p>
                <p className="text-gray-600 mb-4">
                  Category: {medicine.category}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(medicine)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            No medicines found
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <PaginationControls />
    </div>
  );
};

export default MedicineManagement;