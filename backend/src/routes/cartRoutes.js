import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
} from "../controllers/cartController.js";
import isAuthenticated from "../middlewares/authenticate.js";

const router = express.Router();

// All cart routes require authentication
router.use(isAuthenticated);

// GET /api/cart - Get user's cart
router.get("/", getCart);

// GET /api/cart/summary - Get cart summary (for navbar badge)
router.get("/summary", getCartSummary);

// POST /api/cart/add - Add item to cart
router.post("/add", addToCart);

// PUT /api/cart/update/:itemId - Update item quantity
router.put("/update/:itemId", updateCartItem);

// DELETE /api/cart/remove/:itemId - Remove item from cart
router.delete("/remove/:itemId", removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router.delete("/clear", clearCart);

export default router;
