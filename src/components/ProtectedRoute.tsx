import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AdminService } from "@/services/admin.service";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se o usuário está autenticado
        const { data } = await supabase.auth.getSession();
        const isAuth = !!data.session;
        setIsAuthenticated(isAuth);

        // Se requer admin e está autenticado, verificar se é admin
        if (requireAdmin && isAuth) {
          const adminStatus = await AdminService.isAdmin();
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAdmin]);

  if (isLoading) {
    // Mostrar um indicador de carregamento
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para a página de login
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirecionar para a página inicial se não for admin
    return <Navigate to="/" replace />;
  }

  // Se passou por todas as verificações, renderizar o conteúdo protegido
  return <>{children}</>;
}
