import imagekit from "../config/imagekit.js";
import Item from "../models/itemModel.js";

export const createItem = async (req, res) => {
  try {
    const { title, description, price, discounted, totalPrice, quantity } =
      req.body;
    const imageFile = req.file; // Use req.file for single file upload

    // Validate required fields
    if (!title || !description || !price || !totalPrice || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields",
      });
    }

    // Validate image file
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }
    // Validate price and discounted price
    const priceNum = parseFloat(price);
    const discountedNum = parseFloat(discounted);

    // Validate discounted price
    if (discountedNum > 0 && discountedNum >= priceNum) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot exceed the price",
      });
    }

    // Upload image to ImageKit
    const imageUploadResponse = await imagekit.upload({
      file: imageFile.buffer, // Use buffer for multer memory storage
      fileName: `item-${Date.now()}-${imageFile.originalname}`,
      folder: "/items",
      useUniqueFileName: true,
    });

    // Create new item (no need for .save() after create)
    const newItem = await Item.create({
      title,
      description,
      image: imageUploadResponse.url,
      price,
      discounted: discounted || 0,
      totalPrice,
      quantity,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: {
        item: newItem,
      },
    });
  } catch (error) {
    console.error("Error creating item:", error);

    // Handle ImageKit specific errors
    if (error.message && error.message.includes("ImageKit")) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
