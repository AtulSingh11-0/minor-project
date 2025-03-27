import React, { useState, useEffect } from "react";
import api from "../../Apis/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'awaiting_prescription':
      return 'bg-orange-100 text-orange-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'confirmed':
      return 'bg-teal-100 text-teal-800';
    case 'packed':
      return 'bg-indigo-100 text-indigo-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    prescriptionRequired: "",
  });

  const validStatuses = [
    "pending",
    "awaiting_prescription",
    "processing",
    "confirmed",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await api.get("/orders/all", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        },
      });

      if (response.data.data.orders) {
        setOrders(response.data.data.orders);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        }));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Order Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 w-full md:w-auto"
        >
          <option value="">All Statuses</option>
          {validStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>

        <select 
          value={filters.prescriptionRequired}
          onChange={(e) => handleFilterChange("prescriptionRequired", e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 w-full md:w-auto"
        >
          <option value="">All Orders</option>
          <option value="true">Prescription Required</option>
          <option value="false">No Prescription Required</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 text-xl py-8">
          Loading orders...
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50"
                >
                  <td 
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() => viewOrderDetails(order._id)}
                  >
                    {order._id}
                  </td>
                  <td 
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() => viewOrderDetails(order._id)}
                  >
                    {order.user?.name || 'N/A'}
                  </td>
                  <td 
                    className="px-4 py-4 text-sm text-gray-900 cursor-pointer"
                    onClick={() => viewOrderDetails(order._id)}
                  >
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between">
                        <span>{item.product?.name || 'Unknown Product'}</span>
                        <span className="text-gray-600">x {item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td 
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() => viewOrderDetails(order._id)}
                  >
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span 
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {order.prescriptionRequired && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Rx Required
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{pagination.page}</span> of{' '}
                <span className="font-medium">{pagination.pages}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
