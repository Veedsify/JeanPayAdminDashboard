"use client";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { useAuthContext } from "../contexts/UserAuthContext";
import { usePathname } from "next/navigation";
import { LucideLoader } from "lucide-react";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const InitializeAuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthContext();
  const [hasInitialized, setHasInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined" || hasInitialized) return;

      // Define public routes that don't require authentication
      const publicRoutes = ["/login"];

      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      try {
        // Always try to initialize auth to check if user has valid session
        await initializeAuth();
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // For public routes, we don't need to worry about auth failure
        if (isPublicRoute) {
          console.log("Auth failed on public route, continuing...");
        }
      } finally {
        setHasInitialized(true);
      }
    };

    initAuth();
  }, [initializeAuth, hasInitialized, pathname]);

  // Show loader while initializing auth
  if (!hasInitialized || isLoading) {
    return null;
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/login"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For public routes, always render children regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, only render if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated and not on public route, show loader
  // (user will be redirected by the auth context)
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LucideLoader className="animate-spin rounded-full h-12 w-12" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    </Suspense>
  );
};

export default InitializeAuthProvider;
