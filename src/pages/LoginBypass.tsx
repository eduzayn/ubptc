import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginBypass() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simular um login bem-sucedido
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: "user_123456",
        name: "João Silva",
        email: "joao.silva@example.com",
        profession: "Engenheiro Civil",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
      }),
    );

    // Redirecionar para a área do associado
    navigate("/credencial");
  }, [navigate]);

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Fazendo login automático...</h1>
      <p>Você será redirecionado em instantes.</p>
    </div>
  );
}
