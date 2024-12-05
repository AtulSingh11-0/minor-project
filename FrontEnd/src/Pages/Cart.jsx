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
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <div style={styles.loading}>Loading cart...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!cart?.items?.length)
    return <div style={styles.empty}>Your cart is empty</div>;

  const cartSummarySection = cart?.items?.length ? (
    <div style={styles.cartSummary}>
      <h2>Cart Summary</h2>
      {(() => {
        const { subtotal, shipping, tax, total } = calculateTotals();
        return (
          <>
            <div style={styles.summaryItem}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryItem}>
              <span>Shipping:</span>
              <span>{shipping ? `₹${shipping.toFixed(2)}` : "FREE"}</span>
            </div>
            <div style={styles.summaryItem}>
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryItem, fontWeight: "bold" }}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={styles.cartActions}>
              <button onClick={clearCart} style={styles.clearButton}>
                Clear Cart
              </button>
              <button onClick={proceedToCheckout} style={styles.checkoutButton}>
                Proceed to Checkout
              </button>
            </div>
          </>
        );
      })()}
    </div>
  ) : null;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      <div style={styles.cartItems}>
        {cart.items.map((item) => (
          <div key={item.product._id} style={styles.cartItem}>
            <img
              src={item.product.imageUrls?.[0] || "placeholder.jpg"}
              alt={item.product.name}
              style={styles.productImage}
            />

            <div style={styles.itemDetails}>
              <h3>{item.product.name}</h3>
              <p>₹{item.product.price} per unit</p>

              <div style={styles.quantityControls}>
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
                >
                  -
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
                >
                  +
                </button>
              </div>

              <div style={styles.itemActions}>
                <button
                  onClick={() => removeItem(item.product._id)}
                  style={styles.removeButton}
                  disabled={updatingItems[item.product._id]}
                >
                  Remove
                </button>
              </div>
            </div>

            <div style={styles.itemTotal}>
              ₹{(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {cartSummarySection}
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
    marginBottom: "30px",
    color: "white",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: "20px",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "white",
  },
  cartItems: {
    marginBottom: "30px",
    color: "white",
  },
  cartItem: {
    display: "flex",
    padding: "20px",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  productImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginRight: "20px",
  },
  itemDetails: {
    flex: 1,
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "10px 0",
  },
  removeButton: {
    color: "red",
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  itemTotal: {
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  cartSummary: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },
  checkoutButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
  cartActions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  clearButton: {
    flex: 1,
    padding: "15px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loadingOverlay: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  itemActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
};

export default Cart;
