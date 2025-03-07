// Exportar o componente Button para uso global
import { Button } from "./button";

// Adicionar ao objeto window para disponibilidade global
if (typeof window !== "undefined") {
  // @ts-ignore
  window.Button = Button;
}

export { Button };
