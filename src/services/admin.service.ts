import { supabase } from "@/lib/supabase";

export class AdminService {
  /**
   * Verifica se o usuário atual tem permissões de administrador
   */
  static async isAdmin() {
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) return false;

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      return data?.role === "admin";
    } catch (error) {
      console.error("Erro ao verificar permissões de administrador:", error);
      return false;
    }
  }

  /**
   * Concede permissões de administrador a um usuário
   */
  static async grantAdminRole(userId: string) {
    try {
      // Verificar se o usuário atual é admin
      const isAdmin = await this.isAdmin();
      if (!isAdmin) throw new Error("Permissão negada");

      const { data, error } = await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao conceder permissões de administrador:", error);
      throw error;
    }
  }

  /**
   * Remove permissões de administrador de um usuário
   */
  static async revokeAdminRole(userId: string) {
    try {
      // Verificar se o usuário atual é admin
      const isAdmin = await this.isAdmin();
      if (!isAdmin) throw new Error("Permissão negada");

      const { data, error } = await supabase
        .from("users")
        .update({ role: "user" })
        .eq("id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao remover permissões de administrador:", error);
      throw error;
    }
  }
}
