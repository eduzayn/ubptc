import PaymentHistoryComponent from "@/components/payment/PaymentHistory";
import { Payment } from "@/types";

export default function PaymentHistory() {
  // Mock data - in a real app, this would come from your API
  const payments: Payment[] = [
    {
      id: "pay_001",
      userId: "user_123",
      courseId: "Fundamentos da Engenharia Civil",
      amount: 199.9,
      status: "completed",
      paymentDate: new Date(2023, 8, 15),
      asaasId: "pay_asaas_001",
    },
    {
      id: "pay_002",
      userId: "user_123",
      courseId: "Gestão de Projetos para Engenheiros",
      amount: 249.9,
      status: "completed",
      paymentDate: new Date(2023, 7, 20),
      asaasId: "pay_asaas_002",
    },
    {
      id: "pay_003",
      userId: "user_123",
      courseId: "Normas Técnicas Atualizadas",
      amount: 179.9,
      status: "pending",
      paymentDate: new Date(2023, 9, 5),
      asaasId: "pay_asaas_003",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Meus Pagamentos</h1>
      <PaymentHistoryComponent payments={payments} />
    </div>
  );
}
