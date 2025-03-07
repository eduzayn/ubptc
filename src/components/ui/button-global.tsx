import { Button } from "./button";

// Definir o componente Button globalmente
if (typeof window !== "undefined") {
  window.Button = Button;
}

// Não exportamos nada aqui, apenas definimos o Button globalmente
