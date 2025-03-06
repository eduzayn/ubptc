import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthExample() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [user, setUser] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      setUser(data.user);
      setMessage({ text: "Login realizado com sucesso!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Erro ao fazer login", type: "error" });
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Registrar usuário na autenticação
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) throw error;

      // 2. Inserir informações adicionais na tabela users
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
          },
        ]);

        if (profileError) throw profileError;
      }

      setMessage({
        text: "Registro realizado com sucesso! Verifique seu email para confirmar a conta.",
        type: "success",
      });

      // Limpar formulário após sucesso
      setFormData({ email: "", password: "", name: "" });
    } catch (err: any) {
      setMessage({ text: err.message || "Erro ao registrar", type: "error" });
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setMessage({ text: "Logout realizado com sucesso!", type: "success" });
    } catch (err: any) {
      setMessage({
        text: err.message || "Erro ao fazer logout",
        type: "error",
      });
      console.error("Erro:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Autenticação</h1>

      {user ? (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="text-xl mb-2">Usuário Logado</h2>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      ) : (
        <div>
          <div className="flex mb-4 border-b">
            <button
              className={`px-4 py-2 ${activeTab === "login" ? "border-b-2 border-blue-500 font-bold" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "register" ? "border-b-2 border-blue-500 font-bold" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Registro
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4 max-w-md">
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

              <div>
                <label className="block mb-1">Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
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
                {loading ? "Processando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 max-w-md">
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

              <div>
                <label className="block mb-1">Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Processando..." : "Registrar"}
              </button>
            </form>
          )}
        </div>
      )}

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
