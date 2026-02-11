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
      branch_taxes: {
        Row: {
          apply_on: string
          branch_id: string
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          tax_name: string
          tax_type: string
          value: number
        }
        Insert: {
          apply_on?: string
          branch_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          tax_name: string
          tax_type?: string
          value?: number
        }
        Update: {
          apply_on?: string
          branch_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          tax_name?: string
          tax_type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "branch_taxes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          branch_code: string | null
          created_at: string
          currency: string
          currency_symbol: string
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          name_ur: string | null
          order_types: string[]
          pricing_mode: string
          rounding_rule: string
          sales_channel_ids: string[]
          updated_at: string
          vat_enabled: boolean
          vat_rate: number
        }
        Insert: {
          address?: string | null
          branch_code?: string | null
          created_at?: string
          currency?: string
          currency_symbol?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          name_ur?: string | null
          order_types?: string[]
          pricing_mode?: string
          rounding_rule?: string
          sales_channel_ids?: string[]
          updated_at?: string
          vat_enabled?: boolean
          vat_rate?: number
        }
        Update: {
          address?: string | null
          branch_code?: string | null
          created_at?: string
          currency?: string
          currency_symbol?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          name_ur?: string | null
          order_types?: string[]
          pricing_mode?: string
          rounding_rule?: string
          sales_channel_ids?: string[]
          updated_at?: string
          vat_enabled?: boolean
          vat_rate?: number
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
      ingredients: {
        Row: {
          cost_per_unit: number
          created_at: string
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          cost_per_unit?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      item_ingredients: {
        Row: {
          can_add_extra: boolean
          can_remove: boolean
          created_at: string
          extra_cost: number | null
          id: string
          ingredient_id: string
          item_id: string
          quantity: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          can_add_extra?: boolean
          can_remove?: boolean
          created_at?: string
          extra_cost?: number | null
          id?: string
          ingredient_id: string
          item_id: string
          quantity?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          can_add_extra?: boolean
          can_remove?: boolean
          created_at?: string
          extra_cost?: number | null
          id?: string
          ingredient_id?: string
          item_id?: string
          quantity?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_sub_items: {
        Row: {
          can_remove: boolean
          created_at: string
          id: string
          is_default: boolean
          item_id: string
          quantity: number
          replacement_price: number
          sort_order: number
          sub_item_id: string
          updated_at: string
        }
        Insert: {
          can_remove?: boolean
          created_at?: string
          id?: string
          is_default?: boolean
          item_id: string
          quantity?: number
          replacement_price?: number
          sort_order?: number
          sub_item_id: string
          updated_at?: string
        }
        Update: {
          can_remove?: boolean
          created_at?: string
          id?: string
          is_default?: boolean
          item_id?: string
          quantity?: number
          replacement_price?: number
          sort_order?: number
          sub_item_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_sub_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_sub_items_sub_item_id_fkey"
            columns: ["sub_item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
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
      items: {
        Row: {
          base_cost: number
          category_id: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_ur: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_combo: boolean
          is_customizable: boolean
          is_favorite: boolean
          item_type: string | null
          name_ar: string | null
          name_en: string
          name_ur: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          base_cost?: number
          category_id?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_ur?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_combo?: boolean
          is_customizable?: boolean
          is_favorite?: boolean
          item_type?: string | null
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          base_cost?: number
          category_id?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_ur?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_combo?: boolean
          is_customizable?: boolean
          is_favorite?: boolean
          item_type?: string | null
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maintenance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kds_item_status: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          is_completed: boolean
          order_item_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          order_item_id: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          order_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kds_item_status_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kds_item_status_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "pos_order_items"
            referencedColumns: ["id"]
          },
        ]
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
      maintenance_emp_types: {
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
      permissions: {
        Row: {
          code: string
          description: string | null
          group_name: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          description?: string | null
          group_name: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          description?: string | null
          group_name?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      pos_item_ingredients: {
        Row: {
          created_at: string
          extra_price: number | null
          id: string
          ingredient_name_ar: string | null
          ingredient_name_en: string
          ingredient_name_ur: string | null
          is_default_included: boolean | null
          is_removable: boolean | null
          menu_item_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          extra_price?: number | null
          id?: string
          ingredient_name_ar?: string | null
          ingredient_name_en: string
          ingredient_name_ur?: string | null
          is_default_included?: boolean | null
          is_removable?: boolean | null
          menu_item_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          extra_price?: number | null
          id?: string
          ingredient_name_ar?: string | null
          ingredient_name_en?: string
          ingredient_name_ur?: string | null
          is_default_included?: boolean | null
          is_removable?: boolean | null
          menu_item_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_item_ingredients_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "pos_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_item_replacements: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          menu_item_id: string
          price_difference: number | null
          replacement_group: string
          replacement_name_ar: string | null
          replacement_name_en: string
          replacement_name_ur: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          menu_item_id: string
          price_difference?: number | null
          replacement_group: string
          replacement_name_ar?: string | null
          replacement_name_en: string
          replacement_name_ur?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          menu_item_id?: string
          price_difference?: number | null
          replacement_group?: string
          replacement_name_ar?: string | null
          replacement_name_en?: string
          replacement_name_ur?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_item_replacements_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "pos_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_menu_items: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string
          description_en: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_customizable: boolean | null
          is_favorite: boolean | null
          name_ar: string | null
          name_en: string
          name_ur: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_customizable?: boolean | null
          is_favorite?: boolean | null
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_customizable?: boolean | null
          is_favorite?: boolean | null
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maintenance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_order_audit_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          order_id: string
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          order_id: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          order_id?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_order_audit_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "pos_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_order_items: {
        Row: {
          created_at: string
          customization_hash: string | null
          customization_json: Json | null
          id: string
          item_name: string
          line_total: number
          menu_item_id: string | null
          order_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          customization_hash?: string | null
          customization_json?: Json | null
          id?: string
          item_name: string
          line_total: number
          menu_item_id?: string | null
          order_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          customization_hash?: string | null
          customization_json?: Json | null
          id?: string
          item_name?: string
          line_total?: number
          menu_item_id?: string | null
          order_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "pos_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_orders: {
        Row: {
          branch_id: string | null
          cancel_reason: string | null
          cancelled_at: string | null
          change_amount: number | null
          created_at: string
          customer_mobile: string | null
          customer_name: string | null
          delivery_address: string | null
          id: string
          notes: string | null
          order_number: number
          order_type: string
          payment_method: string | null
          payment_status: string
          subtotal: number
          taken_by: string | null
          tendered_amount: number | null
          total_amount: number
          updated_at: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          branch_id?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          change_amount?: number | null
          created_at?: string
          customer_mobile?: string | null
          customer_name?: string | null
          delivery_address?: string | null
          id?: string
          notes?: string | null
          order_number?: number
          order_type: string
          payment_method?: string | null
          payment_status?: string
          subtotal: number
          taken_by?: string | null
          tendered_amount?: number | null
          total_amount: number
          updated_at?: string
          vat_amount: number
          vat_rate?: number
        }
        Update: {
          branch_id?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          change_amount?: number | null
          created_at?: string
          customer_mobile?: string | null
          customer_name?: string | null
          delivery_address?: string | null
          id?: string
          notes?: string | null
          order_number?: number
          order_type?: string
          payment_method?: string | null
          payment_status?: string
          subtotal?: number
          taken_by?: string | null
          tendered_amount?: number | null
          total_amount?: number
          updated_at?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_orders_taken_by_fkey"
            columns: ["taken_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          default_language: string
          emp_type_id: string | null
          employee_code: string | null
          force_password_change: boolean
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          national_id: string | null
          national_id_expiry: string | null
          nationality: string | null
          passport_expiry: string | null
          passport_number: string | null
          phone: string | null
          profile_image: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          default_language?: string
          emp_type_id?: string | null
          employee_code?: string | null
          force_password_change?: boolean
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          national_id?: string | null
          national_id_expiry?: string | null
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          default_language?: string
          emp_type_id?: string | null
          employee_code?: string | null
          force_password_change?: boolean
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          national_id?: string | null
          national_id_expiry?: string | null
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_emp_type_id_fkey"
            columns: ["emp_type_id"]
            isOneToOne: false
            referencedRelation: "maintenance_emp_types"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_channels: {
        Row: {
          code: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string | null
          name_en: string
          name_ur: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en: string
          name_ur?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_en?: string
          name_ur?: string | null
          updated_at?: string
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
      user_activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string | null
          target_user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          target_user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          target_user_id?: string
        }
        Relationships: []
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
          role_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          role_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          role_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_shifts: {
        Row: {
          branch_id: string | null
          created_at: string
          created_by: string | null
          end_datetime: string
          id: string
          is_recurring: boolean
          recurring_days: string[] | null
          start_datetime: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          created_by?: string | null
          end_datetime: string
          id?: string
          is_recurring?: boolean
          recurring_days?: string[] | null
          start_datetime: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          created_by?: string | null
          end_datetime?: string
          id?: string
          is_recurring?: boolean
          recurring_days?: string[] | null
          start_datetime?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_shifts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "manager" | "cashier" | "waiter" | "kitchen" | "kiosk"
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
      app_role: ["admin", "manager", "cashier", "waiter", "kitchen", "kiosk"],
    },
  },
} as const
