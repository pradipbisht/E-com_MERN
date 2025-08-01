# Redux Auth & Cart Provider Examples

This folder contains complete Redux implementations for Authentication and Cart management using Redux Toolkit. These are standalone examples that can be used as reference or integrated into your main application.

## 📁 Folder Structure

```
redux-examples/
├── store/
│   └── index.js                 # Redux store configuration
├── slices/
│   ├── authSlice.js            # Auth state management
│   └── cartSlice.js            # Cart state management
├── hooks/
│   ├── useAuth.js              # Custom auth hook
│   └── useCart.js              # Custom cart hook
├── providers/
│   └── ReduxAuthProvider.jsx   # Redux provider component
├── components/
│   ├── LoginComponent.jsx      # Example login component
│   └── CartComponent.jsx       # Example cart component
├── ExampleApp.jsx              # Complete example app
└── README.md                   # This file
```

## 🚀 Installation

To use these Redux examples, you'll need to install the required dependencies:

```bash
npm install @reduxjs/toolkit react-redux
```

## 📖 Usage

### 1. Basic Setup

To use the Redux providers in your main application, wrap your app with the provider:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReduxAuthProvider } from './redux-examples/providers/ReduxAuthProvider.jsx';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReduxAuthProvider>
      <App />
    </ReduxAuthProvider>
  </React.StrictMode>,
);
```

### 2. Using Auth Hook

```jsx
import { useAuth } from './redux-examples/hooks/useAuth';

function LoginPage() {
  const { login, isLoading, error, user, isAuthenticated } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials).unwrap();
      // Handle success
    } catch (err) {
      // Handle error
    }
  };

  // Component JSX...
}
```

### 3. Using Cart Hook

```jsx
import { useCart } from './redux-examples/hooks/useCart';

function ProductCard({ product }) {
  const { addItem, items, isItemInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    addItem(product._id, 1);
  };

  // Component JSX...
}
```

## 🔧 Features

### Auth Slice Features:

- ✅ Login/Register/Logout
- ✅ Auto-check authentication status
- ✅ Error handling
- ✅ Loading states
- ✅ Persistent auth state

### Cart Slice Features:

- ✅ Add/Remove/Update items
- ✅ Calculate totals automatically
- ✅ Optimistic updates
- ✅ Server synchronization
- ✅ Error handling
- ✅ Loading states

## 📡 API Endpoints Expected

### Auth Endpoints:

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Cart Endpoints:

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

## 🎯 Key Benefits

1. **Centralized State**: All auth and cart state in one place
2. **Optimistic Updates**: Immediate UI feedback
3. **Error Handling**: Comprehensive error management
4. **Type Safety**: Ready for TypeScript conversion
5. **Reusable Hooks**: Easy to use in any component
6. **Persistent State**: State survives page refreshes
7. **Automatic Sync**: Keeps UI in sync with server

## 🔄 State Structure

### Auth State:

```javascript
{
  user: null | User,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: null | string
}
```

### Cart State:

```javascript
{
  items: CartItem[],
  itemCount: number,
  totalPrice: number,
  isLoading: boolean,
  error: null | string
}
```

## 🛠 Customization

You can easily customize these examples by:

1. **Modifying API endpoints** in the slice files
2. **Adding new actions** to the slices
3. **Extending the state** with additional fields
4. **Creating new hooks** for specific use cases
5. **Adding middleware** for logging, persistence, etc.

## 🔗 Integration with Current App

To integrate with your current React Context-based app:

1. **Gradual Migration**: Start by using Redux for new features
2. **Side-by-Side**: Run both systems simultaneously
3. **Component Level**: Use Redux in specific components only
4. **Full Migration**: Replace Context API completely

## 📝 Notes

- These examples use Redux Toolkit for modern Redux patterns
- All async operations use createAsyncThunk
- State is immutable and follows Redux best practices
- Components are fully responsive with Tailwind CSS
- Includes loading states and error handling
- Ready for production use with minor modifications

## 🚨 Important

**DO NOT import these files into your main application** as requested. They are standalone examples for reference and learning purposes only.
