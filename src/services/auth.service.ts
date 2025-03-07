import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type User = Database["public"]["Tables"]["users"]["Row"];

export class AuthService {
  /**
   * Registra um novo usuário
   */
  static async signUp(
    email: string,
    password: string,
    userData: Omit<User, "id" | "created_at" | "is_approved">,
  ) {
    try {
      // 1. Criar o usuário na autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Falha ao criar usuário");

      // 2. Criar o perfil do usuário na tabela users
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            name: userData.name,
            profession: userData.profession,
            address: userData.address,
            phone: userData.phone,
            photo_url: userData.photo_url,
            is_approved: false, // Usuários precisam ser aprovados por um administrador
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      return { user: authData.user, profile: profileData };
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      throw error;
    }
  }

  /**
   * Faz login com email e senha
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Buscar o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      return { user: data.user, profile };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  /**
   * Faz logout do usuário atual
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }

  /**
   * Obtém o usuário atual
   */
  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      // Buscar o perfil do usuário
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) throw profileError;

        return { user: data.user, profile };
      }

      return { user: null, profile: null };
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário atual tem permissões de administrador
   */
  static async isAdmin() {
    try {
      const { user, profile } = await this.getCurrentUser();

      if (!user || !profile) {
        return false;
      }

      return profile.role === "admin";
    } catch (error) {
      console.error("Erro ao verificar status admin:", error);
      return false;
    }
  }

  /**
   * Envia email de redefinição de senha
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      throw error;
    }
  }

  /**
   * Atualiza a senha do usuário
   */
  static async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      throw error;
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  static async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  }

  /**
   * Faz upload da foto do usuário
   */
  static async uploadProfilePhoto(userId: string, file: File) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload da foto para o storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obter a URL pública da foto
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Atualizar o perfil do usuário com a nova URL da foto
      const { data, error } = await supabase
        .from("users")
        .update({ photo_url: urlData.publicUrl })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao fazer upload da foto de perfil:", error);
      throw error;
    }
  }
}
