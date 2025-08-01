import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Item from "../models/itemModel.js";
import mongoose from "mongoose";

// Create new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shippingInfo,
      paymentInfo,
      shippingMethod = "standard",
      useCart = true,
      directItems = [], // For buy now functionality
    } = req.body;

    let orderItems = [];

    if (useCart) {
      // Get items from cart
      const cart = await Cart.findOne({ userId }).populate("items.itemId");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      orderItems = cart.items.map((cartItem) => ({
        itemId: cartItem.itemId._id,
        quantity: cartItem.quantity,
        price: cartItem.itemId.price,
      }));
    } else {
      // Use direct items (for buy now)
      if (!directItems || directItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No items provided for order",
        });
      }

      // Validate and get item details
      for (const directItem of directItems) {
        const item = await Item.findById(directItem.itemId);
        if (!item) {
          return res.status(404).json({
            success: false,
            message: `Item with ID ${directItem.itemId} not found`,
          });
        }

        orderItems.push({
          itemId: item._id,
          quantity: directItem.quantity,
          price: item.price,
        });
      }
    }

    // Calculate order summary
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = shippingMethod === "express" ? 15.99 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const newOrder = new Order({
      userId,
      items: orderItems,
      shippingInfo,
      paymentInfo: {
        ...paymentInfo,
        // In real app, you'd process payment here and get transaction ID
        transactionId: "TXN-" + Date.now(),
      },
      orderSummary: {
        subtotal,
        shippingCost,
        tax,
        total,
      },
      shippingMethod,
      status: "confirmed", // In real app, this would be 'pending' until payment confirmation
    });

    await newOrder.save();

    // Clear cart if using cart items
    if (useCart) {
      await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
    }

    // Populate the order for response
    await newOrder.populate([
      { path: "items.itemId", select: "title price image" },
      { path: "userId", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order: newOrder,
        orderNumber: newOrder.orderNumber,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("items.itemId", "title price image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalOrders = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page * limit < totalOrders,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate("items.itemId", "title price image description")
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, notes } = req.body;

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).populate("items.itemId", "title price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow cancellation if order is pending or confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// Get order summary/stats
const getOrderSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const summary = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$orderSummary.total" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = summary[0] || {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      completedOrders: 0,
    };

    res.json({
      success: true,
      data: { summary: result },
    });
  } catch (error) {
    console.error("Get order summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order summary",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderSummary,
};
