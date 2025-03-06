import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { PaymentService } from "./payment.service";

export type Credential = Database["public"]["Tables"]["credentials"]["Row"];

export interface CredentialData {
  userId: string;
  name: string;
  profession: string;
  email: string;
  photo: string;
}

export class CredentialService {
  /**
   * Verifica se o pagamento foi confirmado antes de gerar a credencial
   */
  static async verifyPaymentAndGenerateCredential(
    paymentId: string,
    userData: CredentialData,
  ) {
    try {
      // 1. Verificar status do pagamento no Asaas
      const paymentStatus = await PaymentService.checkPaymentStatus(paymentId);

      // 2. Se o pagamento foi confirmado, gerar a credencial
      if (
        paymentStatus.status === "CONFIRMED" ||
        paymentStatus.status === "RECEIVED" ||
        paymentStatus.status === "RECEIVED_IN_CASH"
      ) {
        // Atualizar status do pagamento no banco de dados
        await PaymentService.updatePaymentStatus(paymentId, "completed");

        // Buscar o registro de pagamento no banco de dados
        const { data: paymentRecord, error: paymentError } = await supabase
          .from("payments")
          .select("id")
          .eq("asaas_id", paymentId)
          .single();

        if (paymentError) throw paymentError;

        // Gerar credencial
        const credential = await this.generateCredential(
          userData,
          paymentRecord.id,
        );

        return {
          success: true,
          credential,
          message: "Credencial gerada com sucesso!",
        };
      } else {
        // Pagamento ainda não confirmado
        return {
          success: false,
          message: `Pagamento ainda não confirmado. Status atual: ${paymentStatus.status}`,
          paymentStatus,
        };
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento e gerar credencial:", error);
      throw error;
    }
  }

  /**
   * Gera uma nova credencial para o usuário
   */
  static async generateCredential(
    credentialData: CredentialData,
    paymentId?: string,
  ) {
    try {
      // Gerar data de emissão e validade
      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Validade de 1 ano

      // Gerar código QR único para a credencial
      const qrCode = `https://associacaopro.com.br/validar-credencial?id=${credentialData.userId}&token=${this.generateToken()}`;

      // Verificar se já existe uma credencial ativa para o usuário
      const { data: existingCredential, error: checkError } = await supabase
        .from("credentials")
        .select("*")
        .eq("user_id", credentialData.userId)
        .eq("status", "active")
        .maybeSingle();

      if (checkError) throw checkError;

      // Se já existir uma credencial ativa, atualizá-la para inativa
      if (existingCredential) {
        const { error: updateError } = await supabase
          .from("credentials")
          .update({ status: "inactive" })
          .eq("id", existingCredential.id);

        if (updateError) throw updateError;
      }

      // Criar nova credencial
      const { data, error } = await supabase
        .from("credentials")
        .insert([
          {
            user_id: credentialData.userId,
            qr_code: qrCode,
            issue_date: issueDate.toISOString(),
            expiry_date: expiryDate.toISOString(),
            status: "active",
            payment_id: paymentId || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        name: credentialData.name,
        profession: credentialData.profession,
        email: credentialData.email,
        photo: credentialData.photo,
      };
    } catch (error) {
      console.error("Erro ao gerar credencial:", error);
      throw error;
    }
  }

  /**
   * Gera um token aleatório para a credencial
   */
  private static generateToken() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Obtém a credencial ativa de um usuário
   */
  static async getUserCredential(userId: string) {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select(
          `
          id,
          qr_code,
          issue_date,
          expiry_date,
          status,
          users!inner(name, profession, email, photo_url)
        `,
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (error) throw error;

      return {
        ...data,
        name: data.users.name,
        profession: data.users.profession,
        email: data.users.email,
        photo: data.users.photo_url,
      };
    } catch (error) {
      console.error(`Erro ao buscar credencial do usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Valida uma credencial pelo ID
   */
  static async validateCredential(id: string) {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select(
          `
          id,
          issue_date,
          expiry_date,
          status,
          users!inner(name, profession, photo_url)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      const now = new Date();
      const expiryDate = new Date(data.expiry_date);
      const isValid = data.status === "active" && expiryDate > now;

      return {
        valid: isValid,
        credential: {
          id: data.id,
          name: data.users.name,
          profession: data.users.profession,
          photo: data.users.photo_url,
          issueDate: data.issue_date,
          expiryDate: data.expiry_date,
          status: data.status,
        },
        message: isValid
          ? "Credencial válida"
          : "Credencial inválida ou expirada",
      };
    } catch (error) {
      console.error(`Erro ao validar credencial com ID ${id}:`, error);
      return {
        valid: false,
        message: "Credencial não encontrada",
      };
    }
  }

  /**
   * Renova uma credencial expirada
   */
  static async renewCredential(userId: string, paymentId: string) {
    try {
      // Verificar se o pagamento foi confirmado
      const { success, credential, message } =
        await this.verifyPaymentAndGenerateCredential(
          paymentId,
          { userId, name: "", profession: "", email: "", photo: "" }, // Esses dados serão preenchidos pelo método
        );

      if (!success) {
        throw new Error(message);
      }

      return credential;
    } catch (error) {
      console.error(`Erro ao renovar credencial do usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de credenciais
   */
  static async getCredentialStats() {
    try {
      // Total de credenciais ativas
      const { count: activeCredentials, error: activeError } = await supabase
        .from("credentials")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (activeError) throw activeError;

      // Total de credenciais expiradas
      const now = new Date().toISOString();
      const { count: expiredCredentials, error: expiredError } = await supabase
        .from("credentials")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .lt("expiry_date", now);

      if (expiredError) throw expiredError;

      // Credenciais emitidas este mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthCredentials, error: monthError } = await supabase
        .from("credentials")
        .select("*", { count: "exact", head: true })
        .gte("issue_date", startOfMonth.toISOString());

      if (monthError) throw monthError;

      return {
        activeCredentials,
        expiredCredentials,
        monthCredentials,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas de credenciais:", error);
      throw error;
    }
  }
}
