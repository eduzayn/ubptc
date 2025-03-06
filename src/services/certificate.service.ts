import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

export class CertificateService {
  /**
   * Gera um certificado para um usuário que concluiu um curso
   */
  static async generateCertificate(
    userId: string,
    courseId: string,
    hours: number,
  ) {
    try {
      // Verificar se o usuário concluiu o curso
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (enrollmentError) throw enrollmentError;

      if (!enrollment.completed) {
        throw new Error("O usuário não concluiu este curso");
      }

      // Verificar se já existe um certificado
      const { data: existingCertificate, error: checkError } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (checkError) throw checkError;

      // Se já existir um certificado, retorná-lo
      if (existingCertificate) {
        return existingCertificate;
      }

      // Gerar URL do certificado (em um cenário real, você geraria um PDF)
      const downloadUrl = `https://example.com/certificates/${userId}_${courseId}_${Date.now()}.pdf`;

      // Criar o certificado
      const { data, error } = await supabase
        .from("certificates")
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            download_url: downloadUrl,
            hours,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Erro ao gerar certificado para o usuário ${userId} no curso ${courseId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtém todos os certificados de um usuário
   */
  static async getUserCertificates(userId: string) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `
          id,
          issue_date,
          download_url,
          hours,
          courses!inner(id, title, description, category)
        `,
        )
        .eq("user_id", userId)
        .order("issue_date", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar certificados do usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém um certificado específico por ID
   */
  static async getCertificateById(id: string) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `
          id,
          issue_date,
          download_url,
          hours,
          user_id,
          course_id,
          courses!inner(title, description, category),
          users!inner(name, email, profession)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar certificado com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Verifica a autenticidade de um certificado
   */
  static async verifyCertificate(id: string) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `
          id,
          issue_date,
          users!inner(name, profession),
          courses!inner(title)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        valid: true,
        certificate: data,
      };
    } catch (error) {
      console.error(`Erro ao verificar certificado com ID ${id}:`, error);
      return {
        valid: false,
        message: "Certificado não encontrado ou inválido",
      };
    }
  }

  /**
   * Obtém estatísticas de certificados
   */
  static async getCertificateStats() {
    try {
      // Total de certificados
      const { count: totalCertificates, error: countError } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      // Certificados emitidos este mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthCertificates, error: monthError } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .gte("issue_date", startOfMonth.toISOString());

      if (monthError) throw monthError;

      return {
        totalCertificates,
        monthCertificates,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas de certificados:", error);
      throw error;
    }
  }
}
