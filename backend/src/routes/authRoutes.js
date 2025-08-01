import express from "express";
import {
  createAuth,
  getAuth,
  loginAuth,
  singleAuth,
  logoutAuth,
} from "../controllers/authController.js";
import isAuthenticated from "../middlewares/authenticate.js";

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Auth route is working");
});

// Public routes
router.post("/register", createAuth);
router.post("/login", loginAuth);
router.post("/logout", logoutAuth);

// Protected routes
router.get("/getAuth", isAuthenticated, getAuth);
router.get("/profile/:id", isAuthenticated, singleAuth);

export default router;
