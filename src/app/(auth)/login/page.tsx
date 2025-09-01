"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Mail, Lock, LucideLoader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuth from "@/data/hooks/AuthHook";
import { useAuthContext } from "@/components/contexts/UserAuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize auth on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeAuth();
    }
  }, [initializeAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    loginUser.mutate(formData, {
      onSuccess: () => {
        setIsSubmitting(false);
        router.push("/dashboard");
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("Login failed:", error);
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <LucideLoader className="animate-spin rounded-full h-8 w-8 " />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <LucideLoader className="animate-spin rounded-full h-8 w-8 " />
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl mb-4">
            <Image
              src={"/images/logo.png"}
              height={48}
              width={48}
              alt="logo"
              className="w-16 h-16 "
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your JeanPay admin account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground block" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-11 pr-4 bg-gray-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground block"
              >
                Password
              </label>
              <div className="relative block">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 bg-gray-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 disabled:opacity-50"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white cursor-pointer rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
