# Frontend Code Flow Documentation

## 🎨 **Frontend Architecture Overview**

The frontend is built with React 18 and Vite, following modern React patterns with Context API for state management, React Router for navigation, and Tailwind CSS for styling.

## 🚀 **Application Startup Flow**

```
1. main.jsx (Entry Point)
   ├── Mount React app to DOM
   ├── Wrap with StrictMode
   ├── Initialize BrowserRouter
   ├── Load AuthProvider (authentication state)
   ├── Load CartProvider (cart state)
   └── Render main App component
```

### Entry Point (`src/main.jsx`)

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import CartProvider from "./context/CartProvider.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

## 🧭 **Routing Structure (`src/App.jsx`)**

```jsx
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}
```

## 🔐 **Authentication Flow**

### AuthProvider Context (`src/context/AuthProvider.jsx`)

```jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    setUser(response.data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoading, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Authentication Hook Usage

```jsx
const { user, isAuthenticated, login, logout } = useAuth();

// Protected route example
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

## 🛒 **Cart Management Flow**

### CartProvider Context (`src/context/CartProvider.jsx`)

```jsx
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const addToCart = async (itemId, quantity) => {
    setLoading(true);
    try {
      const response = await cartApi.addToCart(itemId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    // Similar pattern for remove
  };

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

## 📱 **Page Components Flow**

### 1. Home Page (`src/pages/Home.jsx`)

```
Component Lifecycle:
1. Mount component
2. Fetch items from API (useEffect)
3. Display loading state
4. Render product grid with Card components
5. Handle add to cart actions
```

```jsx
const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemApi.getAllItems();
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(item => (
        <Card key={item._id} item={item} />
      ))}
    </div>
  );
};
```

### 2. Product Card Component (`src/components/Card.jsx`)

```jsx
const Card = ({ item }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(item._id, 1);
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    // Add to cart then navigate to checkout
    addToCart(item._id, 1);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={item.imageUrl} alt={item.name} />
      <h3>{item.name}</h3>
      <p>${item.price}</p>
      <div className="flex gap-2">
        <Button onClick={handleAddToCart} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
          Add to Cart
        </Button>
        <Button onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};
```

### 3. Authentication Pages

#### Login Page (`src/pages/LogIn.jsx`)

```jsx
const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/'); // Redirect to home
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
      />
      <Input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
      />
      <Button type="submit">Login</Button>
    </form>
  );
};
```

### 4. Cart Page (`src/pages/CartPage.jsx`)

```jsx
const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cart.items.map(item => (
        <div key={item.itemId._id} className="flex items-center gap-4">
          <img src={item.itemId.imageUrl} alt={item.itemId.name} />
          <div>
            <h3>{item.itemId.name}</h3>
            <p>${item.itemId.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => updateQuantity(item.itemId._id, item.quantity - 1)}>
              -
            </Button>
            <span>{item.quantity}</span>
            <Button onClick={() => updateQuantity(item.itemId._id, item.quantity + 1)}>
              +
            </Button>
          </div>
          <Button onClick={() => removeFromCart(item.itemId._id)}>
            Remove
          </Button>
        </div>
      ))}
      <div>Total: ${cart.totalAmount}</div>
      <Button onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </Button>
    </div>
  );
};
```

### 5. Checkout Page (`src/pages/Checkout.jsx`)

```jsx
const Checkout = () => {
  const { cart } = useCart();
  const [orderData, setOrderData] = useState({
    shippingAddress: {},
    paymentMethod: 'card'
  });

  const handlePlaceOrder = async () => {
    try {
      const response = await orderApi.createOrder({
        items: cart.items,
        totalAmount: cart.totalAmount,
        ...orderData
      });
      // Redirect to order confirmation
      navigate(`/order-confirmation/${response.data._id}`);
    } catch (error) {
      // Show error message
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2>Shipping Information</h2>
        {/* Shipping form */}
      </div>
      <div>
        <h2>Order Summary</h2>
        {cart.items.map(item => (
          <div key={item.itemId._id}>
            {item.itemId.name} x {item.quantity} = ${item.itemId.price * item.quantity}
          </div>
        ))}
        <div>Total: ${cart.totalAmount}</div>
        <Button onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
    </div>
  );
};
```

## 🌐 **API Integration Layer**

### Axios Configuration (`src/api/axiosApi.js`)

```jsx
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // For cookie-based auth
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Service Examples

#### Auth API (`src/api/authApi.js`)

```jsx
const authApi = {
  login: async (credentials) => {
    return await axiosClient.post("/auth/login", credentials);
  },

  register: async (userData) => {
    return await axiosClient.post("/auth/register", userData);
  },

  logout: async () => {
    return await axiosClient.post("/auth/logout");
  },

  checkAuth: async () => {
    return await axiosClient.get("/auth/check");
  }
};
```

#### Cart API (`src/api/cartApi.js`)

```jsx
const cartApi = {
  getCart: async () => {
    return await axiosClient.get("/cart");
  },

  addToCart: async (itemId, quantity) => {
    return await axiosClient.post("/cart/add", { itemId, quantity });
  },

  updateCartItem: async (itemId, quantity) => {
    return await axiosClient.put("/cart/update", { itemId, quantity });
  },

  removeFromCart: async (itemId) => {
    return await axiosClient.delete(`/cart/remove/${itemId}`);
  }
};
```

## 🎨 **UI Components**

### Navigation Component (`src/components/Navbar.jsx`)

```jsx
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            E-Commerce
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>

            <Link to="/about">
              <Info className="h-5 w-5" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/create">
                  <Plus className="h-5 w-5" />
                </Link>

                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                      {cart.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Link>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{user?.username}</span>
                  <Button onClick={logout} variant="outline" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
```

## 🔄 **State Management Patterns**

### Context API Pattern

```jsx
// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const contextValue = {
    ...state,
    actions: { login, logout, register }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create Hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### Redux Alternative (in `redux-examples/`)

For comparison, Redux implementation is available showing:

- Store configuration with Redux Toolkit
- Slice-based state management
- Async thunks for API calls
- Redux hooks usage

## 🎯 **Performance Optimizations**

### 1. Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const LazyCheckout = lazy(() => import('./pages/Checkout'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyCheckout />
</Suspense>
```

### 2. Memoization

```jsx
import { memo, useMemo, useCallback } from 'react';

const Card = memo(({ item }) => {
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(item.price);
  }, [item.price]);

  const handleAddToCart = useCallback(() => {
    addToCart(item._id, 1);
  }, [item._id, addToCart]);

  return (
    // Component JSX
  );
});
```

### 3. Image Optimization

```jsx
<img
  src={item.imageUrl}
  alt={item.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

## 🔧 **Development Tools**

### Vite Configuration (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### TailwindCSS Configuration

- Custom theme colors
- Component classes
- Responsive design utilities
- Dark mode support (optional)

## 🚨 **Error Handling**

### Error Boundaries

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```jsx
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    toast.error(error.response.data.message);
  } else if (error.request) {
    // Network error
    toast.error("Network error. Please try again.");
  } else {
    // Other error
    toast.error("Something went wrong.");
  }
};
```

## 📱 **Responsive Design**

### TailwindCSS Responsive Classes

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3-4 columns */}
</div>
```

### Mobile-First Approach

- Touch-friendly button sizes
- Optimized navigation for mobile
- Responsive image sizes
- Mobile-optimized forms

## 🔄 **Build and Deployment**

### Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Production Build Optimization

- Tree shaking for smaller bundles
- Asset optimization
- Code splitting
- Gzip compression
