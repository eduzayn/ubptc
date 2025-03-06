// Mock da biblioteca Asaas para desenvolvimento

const mockAsaas = {
  customers: {
    create: async (customerData: any) => {
      console.log("Mock: Criando cliente", customerData);
      return {
        id: "cus_" + Math.random().toString(36).substring(2, 15),
        name: customerData.name,
        email: customerData.email,
        cpfCnpj: customerData.cpfCnpj,
        // outros campos
      };
    },
  },
  payments: {
    create: async (paymentData: any) => {
      console.log("Mock: Criando pagamento", paymentData);
      const id = "pay_" + Math.random().toString(36).substring(2, 15);
      return {
        id,
        status: "PENDING",
        value: paymentData.value,
        netValue: paymentData.value,
        billingType: paymentData.billingType,
        dueDate: paymentData.dueDate,
        customer: paymentData.customerId,
        description: paymentData.description,
        // Campos específicos para cada tipo de pagamento
        pixQrCode:
          paymentData.billingType === "PIX"
            ? `https://example.com/pix/${id}`
            : null,
        bankSlipUrl:
          paymentData.billingType === "BOLETO"
            ? `https://example.com/boleto/${id}`
            : null,
      };
    },
    getById: async (paymentId: string) => {
      console.log("Mock: Consultando pagamento", paymentId);
      // Simulando um pagamento confirmado
      return {
        id: paymentId,
        status: "CONFIRMED",
        value: 399.9,
        netValue: 399.9,
        // outros campos
      };
    },
  },
};

export const asaas = mockAsaas;
