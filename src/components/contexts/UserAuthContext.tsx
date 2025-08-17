"use client";

import { validateUser } from "@/data/funcs/user/UserFuncs";
import axiosClient from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// User type definition
export interface User {
  id: string;
  email: string;
  first_name: string;
  username: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
  is_admin: boolean;
  user_id: number;
  country: "nigeria" | "ghana";
  is_blocked: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  setting: {
    user_id: number;
    default_currency: "NGN" | "GHS";
  };
}

// Authentication state type
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication context type
export interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

// Registration data type
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      router.push("/login");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const validateUserToken = useCallback(async () => {
    try {
      // Replace with your API endpoint
      const response = await validateUser();
      if (response.data) {
        const userData = response.data.user;
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Token validation failed");
      }
    } catch {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Session expired",
      }));
    }
  }, [setAuthState]);

  // Initialize auth state on mount
  const initializeAuth = useCallback(async () => {
    try {
      await validateUserToken();
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Auth initialization error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Authentication initialization failed",
      }));
    }
  }, [validateUserToken, setAuthState]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Replace with your API endpoint
      await axiosClient.post("/api/auth/logout", {});
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Replace with your API endpoint
      const response = await axiosClient.patch("/api/auth/user", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      setAuthState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...data.user,
        },
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Update failed",
      }));
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No token to refresh");
      }

      // Replace with your API endpoint
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        setAuthState((prev) => ({
          ...prev,
          user: data.user,
          error: null,
        }));
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    logout,
    updateUser,
    clearError,
    refreshToken,
  };

  if (!authState.isAuthenticated && !authState.user) {
    return null;
  }
  if (!authState.user?.is_admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

// Export the context for advanced use cases
export { AuthContext };
