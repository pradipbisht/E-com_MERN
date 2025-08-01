// authenticate.js
import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  // ✅ Get token from cookies instead of Authorization header
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
  }
};

export default isAuthenticated;
