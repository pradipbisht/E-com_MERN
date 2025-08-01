import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

// Auth initializer component
const AuthInitializer = ({ children }) => {
  const { checkAuth, isAuthenticated } = useAuth();
  const { getCart } = useCart();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Fetch cart when user is authenticated
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  return children;
};

// Main Redux Provider component
export const ReduxAuthProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};

// HOC for components that need auth
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access this page.
            </p>
            <a
              href="/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Go to Login
            </a>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default ReduxAuthProvider;
