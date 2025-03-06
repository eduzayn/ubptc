import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function QueryDataExample() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        // Consultar dados da tabela 'users'
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .limit(10);

        if (error) throw error;
        setUsers(data || []);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar usuários");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Consulta de Dados</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-2">Usuários ({users.length})</h2>
          {users.length === 0 ? (
            <p>Nenhum usuário encontrado</p>
          ) : (
            <ul className="border rounded divide-y">
              {users.map((user) => (
                <li key={user.id} className="p-3">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
