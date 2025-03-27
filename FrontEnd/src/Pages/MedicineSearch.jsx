import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
  ShoppingBag,
} from "lucide-react";
import api from "../Apis/Api";

const MedicineSearch = () => {
  const CATEGORIES = ["prescription", "otc", "healthcare", "supplies"];

  // Define available sort options
  const SORT_OPTIONS = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
  ];

  // Separate state for temporary filters
  const [tempFilters, setTempFilters] = useState({
    category: "", // Single category
    minPrice: "",
    maxPrice: "",
    requiresPrescription: "",
    sortBy: "",
  });

  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    requiresPrescription: "",
    sortBy: "",
  });

  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState({});
  const [addedProducts, setAddedProducts] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("");

  // Handle category changes (temporary)
  const handleCategoryChange = (category) => {
    setTempFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
  };

  // Handle price changes (temporary)
  const handlePriceChange = (field, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setTempFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = async () => {
    setIsFilterLoading(true);
    setActiveFilters(tempFilters);
    setPage(1); // Reset to first page
    await fetchAllProducts(1, tempFilters);
    setIsFilterLoading(false);
  };

  // Clear filters
  const handleClearFilters = async () => {
    const clearedFilters = {
      category: "", // Single category
      minPrice: "",
      maxPrice: "",
      requiresPrescription: "",
      sortBy: "",
    };
    setTempFilters(clearedFilters);
    setActiveFilters(clearedFilters);
    setPage(1);
    await fetchAllProducts(1, clearedFilters);
  };

  // Update the fetchAllProducts function
  const fetchAllProducts = async (
    currentPage = page,
    filters = activeFilters
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use regular product listing API for filters
      const response = await api.get("/products", {
        params: {
          page: currentPage,
          limit: 10,
          category: filters.category || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          requiresPrescription: filters.requiresPrescription || undefined,
          sortBy: filters.sortBy || undefined,
        },
      });

      const { products, pagination } = response.data.data;
      setProducts(products);
      setTotalPages(pagination.pages);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleSearch function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validatePriceFilters()) return;

    setError(null);
    setIsLoading(true);
    setPage(1); // Reset to first page on new search

    try {
      if (!search.trim()) {
        // If search is cleared, fetch all products
        await fetchAllProducts(1, activeFilters);
        return;
      }

      // Use search API when there's a query
      const response = await api.get("/products/search", {
        params: {
          query: search,
          page: 1,
          ...activeFilters,
        },
      });

      setProducts(response.data.data.products || []);
      setTotalPages(1);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearch("");
    setError(null);
    await fetchAllProducts(1, activeFilters);
  };

  // Update useEffect to prevent unnecessary API calls
  useEffect(() => {
    // Only fetch if not in search mode
    if (!search.trim()) {
      fetchAllProducts();
    }
  }, [page, sortBy, activeFilters]);

  const validatePriceFilters = () => {
    const min = Number(activeFilters.minPrice);
    const max = Number(activeFilters.maxPrice);
    if (min && max && min > max) {
      setError("Minimum price cannot be greater than maximum price");
      return false;
    }
    return true;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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
    <div className="min-h-screen">
      {/* Header */}

      {/* Search Section */}
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for medicines, healthcare products..."
              className="w-full p-3 pl-10 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-[60px] top-1/2 transform -translate-y-1/2 p-1 rounded-full 
                           text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                           transition-colors duration-200 focus:outline-none"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 
                         bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 
                         transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp size={20} className="mr-2" />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter size={20} className="mr-2" />
                  Show Filters
                </>
              )}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="flex flex-col">
                  <h3 className="text-gray-700 mb-2">Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio" // Changed to radio for single selection
                          checked={tempFilters.category === category}
                          onChange={() => handleCategoryChange(category)}
                          className="form-radio h-4 w-4 text-blue-600"
                          name="category"
                        />
                        <span className="text-gray-700 capitalize">
                          {category.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={tempFilters.minPrice}
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value)
                    }
                    placeholder="Min Price"
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={tempFilters.maxPrice}
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value)
                    }
                    placeholder="Max Price"
                    className="p-2 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={tempFilters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Default</option>
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    disabled={isFilterLoading}
                  >
                    <X size={16} />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
                    disabled={isFilterLoading}
                  >
                    {isFilterLoading ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      <Filter size={16} />
                    )}
                    <span>Apply Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Error Handling */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4">
          {isLoading ? (
            // Skeleton Loader
            [...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-4 animate-pulse"
              >
                <div className="h-40 bg-gray-300 mb-4 rounded"></div>
                <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 mb-2 w-1/2"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.imageUrls?.[0] || "placeholder.jpg"}
                  alt={product.name}
                  className=" w-40 h-40 object-cover mb-9 m-auto p-4 rounded"
                />
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.category || "General Medicine"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={
                      loadingProducts[product._id] || addedProducts[product._id]
                    }
                    className={`
                      px-4 py-2 rounded text-sm font-semibold
                      ${
                        loadingProducts[product._id] ||
                        addedProducts[product._id]
                          ? "bg-green-400 text-white cursor-not-allowed"
                          : "text-blue-600  hover:bg-neutral-200 duration-150"
                      }
                    `}
                  >
                    {loadingProducts[product._id]
                      ? "Adding..."
                      : addedProducts[product._id]
                      ? "✓"
                      : <ShoppingBag/>}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found. Try a different search.
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-2 border rounded-full shadow-md bg-blue-200 hover:bg-blue-500 hover:text-white duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-2 border rounded-full shadow-md bg-blue-200 hover:bg-blue-500 hover:text-white duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;
