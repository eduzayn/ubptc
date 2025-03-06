import { asaas } from "@/lib/asaas";

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

export class PaymentService {
  /**
   * Cria um cliente no Asaas
   */
  static async createCustomer(customerData: CustomerData) {
    try {
      const customer = await asaas.customers.create(customerData);
      return customer;
    } catch (error) {
      console.error("Erro ao criar cliente no Asaas:", error);
      throw error;
    }
  }

  /**
   * Cria um pagamento no Asaas
   */
  static async createPayment(paymentData: PaymentData) {
    try {
      const payment = await asaas.payments.create(paymentData);
      return payment;
    } catch (error) {
      console.error("Erro ao criar pagamento no Asaas:", error);
      throw error;
    }
  }

  /**
   * Verifica o status de um pagamento
   */
  static async checkPaymentStatus(paymentId: string) {
    try {
      const payment = await asaas.payments.getById(paymentId);
      return payment;
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      throw error;
    }
  }

  /**
   * Processa pagamento com cartão de crédito
   */
  static async processCreditCardPayment(
    customerData: CustomerData,
    paymentData: PaymentData,
  ) {
    try {
      // 1. Criar ou obter cliente
      const customer = await this.createCustomer(customerData);

      // 2. Criar pagamento com cartão de crédito
      const payment = await this.createPayment({
        ...paymentData,
        customerId: customer.id,
        billingType: "CREDIT_CARD",
      });

      return payment;
    } catch (error) {
      console.error("Erro ao processar pagamento com cartão:", error);
      throw error;
    }
  }

  /**
   * Processa pagamento com PIX
   */
  static async processPixPayment(
    customerData: CustomerData,
    value: number,
    description: string,
  ) {
    try {
      // 1. Criar ou obter cliente
      const customer = await this.createCustomer(customerData);

      // 2. Criar pagamento PIX
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1); // Vencimento para amanhã

      const payment = await this.createPayment({
        customerId: customer.id,
        billingType: "PIX",
        value,
        description,
        dueDate: dueDate.toISOString().split("T")[0],
      });

      return payment;
    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
      throw error;
    }
  }

  /**
   * Processa pagamento com boleto
   */
  static async processBoletoPayment(
    customerData: CustomerData,
    value: number,
    description: string,
  ) {
    try {
      // 1. Criar ou obter cliente
      const customer = await this.createCustomer(customerData);

      // 2. Criar pagamento com boleto
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // Vencimento para 3 dias

      const payment = await this.createPayment({
        customerId: customer.id,
        billingType: "BOLETO",
        value,
        description,
        dueDate: dueDate.toISOString().split("T")[0],
      });

      return payment;
    } catch (error) {
      console.error("Erro ao processar pagamento com boleto:", error);
      throw error;
    }
  }
}
