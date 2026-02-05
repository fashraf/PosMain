 import { Navigate } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

 export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
   const { isAuthenticated, isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

   if (!isAuthenticated || !session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
