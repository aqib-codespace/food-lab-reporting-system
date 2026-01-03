"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/login.schema";
import { clientAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  FlaskConical,
  Microscope,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = clientAuth.isAuthenticated();
    if (isAuthenticated) {
      router.replace("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError("");

      // Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMsg = result.error || "Invalid email or password";
        setLoginError(errorMsg);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMsg,
        });
        return;
      }

      // Store auth data in localStorage and cookie
      await clientAuth.setAuth(result.user);

      // Show success toast
      toast({
        title: "Welcome Back!",
        description: "You have successfully signed in.",
      });

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = "An error occurred during login. Please try again.";
      setLoginError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Logo />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your Food Lab Reporting account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Login Error Message */}
            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {loginError}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full flex items-center bg-gray-800 text-white  hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <FlaskConical className="w-4 h-4" />
              <span className="text-sm font-medium">FoodLab Reporting</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Advanced Laboratory
              <br />
              <span className="text-gray-400">Management System</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Streamline your food safety testing workflows with comprehensive
              reporting, sample tracking, and quality assurance tools.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem
              icon={<FlaskConical className="w-5 h-5" />}
              title="Sample Management"
              description="Track and manage laboratory samples with precision"
            />
            <FeatureItem
              icon={<Microscope className="w-5 h-5" />}
              title="Advanced Testing"
              description="Comprehensive food safety and quality analysis"
            />
          </div>
        </div>

        <div className="absolute top-20 right-20 w-64 h-64 bg-gray-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gray-600/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="p-2 rounded-lg bg-white/10">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}
