import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "USA" },
    },
    paymentInfo: {
      method: { type: String, required: true, default: "card" },
      cardLast4: String,
      transactionId: String,
    },
    orderSummary: {
      subtotal: { type: Number, required: true },
      shippingCost: { type: Number, required: true, default: 5.99 },
      tax: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    estimatedDelivery: Date,
    trackingNumber: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Calculate estimated delivery based on shipping method
orderSchema.pre("save", function (next) {
  if (!this.estimatedDelivery) {
    const now = new Date();
    const deliveryDays = this.shippingMethod === "express" ? 3 : 7;
    this.estimatedDelivery = new Date(
      now.setDate(now.getDate() + deliveryDays)
    );
  }
  next();
});

export default mongoose.model("Order", orderSchema);
