// components/AuthGuard.jsx
"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/app/api/auth/verify/api";
import { LoadingSpinner } from "../Loading/LoadingSpinner";

// Create a context to share auth data from the guard
const AuthGuardContext = createContext(null);

// Custom hook to use auth data inside AuthGuard
export function useAuthGuard() {
  const context = useContext(AuthGuardContext);
  if (!context) {
    throw new Error("useAuthGuard must be used within AuthGuard");
  }
  return context;
}

export function AuthGuard({ children, requiredRole = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        //  Check if requiredRole is "client" - skip authentication
        if (requiredRole === "client") {
          setIsAuthenticated(true);
          setIsGuest(true);
          setUser({
            role: "client",
            name: "Guest Client",
            email: "guest@client.com",
            isGuest: true,
          });
          setLoading(false);
          return;
        }

        // Normal authentication flow for other roles
        const response = await api.auth.verify();

        if (response.authenticated) {
          setIsAuthenticated(true);
          setUser(response.user || response.data);

          // Check role if required
          if (requiredRole && response.user?.role !== requiredRole) {
            router.push("/unauthorized");
            return;
          }
        } else {
          if (requiredRole === "client") {
            router.push("/Auth/login");
          } else {
            router.push(`/Auth/Admin/signin?from=${pathname}`);
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        if (requiredRole === "client") {
          router.push("/Auth/login");
        } else {
          router.push(`/Auth/Admin/signin?from=${pathname}`);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router, pathname, requiredRole]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Provide auth data to children via context
  return (
    <AuthGuardContext.Provider value={{ user, isAuthenticated, loading, isGuest }}>
      {children}
    </AuthGuardContext.Provider>
  );
}
