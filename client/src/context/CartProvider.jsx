import React, { createContext, useContext, useReducer, useEffect } from "react";
import cartApi from "../api/cartApi.js";
import { useAuth } from "./AuthProvider.jsx";

// Initial state for cart
const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
};

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };

    case "SET_CART":
      return {
        ...state,
        cartItems: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        totalItems: action.payload.totalItems || 0,
        isLoading: false,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "RESET_CART":
      return { ...initialState };

    default:
      return state;
  }
}

// Create Cart Context
const CartContext = createContext();

// CartProvider component
function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      dispatch({ type: "RESET_CART" });
    }
  }, [isAuthenticated]);

  // Load cart from backend
  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartApi.getCart();
      dispatch({ type: "SET_CART", payload: response.data });
    } catch (error) {
      console.error("Failed to load cart:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to load cart",
      });
    }
  };

  // Add item to cart
  const addToCart = async (item, quantity = 1) => {
    if (!isAuthenticated) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please login to add items to cart",
      });
      return false;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartApi.addToCart(item._id, quantity);
      dispatch({ type: "SET_CART", payload: response.data });
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to add item to cart",
      });
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartApi.updateCartItem(itemId, quantity);
      dispatch({ type: "SET_CART", payload: response.data });
      return true;
    } catch (error) {
      console.error("Failed to update cart:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to update cart",
      });
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartApi.removeFromCart(itemId);
      dispatch({ type: "SET_CART", payload: response.data });
      return true;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to remove item",
      });
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await cartApi.clearCart();
      dispatch({
        type: "SET_CART",
        payload: { items: [], totalAmount: 0, totalItems: 0 },
      });
      return true;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to clear cart",
      });
      return false;
    }
  };

  // Buy now functionality - add to cart and redirect to checkout
  const buyNow = async (item, quantity = 1) => {
    if (!isAuthenticated) {
      dispatch({ type: "SET_ERROR", payload: "Please login to buy items" });
      return false;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Clear cart first to ensure only this item
      await cartApi.clearCart();

      // Add item to cart
      const response = await cartApi.addToCart(item._id, quantity);
      dispatch({ type: "SET_CART", payload: response.data });

      // Return success - component can then redirect to checkout
      return true;
    } catch (error) {
      console.error("Failed to buy now:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to process buy now",
      });
      return false;
    }
  };

  // Helper functions
  const isItemInCart = (itemId) => {
    return state.cartItems.some(
      (item) => (item.itemId._id || item.itemId) === itemId
    );
  };

  const getItemQuantity = (itemId) => {
    const cartItem = state.cartItems.find(
      (item) => (item.itemId._id || item.itemId) === itemId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const getCartTotal = () => {
    return state.totalAmount.toFixed(2);
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    // State
    cartItems: state.cartItems,
    totalAmount: state.totalAmount,
    totalItems: state.totalItems,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    buyNow, // New buy now functionality
    loadCart,
    clearError,

    // Helper functions
    isItemInCart,
    getItemQuantity,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
