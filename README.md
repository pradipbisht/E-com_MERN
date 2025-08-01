# 🛒 E-Commerce Full-Stack Application

A modern, full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features include user authentication, product management, shopping cart, and order processing.

## 🚀 **Quick Start**

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "New folder"
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 **Project Structure**

```
New folder/
├── backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middlewares/    # Authentication & validation
│   │   └── config/         # Database & services config
│   └── package.json
├── client/                  # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # State management
│   │   ├── api/            # Backend integration
│   │   └── redux-examples/ # Redux alternative examples
│   └── package.json
├── PROJECT_STRUCTURE.md     # Detailed project documentation
├── BACKEND_FLOW.md         # Backend architecture guide
├── FRONTEND_FLOW.md        # Frontend architecture guide
└── README.md               # This file
```

## ✨ **Features**

### 🔐 **Authentication**

- User registration and login
- JWT-based authentication with httpOnly cookies
- Protected routes and middleware

### 🛍️ **Product Management**

- Product listing with image support
- Product creation (authenticated users)
- ImageKit integration for file uploads
- Product search and filtering

### 🛒 **Shopping Cart**

- Add/remove items from cart
- Quantity management
- Cart persistence across sessions
- Real-time cart updates

### 📦 **Order Processing**

- Checkout process
- Order history
- Order status tracking
- Buy now functionality

### 🎨 **User Interface**

- Modern, responsive design with Tailwind CSS
- Mobile-friendly navigation
- Loading states and error handling
- Icon integration with Lucide React

## 🛠️ **Technology Stack**

### **Backend**

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with httpOnly cookies
- **File Upload**: ImageKit
- **Environment**: dotenv

### **Frontend**

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Context API

## 📚 **Documentation**

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete project structure overview
- **[BACKEND_FLOW.md](./BACKEND_FLOW.md)** - Backend architecture and API documentation
- **[FRONTEND_FLOW.md](./FRONTEND_FLOW.md)** - Frontend architecture and component flow
- **[Redux Examples](./client/src/redux-examples/README-REDUX.md)** - Alternative Redux implementation

## 🔧 **Development Commands**

### Backend Commands

```bash
cd backend
npm start          # Start development server
npm install        # Install dependencies
```

### Frontend Commands

```bash
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌐 **API Endpoints**

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Products

- `GET /api/items` - Get all products
- `POST /api/items/create` - Create new product (auth required)
- `PUT /api/items/:id` - Update product (auth required)
- `DELETE /api/items/:id` - Delete product (auth required)

### Cart

- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/update` - Update cart item (auth required)
- `DELETE /api/cart/remove/:itemId` - Remove from cart (auth required)

### Orders

- `POST /api/orders/create` - Create new order (auth required)
- `GET /api/orders` - Get user orders (auth required)
- `GET /api/orders/:id` - Get specific order (auth required)

## 🔒 **Environment Variables**

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=5000
```

## 🔄 **State Management Options**

The application currently uses **Context API** for state management, providing:

- AuthProvider for user authentication state
- CartProvider for shopping cart state

**Alternative**: Complete Redux examples are available in `client/src/redux-examples/` for learning purposes and as an alternative implementation.

## 🚀 **Deployment**

### Backend Deployment

1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting (Netlify, Vercel, etc.)
3. Configure API base URL for production

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🐛 **Known Issues**

- Backend server requires MongoDB connection to start
- Image uploads require ImageKit configuration
- CORS settings may need adjustment for production

## 📞 **Support**

For support, please create an issue in the repository or contact the development team.

---

**Happy Coding! 🎉**
