import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { PaymentService } from "@/services/payment.service";
import { CredentialService } from "@/services/credential.service";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isLoading, setIsLoading] = useState(false);
  const [installments, setInstallments] = useState("1");
  const navigate = useNavigate();

  // Dados do usuário (em um cenário real, viriam do contexto de autenticação ou do formulário anterior)
  const userData = {
    userId: "user_" + Math.random().toString(36).substring(2, 9),
    name: "João Silva",
    email: "joao.silva@example.com",
    cpfCnpj: "123.456.789-00",
    phone: "(11) 98765-4321",
    profession: "Engenheiro Civil",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    address: "Av. Paulista, 1000",
    addressNumber: "123",
    postalCode: "01310-100",
  };

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let paymentResult;
      const customerData = {
        name: userData.name,
        email: userData.email,
        cpfCnpj: userData.cpfCnpj,
        phone: userData.phone,
        address: userData.address,
        addressNumber: userData.addressNumber,
        postalCode: userData.postalCode,
      };

      // Processar pagamento de acordo com o método selecionado
      if (paymentMethod === "credit_card") {
        // Extrair mês e ano da data de validade
        const [expiryMonth, expiryYear] = formData.cardExpiry.split("/");

        paymentResult = await PaymentService.processCreditCardPayment(
          customerData,
          {
            customerId: "", // Será preenchido pelo serviço
            value: 399.9,
            dueDate: new Date().toISOString().split("T")[0],
            description: "Associação Anual - AssociaçãoPro",
            billingType: "CREDIT_CARD",
            installmentCount: parseInt(installments),
            creditCard: {
              holderName: formData.cardHolder,
              number: formData.cardNumber.replace(/\s/g, ""),
              expiryMonth: expiryMonth.trim(),
              expiryYear: "20" + expiryYear.trim(),
              ccv: formData.cardCvv,
            },
            creditCardHolderInfo: {
              name: userData.name,
              email: userData.email,
              cpfCnpj: userData.cpfCnpj,
              postalCode: userData.postalCode,
              addressNumber: userData.addressNumber,
              phone: userData.phone,
            },
          },
        );
      } else if (paymentMethod === "pix") {
        paymentResult = await PaymentService.processPixPayment(
          customerData,
          399.9,
          "Associação Anual - AssociaçãoPro",
        );
      } else {
        paymentResult = await PaymentService.processBoletoPayment(
          customerData,
          399.9,
          "Associação Anual - AssociaçãoPro",
        );
      }

      // Em um cenário real, aqui você verificaria o status do pagamento
      // Para cartão de crédito, o pagamento pode ser aprovado imediatamente
      // Para PIX e boleto, você redirecionaria para uma página de aguardo

      if (paymentMethod === "credit_card") {
        // Para cartão, verificamos e geramos a credencial imediatamente
        const credentialResult =
          await CredentialService.verifyPaymentAndGenerateCredential(
            paymentResult.id,
            {
              userId: userData.userId,
              name: userData.name,
              profession: userData.profession,
              email: userData.email,
              photo: userData.photo,
            },
          );

        if (credentialResult.success) {
          // Redirecionar para a página de credencial
          navigate("/credencial");
        } else {
          // Em caso de erro, mostrar mensagem
          alert("Erro ao processar pagamento: " + credentialResult.message);
        }
      } else {
        // Para PIX e boleto, redirecionar para página de aguardo
        // Em um cenário real, você salvaria o ID do pagamento no banco de dados
        // e teria um webhook para receber a confirmação do Asaas
        navigate("/pagamento-pendente", {
          state: {
            paymentId: paymentResult.id,
            paymentMethod,
            pixCode: paymentResult.pixQrCode,
            boletoUrl: paymentResult.bankSlipUrl,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Finalizar Associação
      </h1>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Associação</CardTitle>
            <CardDescription>
              Revise os detalhes e escolha a forma de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Plano de Associação Anual</span>
                  <span className="font-bold">R$ 399,90</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Credencial digital
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Acesso a cursos exclusivos
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Certificados digitais
                  </li>
                </ul>
              </div>

              <form onSubmit={handleSubmit}>
                <Tabs
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger
                      value="credit_card"
                      className="flex items-center gap-2"
                    >
                      <CreditCard size={16} />
                      Cartão de Crédito
                    </TabsTrigger>
                    <TabsTrigger
                      value="pix"
                      className="flex items-center gap-2"
                    >
                      <Wallet size={16} />
                      PIX
                    </TabsTrigger>
                    <TabsTrigger
                      value="bank_slip"
                      className="flex items-center gap-2"
                    >
                      <Landmark size={16} />
                      Boleto Bancário
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit_card" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="card_number"
                          className="text-sm font-medium"
                        >
                          Número do Cartão
                        </label>
                        <input
                          id="cardNumber"
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="expiry"
                            className="text-sm font-medium"
                          >
                            Data de Validade
                          </label>
                          <input
                            id="cardExpiry"
                            type="text"
                            placeholder="MM/AA"
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="cvv" className="text-sm font-medium">
                            CVV
                          </label>
                          <input
                            id="cardCvv"
                            type="text"
                            placeholder="123"
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            value={formData.cardCvv}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="card_holder"
                          className="text-sm font-medium"
                        >
                          Nome no Cartão
                        </label>
                        <input
                          id="cardHolder"
                          type="text"
                          placeholder="Nome como está no cartão"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={formData.cardHolder}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="installments"
                          className="text-sm font-medium"
                        >
                          Parcelas
                        </label>
                        <select
                          id="installments"
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="1">1x de R$ 399,90 (sem juros)</option>
                          <option value="2">2x de R$ 199,95 (sem juros)</option>
                          <option value="3">3x de R$ 133,30 (sem juros)</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pix" className="space-y-4">
                    <div className="bg-muted p-6 rounded-md flex flex-col items-center">
                      <div className="w-48 h-48 bg-white p-2 mb-4">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-center text-sm">
                            QR Code do PIX será gerado após confirmação
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Após clicar em "Finalizar Pagamento", você receberá o QR
                        Code do PIX para pagamento imediato.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank_slip" className="space-y-4">
                    <div className="bg-muted p-6 rounded-md">
                      <p className="text-sm text-muted-foreground mb-4">
                        O boleto será gerado após a confirmação. O pagamento
                        será confirmado em até 3 dias úteis após o pagamento.
                      </p>
                      <div className="border border-dashed border-gray-300 p-4 rounded-md">
                        <p className="text-center text-sm">
                          Boleto será gerado após confirmação
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <div className="mt-6 p-4 bg-muted rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold">R$ 399,90</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processando..." : "Finalizar Pagamento"}
                  </Button>
                </Tabs>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
