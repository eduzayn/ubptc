import React from "react";
import { Button as ButtonOriginal } from "./button";

// Componente Button com fallback
const Button = ButtonOriginal;

// Definir globalmente
if (typeof window !== "undefined") {
  // @ts-ignore
  window.Button = Button;
}

export { Button };
