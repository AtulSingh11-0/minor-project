import React, { useState, useEffect } from "react";
import api from "../Apis/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Minus, Plus, PlusIcon } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get(`/cart`);
      setCart(response.data.data.cart);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (updatingItems[productId]) return;

    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await api.put("/cart/update", { productId, quantity });
      await fetchCart();
      toast.success("Quantity updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    setLoading(true);
    try {
      await api.delete("/cart/clear");
      await fetchCart();
      toast.success("Cart cleared successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.totalAmount;
    const shipping = cart?.items?.length ? (subtotal > 500 ? 0 : 50) : 0;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  // Loading State
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
          <p className="text-lg">Loading cart...</p>
        </div>
      </div>
    );

  // Error State
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div className="text-center">
          <p className="text-2xl mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );

  // Cart Summary Component
  const CartSummary = () => {
    const { subtotal, shipping, tax, total } = calculateTotals();
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 border-b border-gray-400 pb-2">
          Order Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-black">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black">
            <span>Shipping</span>
            <span>
              {cart?.items?.length
                ? shipping
                  ? `₹${shipping.toFixed(2)}`
                  : "FREE"
                : "₹0.00"}
            </span>
          </div>
          <div className="flex justify-between text-black">
            <span>Tax (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg sm:text-xl text-black border-t border-gray-400 pt-3">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <button
            onClick={proceedToCheckout}
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="w-full bg-red-600 text-white py-2 sm:py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    );
  };

  // Empty Cart State
  if (!cart?.items?.length)
    return (
      <div className="container px-4 md:mt-11 md:px-16 py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-6">
            <img
              src="/emptyCart.svg"
              alt="Empty Cart"
              className="w-40 sm:w-52 h-auto mb-6"
            />
            <div className="text-center text-2xl sm:text-4xl text-blue-600">
              Your cart is empty
            </div>
          </div>
          <div className="md:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    );

  // Full Cart View
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-xl overflow-x-auto">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="text-left text-base sm:text-lg bg-gray-100">
                  <th className="p-4">Product</th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Quantity</th>
                  <th className="p-4 text-center">Total</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr
                    key={item.product._id}
                    className="border-b border-neutral-300 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.imageUrls?.[0] || "placeholder.jpg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="text-base font-bold">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">{item.product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">₹{item.product.price}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={
                            item.quantity <= 1 || updatingItems[item.product._id]
                          }
                          className="bg-blue-700 text-white px-2 py-1 rounded-md disabled:opacity-50"
                        >
                          <Minus size={18} strokeWidth={4}/>
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.product.stockQuantity ||
                            updatingItems[item.product._id]
                          }
                          className="bg-blue-700 text-white px-2 py-1 rounded-md disabled:opacity-50"
                        >
                          <Plus size={18} strokeWidth={4}/>
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-blue-600">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        disabled={updatingItems[item.product._id]}
                        className="text-red-500 hover:text-red-400 disabled:opacity-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View for Cart Items */}
          <div className="md:hidden">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="p-4 border-b border-neutral-300 flex items-start"
              >
                <img
                  src={item.product.imageUrls?.[0] || "placeholder.jpg"}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      disabled={updatingItems[item.product._id]}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={
                          item.quantity <= 1 || updatingItems[item.product._id]
                        }
                        className="bg-blue-700 text-white px-2 font-bold py-1 rounded-md disabled:opacity-50"
                      >
                        <Minus size={18} strokeWidth={4}/>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        disabled={
                          item.quantity >= item.product.stockQuantity ||
                          updatingItems[item.product._id]
                        }
                        className="bg-blue-700 text-white px-2 font-bold py-1 rounded-md disabled:opacity-50"
                      >
                        <Plus size={18} strokeWidth={3}/>
                        
                      </button>
                    </div>
                    <div className="text-blue-600 font-bold">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary Section */}
        <div className="md:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;