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
      // Defina suas tabelas aqui
      // Exemplo:
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string;
          // outros campos
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          name: string;
          // outros campos
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string;
          // outros campos
        };
      };
      // Adicione outras tabelas conforme necessário
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
