import express from "express";
// import { upload } from "./middlewares/upload.js";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./config/db.js";
import morgan from "morgan";

dotenv.config();
dbConnect();

const app = express();
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running on port 5000");
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
