// Supabase Database Types
// Generated types for type-safe database operations

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
      employees: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          role: "admin" | "analyst" | "technician" | "manager";
          initials: string;
          photo: string | null;
          signature: string | null;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          role: "admin" | "analyst" | "technician" | "manager";
          initials: string;
          photo?: string | null;
          signature?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          role?: "admin" | "analyst" | "technician" | "manager";
          initials?: string;
          photo?: string | null;
          signature?: string | null;
          status?: "active" | "inactive";
          updated_at?: string;
        };
      };
      container_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: "external" | "internal";
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: "external" | "internal";
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: "external" | "internal";
          status?: "active" | "inactive";
          updated_at?: string;
        };
      };
      sample_names: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          category: string | null;
          description: string | null;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          category?: string | null;
          description?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string | null;
          category?: string | null;
          description?: string | null;
          status?: "active" | "inactive";
          updated_at?: string;
        };
      };
      storage_locations: {
        Row: {
          id: string;
          name: string;
          type: "store" | "fridge" | "freezer" | "room";
          code: string | null;
          capacity: number | null;
          temperature: string | null;
          description: string | null;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "store" | "fridge" | "freezer" | "room";
          code?: string | null;
          capacity?: number | null;
          temperature?: string | null;
          description?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "store" | "fridge" | "freezer" | "room";
          code?: string | null;
          capacity?: number | null;
          temperature?: string | null;
          description?: string | null;
          status?: "active" | "inactive";
          updated_at?: string;
        };
      };
      sample_colors: {
        Row: {
          id: string;
          name: string;
          hex_code: string;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          hex_code: string;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          hex_code?: string;
          status?: "active" | "inactive";
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          ref_number: string;
          employee_id: string;
          report_date: string;
          sender_shop: string | null;
          barcode_number: string | null;
          produced_date: string | null;
          expired_date: string | null;
          report_number: string;
          pdf_url: string | null;
          word_url: string | null;
          status: "pending" | "completed" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ref_number: string;
          employee_id: string;
          report_date: string;
          sender_shop?: string | null;
          barcode_number?: string | null;
          produced_date?: string | null;
          expired_date?: string | null;
          report_number?: string;
          pdf_url?: string | null;
          word_url?: string | null;
          status?: "pending" | "completed" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ref_number?: string;
          employee_id?: string;
          report_date?: string;
          sender_shop?: string | null;
          barcode_number?: string | null;
          produced_date?: string | null;
          expired_date?: string | null;
          report_number?: string;
          pdf_url?: string | null;
          word_url?: string | null;
          status?: "pending" | "completed" | "archived";
          updated_at?: string;
        };
      };
      report_samples: {
        Row: {
          id: string;
          report_id: string;
          sample_number: string | null;
          sample_name_id: string | null;
          sample_name: string | null;
          internal_container_count: number | null;
          internal_container_type: string | null;
          net_weight: number | null;
          weight_unit: "gram" | "kg" | null;
          pure_or_total: "pure" | "total" | null;
          weight_used: number | null;
          color_code: string | null;
          storage_location_id: string | null;
          storage_location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          sample_number?: string | null;
          sample_name_id?: string | null;
          sample_name?: string | null;
          internal_container_count?: number | null;
          internal_container_type?: string | null;
          net_weight?: number | null;
          weight_unit?: "gram" | "kg" | null;
          pure_or_total?: "pure" | "total" | null;
          weight_used?: number | null;
          color_code?: string | null;
          storage_location_id?: string | null;
          storage_location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          sample_number?: string | null;
          sample_name_id?: string | null;
          sample_name?: string | null;
          internal_container_count?: number | null;
          internal_container_type?: string | null;
          net_weight?: number | null;
          weight_unit?: "gram" | "kg" | null;
          pure_or_total?: "pure" | "total" | null;
          weight_used?: number | null;
          color_code?: string | null;
          storage_location_id?: string | null;
          storage_location?: string | null;
          updated_at?: string;
        };
      };
      report_external_containers: {
        Row: {
          id: string;
          report_id: string;
          container_type_id: string | null;
          container_name: string | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          container_type_id?: string | null;
          container_name?: string | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          container_type_id?: string | null;
          container_name?: string | null;
          quantity?: number;
        };
      };
      report_internal_containers: {
        Row: {
          id: string;
          report_id: string;
          container_type_id: string | null;
          container_name: string | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          container_type_id?: string | null;
          container_name?: string | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          container_type_id?: string | null;
          container_name?: string | null;
          quantity?: number;
        };
      };
    };
  };
}
