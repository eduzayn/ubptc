import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RealtimeExample() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar mensagens iniciais
  useEffect(() => {
    fetchMessages();

    // Configurar assinatura em tempo real
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Mudança recebida:", payload);

          if (payload.eventType === "INSERT") {
            // Adicionar nova mensagem à lista
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            // Atualizar mensagem existente
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            // Remover mensagem
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    // Limpar assinatura ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      // Buscar mensagens da tabela 'messages'
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar mensagens");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          content: newMessage,
          user_id: "anônimo", // Em um app real, usaria o ID do usuário logado
          user_name: "Usuário Anônimo", // Em um app real, usaria o nome do usuário logado
        },
      ]);

      if (error) throw error;
      setNewMessage(""); // Limpar campo após envio
    } catch (err: any) {
      alert(err.message || "Erro ao enviar mensagem");
      console.error("Erro:", err);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat em Tempo Real</h1>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="text-sm text-gray-700 mb-2">
          Este exemplo demonstra atualizações em tempo real usando o Supabase
          Realtime. Abra esta página em duas janelas diferentes para ver as
          mensagens sendo atualizadas instantaneamente.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Nota:</strong> Você precisa ter uma tabela 'messages' com
          colunas 'id', 'content', 'user_id', 'user_name' e 'created_at'. Também
          é necessário habilitar o Realtime para esta tabela no Supabase
          Dashboard.
        </p>
      </div>

      <div className="mb-4 p-4 border rounded bg-white h-80 overflow-y-auto flex flex-col-reverse">
        {loading ? (
          <p className="text-center text-gray-500">Carregando mensagens...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma mensagem ainda. Seja o primeiro a enviar!
          </p>
        ) : (
          <div className="space-y-2">
            {[...messages].reverse().map((msg) => (
              <div key={msg.id} className="p-2 rounded bg-gray-100">
                <p className="font-bold text-sm">{msg.user_name}</p>
                <p>{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
