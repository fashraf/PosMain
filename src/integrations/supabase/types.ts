export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allergens: {
        Row: {
          created_at: string
          icon_class: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          severity: Database["public"]["Enums"]["allergen_severity"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          severity?: Database["public"]["Enums"]["allergen_severity"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          severity?: Database["public"]["Enums"]["allergen_severity"]
          updated_at?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      classification_types: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ingredient_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      item_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_class: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_subcategories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          parent_category_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          parent_category_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          parent_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_subcategories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "maintenance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      serving_times: {
        Row: {
          created_at: string
          icon_class: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          sort_order: number | null
          time_range: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          sort_order?: number | null
          time_range?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          sort_order?: number | null
          time_range?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      storage_types: {
        Row: {
          created_at: string
          icon_class: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          temp_range: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          temp_range?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_class?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          temp_range?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          base_unit_id: string | null
          conversion_factor: number | null
          created_at: string
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          base_unit_id?: string | null
          conversion_factor?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          base_unit_id?: string | null
          conversion_factor?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_base_unit_id_fkey"
            columns: ["base_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_branches: {
        Row: {
          branch_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_branches_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_branch_access: {
        Args: { _branch_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      allergen_severity: "low" | "medium" | "high"
      app_role: "admin" | "manager" | "cashier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allergen_severity: ["low", "medium", "high"],
      app_role: ["admin", "manager", "cashier"],
    },
  },
} as const
