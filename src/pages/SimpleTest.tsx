import React from "react";
import { Button } from "../components/ui/button-fixed";

export default function SimpleTest() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Teste Simples</h1>
      <p style={{ marginBottom: "20px" }}>
        Esta página usa uma versão simplificada do componente Button.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Botão HTML Nativo
        </button>

        <Button>Botão Componente</Button>

        <Button variant="destructive">Botão Destrutivo</Button>

        <Button variant="outline">Botão Outline</Button>
      </div>
    </div>
  );
}
