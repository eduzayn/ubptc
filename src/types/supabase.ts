export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string;
          profession: string;
          address: string | null;
          phone: string | null;
          photo_url: string | null;
          is_approved: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          name: string;
          profession: string;
          address?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          is_approved?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string;
          profession?: string;
          address?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          is_approved?: boolean;
        };
      };
      courses: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          price: number;
          is_free: boolean;
          category: string;
          image_url: string | null;
          instructor: string | null;
          duration: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          price: number;
          is_free?: boolean;
          category: string;
          image_url?: string | null;
          instructor?: string | null;
          duration?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          price?: number;
          is_free?: boolean;
          category?: string;
          image_url?: string | null;
          instructor?: string | null;
          duration?: string | null;
        };
      };
      course_modules: {
        Row: {
          id: string;
          created_at: string;
          course_id: string;
          title: string;
          order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          course_id: string;
          title: string;
          order: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          course_id?: string;
          title?: string;
          order?: number;
        };
      };
      course_lessons: {
        Row: {
          id: string;
          created_at: string;
          module_id: string;
          title: string;
          type: string;
          content_url: string | null;
          duration: string | null;
          order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          module_id: string;
          title: string;
          type: string;
          content_url?: string | null;
          duration?: string | null;
          order: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          module_id?: string;
          title?: string;
          type?: string;
          content_url?: string | null;
          duration?: string | null;
          order?: number;
        };
      };
      user_courses: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          course_id: string;
          progress: number;
          last_accessed: string | null;
          completed: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          course_id: string;
          progress?: number;
          last_accessed?: string | null;
          completed?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          course_id?: string;
          progress?: number;
          last_accessed?: string | null;
          completed?: boolean;
        };
      };
      certificates: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          course_id: string;
          issue_date: string;
          download_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          course_id: string;
          issue_date: string;
          download_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          course_id?: string;
          issue_date?: string;
          download_url?: string | null;
        };
      };
      credentials: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          qr_code: string;
          issue_date: string;
          expiry_date: string;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          qr_code: string;
          issue_date: string;
          expiry_date: string;
          status: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          qr_code?: string;
          issue_date?: string;
          expiry_date?: string;
          status?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          course_id: string | null;
          amount: number;
          status: string;
          payment_date: string;
          asaas_id: string | null;
          payment_method: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          course_id?: string | null;
          amount: number;
          status: string;
          payment_date: string;
          asaas_id?: string | null;
          payment_method: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          course_id?: string | null;
          amount?: number;
          status?: string;
          payment_date?: string;
          asaas_id?: string | null;
          payment_method?: string;
        };
      };
      library_materials: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          type: string;
          category: string;
          file_size: string;
          pages: number;
          published_at: string;
          download_url: string;
          cover_image_url: string | null;
          download_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          type: string;
          category: string;
          file_size: string;
          pages: number;
          published_at: string;
          download_url: string;
          cover_image_url?: string | null;
          download_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          type?: string;
          category?: string;
          file_size?: string;
          pages?: number;
          published_at?: string;
          download_url?: string;
          cover_image_url?: string | null;
          download_count?: number;
        };
      };
      user_downloads: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          material_id: string;
          download_date: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          material_id: string;
          download_date: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          material_id?: string;
          download_date?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
