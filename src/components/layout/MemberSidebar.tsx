import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Award,
  BookOpen,
  User,
  FileText,
  LogOut,
} from "lucide-react";

export default function MemberSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Credencial",
      icon: <User size={20} />,
      href: "/credencial",
    },
    {
      title: "Meus Cursos",
      icon: <BookOpen size={20} />,
      href: "/cursos/meus",
    },
    {
      title: "Certificados",
      icon: <Award size={20} />,
      href: "/certificados",
    },
    {
      title: "Biblioteca",
      icon: <FileText size={20} />,
      href: "/biblioteca",
    },
    {
      title: "Pagamentos",
      icon: <CreditCard size={20} />,
      href: "/pagamentos",
    },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=joao"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">João Silva</h3>
            <p className="text-sm text-muted-foreground">Engenheiro Civil</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
