import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InsertDataExample() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Inserir novo registro na tabela 'users'
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: formData.name,
            email: formData.email,
          },
        ])
        .select();

      if (error) throw error;

      setMessage({
        text: `Usuário inserido com sucesso! ID: ${data?.[0]?.id}`,
        type: "success",
      });

      // Limpar formulário após sucesso
      setFormData({ name: "", email: "" });
    } catch (err: any) {
      setMessage({
        text: err.message || "Erro ao inserir usuário",
        type: "error",
      });
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inserir Dados</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Salvar Usuário"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
