import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, Settings } from "lucide-react";

export default function Header() {
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
          <Link to="/admin/dashboard" className="mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              title="Área Administrativa"
            >
              <Settings size={18} />
            </Button>
          </Link>
          <Link to="/acesso-direto">
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle size={18} />
              Área do Associado
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
