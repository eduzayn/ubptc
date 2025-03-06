import { useState } from "react";
import QueryDataExample from "./1-query-data";
import InsertDataExample from "./2-insert-data";
import AuthExample from "./3-auth";
import RealtimeExample from "./4-realtime";

export default function SupabaseExamples() {
  const [activeExample, setActiveExample] = useState<string>("query");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Exemplos Supabase</h1>

      <div className="flex mb-6 border-b overflow-x-auto">
        <button
          className={`px-4 py-2 whitespace-nowrap ${activeExample === "query" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveExample("query")}
        >
          1. Consultar Dados
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${activeExample === "insert" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveExample("insert")}
        >
          2. Inserir Dados
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${activeExample === "auth" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveExample("auth")}
        >
          3. Autenticação
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${activeExample === "realtime" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveExample("realtime")}
        >
          4. Tempo Real
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeExample === "query" && <QueryDataExample />}
        {activeExample === "insert" && <InsertDataExample />}
        {activeExample === "auth" && <AuthExample />}
        {activeExample === "realtime" && <RealtimeExample />}
      </div>
    </div>
  );
}
