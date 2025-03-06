import React from "react";
import { Button } from "../components/ui/button-debug";

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Página de Teste</h1>
      <p className="mb-4">
        Esta é uma página simples para testar se os componentes estão
        funcionando corretamente.
      </p>

      <div className="space-y-4">
        <Button>Botão Padrão</Button>
        <Button variant="destructive">Botão Destrutivo</Button>
        <Button variant="outline">Botão Outline</Button>
        <Button variant="secondary">Botão Secundário</Button>
        <Button variant="ghost">Botão Ghost</Button>
        <Button variant="link">Botão Link</Button>
      </div>
    </div>
  );
}
