import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Apis/Api";
import { toast } from "react-toastify";

const TRACKING_STEPS = [
  { status: "pending", label: "Order Placed" },
  { status: "processing", label: "Processing" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderTrackingProgress = ({ currentStatus, updates }) => {
  const getCurrentStepIndex = () => {
    if (currentStatus === "cancelled") return -1;
    return TRACKING_STEPS.findIndex((step) => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="relative md:flex md:justify-between items-center w-full px-5 md:mt-8 hidden">
      {/* Progress Line */}
      <div
        className="absolute top-[16px] left-0 right-0 h-[2px] z-0 mx-36 hidden md:block"
        style={{
          background: `linear-gradient(to right, 
            #4CAF50 ${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%, 
            rgba(0, 0, 0, 0.2) ${
              (currentStepIndex / (TRACKING_STEPS.length - 1)) * 100
            }%)`,
        }}
      ></div>

      {TRACKING_STEPS.map((step, index) => {
        const update = updates?.find((u) => u.status === step.status);
        const isCompleted = currentStepIndex > index;
        const isCurrent = currentStepIndex === index;

        const statusClass = isCompleted
          ? "bg-green-500 border-green-600 text-white"
          : isCurrent
          ? "bg-blue-500 border-blue-700 shadow-lg shadow-blue-200 text-white"
          : "bg-gray-300 border-gray-400 text-gray-500";

        return (
          <div
            key={step.status}
            className="relative flex flex-col items-center z-10 flex-1"
          >
            {/* Step Point */}
            <div
              className={`
                w-8 h-8 rounded-full border-2 md:flex md:items-center justify-center 
                mb-2 transition-all duration-300 ease-in-out hidden
                ${statusClass}
                `}
              title={update?.description || step.label}
            >
              {isCompleted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <div className="text-center hidden md:block">
              <div className="text-sm font-medium text-gray-700">
                {step.label}
              </div>
              {update && (
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <div>{formatDate(update.timestamp)}</div>
                  {update.location && (
                    <div className="italic">{update.location}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [prescriptionUploads, setPrescriptionUploads] = useState({});
  const [cancellationReason, setCancellationReason] = useState("");
  const [trackingInfo, setTrackingInfo] = useState({});
  const [trackingLoading, setTrackingLoading] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchPrescriptionStatus();
  }, [orders]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAllTracking = async () => {
      orders.forEach((order) => {
        // Only fetch for non-cancelled and non-delivered orders
        if (!["cancelled", "delivered"].includes(order.orderStatus)) {
          fetchTrackingInfo(order._id, abortController.signal);
        }
      });
    };

    if (orders.length > 0) {
      fetchAllTracking();
    }

    return () => {
      abortController.abort();
    };
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/prescriptions/my-prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create a map of orderId -> prescription status
      const uploads = {};
      response.data.data.prescriptions.forEach((prescription) => {
        if (prescription.order) {
          uploads[prescription.order._id || prescription.order] = prescription;
        }
      });
      setPrescriptionUploads(uploads);
    } catch (err) {
      console.error("Failed to fetch prescription status:", err);
    }
  };

  const fetchTrackingInfo = async (orderId, signal) => {
    setTrackingLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/tracking/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (response.data.data.tracking) {
        setTrackingInfo((prev) => ({
          ...prev,
          [orderId]: response.data.data.tracking,
        }));
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error(`Failed to fetch tracking for order ${orderId}:`, err);
        setTrackingInfo((prev) => ({
          ...prev,
          [orderId]: null,
        }));
      }
    } finally {
      setTrackingLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const cancelOrder = async (orderId) => {
    const reason = prompt("Please enter reason for cancellation (optional):");
    if (reason === null) return; // User clicked cancel

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/orders/${orderId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order cancelled successfully");
      fetchOrders();
      fetchPrescriptionStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500 text-yellow-500",
      awaiting_prescription: "bg-orange-500 text-orange-500",
      processing: "bg-blue-500 text-blue-500",
      confirmed: "bg-green-500 text-green-500",
      packed: "bg-purple-500 text-purple-500",
      shipped: "bg-blue-600 text-blue-600",
      delivered: "bg-green-700 text-green-700",
      cancelled: "bg-red-600 text-red-600",
    };
    return colors[status] || "bg-gray-500 text-gray-500";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStatusText = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, and PDF files are allowed");
    }
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateFile(file);
        setUploadFile(file);
        setError(null);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result);
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      } catch (err) {
        setError(err.message);
        setUploadFile(null);
        setPreview(null);
        toast.error(err.message);
      }
    }
  };

  const handlePrescriptionUpload = async (orderId) => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("prescriptionImage", uploadFile);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/prescriptions/upload/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local prescription uploads state
      setPrescriptionUploads((prev) => ({
        ...prev,
        [orderId]: response.data.data.prescription,
      }));

      toast.success("Prescription uploaded successfully!");
      setSelectedOrderId(null);
      setUploadFile(null);
      setPreview(null);
      fetchOrders(); // Refresh orders list
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to upload prescription";
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12 text-black">
        <div className="border-4 border-white border-t-4 border-solid rounded-full w-10 h-10 mx-auto animate-spin"></div>
        <p>Loading your orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-green-500 text-black py-2 px-4 rounded mt-4"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 text-black">
      <h1 className="text-center mb-8 text-3xl font-semibold">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p>No orders found</p>
          <button
            onClick={() => navigate("/Medicine-search")}
            className="bg-green-500 text-black py-2 px-4 rounded mt-4"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg p-6 sm:mb-6 shadow-lg"
          >
            <div className="md:flex justify-between text-black">
              <div className="mb-5">
                <h3 className="text-2xl">Order ID: #{order._id.slice(-8)}</h3>
                <p className="text-sm text-neutral-600">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div
                className={`py-2 bg-opacity-10 flex justify-center px-5 rounded-xl text-sm md:mb-10 font-bold ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {getStatusText(order.orderStatus)}
              </div>
            </div>
            <div className="w-full">
              {order.trackingNumber && (
                <p>Tracking Number: {order.trackingNumber}</p>
              )}
              {trackingInfo[order._id] && !trackingLoading[order._id] && (
                <div className="md:mt-4 md:p-4 bg-opacity-10 bg-white rounded-lg">
                  {/* <h4 className="text-lg font-semibold">Tracking Information</h4> */}
                  {trackingInfo[order._id] ? (
                    <>
                      <OrderTrackingProgress
                        currentStatus={trackingInfo[order._id].currentStatus}
                        updates={trackingInfo[order._id].updates}
                      />
                      {trackingInfo[order._id].estimatedDelivery && (
                        <p className="mt-4 py-2 px-4 bg-opacity-20 bg-white rounded-lg text-black">
                          Estimated Delivery:{" "}
                          {formatDate(
                            trackingInfo[order._id].estimatedDelivery
                          )}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>No tracking information available</p>
                  )}
                </div>
              )}
              {trackingLoading[order._id] && (
                <div className="mt-4 p-4 bg-opacity-10 bg-white rounded-lg">
                  <p>Loading tracking information...</p>
                </div>
              )}
            </div>

            <div className="py-4">
              <div className="grid grid-cols-5 font-bold border-b pb-2 mb-2 md:px-6 py-3">
                <div className="col-span-3">Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Price</div>
              </div>
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-5 items-center mb-2 pb-2 md:px-6 py-3"
                >
                  <div className="flex items-center col-span-3 ">
                    <img
                      src={item.product.imageUrls?.[0] || "placeholder.jpg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg mr-1 md:mr-4"
                    />
                    <span className="font-semibold">{item.product.name}</span>
                  </div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-right">₹{item.price}</div>
                </div>
              ))}
              <div className="grid md:grid-cols-3 font-semibold mt-4 px-6 py-3 ">
                <p>
                  Payment Status: {getStatusText(order.paymentStatus)}
                </p>
                <p className="col-span-2 md:text-end">
                  <span className="">Total: </span>
                  {formatPrice(order.totalAmount)}
                </p>
                {/* <div className="text-right">₹{totalPrice.toLocaleString()}</div> */}
              </div>
            </div>

            <div className="flex justify-center md:justify-end items-center mt-6">
  <div className="flex flex-col w-64 gap-4 p-4  rounded-lg max-w-xl">
    {/* Cancel Order Button */}
    {!["delivered", "cancelled"].includes(order.orderStatus) && (
      <button
        onClick={() => cancelOrder(order._id)}
        className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-sm transition-transform hover:scale-105 active:scale-95 hover:bg-red-600"
      >
        Cancel Order
      </button>
    )}

    {/* Upload Prescription Section */}
    {(order.prescriptionStatus === "pending" ||
      order.orderStatus === "awaiting_prescription") &&
      !prescriptionUploads[order._id] && (
        <div className="flex flex-col gap-4">
          {selectedOrderId === order._id ? (
            <div className="flex flex-col gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                id={`prescription-${order._id}`}
                className="hidden"
              />
              <label
                htmlFor={`prescription-${order._id}`}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg cursor-pointer border-2 border-dashed border-gray-400 hover:bg-gray-300"
              >
                {uploadFile ? uploadFile.name : "Choose a file"}
              </label>
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => handlePrescriptionUpload(order._id)}
                  disabled={uploadLoading || !uploadFile}
                  className={`py-2 px-4 rounded-lg text-white transition-colors ${
                    uploadLoading || !uploadFile
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {uploadLoading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => {
                    setSelectedOrderId(null);
                    setUploadFile(null);
                    setPreview(null);
                  }}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSelectedOrderId(order._id)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-transform hover:scale-105 active:scale-95"
            >
              Upload Prescription
            </button>
          )}
        </div>
      )}

    {/* Prescription Submitted Message */}
    {prescriptionUploads[order._id] && (
      <div className="mt-4 text-green-600 font-semibold flex justify-center text-center">
        <span>Prescription submitted</span>
        {prescriptionUploads[order._id].verificationStatus === "pending" && (
          <span className="text-yellow-500 italic ml-2">
            (Pending verification)
          </span>
        )}
      </div>
    )}
  </div>
</div>

          </div>
        ))
      )}
    </div>
  );
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Orders;
