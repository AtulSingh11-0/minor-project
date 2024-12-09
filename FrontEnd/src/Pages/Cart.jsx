import React, { useState, useEffect } from "react";
import api from "../Apis/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
      const response = await api.get("/cart");
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
    const shipping = cart?.items?.length ? (subtotal > 500 ? 0 : 50) : 0; // Free shipping above ₹500
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  if (loading)
    return <div className="text-center p-5 text-white">Loading cart...</div>;
  if (error) return <div className="text-center text-red-500 p-5">{error}</div>;

  const cartSummarySection = cart ? (
    <div className="bg-white p-6 rounded-lg shadow-xl sticky top-20 max-w-sm">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b border-gray-400 pb-3">
        Order Summary
      </h2>
      <div className="space-y-4">
        {(() => {
          const { subtotal, shipping, tax, total } = calculateTotals();
          return (
            <>
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
              <div className="flex justify-between font-bold text-xl text-black border-t border-gray-400 pt-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </>
          );
        })()}
      </div>
      <div className="mt-11 space-y-4 ">
        <button
          onClick={proceedToCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </button>
        <button
          onClick={clearCart}
          className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>
    </div>
  ) : null;

  if (!cart?.items?.length)
    return (
      <div className="max-w-[90%]  m-auto px-4 py-8 text-black">
        <h1 className="text-2xl font-bold mb-10">Shopping Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6 bg-white rounded-xl shadow-xl h-[60vh]">
            <div className="mt-9">
              <img
                src="../../public/emptyCart.svg"
                alt=""
                className="size-52 m-auto"
              />
              {/* https://cdn-icons-png.flaticon.com/512/11329/11329060.png */}
              <div className="text-center text-4xl text-blue-600 p-10">
                Your cart is empty
              </div>
            </div>
          </div>
          <div className="md:col-span-1">{cartSummarySection}</div>
        </div>
      </div>
    );

  return (
    <div className="max-w-[90%] m-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-10">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Cart Items Section */}
        <div className="md:col-span-2 space-y-6 bg-white rounded-xl shadow-xl h-fit">
          <table className="w-full">
            <thead className="">
              <tr className="text-left text-lg">
                <th className="p-7">Product</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4 text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {cart.items.map((item) => (
                <tr
                  key={item.product._id}
                  className="border-b-2 border-neutral-300 transition-colors relative"
                >
                  <td className="p-4 flex items-center space-x-4">
                    <div className="ml-8">
                      <img
                        src={item.product.imageUrls?.[0] || "placeholder.jpg"}
                        alt={item.product.name}
                        className="w-28 h-28 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-xl font-bold text-black">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-700">{item.product.category}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">₹{item.product.price}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-4">
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
                        className="bg-blue-700 text-white px-3 py-1 rounded-md disabled:opacity-50 hover:bg-blue-700"
                      >
                        -
                      </button>
                      <span className="text-black">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        disabled={
                          item.quantity >= item.product.stockQuantity ||
                          updatingItems[item.product._id]
                        }
                        className="bg-blue-700 text-white px-3 py-1 rounded-md disabled:opacity-50 hover:bg-blue-600"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center text-xl font-bold text-blue-600">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 absolute top-6 right-7"
                      disabled={updatingItems[item.product._id]}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
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

        {/* Cart Summary Section */}
        <div className="md:col-span-1">{cartSummarySection}</div>
      </div>
    </div>
  );
};

export default Cart;
