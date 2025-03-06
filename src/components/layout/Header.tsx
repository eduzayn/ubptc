import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/ui/notification-bell";

export default function Header() {
  const { isAuthenticated, user, profile, signOut } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          AssociaçãoPro
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link
            to="/cursos"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Cursos
          </Link>
          <Link
            to="/sobre"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Sobre
          </Link>
          <Link
            to="/associar"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Associe-se
          </Link>
          <Link
            to="/contato"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <a href="/admin/login" className="mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              title="Área Administrativa"
            >
              <Settings size={18} />
            </Button>
          </a>

          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/10">
                    <img
                      src={
                        profile?.photo_url ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="max-w-[100px] truncate">
                    {profile?.name || user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/credencial">Credencial</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cursos/meus">Meus Cursos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/certificados">Certificados</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/biblioteca">Biblioteca</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pagamentos">Pagamentos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <UserCircle size={18} />
                Área do Associado
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
