# E-Commerce Application - Project Structure & Code Flow

## 📁 **Project Overview**

This is a full-stack e-commerce application with a React frontend and Node.js/Express backend, featuring user authentication, cart management, and order processing.

```
New folder/
├── backend/                 # Node.js/Express API Server
├── client/                  # React Frontend Application
├── PROJECT_STRUCTURE.md     # This file
├── BACKEND_FLOW.md         # Backend architecture documentation
└── FRONTEND_FLOW.md        # Frontend architecture documentation
```

## 🗂️ **Backend Structure (`/backend`)**

```
backend/
├── package.json            # Dependencies & scripts
├── .env                    # Environment variables (not in git)
├── README.md              # Backend-specific documentation
└── src/
    ├── index.js           # Main server entry point
    ├── config/
    │   ├── db.js          # MongoDB connection setup
    │   └── imagekit.js    # ImageKit configuration for file uploads
    ├── models/
    │   ├── authModel.js   # User authentication schema
    │   ├── itemModel.js   # Product/item schema
    │   ├── cartModel.js   # Shopping cart schema
    │   └── orderModel.js  # Order management schema
    ├── controllers/
    │   ├── authController.js   # User auth logic (login/register)
    │   ├── itemController.js   # Product CRUD operations
    │   ├── cartController.js   # Cart management logic
    │   └── orderController.js  # Order processing logic
    ├── middlewares/
    │   ├── authenticate.js     # JWT authentication middleware
    │   └── upload.js          # File upload middleware
    └── routes/
        ├── authRoutes.js      # Authentication endpoints
        ├── itemRoutes.js      # Product API endpoints
        ├── cartRoutes.js      # Cart API endpoints
        └── orderRoutes.js     # Order API endpoints
```

## 🗂️ **Frontend Structure (`/client`)**

```
client/
├── package.json               # Dependencies & scripts
├── vite.config.js            # Vite build configuration
├── index.html                # HTML template
├── components.json           # shadcn/ui component config
├── jsconfig.json            # JavaScript project config
├── eslint.config.js         # ESLint configuration
├── README.md                # Frontend-specific documentation
├── public/
│   └── vite.svg             # Static assets
└── src/
    ├── main.jsx             # React app entry point
    ├── App.jsx              # Main app component with routing
    ├── App.css              # Global app styles
    ├── index.css            # Global CSS and Tailwind imports
    ├── api/                 # Backend API integration
    │   ├── index.js         # API exports
    │   ├── axiosApi.js      # Axios client configuration
    │   ├── authApi.js       # Authentication API calls
    │   ├── itemApi.js       # Product API calls
    │   ├── cartApi.js       # Cart API calls
    │   └── orderApi.js      # Order API calls
    ├── components/          # Reusable UI components
    │   ├── Card.jsx         # Product card component
    │   ├── Navbar.jsx       # Navigation component
    │   └── ui/              # shadcn/ui components
    │       ├── button.jsx   # Button component
    │       └── input.jsx    # Input component
    ├── pages/               # Page components
    │   ├── Home.jsx         # Product listing page
    │   ├── About.jsx        # About page
    │   ├── LogIn.jsx        # Login page
    │   ├── Register.jsx     # Registration page
    │   ├── CreatePage.jsx   # Product creation page
    │   ├── CartPage.jsx     # Shopping cart page
    │   ├── Checkout.jsx     # Checkout process page
    │   └── ErrorPage.jsx    # 404/Error page
    ├── context/             # React Context providers
    │   ├── AuthProvider.jsx # User authentication state
    │   └── CartProvider.jsx # Shopping cart state
    ├── lib/
    │   └── utils.js         # Utility functions
    ├── assets/
    │   └── react.svg        # React logo
    └── redux-examples/      # Redux implementation examples
        ├── README.md        # Redux examples documentation
        ├── ExampleApp.jsx   # Sample Redux app
        ├── store/
        │   └── index.js     # Redux store configuration
        ├── slices/
        │   ├── authSlice.js # Authentication Redux slice
        │   └── cartSlice.js # Cart Redux slice
        ├── hooks/
        │   ├── useAuth.js   # Redux auth hooks
        │   └── useCart.js   # Redux cart hooks
        ├── providers/
        │   └── ReduxAuthProvider.jsx
        └── components/
            ├── LoginComponent.jsx
            └── CartComponent.jsx
```

## 🔧 **Technology Stack**

### Backend

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with httpOnly cookies
- **File Upload**: ImageKit integration
- **Environment**: dotenv for configuration

### Frontend

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Context API (with Redux examples)

## 📊 **Data Flow Overview**

1. **Authentication Flow**: User registers/logs in → JWT token stored in httpOnly cookie → Token validated on protected routes
2. **Product Management**: Items created via admin interface → Stored in MongoDB → Displayed on frontend
3. **Cart Management**: Items added to cart → Stored in backend cart collection → Persisted across sessions
4. **Order Processing**: Cart items → Order creation → Payment processing → Order confirmation

## 🔐 **Security Features**

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Authentication middleware for protected routes

## 🚀 **Getting Started**

1. **Backend Setup**:

   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**:

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Environment Variables**: Create `.env` file in backend with required variables

## 📝 **API Documentation**

- **Authentication**: `/api/auth/*`
- **Products**: `/api/items/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`

For detailed API documentation, see `BACKEND_FLOW.md`
For frontend architecture details, see `FRONTEND_FLOW.md`
