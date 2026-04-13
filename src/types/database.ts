export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          call_count: number
          id: string
          user_id: string
          window_start: string
        }
        Insert: {
          call_count?: number
          id?: string
          user_id: string
          window_start?: string
        }
        Update: {
          call_count?: number
          id?: string
          user_id?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      historical: {
        Row: {
          cost: number
          created_at: string
          expense: number
          id: string
          income: number
          month: number
          user_id: string
          year: number
        }
        Insert: {
          cost?: number
          created_at?: string
          expense?: number
          id?: string
          income?: number
          month: number
          user_id: string
          year: number
        }
        Update: {
          cost?: number
          created_at?: string
          expense?: number
          id?: string
          income?: number
          month?: number
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "historical_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      occupancy: {
        Row: {
          created_at: string
          date: string
          id: string
          pct: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          pct: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          pct?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "occupancy_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          empresa: string | null
          id: string
          nombre: string
          plan: string
          telefono: string | null
          trial_used: boolean
          trial_used_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa?: string | null
          id: string
          nombre: string
          plan?: string
          telefono?: string | null
          trial_used?: boolean
          trial_used_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa?: string | null
          id?: string
          nombre?: string
          plan?: string
          telefono?: string | null
          trial_used?: boolean
          trial_used_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          concept: string
          created_at: string
          date: string
          id: string
          note: string | null
          period: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          concept: string
          created_at?: string
          date: string
          id?: string
          note?: string | null
          period?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          concept?: string
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          period?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          growth_rate: number
          last_forecast_q: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          growth_rate?: number
          last_forecast_q?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          growth_rate?: number
          last_forecast_q?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visitors: {
        Row: {
          count: number
          created_at: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          count: number
          created_at?: string
          date: string
          id?: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_max_calls?: number
          p_user_id: string
          p_window_seconds?: number
        }
        Returns: {
          allowed: boolean
          remaining: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
