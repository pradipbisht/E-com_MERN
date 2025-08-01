import { useAuth } from "../context/AuthProvider.jsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlbumIcon,
  Home,
  ShoppingCart,
  Plus,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../context/CartProvider.jsx";

function Navbar() {
  const { user, isAuthenticated, isLoading, error, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { totalItems, totalAmount, cartItems } = useCart();

  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-500">
              My-Arena
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                <Home className="inline-block mr-2 w-4 h-4" />
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                <AlbumIcon className="inline-block mr-2 w-4 h-4" />
                About
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/create"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                    <Plus className="inline-block mr-2 w-4 h-4" />
                    Create Item
                  </Link>
                  <Link
                    to="/cart"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center relative">
                    <ShoppingCart className="inline-block mr-2 w-4 h-4" />
                    Cart
                    {/* Cart item count badge */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm flex items-center">
                  <User className="inline-block mr-2 w-4 h-4" />
                  Welcome,{" "}
                  <span className="font-medium text-indigo-600 ml-1">
                    {user?.username}
                  </span>
                  !
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center">
                  <LogOut className="inline-block mr-2 w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                  <LogIn className="inline-block mr-2 w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center">
                  <UserPlus className="inline-block mr-2 w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 p-2">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                onClick={() => setIsMenuOpen(false)}>
                <Home className="inline-block mr-2 w-4 h-4" />
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                onClick={() => setIsMenuOpen(false)}>
                <AlbumIcon className="inline-block mr-2 w-4 h-4" />
                About
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/create"
                    className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                    onClick={() => setIsMenuOpen(false)}>
                    <Plus className="inline-block mr-2 w-4 h-4" />
                    Create Item
                  </Link>
                  <Link
                    to="/cart"
                    className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                    onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="inline-block mr-2 w-4 h-4" />
                    Cart
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  </Link>
                </>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2 flex items-center">
                      <User className="inline-block mr-2 w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 text-sm">
                        Welcome,{" "}
                        <span className="font-medium text-indigo-600">
                          {user?.username}
                        </span>
                        !
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center">
                      <LogOut className="inline-block mr-2 w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block text-indigo-600 hover:text-indigo-500 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                      onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="inline-block mr-2 w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                      onClick={() => setIsMenuOpen(false)}>
                      <UserPlus className="inline-block mr-2 w-4 h-4" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
