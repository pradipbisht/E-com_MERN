import { useCart } from "../context/CartProvider";
import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function CartPage() {
  const {
    cartItems,
    totalAmount,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    isLoading,
    error,
    clearError,
  } = useCart();

  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      setActionLoading(`remove-${itemId}`);
      await removeFromCart(itemId);
      setActionLoading(null);
    } else {
      setActionLoading(`update-${itemId}`);
      await updateQuantity(itemId, newQuantity);
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setActionLoading(`remove-${itemId}`);
      await removeFromCart(itemId);
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setActionLoading("clear");
      await clearCart();
      setActionLoading(null);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Close error after some time
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 text-indigo-600 hover:text-indigo-500 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3" />
              Shopping Cart ({totalItems} items)
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={actionLoading === "clear"}
              className="text-red-600 hover:text-red-800 flex items-center disabled:text-gray-400 disabled:cursor-not-allowed">
              {actionLoading === "clear" ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Clear Cart
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading cart...</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                  <div className="space-y-4">
                    {cartItems.map((cartItem) => {
                      const item = cartItem.itemId; // Backend structure: { itemId: {...}, quantity }
                      const itemId = item._id || item.id;

                      return (
                        <div
                          key={cartItem._id || `${itemId}-${cartItem.quantity}`}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          {/* Item Image */}
                          <img
                            src={
                              item.image ||
                              "https://via.placeholder.com/80x80?text=No+Image"
                            }
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />

                          {/* Item Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.title || item.name || "Untitled Item"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {item.description || "No description"}
                            </p>
                            <div className="text-lg font-bold text-green-600 mt-1">
                              ${item.price || 0}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  itemId,
                                  cartItem.quantity - 1
                                )
                              }
                              disabled={
                                actionLoading === `update-${itemId}` ||
                                actionLoading === `remove-${itemId}`
                              }
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed">
                              {actionLoading === `update-${itemId}` ||
                              actionLoading === `remove-${itemId}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Minus className="w-4 h-4" />
                              )}
                            </button>

                            <span className="w-12 text-center font-semibold text-gray-900">
                              {cartItem.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  itemId,
                                  cartItem.quantity + 1
                                )
                              }
                              disabled={actionLoading === `update-${itemId}`}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed">
                              {actionLoading === `update-${itemId}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(itemId)}
                            disabled={actionLoading === `remove-${itemId}`}
                            className="text-red-600 hover:text-red-800 p-2 disabled:text-gray-400 disabled:cursor-not-allowed">
                            {actionLoading === `remove-${itemId}` ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>

                          {/* Item Total */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ${(item.price * cartItem.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">$5.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">
                      ${(totalAmount * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(totalAmount + 5.99 + totalAmount * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold">
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className="text-indigo-600 hover:text-indigo-500 text-sm">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
