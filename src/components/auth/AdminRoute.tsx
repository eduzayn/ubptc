import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/auth.service";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const isAdmin = await AuthService.isAdmin();
      setIsAuthorized(isAdmin);
    } catch (error) {
      console.error("Erro na verificação de admin:", error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
