import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AssociaçãoPro</h3>
            <p className="text-gray-400">
              Plataforma completa para gestão de associados, cursos e
              certificações.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cursos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="/associar"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Associe-se
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Área do Associado</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/credencial"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Credencial Digital
                </Link>
              </li>
              <li>
                <Link
                  to="/cursos/meus"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Meus Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/certificados"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Certificados
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contato@associacaopro.com.br</li>
              <li>(11) 99999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} AssociaçãoPro. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
