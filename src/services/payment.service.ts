import { supabase } from "@/lib/supabase";
import { asaasClient } from "@/lib/asaas-client";
import { Database } from "@/types/supabase";

export type Payment = Database["public"]["Tables"]["payments"]["Row"];

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

export class PaymentService {
  /**
   * Cria um cliente no Asaas
   */
  static async createCustomer(customerData: CustomerData) {
    try {
      // Verificar se o cliente já existe pelo email
      const existingCustomer = await asaasClient.customers.getByEmail(
        customerData.email,
      );
      if (existingCustomer) {
        return existingCustomer;
      }

      // Criar novo cliente
      const customer = await asaasClient.customers.create(customerData);
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
      const payment = await asaasClient.payments.create(paymentData);
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
      const payment = await asaasClient.payments.getById(paymentId);
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

      // 3. Registrar o pagamento no banco de dados
      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            user_id: paymentData.externalReference || "anonymous",
            course_id: null, // Pode ser atualizado posteriormente
            amount: paymentData.value,
            status: "pending", // Será atualizado quando o pagamento for confirmado
            asaas_id: payment.id,
            payment_method: "credit_card",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { ...payment, dbRecord: data };
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
    userId?: string,
    courseId?: string,
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
        externalReference: userId,
      });

      // 3. Registrar o pagamento no banco de dados
      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            user_id: userId || "anonymous",
            course_id: courseId || null,
            amount: value,
            status: "pending",
            asaas_id: payment.id,
            payment_method: "pix",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { ...payment, dbRecord: data };
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
    userId?: string,
    courseId?: string,
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
        externalReference: userId,
      });

      // 3. Registrar o pagamento no banco de dados
      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            user_id: userId || "anonymous",
            course_id: courseId || null,
            amount: value,
            status: "pending",
            asaas_id: payment.id,
            payment_method: "boleto",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { ...payment, dbRecord: data };
    } catch (error) {
      console.error("Erro ao processar pagamento com boleto:", error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pagamento no banco de dados
   */
  static async updatePaymentStatus(paymentId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from("payments")
        .update({ status })
        .eq("asaas_id", paymentId)
        .select()
        .single();

      if (error) throw error;

      // Criar notificação para o usuário sobre a mudança de status
      try {
        const { data: notificationService } = await import(
          "@/services/notification.service"
        );
        const NotificationService = notificationService.NotificationService;

        let title = "";
        let message = "";

        switch (status) {
          case "completed":
            title = "Pagamento confirmado";
            message = `Seu pagamento foi confirmado com sucesso.`;
            break;
          case "pending":
            title = "Pagamento pendente";
            message = `Seu pagamento está pendente de confirmação.`;
            break;
          case "overdue":
            title = "Pagamento atrasado";
            message = `Seu pagamento está atrasado. Por favor, regularize.`;
            break;
          case "cancelled":
            title = "Pagamento cancelado";
            message = `Seu pagamento foi cancelado.`;
            break;
        }

        if (title && data?.user_id) {
          await NotificationService.createNotification(
            data.user_id,
            title,
            message,
            "payment",
          );
        }
      } catch (notificationError) {
        console.error(
          "Erro ao criar notificação de pagamento:",
          notificationError,
        );
        // Não interromper o fluxo principal se a notificação falhar
      }

      return data;
    } catch (error) {
      console.error(
        `Erro ao atualizar status do pagamento ${paymentId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtém todos os pagamentos de um usuário
   */
  static async getUserPayments(userId: string) {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          id,
          amount,
          status,
          payment_date,
          payment_method,
          asaas_id,
          courses(id, title)
        `,
        )
        .eq("user_id", userId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar pagamentos do usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de pagamentos
   */
  static async getPaymentStats() {
    try {
      // Total de pagamentos
      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select("amount, status");

      if (paymentsError) throw paymentsError;

      // Calcular estatísticas
      const totalRevenue = payments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0);

      const pendingRevenue = payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0);

      const completedPayments = payments.filter(
        (p) => p.status === "completed",
      ).length;
      const pendingPayments = payments.filter(
        (p) => p.status === "pending",
      ).length;

      // Pagamentos deste mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthPayments, error: monthError } = await supabase
        .from("payments")
        .select("amount, status")
        .gte("payment_date", startOfMonth.toISOString());

      if (monthError) throw monthError;

      const monthlyRevenue = monthPayments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        totalRevenue,
        pendingRevenue,
        completedPayments,
        pendingPayments,
        monthlyRevenue,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas de pagamentos:", error);
      throw error;
    }
  }
}
