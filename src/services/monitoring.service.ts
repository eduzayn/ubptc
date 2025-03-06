import { supabase } from "@/lib/supabase";

export class MonitoringService {
  /**
   * Obtém estatísticas do sistema através da função Edge
   */
  static async getSystemStats() {
    try {
      const { data, error } = await supabase.functions.invoke("monitoring", {
        body: { action: "getStats" },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao obter estatísticas do sistema:", error);
      throw error;
    }
  }

  /**
   * Verifica a integridade do sistema
   */
  static async checkSystemHealth() {
    try {
      const { data, error } = await supabase.functions.invoke("monitoring", {
        body: { action: "healthCheck" },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao verificar integridade do sistema:", error);
      throw error;
    }
  }

  /**
   * Obtém logs de pagamentos para análise
   */
  static async getPaymentLogs(environment = "production", limit = 100) {
    try {
      const { data, error } = await supabase
        .from("payment_logs")
        .select("*")
        .eq("environment", environment)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao obter logs de pagamentos:", error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de pagamentos por status
   */
  static async getPaymentStatsByStatus(environment = "production") {
    try {
      const { data, error } = await supabase
        .from("payment_logs")
        .select("status, count(*)")
        .eq("environment", environment)
        .group("status");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        "Erro ao obter estatísticas de pagamentos por status:",
        error,
      );
      throw error;
    }
  }

  /**
   * Obtém estatísticas de pagamentos por evento
   */
  static async getPaymentStatsByEvent(environment = "production") {
    try {
      const { data, error } = await supabase
        .from("payment_logs")
        .select("event, count(*)")
        .eq("environment", environment)
        .group("event");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        "Erro ao obter estatísticas de pagamentos por evento:",
        error,
      );
      throw error;
    }
  }
}
