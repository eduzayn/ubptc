// Arquivo para garantir que o Button esteja disponível globalmente

// Importar o Button real do componente
import { Button } from "./button";

// Adicionar ao objeto global window
if (typeof window !== "undefined") {
  window.Button = Button;
  console.log("Button adicionado ao objeto global window");
}

export { Button };
