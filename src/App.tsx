import { Routes, Route } from "react-router-dom";
import routes from "./routes";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Tempo routes */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

        {/* App routes */}
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}
