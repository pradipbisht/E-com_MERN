import express from "express";
import {
  createItem,
  getAllItems,
  getItemById,
} from "../controllers/itemController.js";
import { upload } from "../middlewares/upload.js";
import isAuthenticated from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/create", upload.single("image"), isAuthenticated, createItem);
// public routes
router.get("/all-items", getAllItems);
router.get("/item/:id", getItemById);

export default router;
