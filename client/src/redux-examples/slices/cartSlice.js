import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cart", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch cart");
      }

      const data = await response.json();
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ itemId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId, quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to add to cart");
      }

      const data = await response.json();
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/update/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update cart item");
      }

      const data = await response.json();
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to remove from cart");
      }

      const data = await response.json();
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to clear cart");
      }

      return [];
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Helper functions
const calculateTotals = (items) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const price =
      item.item.discounted && parseFloat(item.item.discounted) > 0
        ? parseFloat(item.item.price) - parseFloat(item.item.discounted)
        : parseFloat(item.item.price || 0);
    return total + price * item.quantity;
  }, 0);

  return { itemCount, totalPrice };
};

// Initial state
const initialState = {
  items: [],
  itemCount: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.totalPrice = 0;
      state.error = null;
    },
    // Local cart operations (for optimistic updates)
    addItemLocally: (state, action) => {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem.item._id === item._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ item, quantity });
      }

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.totalPrice = totals.totalPrice;
    },
    updateItemQuantityLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem.item._id === itemId
      );

      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (cartItem) => cartItem.item._id !== itemId
          );
        } else {
          existingItem.quantity = quantity;
        }

        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.totalPrice = totals.totalPrice;
      }
    },
    removeItemLocally: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(
        (cartItem) => cartItem.item._id !== itemId
      );

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.totalPrice = totals.totalPrice;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart cases
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.totalPrice = totals.totalPrice;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.totalPrice = totals.totalPrice;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update cart item cases
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.totalPrice = totals.totalPrice;
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.totalPrice = totals.totalPrice;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear cart cases
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.itemCount = 0;
        state.totalPrice = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCartError,
  resetCart,
  addItemLocally,
  updateItemQuantityLocally,
  removeItemLocally,
} = cartSlice.actions;

export default cartSlice.reducer;
