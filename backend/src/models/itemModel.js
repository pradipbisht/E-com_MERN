import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 150,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 99,
      validate: {
        validator: function (value) {
          return value > 0;
        },
      },
    },
    discounted: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message:
          "Discounted price must be less than or equal to the original price.",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= this.price - this.discounted;
        },
        message:
          "Total price must be greater than or equal to the discounted price.",
      },
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
