import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
  clearError,
  resetAuth,
} from "../slices/authSlice";

// Custom hook for auth operations
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(checkAuthStatus());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetAuthState = useCallback(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearAuthError,
    resetAuthState,
  };
};
