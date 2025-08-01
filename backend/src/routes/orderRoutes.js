import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderSummary,
} from "../controllers/orderController.js";
import isAuthenticated from "../middlewares/authenticate.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(isAuthenticated);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", createOrder);

// @route   GET /api/orders
// @desc    Get user orders with pagination
// @access  Private
router.get("/", getUserOrders);

// @route   GET /api/orders/summary
// @desc    Get user order summary/stats
// @access  Private
router.get("/summary", getOrderSummary);

// @route   GET /api/orders/:orderId
// @desc    Get single order by ID
// @access  Private
router.get("/:orderId", getOrderById);

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status (admin only)
// @access  Private/Admin
router.put("/:orderId/status", updateOrderStatus);

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order
// @access  Private
router.put("/:orderId/cancel", cancelOrder);

export default router;
