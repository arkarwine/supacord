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
      chats: {
        Row: {
          created_at: string
          id: string
          last_message_id: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_id?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_chats_last_message_id_fkey"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          chat_id: string
          created_at: string
          receiver_user_id: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          receiver_user_id?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          receiver_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "get_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_members_receiver_user_id_fkey"
            columns: ["receiver_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          created_at: string
          deleted: boolean
          id: number
          receiver_id: string | null
          reply_to_message_id: number | null
          sender_id: string
          start: boolean | null
          text: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          deleted?: boolean
          id?: number
          receiver_id?: string | null
          reply_to_message_id?: number | null
          sender_id?: string
          start?: boolean | null
          text: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          deleted?: boolean
          id?: number
          receiver_id?: string | null
          reply_to_message_id?: number | null
          sender_id?: string
          start?: boolean | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "get_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string | null
          username: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name?: string | null
          username: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      get_chats: {
        Row: {
          id: string | null
          last_message: Database["public"]["Tables"]["messages"]["Row"] | null
          user: Database["public"]["Tables"]["profiles"]["Row"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_private_chat: {
        Args: {
          receiver_user_id: string
        }
        Returns: {
          created_at: string
          id: string
          last_message_id: number | null
        }
      }
      delete_message: {
        Args: {
          message_id: number
          chat_id: string
        }
        Returns: boolean
      }
      get_messages: {
        Args: {
          chat_id: string
        }
        Returns: {
          chat_id: string
          created_at: string
          deleted: boolean
          id: number
          receiver_id: string | null
          reply_to_message_id: number | null
          sender_id: string
          start: boolean | null
          text: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
