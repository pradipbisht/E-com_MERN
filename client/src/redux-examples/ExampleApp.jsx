import React from "react";
import { ReduxAuthProvider } from "./providers/ReduxAuthProvider.jsx";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import LoginComponent from "./components/LoginComponent.jsx";
import CartComponent from "./components/CartComponent.jsx";

// Example App Component showing how to use Redux Auth and Cart
const ExampleApp = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { addItem, itemCount } = useCart();

  const handleAddToCart = () => {
    // Example: Add a sample item to cart
    const sampleItem = {
      _id: "1",
      title: "Sample Product",
      description: "This is a sample product",
      price: 29.99,
      image: "https://via.placeholder.com/200x200?text=Product",
    };

    addItem(sampleItem._id, 1);
  };

  if (!isAuthenticated) {
    return <LoginComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Redux Example App</h1>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <span className="font-medium">{user?.username}</span>!
              </span>

              <div className="flex items-center space-x-2">
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
                <span>Cart</span>
              </div>

              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sample Product */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Sample Product</h2>
              <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <h3 className="font-semibold mb-2">Amazing Product</h3>
              <p className="text-gray-600 mb-4">
                This is a sample product for testing the cart functionality.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  $29.99
                </span>
                <button
                  onClick={handleAddToCart}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Cart Component */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <CartComponent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main wrapper component
const ReduxExampleApp = () => {
  return (
    <ReduxAuthProvider>
      <ExampleApp />
    </ReduxAuthProvider>
  );
};

export default ReduxExampleApp;
