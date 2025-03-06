import { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import WebhookConfig from "./pages/admin/WebhookConfig";
import LibraryManager from "./pages/admin/LibraryManager";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import TestPage from "./pages/TestPage";
import SimpleTest from "./pages/SimpleTest";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <SimpleTest />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/associar",
    element: <Register />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/webhooks",
    element: <WebhookConfig />,
  },
  {
    path: "/admin/biblioteca",
    element: <LibraryManager />,
  },
  {
    path: "/admin/monitoramento",
    element: <SystemMonitoring />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/simple",
    element: <SimpleTest />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
