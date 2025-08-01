# Redux Examples - Alternative State Management

## 📚 **Purpose**

This folder contains complete Redux implementation examples as an alternative to the Context API currently used in the main application. Use these examples to understand how to implement Redux with Redux Toolkit.

## 🗂️ **Folder Structure**

```
redux-examples/
├── README-REDUX.md             # This documentation
├── ExampleApp.jsx              # Complete Redux app example
├── store/
│   └── index.js               # Redux store configuration
├── slices/
│   ├── authSlice.js          # Authentication state slice
│   └── cartSlice.js          # Cart state slice
├── hooks/
│   ├── useAuth.js            # Custom Redux auth hooks
│   └── useCart.js            # Custom Redux cart hooks
├── providers/
│   └── ReduxAuthProvider.jsx # Redux provider wrapper
└── components/
    ├── LoginComponent.jsx    # Redux-connected login
    └── CartComponent.jsx     # Redux-connected cart
```

## 🚀 **How to Use**

1. Install Redux dependencies:

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. Replace Context providers with Redux providers in `main.jsx`:

   ```jsx
   import { Provider } from 'react-redux';
   import { store } from './redux-examples/store';

   <Provider store={store}>
     <App />
   </Provider>
   ```

3. Use Redux hooks instead of Context hooks:
   ```jsx
   import { useAuth } from './redux-examples/hooks/useAuth';
   import { useCart } from './redux-examples/hooks/useCart';
   ```

## 🔄 **Migration Guide**

- **AuthProvider** → **Redux Auth Slice** + **useAuth hook**
- **CartProvider** → **Redux Cart Slice** + **useCart hook**
- **Context API calls** → **Redux dispatch actions**
- **useContext** → **useSelector** + **useDispatch**

## 💡 **Key Benefits of Redux**

- **DevTools**: Time-travel debugging
- **Predictability**: Immutable state updates
- **Middleware**: Easy to add logging, persistence
- **Scalability**: Better for large applications
- **Testing**: Easier to test pure functions

## 📖 **Learning Resources**

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

**Note**: The main application currently uses Context API. These Redux examples are provided for learning and as an alternative implementation approach.
