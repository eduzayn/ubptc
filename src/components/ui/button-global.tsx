import React from "react";
import { Button as ButtonComponent } from "./button";

// Definir o componente Button globalmente para evitar o erro "Button is not defined"
if (typeof window !== "undefined") {
  // @ts-ignore
  window.Button = ButtonComponent;
  console.log("Button definido globalmente", window.Button);
}

// Exportar o componente para uso local
export { ButtonComponent as Button };
