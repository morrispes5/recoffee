// Dihasilkan dari project Supabase `recoffee` (M4). Jangan diedit manual: generate ulang bila skema berubah.
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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string
          email: string
          nama: string | null
        }
        Insert: {
          created_at?: string
          email: string
          nama?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          nama?: string | null
        }
        Relationships: []
      }
      item_pesanan: {
        Row: {
          harga_satuan: number
          id: string
          menu_id: string
          nama_menu: string
          pesanan_id: string
          qty: number
        }
        Insert: {
          harga_satuan: number
          id?: string
          menu_id: string
          nama_menu: string
          pesanan_id: string
          qty: number
        }
        Update: {
          harga_satuan?: number
          id?: string
          menu_id?: string
          nama_menu?: string
          pesanan_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_pesanan_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_pesanan_pesanan_id_fkey"
            columns: ["pesanan_id"]
            isOneToOne: false
            referencedRelation: "pesanan"
            referencedColumns: ["id"]
          },
        ]
      }
      meja: {
        Row: {
          kapasitas: number
          nomor: number
        }
        Insert: {
          kapasitas?: number
          nomor: number
        }
        Update: {
          kapasitas?: number
          nomor?: number
        }
        Relationships: []
      }
      menu: {
        Row: {
          created_at: string
          deskripsi: string | null
          diarsipkan: boolean
          harga: number
          id: string
          kategori: Database["public"]["Enums"]["kategori_menu"]
          nama: string
          tersedia: boolean
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          diarsipkan?: boolean
          harga: number
          id?: string
          kategori: Database["public"]["Enums"]["kategori_menu"]
          nama: string
          tersedia?: boolean
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          diarsipkan?: boolean
          harga?: number
          id?: string
          kategori?: Database["public"]["Enums"]["kategori_menu"]
          nama?: string
          tersedia?: boolean
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      pelanggan: {
        Row: {
          created_at: string
          email: string
          id: string
          nama: string
          no_hp: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nama: string
          no_hp: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nama?: string
          no_hp?: string
          updated_at?: string
        }
        Relationships: []
      }
      pesanan: {
        Row: {
          catatan: string | null
          created_at: string
          id: string
          pelanggan_id: string
          sesi_id: string
          status: Database["public"]["Enums"]["status_pesanan"]
          updated_at: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          id?: string
          pelanggan_id: string
          sesi_id: string
          status?: Database["public"]["Enums"]["status_pesanan"]
          updated_at?: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          id?: string
          pelanggan_id?: string
          sesi_id?: string
          status?: Database["public"]["Enums"]["status_pesanan"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pesanan_pelanggan_id_fkey"
            columns: ["pelanggan_id"]
            isOneToOne: false
            referencedRelation: "pelanggan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pesanan_sesi_id_fkey"
            columns: ["sesi_id"]
            isOneToOne: false
            referencedRelation: "sesi_meja"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pesanan_sesi_id_fkey"
            columns: ["sesi_id"]
            isOneToOne: false
            referencedRelation: "v_status_meja"
            referencedColumns: ["sesi_id"]
          },
        ]
      }
      sesi_meja: {
        Row: {
          dibuka_at: string
          dikonfirmasi_oleh: string | null
          ditutup_at: string | null
          id: string
          metode_bayar: Database["public"]["Enums"]["metode_bayar"] | null
          minta_bill_at: string | null
          nomor_meja: number
          status: Database["public"]["Enums"]["status_sesi"]
          total_bayar: number | null
        }
        Insert: {
          dibuka_at?: string
          dikonfirmasi_oleh?: string | null
          ditutup_at?: string | null
          id?: string
          metode_bayar?: Database["public"]["Enums"]["metode_bayar"] | null
          minta_bill_at?: string | null
          nomor_meja: number
          status?: Database["public"]["Enums"]["status_sesi"]
          total_bayar?: number | null
        }
        Update: {
          dibuka_at?: string
          dikonfirmasi_oleh?: string | null
          ditutup_at?: string | null
          id?: string
          metode_bayar?: Database["public"]["Enums"]["metode_bayar"] | null
          minta_bill_at?: string | null
          nomor_meja?: number
          status?: Database["public"]["Enums"]["status_sesi"]
          total_bayar?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sesi_meja_dikonfirmasi_oleh_fk"
            columns: ["dikonfirmasi_oleh"]
            isOneToOne: false
            referencedRelation: "admin"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "sesi_meja_nomor_meja_fkey"
            columns: ["nomor_meja"]
            isOneToOne: false
            referencedRelation: "meja"
            referencedColumns: ["nomor"]
          },
          {
            foreignKeyName: "sesi_meja_nomor_meja_fkey"
            columns: ["nomor_meja"]
            isOneToOne: false
            referencedRelation: "v_status_meja"
            referencedColumns: ["nomor"]
          },
        ]
      }
    }
    Views: {
      v_status_meja: {
        Row: {
          dibuka_at: string | null
          kapasitas: number | null
          metode_bayar: Database["public"]["Enums"]["metode_bayar"] | null
          minta_bill_at: string | null
          nomor: number | null
          pesanan_belum_diantar: number | null
          sesi_id: string | null
          status: string | null
          total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      batalkan_sesi: { Args: { p_sesi_id: string }; Returns: undefined }
      buat_pesanan: {
        Args: { p_catatan?: string; p_items: Json; p_nomor_meja: number }
        Returns: string
      }
      get_status_terakhir_meja: {
        Args: { p_nomor_meja: number; p_sesi_id: string }
        Returns: Database["public"]["Enums"]["status_sesi"]
      }
      get_tagihan_meja: { Args: { p_nomor_meja: number }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      konfirmasi_bayar: {
        Args: {
          p_metode?: Database["public"]["Enums"]["metode_bayar"]
          p_sesi_id: string
        }
        Returns: undefined
      }
      minta_bill: {
        Args: {
          p_metode: Database["public"]["Enums"]["metode_bayar"]
          p_nomor_meja: number
        }
        Returns: undefined
      }
      simpan_profil: {
        Args: { p_nama: string; p_no_hp: string }
        Returns: undefined
      }
    }
    Enums: {
      kategori_menu: "kopi" | "non_kopi" | "makanan" | "camilan"
      metode_bayar: "qris" | "kasir"
      status_pesanan: "baru" | "diproses" | "diantar"
      status_sesi: "aktif" | "minta_bill" | "selesai" | "batal"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      kategori_menu: ["kopi", "non_kopi", "makanan", "camilan"],
      metode_bayar: ["qris", "kasir"],
      status_pesanan: ["baru", "diproses", "diantar"],
      status_sesi: ["aktif", "minta_bill", "selesai", "batal"],
    },
  },
} as const
