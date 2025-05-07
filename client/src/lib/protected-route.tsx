import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "intern" | "company";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  let auth;

  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { user, isLoading } = auth;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no user, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required and user doesn't have that role
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'intern' 
      ? '/intern/dashboard' 
      : '/company/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Render the protected content
  return <>{children}</>;
}