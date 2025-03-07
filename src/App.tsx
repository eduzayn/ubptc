import { Routes, Route, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoursesList from "./pages/CoursesList";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import Certificates from "./pages/Certificates";
import Credential from "./pages/Credential";
import PaymentHistory from "./pages/PaymentHistory";
import AdminDashboard from "./pages/admin/Dashboard";
import CourseEditor from "./pages/admin/CourseEditor";
import LibraryManager from "./pages/admin/LibraryManager";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CredentialValidation from "./pages/CredentialValidation";
import PaymentPending from "./pages/PaymentPending";
import LoginBypass from "./pages/LoginBypass";
import Library from "./pages/Library";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/associar" element={<Register />} />
        <Route path="/cursos" element={<CoursesList />} />
        <Route path="/cursos/:id" element={<CourseDetail />} />
        <Route path="/cursos/meus" element={<MyCourses />} />
        <Route path="/certificados" element={<Certificates />} />
        <Route path="/credencial" element={<Credential />} />
        <Route path="/pagamentos" element={<PaymentHistory />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/validar-credencial" element={<CredentialValidation />} />
        <Route path="/pagamento-pendente" element={<PaymentPending />} />
        <Route path="/acesso-direto" element={<LoginBypass />} />
        <Route path="/biblioteca" element={<Library />} />

        {/* Rotas admin protegidas */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Outlet />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="cursos/editor" element={<CourseEditor />} />
          <Route path="biblioteca" element={<LibraryManager />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
