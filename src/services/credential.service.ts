import { supabase } from "@/lib/supabase";
import { PaymentService } from "./payment.service";

export interface CredentialData {
  userId: string;
  name: string;
  profession: string;
  email: string;
  photo: string;
  paymentId: string;
}

export class CredentialService {
  /**
   * Verifica se o pagamento foi confirmado antes de gerar a credencial
   */
  static async verifyPaymentAndGenerateCredential(
    paymentId: string,
    userData: Omit<CredentialData, "paymentId">,
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
        // Gerar credencial
        const credential = await this.generateCredential({
          ...userData,
          paymentId,
        });

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
  static async generateCredential(credentialData: CredentialData) {
    try {
      // Gerar data de emissão e validade
      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Validade de 1 ano

      // Gerar código QR único para a credencial
      const qrCode = `https://associacaopro.com.br/validar-credencial?id=${credentialData.userId}&token=${this.generateToken()}`;

      // Em um cenário real, aqui você salvaria os dados no Supabase
      // const { data, error } = await supabase
      //   .from('credentials')
      //   .insert([
      //     {
      //       user_id: credentialData.userId,
      //       qr_code: qrCode,
      //       issue_date: issueDate.toISOString(),
      //       expiry_date: expiryDate.toISOString(),
      //       payment_id: credentialData.paymentId,
      //       status: 'active'
      //     }
      //   ])
      //   .select();

      // if (error) throw error;

      // Simulando resposta do banco de dados
      const credential = {
        id: this.generateId(),
        userId: credentialData.userId,
        name: credentialData.name,
        profession: credentialData.profession,
        email: credentialData.email,
        photo: credentialData.photo,
        qrCode,
        issueDate,
        expiryDate,
        status: "Ativo",
        paymentId: credentialData.paymentId,
      };

      return credential;
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
   * Gera um ID aleatório
   */
  private static generateId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Valida uma credencial pelo ID e token
   */
  static async validateCredential(id: string, token: string) {
    try {
      // Em um cenário real, aqui você consultaria o Supabase
      // const { data, error } = await supabase
      //   .from('credentials')
      //   .select('*')
      //   .eq('user_id', id)
      //   .single();

      // if (error) throw error;
      // if (!data) return { valid: false, message: 'Credencial não encontrada' };

      // const isValid = data.status === 'active' && new Date(data.expiry_date) > new Date();

      // Simulando validação
      const isValid = true;

      return {
        valid: isValid,
        message: isValid
          ? "Credencial válida"
          : "Credencial inválida ou expirada",
        // credential: isValid ? data : null
      };
    } catch (error) {
      console.error("Erro ao validar credencial:", error);
      throw error;
    }
  }
}
