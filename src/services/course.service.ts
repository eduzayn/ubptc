import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseModule =
  Database["public"]["Tables"]["course_modules"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type CourseEnrollment =
  Database["public"]["Tables"]["course_enrollments"]["Row"];

export class CourseService {
  /**
   * Obtém todos os cursos
   */
  static async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      throw error;
    }
  }

  /**
   * Obtém cursos por categoria
   */
  static async getCoursesByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar cursos da categoria ${category}:`, error);
      throw error;
    }
  }

  /**
   * Busca cursos por termo de pesquisa
   */
  static async searchCourses(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Erro ao buscar cursos com o termo "${searchTerm}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtém um curso específico por ID com seus módulos e lições
   */
  static async getCourseById(id: string) {
    try {
      // Buscar o curso
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseError) throw courseError;

      // Buscar os módulos do curso
      const { data: modules, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", id)
        .order("order_number", { ascending: true });

      if (modulesError) throw modulesError;

      // Buscar as lições de cada módulo
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const { data: lessons, error: lessonsError } = await supabase
            .from("lessons")
            .select("*")
            .eq("module_id", module.id)
            .order("order_number", { ascending: true });

          if (lessonsError) throw lessonsError;

          return {
            ...module,
            lessons: lessons || [],
          };
        }),
      );

      return {
        ...course,
        modules: modulesWithLessons,
      };
    } catch (error) {
      console.error(`Erro ao buscar curso com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um novo curso
   */
  static async addCourse(
    courseData: Omit<Course, "id" | "created_at" | "updated_at">,
  ) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([courseData])
        .select()
        .single();

      if (error) throw error;

      // Criar notificação global sobre o novo curso
      try {
        const { data: notificationService } = await import(
          "@/services/notification.service"
        );
        const NotificationService = notificationService.NotificationService;

        await NotificationService.createGlobalNotification(
          "Novo curso disponível",
          `O curso "${courseData.title}" foi adicionado à plataforma.`,
          "course",
        );
      } catch (notificationError) {
        console.error(
          "Erro ao criar notificação de novo curso:",
          notificationError,
        );
        // Não interromper o fluxo principal se a notificação falhar
      }

      return data;
    } catch (error) {
      console.error("Erro ao adicionar curso:", error);
      throw error;
    }
  }

  /**
   * Atualiza um curso existente
   */
  static async updateCourse(id: string, updates: Partial<Course>) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar curso com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove um curso
   */
  static async deleteCourse(id: string) {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir curso com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um módulo a um curso
   */
  static async addModule(moduleData: Omit<CourseModule, "id">) {
    try {
      const { data, error } = await supabase
        .from("course_modules")
        .insert([moduleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao adicionar módulo:", error);
      throw error;
    }
  }

  /**
   * Atualiza um módulo
   */
  static async updateModule(id: string, updates: Partial<CourseModule>) {
    try {
      const { data, error } = await supabase
        .from("course_modules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar módulo com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove um módulo
   */
  static async deleteModule(id: string) {
    try {
      const { error } = await supabase
        .from("course_modules")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir módulo com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona uma lição a um módulo
   */
  static async addLesson(lessonData: Omit<Lesson, "id">) {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .insert([lessonData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao adicionar lição:", error);
      throw error;
    }
  }

  /**
   * Atualiza uma lição
   */
  static async updateLesson(id: string, updates: Partial<Lesson>) {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar lição com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove uma lição
   */
  static async deleteLesson(id: string) {
    try {
      const { error } = await supabase.from("lessons").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir lição com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Matricula um usuário em um curso
   */
  static async enrollUserInCourse(userId: string, courseId: string) {
    try {
      // Verificar se o usuário já está matriculado
      const { data: existingEnrollment, error: checkError } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (checkError) throw checkError;

      // Se já estiver matriculado, retornar a matrícula existente
      if (existingEnrollment) {
        return existingEnrollment;
      }

      // Caso contrário, criar nova matrícula
      const { data, error } = await supabase
        .from("course_enrollments")
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            progress: 0,
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Erro ao matricular usuário ${userId} no curso ${courseId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtém os cursos de um usuário
   */
  static async getUserCourses(userId: string) {
    try {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select(
          `
          id,
          progress,
          last_accessed,
          completed,
          completion_date,
          courses!inner(*)
        `,
        )
        .eq("user_id", userId)
        .order("last_accessed", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar cursos do usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza o progresso de um usuário em um curso
   */
  static async updateCourseProgress(
    userId: string,
    courseId: string,
    progress: number,
    completed: boolean = false,
  ) {
    try {
      const updates: Partial<CourseEnrollment> = {
        progress,
        last_accessed: new Date().toISOString(),
      };

      if (completed) {
        updates.completed = true;
        updates.completion_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("course_enrollments")
        .update(updates)
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Erro ao atualizar progresso do usuário ${userId} no curso ${courseId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtém estatísticas dos cursos
   */
  static async getCourseStats() {
    try {
      // Total de cursos
      const { count: totalCourses, error: countError } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      // Total de matrículas
      const { count: totalEnrollments, error: enrollmentsError } =
        await supabase
          .from("course_enrollments")
          .select("*", { count: "exact", head: true });

      if (enrollmentsError) throw enrollmentsError;

      // Cursos concluídos
      const { count: completedCourses, error: completedError } = await supabase
        .from("course_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("completed", true);

      if (completedError) throw completedError;

      return {
        totalCourses,
        totalEnrollments,
        completedCourses,
        completionRate:
          totalEnrollments > 0
            ? (completedCourses / totalEnrollments) * 100
            : 0,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas dos cursos:", error);
      throw error;
    }
  }
}
