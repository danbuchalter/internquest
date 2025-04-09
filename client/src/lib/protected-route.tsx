import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  requiredRole?: "intern" | "company";
  children?: (params: Record<string, string>) => React.ReactNode;
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRole,
  children,
}: ProtectedRouteProps) {
  let auth;
  
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error:", error);
    // Fallback render for development
    return (
      <Route path={path}>
        {children ? 
          (params) => children(Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
          ) as Record<string, string>) : 
          <Component />
        }
      </Route>
    );
  }
  
  const { user, isLoading } = auth;

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If no user, redirect to auth page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If a specific role is required and user doesn't have that role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard
    const redirectPath = user.role === 'intern' 
      ? '/intern/dashboard' 
      : '/company/dashboard';
      
    return (
      <Route path={path}>
        <Redirect to={redirectPath} />
      </Route>
    );
  }

  if (children) {
    return (
      <Route path={path}>
        {(params) => children(Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined)
        ) as Record<string, string>)}
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
