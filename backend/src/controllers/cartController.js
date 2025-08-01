import Cart from "../models/cartModel.js";
import Item from "../models/itemModel.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.itemId",
      "title description price image"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          items: [],
          totalAmount: 0,
          totalItems: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Validate item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Get or create cart
    let cart = await Cart.getOrCreateCart(userId);

    // Add item to cart
    await cart.addItem(itemId, quantity, item.price);

    // Return updated cart with populated items
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.itemId",
      "title description price image"
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Update quantity
    await cart.updateQuantity(itemId, quantity);

    // Return updated cart with populated items
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.itemId",
      "title description price image"
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove item
    await cart.removeItem(itemId);

    // Return updated cart with populated items
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.itemId",
      "title description price image"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Clear cart
    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        items: [],
        totalAmount: 0,
        totalItems: 0,
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

// Get cart summary (for navbar badge)
export const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
      },
    });
  } catch (error) {
    console.error("Get cart summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart summary",
      error: error.message,
    });
  }
};
