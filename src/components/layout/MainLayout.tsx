import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MemberSidebar from "./MemberSidebar";

export default function MainLayout() {
  const location = useLocation();
  const isMemberArea = [
    "/credencial",
    "/cursos/meus",
    "/certificados",
    "/pagamentos",
    "/biblioteca",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {isMemberArea ? (
          <div className="flex">
            <MemberSidebar />
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}
