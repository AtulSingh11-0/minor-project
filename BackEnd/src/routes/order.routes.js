const express = require("express");
const orderController = require("../controllers/order.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  validateOrderCreation,
  validateOrderOperation,
} = require("../middleware/order.middleware");

const router = express.Router();

// Protect all order routes
router.use(protect);

// Customer routes
router.post("/create", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get(
  "/prescription-required",
  orderController.getPrescriptionRequiredOrders
);
router.get(
  "/:id",
  restrictTo("user", "admin", "pharmacy"),
  orderController.getOrderById
);
router.put("/:id/cancel", orderController.cancelOrder);

// Admin/Pharmacy routes
router.get(
  "/admin/all", // Changed from /all to /admin/all
  protect,
  restrictTo("admin", "pharmacy"),
  orderController.getAllOrders
);

router.put(
  "/:id/status",
  restrictTo("admin", "pharmacy"),
  validateOrderOperation,
  orderController.updateOrderStatus
);

module.exports = router;
