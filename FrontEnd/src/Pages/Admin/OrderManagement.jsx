import React, { useState, useEffect } from "react";
import api from "../../Apis/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./OrderManagement.css"; // Add this import

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
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
        // Updated endpoint
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

  const updateOrderStatus = async (orderId, newStatus) => {
    if (updating[orderId]) return;

    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
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
    <div className="order-management">
      <h1>Order Management</h1>

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
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
          onChange={(e) =>
            handleFilterChange("prescriptionRequired", e.target.value)
          }
        >
          <option value="">All Orders</option>
          <option value="true">Prescription Required</option>
          <option value="false">No Prescription Required</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => viewOrderDetails(order._id)}
                    className="order-row"
                  >
                    <td>{order._id}</td>
                    <td>{order.user?.name}</td>
                    <td className="items-cell">
                      {order.items.map((item) => (
                        <div key={item._id} className="order-item">
                          <span className="item-name">{item.product.name}</span>
                          <span className="item-quantity">
                            x {item.quantity}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        disabled={updating[order._id]}
                        className={`status-select ${order.orderStatus}`}
                      >
                        {validStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {order.prescriptionRequired && (
                        <span className="prescription-badge">
                          Prescription Required
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagement;
