import axios from "axios";

const API_KEY = import.meta.env.VITE_ASAAS_API_KEY;
// Usar ambiente de produção
const ENVIRONMENT = "production";

// Definir a URL base para o ambiente de produção
const BASE_URL = "https://www.asaas.com/api/v3";

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    access_token: API_KEY,
  },
});

// Interface para dados do cliente
export interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

// Interface para dados de pagamento
export interface PaymentData {
  customerId: string;
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
  billingType: "CREDIT_CARD" | "PIX" | "BOLETO";
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
  installmentCount?: number;
}

// Cliente Asaas para produção
export const asaasProductionClient = {
  customers: {
    create: async (customerData: CustomerData) => {
      try {
        const response = await api.post("/customers", customerData);
        return response.data;
      } catch (error) {
        console.error("Erro ao criar cliente no Asaas (produção):", error);
        throw error;
      }
    },
    getById: async (customerId: string) => {
      try {
        const response = await api.get(`/customers/${customerId}`);
        return response.data;
      } catch (error) {
        console.error(
          `Erro ao buscar cliente ${customerId} (produção):`,
          error,
        );
        throw error;
      }
    },
    getByEmail: async (email: string) => {
      try {
        const response = await api.get("/customers", {
          params: { email },
        });
        return response.data.data[0] || null;
      } catch (error) {
        console.error(
          `Erro ao buscar cliente por email ${email} (produção):`,
          error,
        );
        throw error;
      }
    },
  },
  payments: {
    create: async (paymentData: PaymentData) => {
      try {
        const response = await api.post("/payments", paymentData);
        return response.data;
      } catch (error) {
        console.error("Erro ao criar pagamento no Asaas (produção):", error);
        throw error;
      }
    },
    getById: async (paymentId: string) => {
      try {
        const response = await api.get(`/payments/${paymentId}`);
        return response.data;
      } catch (error) {
        console.error(
          `Erro ao buscar pagamento ${paymentId} (produção):`,
          error,
        );
        throw error;
      }
    },
    getByCustomer: async (customerId: string) => {
      try {
        const response = await api.get("/payments", {
          params: { customer: customerId },
        });
        return response.data.data;
      } catch (error) {
        console.error(
          `Erro ao buscar pagamentos do cliente ${customerId} (produção):`,
          error,
        );
        throw error;
      }
    },
  },
};
