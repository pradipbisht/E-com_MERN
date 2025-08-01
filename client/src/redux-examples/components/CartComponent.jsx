import React from "react";
import { useCart } from "../hooks/useCart";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

// Example Cart Component using Redux
const CartComponent = () => {
  const {
    items,
    itemCount,
    totalPrice,
    isLoading,
    error,
    updateItem,
    removeItem,
    clearAllItems,
    clearError,
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateItem(itemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearAllItems();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading cart...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="mr-2" />
          Shopping Cart ({itemCount} items)
        </h2>

        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 flex items-center">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Cart
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
          {error}
          <button
            onClick={clearError}
            className="text-red-800 hover:text-red-900">
            ×
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600">Add some items to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow border">
                <img
                  src={
                    cartItem.item.image ||
                    "https://via.placeholder.com/80x80?text=No+Image"
                  }
                  alt={cartItem.item.title}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {cartItem.item.title || "Untitled Item"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cartItem.item.description || "No description"}
                  </p>
                  <div className="text-lg font-bold text-green-600 mt-1">
                    $
                    {cartItem.item.discounted &&
                    parseFloat(cartItem.item.discounted) > 0
                      ? (
                          parseFloat(cartItem.item.price) -
                          parseFloat(cartItem.item.discounted)
                        ).toFixed(2)
                      : parseFloat(cartItem.item.price || 0).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        cartItem.item._id,
                        cartItem.quantity - 1
                      )
                    }
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 bg-gray-100 rounded text-center min-w-[3rem]">
                    {cartItem.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        cartItem.item._id,
                        cartItem.quantity + 1
                      )
                    }
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(cartItem.item._id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Items:</span>
              <span className="text-lg font-bold">{itemCount}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total Price:</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartComponent;
