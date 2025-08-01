import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item", // Should match your item model name
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalItems: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
cartSchema.index({ userId: 1 });
cartSchema.index({ "items.itemId": 1 });

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

// Instance method to add item
cartSchema.methods.addItem = function (itemId, quantity, price) {
  const existingItem = this.items.find(
    (item) => item.itemId.toString() === itemId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ itemId, quantity, price });
  }

  return this.save();
};

// Instance method to remove item
cartSchema.methods.removeItem = function (itemId) {
  this.items = this.items.filter(
    (item) => item.itemId.toString() !== itemId.toString()
  );
  return this.save();
};

// Instance method to update quantity
cartSchema.methods.updateQuantity = function (itemId, quantity) {
  const existingItem = this.items.find(
    (item) => item.itemId.toString() === itemId.toString()
  );

  if (existingItem) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    } else {
      existingItem.quantity = quantity;
      return this.save();
    }
  }

  throw new Error("Item not found in cart");
};

// Instance method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function (userId) {
  let cart = await this.findOne({ userId });

  if (!cart) {
    cart = new this({ userId, items: [] });
    await cart.save();
  }

  return cart;
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
