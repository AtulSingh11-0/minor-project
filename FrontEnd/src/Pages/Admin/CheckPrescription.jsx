import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Apis/Api";
import { toast } from "react-toastify";

const CheckPrescription = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (!response.data.data.order) {
        toast.error("Order not found");
        navigate("/admin/check-prescriptions");
        return;
      }
      setOrder(response.data.data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
      toast.error("Failed to fetch order details");
      navigate("/admin/check-prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success("Prescription processed successfully");
    navigate("/admin/check-prescriptions");
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this prescription?"))
      return;

    setUpdating(true);
    try {
      await api.put(`/prescriptions/${order.prescription._id}/verify`, {
        status: "approved",
      });
      handleSuccess();
    } catch (err) {
      toast.error("Failed to approve prescription");
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    const notes = window.prompt("Enter rejection reason:");
    if (!notes) return;

    setUpdating(true);
    try {
      await api.put(`/prescriptions/${order.prescription._id}/verify`, {
        status: "rejected",
        notes,
      });
      handleSuccess();
    } catch (err) {
      toast.error("Failed to reject prescription");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-blue-600 text-xl">
      Loading...
    </div>
  );

  if (!order) return (
    <div className="flex justify-center items-center h-screen text-red-600 text-xl">
      Order not found
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-800 text-white p-6">
          <h1 className="text-2xl font-bold">
            Prescription Approval for Order #{orderId.slice(-8)}
          </h1>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Ordered Medicines
            </h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div 
                  key={item._id} 
                  className="flex justify-between p-3 bg-blue-50 rounded-md"
                >
                  <span className="font-medium text-gray-800">
                    {item.product.name}
                  </span>
                  <span className="text-gray-600">
                    Quantity: {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Prescription
            </h2>
            {order.prescription ? (
              <div className="bg-gray-100 p-4 rounded-lg">
                <img
                  src={order.prescription.imageUrl}
                  alt="Prescription"
                  className="w-full max-h-[500px] object-contain rounded-md shadow-md"
                />
              </div>
            ) : (
              <p className="text-gray-500">No prescription uploaded yet</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleApprove}
              disabled={updating}
              className="flex-1 bg-green-500 text-white py-3 rounded-md 
                hover:bg-green-600 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Approve Prescription
            </button>
            <button
              onClick={handleReject}
              disabled={updating}
              className="flex-1 bg-red-500 text-white py-3 rounded-md 
                hover:bg-red-600 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Reject Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPrescription;