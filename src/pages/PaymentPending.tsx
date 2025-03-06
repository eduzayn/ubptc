import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentService } from "@/services/payment.service";
import { CredentialService } from "@/services/credential.service";

export default function PaymentPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutos em segundos

  const { paymentId, paymentMethod, pixCode, boletoUrl } = location.state || {};

  // Formatar o tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Verificar status do pagamento
  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    setIsChecking(true);
    try {
      const paymentStatus = await PaymentService.checkPaymentStatus(paymentId);

      if (
        paymentStatus.status === "CONFIRMED" ||
        paymentStatus.status === "RECEIVED" ||
        paymentStatus.status === "RECEIVED_IN_CASH"
      ) {
        // Pagamento confirmado, gerar credencial
        // Em um cenário real, você obteria os dados do usuário do banco de dados
        const userData = {
          userId: "user_" + Math.random().toString(36).substring(2, 9),
          name: "João Silva",
          profession: "Engenheiro Civil",
          email: "joao.silva@example.com",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
        };

        await CredentialService.verifyPaymentAndGenerateCredential(
          paymentId,
          userData,
        );

        // Redirecionar para a página de credencial
        navigate("/credencial");
      } else {
        // Pagamento ainda não confirmado
        setIsChecking(false);
      }
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      setIsChecking(false);
    }
  };

  // Verificar status a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [paymentId]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Verificar status inicial
  useEffect(() => {
    checkPaymentStatus();
  }, []);

  if (!paymentId) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Informações de pagamento não encontradas.</p>
            <Button onClick={() => navigate("/checkout")}>
              Voltar para o Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Aguardando Confirmação de Pagamento
      </h1>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {paymentMethod === "pix"
                ? "Pagamento via PIX"
                : "Pagamento via Boleto"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="mb-2">
                Estamos aguardando a confirmação do seu pagamento.
              </p>
              <p className="text-sm text-muted-foreground">
                {paymentMethod === "pix"
                  ? "O PIX geralmente é confirmado em poucos minutos."
                  : "O boleto pode levar até 3 dias úteis para ser compensado."}
              </p>
            </div>

            {paymentMethod === "pix" && (
              <div className="bg-muted p-6 rounded-md flex flex-col items-center">
                <p className="text-sm font-medium mb-4">
                  Escaneie o QR Code abaixo:
                </p>
                {pixCode ? (
                  <div className="w-48 h-48 bg-white p-2 mb-4">
                    <img
                      src={pixCode}
                      alt="QR Code PIX"
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                    <p className="text-center text-sm">
                      QR Code não disponível
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Atualizando automaticamente em: {formatTime(countdown)}
                </p>
              </div>
            )}

            {paymentMethod === "bank_slip" && (
              <div className="bg-muted p-6 rounded-md">
                <p className="text-sm font-medium mb-4">Acesse seu boleto:</p>
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={() => window.open(boletoUrl, "_blank")}
                    disabled={!boletoUrl}
                  >
                    Visualizar Boleto
                  </Button>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Após o pagamento, sua credencial será gerada automaticamente.
                </p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button
                onClick={checkPaymentStatus}
                disabled={isChecking}
                className="w-full max-w-xs"
              >
                {isChecking ? "Verificando..." : "Verificar Pagamento"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
