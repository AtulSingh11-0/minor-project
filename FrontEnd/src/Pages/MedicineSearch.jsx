import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
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
  const [loadingProducts, setLoadingProducts] = useState({});
  const [addedProducts, setAddedProducts] = useState({});

  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [sortBy, setSortBy] = useState(""); // Sorting criteria

  const fetchAllProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/products", {
        params: {
          query: search,
          ...advancedFilters,
          page,
          sortBy,
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

  useEffect(() => {
    fetchAllProducts();
  }, [page, sortBy, advancedFilters]);

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
    setPage(1); // Reset to first page on new search
    // fetchAllProducts();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.get(`/products/search?query=${search}`, {
        params: {
          ...advancedFilters,
        },
      });
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

  // const handleRetry = () => {
  //   fetchAllProducts();
  // };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // const handleSortChange = (e) => {
  //   setSortBy(e.target.value);
  // };

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
  }
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
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              <Search size={20} />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <input 
                  type="text"
                  value={advancedFilters.category}
                  onChange={(e) => 
                    setAdvancedFilters(prev => ({
                      ...prev, 
                      category: e.target.value
                    }))
                  }
                  placeholder="Category"
                  className="p-2 border rounded"
                />
                <input 
                  type="number"
                  value={advancedFilters.minPrice}
                  onChange={(e) => 
                    setAdvancedFilters(prev => ({
                      ...prev, 
                      minPrice: e.target.value
                    }))
                  }
                  placeholder="Min Price"
                  className="p-2 border rounded"
                />
                <input 
                  type="number"
                  value={advancedFilters.maxPrice}
                  onChange={(e) => 
                    setAdvancedFilters(prev => ({
                      ...prev, 
                      maxPrice: e.target.value
                    }))
                  }
                  placeholder="Max Price"
                  className="p-2 border rounded"
                />
              </div>
            )}
          </div>
        </form>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-4">
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
                        loadingProducts[product._id] || addedProducts[product._id]
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }
                    `}
                  >
                    {loadingProducts[product._id]
                      ? "Adding..."
                      : addedProducts[product._id]
                      ? "Added ✓"
                      : "Add to Cart"}
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
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;