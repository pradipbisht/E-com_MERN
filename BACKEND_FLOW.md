# Backend Code Flow Documentation

## 🏗️ **Backend Architecture Overview**

The backend follows a clean MVC (Model-View-Controller) architecture with Express.js, providing RESTful APIs for the e-commerce application.

## 🚀 **Server Startup Flow**

```
1. index.js (Entry Point)
   ├── Load environment variables (.env)
   ├── Connect to MongoDB (config/db.js)
   ├── Initialize Express app
   ├── Configure middleware (CORS, cookies, JSON parsing)
   ├── Mount API routes
   └── Start server on specified port
```

### Entry Point (`src/index.js`)

```javascript
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware setup
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
```

## 🗄️ **Database Models & Schemas**

### 1. User Model (`models/authModel.js`)

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcrypt
  createdAt: { type: Date, default: Date.now }
});
```

### 2. Item Model (`models/itemModel.js`)

```javascript
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
```

### 3. Cart Model (`models/cartModel.js`)

```javascript
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: { type: Number, default: 0 }
});
```

### 4. Order Model (`models/orderModel.js`)

```javascript
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ /* Cart items snapshot */ }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
  shippingAddress: { /* Address object */ },
  paymentMethod: { type: String, required: true }
});
```

## 🔐 **Authentication Flow**

### Registration Process

```
1. POST /api/auth/register
   ├── Validate input data
   ├── Check if user already exists
   ├── Hash password with bcrypt
   ├── Create user in database
   ├── Generate JWT token
   └── Set httpOnly cookie
```

### Login Process

```
1. POST /api/auth/login
   ├── Validate credentials
   ├── Compare password with bcrypt
   ├── Generate JWT token
   ├── Set httpOnly cookie
   └── Return user data
```

### Authentication Middleware (`middlewares/authenticate.js`)

```javascript
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
```

## 🛍️ **E-commerce API Flows**

### Item Management Flow

```
CREATE ITEM
1. POST /api/items/create
   ├── Authenticate user (middleware)
   ├── Upload image to ImageKit
   ├── Validate item data
   ├── Save item to database
   └── Return created item

GET ITEMS
1. GET /api/items
   ├── Fetch all items from database
   ├── Populate category information
   └── Return items array

UPDATE ITEM
1. PUT /api/items/:id
   ├── Authenticate user
   ├── Verify ownership
   ├── Update item data
   └── Return updated item

DELETE ITEM
1. DELETE /api/items/:id
   ├── Authenticate user
   ├── Verify ownership
   ├── Remove from database
   └── Return success message
```

### Cart Management Flow

```
ADD TO CART
1. POST /api/cart/add
   ├── Authenticate user (middleware)
   ├── Find or create user's cart
   ├── Check if item exists in cart
   │   ├── If exists: Update quantity
   │   └── If new: Add new item
   ├── Recalculate total amount
   └── Return updated cart

GET CART
1. GET /api/cart
   ├── Authenticate user
   ├── Find user's cart
   ├── Populate item details
   └── Return cart with items

UPDATE CART ITEM
1. PUT /api/cart/update
   ├── Authenticate user
   ├── Find cart item
   ├── Update quantity
   ├── Recalculate totals
   └── Return updated cart

REMOVE FROM CART
1. DELETE /api/cart/remove/:itemId
   ├── Authenticate user
   ├── Find and remove item
   ├── Recalculate totals
   └── Return updated cart
```

### Order Processing Flow

```
CREATE ORDER (Buy Now)
1. POST /api/orders/create
   ├── Authenticate user
   ├── Validate order data
   ├── Get cart items
   ├── Calculate final amount
   ├── Create order record
   ├── Clear user's cart
   └── Return order confirmation

GET USER ORDERS
1. GET /api/orders
   ├── Authenticate user
   ├── Find user's orders
   ├── Populate item details
   └── Return orders array

UPDATE ORDER STATUS
1. PUT /api/orders/:id/status
   ├── Authenticate user (admin)
   ├── Validate new status
   ├── Update order status
   └── Return updated order
```

## 🔧 **Middleware Functions**

### 1. Authentication Middleware

- **Purpose**: Verify JWT tokens and protect routes
- **Usage**: Applied to all protected routes
- **Flow**: Extract token → Verify → Attach user to request

### 2. Upload Middleware

- **Purpose**: Handle file uploads with ImageKit
- **Usage**: Used in item creation/update endpoints
- **Flow**: Parse multipart data → Upload to ImageKit → Return URL

## 🗃️ **Database Operations**

### Connection Setup (`config/db.js`)

```javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
```

### Model Methods Examples

```javascript
// Cart Model Methods
cartSchema.methods.addItem = async function(itemId, quantity) {
  // Add item logic
};

cartSchema.methods.removeItem = async function(itemId) {
  // Remove item logic
};

cartSchema.methods.calculateTotal = async function() {
  // Calculate total amount
};
```

## 🚨 **Error Handling**

### Controller Error Pattern

```javascript
export const createItem = async (req, res) => {
  try {
    // Business logic
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## 🔄 **API Response Format**

### Success Response

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🌐 **Environment Configuration**

### Required Environment Variables (`.env`)

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=5000
```

## 🔧 **Development Commands**

```bash
# Start development server
npm start

# Install dependencies
npm install

# Environment setup
cp .env.example .env
```

## 📊 **Performance Considerations**

1. **Database Indexing**: Indexes on userId, email, itemId for faster queries
2. **Pagination**: Implement pagination for large datasets
3. **Caching**: Consider Redis for session storage
4. **File Upload**: ImageKit CDN for optimized image delivery
5. **Connection Pooling**: MongoDB connection pooling for better performance
