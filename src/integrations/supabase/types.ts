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
      benefits: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          min_investment: number | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          min_investment?: number | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          min_investment?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      contributions: {
        Row: {
          amount_mxn: number
          amount_usd: number
          created_at: string
          financial_contract: string | null
          id: string
          network: string | null
          status: string
          tx_hash: string | null
          updated_at: string
          user_id: string
          vehicle: string
        }
        Insert: {
          amount_mxn: number
          amount_usd: number
          created_at?: string
          financial_contract?: string | null
          id?: string
          network?: string | null
          status?: string
          tx_hash?: string | null
          updated_at?: string
          user_id: string
          vehicle: string
        }
        Update: {
          amount_mxn?: number
          amount_usd?: number
          created_at?: string
          financial_contract?: string | null
          id?: string
          network?: string | null
          status?: string
          tx_hash?: string | null
          updated_at?: string
          user_id?: string
          vehicle?: string
        }
        Relationships: []
      }
      participations: {
        Row: {
          amount: number
          created_at: string
          estimated_return: number | null
          id: string
          notes: string | null
          scenario: Database["public"]["Enums"]["scenario_type"]
          status: Database["public"]["Enums"]["participation_status"]
          term_months: number
          type: Database["public"]["Enums"]["participation_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          estimated_return?: number | null
          id?: string
          notes?: string | null
          scenario?: Database["public"]["Enums"]["scenario_type"]
          status?: Database["public"]["Enums"]["participation_status"]
          term_months: number
          type: Database["public"]["Enums"]["participation_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          estimated_return?: number | null
          id?: string
          notes?: string | null
          scenario?: Database["public"]["Enums"]["scenario_type"]
          status?: Database["public"]["Enums"]["participation_status"]
          term_months?: number
          type?: Database["public"]["Enums"]["participation_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount_mxn: number
          amount_usd: number
          created_at: string
          id: string
          notes: string | null
          paid_at: string
          user_id: string
          vehicle: string
        }
        Insert: {
          amount_mxn: number
          amount_usd: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string
          user_id: string
          vehicle: string
        }
        Update: {
          amount_mxn?: number
          amount_usd?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string
          user_id?: string
          vehicle?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          deposit_address: string
          humberto_contact_email: string
          humberto_contact_whatsapp: string
          id: string
          terms_url: string
          updated_at: string
          urbanika_contact_email: string
          urbanika_contact_whatsapp: string
        }
        Insert: {
          deposit_address?: string
          humberto_contact_email?: string
          humberto_contact_whatsapp?: string
          id?: string
          terms_url?: string
          updated_at?: string
          urbanika_contact_email?: string
          urbanika_contact_whatsapp?: string
        }
        Update: {
          deposit_address?: string
          humberto_contact_email?: string
          humberto_contact_whatsapp?: string
          id?: string
          terms_url?: string
          updated_at?: string
          urbanika_contact_email?: string
          urbanika_contact_whatsapp?: string
        }
        Relationships: []
      }
      user_benefits: {
        Row: {
          benefit_name: string
          created_at: string
          id: string
          notes: string | null
          status: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          benefit_name: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          benefit_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      participation_status: "pending" | "active" | "closed"
      participation_type: "investment" | "loan"
      scenario_type: "conservative" | "base" | "optimistic"
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
      app_role: ["admin", "moderator", "user"],
      participation_status: ["pending", "active", "closed"],
      participation_type: ["investment", "loan"],
      scenario_type: ["conservative", "base", "optimistic"],
    },
  },
} as const
