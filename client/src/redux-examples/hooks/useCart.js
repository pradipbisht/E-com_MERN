import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  clearCartError,
  resetCart,
  addItemLocally,
  updateItemQuantityLocally,
  removeItemLocally,
} from "../slices/cartSlice";

// Custom hook for cart operations
export const useCart = () => {
  const dispatch = useDispatch();
  const { items, itemCount, totalPrice, isLoading, error } = useSelector(
    (state) => state.cart
  );

  const getCart = useCallback(() => {
    return dispatch(fetchCart());
  }, [dispatch]);

  const addItem = useCallback(
    (itemId, quantity = 1) => {
      return dispatch(addToCart({ itemId, quantity }));
    },
    [dispatch]
  );

  const updateItem = useCallback(
    (itemId, quantity) => {
      return dispatch(updateCartItem({ itemId, quantity }));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (itemId) => {
      return dispatch(removeFromCart(itemId));
    },
    [dispatch]
  );

  const clearAllItems = useCallback(() => {
    return dispatch(clearCart());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCartError());
  }, [dispatch]);

  const resetCartState = useCallback(() => {
    dispatch(resetCart());
  }, [dispatch]);

  // Local optimistic updates
  const addItemOptimistic = useCallback(
    (item, quantity = 1) => {
      dispatch(addItemLocally({ item, quantity }));
    },
    [dispatch]
  );

  const updateItemOptimistic = useCallback(
    (itemId, quantity) => {
      dispatch(updateItemQuantityLocally({ itemId, quantity }));
    },
    [dispatch]
  );

  const removeItemOptimistic = useCallback(
    (itemId) => {
      dispatch(removeItemLocally(itemId));
    },
    [dispatch]
  );

  // Helper functions
  const isItemInCart = useCallback(
    (itemId) => {
      return items.some((cartItem) => cartItem.item._id === itemId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (itemId) => {
      const cartItem = items.find((item) => item.item._id === itemId);
      return cartItem ? cartItem.quantity : 0;
    },
    [items]
  );

  const getCartTotal = useCallback(() => {
    return items.reduce((total, cartItem) => {
      const price =
        cartItem.item.discounted && parseFloat(cartItem.item.discounted) > 0
          ? parseFloat(cartItem.item.price) -
            parseFloat(cartItem.item.discounted)
          : parseFloat(cartItem.item.price || 0);
      return total + price * cartItem.quantity;
    }, 0);
  }, [items]);

  return {
    // State
    items,
    itemCount,
    totalPrice,
    isLoading,
    error,

    // API Actions
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearAllItems,
    clearError,
    resetCartState,

    // Optimistic Updates
    addItemOptimistic,
    updateItemOptimistic,
    removeItemOptimistic,

    // Helper functions
    isItemInCart,
    getItemQuantity,
    getCartTotal,
  };
};
