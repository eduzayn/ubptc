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
          profession: string | null;
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
          profession?: string | null;
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
          profession?: string | null;
          address?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          is_approved?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          price: number;
          is_free: boolean;
          category: string | null;
          image_url: string | null;
          instructor: string | null;
          duration: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          price: number;
          is_free?: boolean;
          category?: string | null;
          image_url?: string | null;
          instructor?: string | null;
          duration?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          price?: number;
          is_free?: boolean;
          category?: string | null;
          image_url?: string | null;
          instructor?: string | null;
          duration?: string | null;
        };
      };
      course_modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          order_number: number;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          order_number: number;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          order_number?: number;
        };
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          type: string;
          content: string | null;
          duration: string | null;
          order_number: number;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          type: string;
          content?: string | null;
          duration?: string | null;
          order_number: number;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          type?: string;
          content?: string | null;
          duration?: string | null;
          order_number?: number;
        };
      };
      library_materials: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          type: string;
          category: string | null;
          file_size: string | null;
          pages: number | null;
          published_at: string;
          download_url: string | null;
          cover_image_url: string | null;
          download_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          type: string;
          category?: string | null;
          file_size?: string | null;
          pages?: number | null;
          published_at?: string;
          download_url?: string | null;
          cover_image_url?: string | null;
          download_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          type?: string;
          category?: string | null;
          file_size?: string | null;
          pages?: number | null;
          published_at?: string;
          download_url?: string | null;
          cover_image_url?: string | null;
          download_count?: number;
        };
      };
      user_downloads: {
        Row: {
          id: string;
          user_id: string;
          material_id: string;
          download_date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          material_id: string;
          download_date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          material_id?: string;
          download_date?: string;
        };
      };
      course_enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrollment_date: string;
          progress: number;
          last_accessed: string;
          completed: boolean;
          completion_date: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrollment_date?: string;
          progress?: number;
          last_accessed?: string;
          completed?: boolean;
          completion_date?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrollment_date?: string;
          progress?: number;
          last_accessed?: string;
          completed?: boolean;
          completion_date?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string | null;
          amount: number;
          status: string;
          payment_date: string;
          asaas_id: string | null;
          payment_method: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string | null;
          amount: number;
          status: string;
          payment_date?: string;
          asaas_id?: string | null;
          payment_method?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string | null;
          amount?: number;
          status?: string;
          payment_date?: string;
          asaas_id?: string | null;
          payment_method?: string | null;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          issue_date: string;
          download_url: string | null;
          hours: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          issue_date?: string;
          download_url?: string | null;
          hours?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          issue_date?: string;
          download_url?: string | null;
          hours?: number | null;
        };
      };
      credentials: {
        Row: {
          id: string;
          user_id: string;
          qr_code: string | null;
          issue_date: string;
          expiry_date: string | null;
          status: string;
          payment_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          qr_code?: string | null;
          issue_date?: string;
          expiry_date?: string | null;
          status?: string;
          payment_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          qr_code?: string | null;
          issue_date?: string;
          expiry_date?: string | null;
          status?: string;
          payment_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_download_count: {
        Args: {
          material_id: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
