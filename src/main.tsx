import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Importar o componente Button global - deve ser importado antes de qualquer outro componente
import "./components/ui/button-global";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Garantir que o Button esteja definido globalmente
if (typeof window !== "undefined") {
  try {
    // @ts-ignore
    if (!window.Button) {
      const { Button } = require("./components/ui/button");
      // @ts-ignore
      window.Button = Button;
      console.log("Button definido no main.tsx");
    }
  } catch (e) {
    console.error("Erro ao definir Button:", e);
  }
}

const basename = import.meta.env.VITE_BASE_PATH || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
