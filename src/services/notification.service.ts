import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "payment" | "material" | "course" | "system";
  read: boolean;
  created_at: string;
};

export class NotificationService {
  /**
   * Cria uma nova notificação para um usuário
   */
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: "payment" | "material" | "course" | "system",
  ) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: userId,
            title,
            message,
            type,
            read: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw error;
    }
  }

  /**
   * Obtém todas as notificações de um usuário
   */
  static async getUserNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar notificações do usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Marca uma notificação como lida
   */
  static async markAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Erro ao marcar notificação ${notificationId} como lida:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Marca todas as notificações de um usuário como lidas
   */
  static async markAllAsRead(userId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao marcar todas notificações como lidas:`, error);
      throw error;
    }
  }

  /**
   * Exclui uma notificação
   */
  static async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir notificação ${notificationId}:`, error);
      throw error;
    }
  }

  /**
   * Cria uma notificação para todos os usuários
   */
  static async createGlobalNotification(
    title: string,
    message: string,
    type: "material" | "course" | "system",
  ) {
    try {
      // Buscar todos os usuários
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id");

      if (usersError) throw usersError;

      // Criar notificações em lote
      const notifications = users.map((user) => ({
        user_id: user.id,
        title,
        message,
        type,
        read: false,
      }));

      const { data, error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao criar notificação global:", error);
      throw error;
    }
  }
}
