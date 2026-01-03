import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  handleSupabaseError,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Color = Database["public"]["Tables"]["sample_colors"]["Row"];
type ColorInsert = Database["public"]["Tables"]["sample_colors"]["Insert"];
type ColorUpdate = Database["public"]["Tables"]["sample_colors"]["Update"];

export function useColors() {
  const [data, setData] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Please check your environment variables."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: colorsData, error: fetchError } = await supabase
        .from("sample_colors")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;

      setData(colorsData || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const create = async (
    colorData: Omit<ColorInsert, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { error: createError } = await supabase
        .from("sample_colors")
        // @ts-ignore - Supabase type inference issue
        .insert([{ ...colorData, status: "active" }]);

      if (createError) throw createError;

      await fetchColors();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (id: string, updates: ColorUpdate) => {
    try {
      const { error: updateError } = await supabase
        .from("sample_colors")
        // @ts-ignore - Supabase type inference issue
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchColors();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("sample_colors")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchColors();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchColors,
    create,
    update,
    remove,
  };
}
