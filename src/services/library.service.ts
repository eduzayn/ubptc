import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type LibraryMaterial =
  Database["public"]["Tables"]["library_materials"]["Row"];

export class LibraryService {
  /**
   * Obtém todos os materiais da biblioteca
   */
  static async getAllMaterials() {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar materiais da biblioteca:", error);
      throw error;
    }
  }

  /**
   * Obtém materiais da biblioteca por tipo
   */
  static async getMaterialsByType(type: string) {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar materiais do tipo ${type}:`, error);
      throw error;
    }
  }

  /**
   * Obtém um material específico por ID
   */
  static async getMaterialById(id: string) {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar material com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um novo material à biblioteca
   */
  static async addMaterial(
    material: Omit<LibraryMaterial, "id" | "created_at" | "download_count">,
  ) {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .insert([
          {
            ...material,
            download_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao adicionar material:", error);
      throw error;
    }
  }

  /**
   * Atualiza um material existente
   */
  static async updateMaterial(id: string, updates: Partial<LibraryMaterial>) {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar material com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove um material da biblioteca
   */
  static async deleteMaterial(id: string) {
    try {
      const { error } = await supabase
        .from("library_materials")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir material com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Registra um download de material por um usuário
   */
  static async registerDownload(userId: string, materialId: string) {
    try {
      // 1. Registrar o download na tabela user_downloads
      const { error: downloadError } = await supabase
        .from("user_downloads")
        .insert([
          {
            user_id: userId,
            material_id: materialId,
            download_date: new Date().toISOString(),
          },
        ]);

      if (downloadError) throw downloadError;

      // 2. Incrementar o contador de downloads do material
      const { error: updateError } = await supabase.rpc(
        "increment_download_count",
        { material_id: materialId },
      );

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error(
        `Erro ao registrar download do material ${materialId} pelo usuário ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Faz upload de um arquivo para o bucket de armazenamento
   */
  static async uploadFile(file: File, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("library")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Gerar URL pública para o arquivo
      const { data: urlData } = supabase.storage
        .from("library")
        .getPublicUrl(path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      throw error;
    }
  }

  /**
   * Faz upload de uma imagem de capa para o bucket de armazenamento
   */
  static async uploadCoverImage(file: File, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Gerar URL pública para a imagem
      const { data: urlData } = supabase.storage
        .from("covers")
        .getPublicUrl(path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem de capa:", error);
      throw error;
    }
  }

  /**
   * Obtém os materiais mais populares (mais baixados)
   */
  static async getPopularMaterials(limit = 5) {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .select("*")
        .order("download_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar materiais populares:", error);
      throw error;
    }
  }
}
