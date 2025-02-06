export interface Database {
  public: {
    Tables: {
      user: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user"]["Row"], "created_at" | "updated_at">;
      };
      favorite: {
        Row: {
          id: string;
          user_id: string;
          coin_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["favorite"]["Row"], "id" | "created_at" | "updated_at">;
      };
      // Другие таблицы...
    };
  };
} 