// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  handleSupabaseError,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Role = Database["public"]["Tables"]["roles"]["Row"];
type ContainerType = Database["public"]["Tables"]["container_types"]["Row"];
type SampleName = Database["public"]["Tables"]["sample_names"]["Row"];
type StorageLocation = Database["public"]["Tables"]["storage_locations"]["Row"];

interface UseDataResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (
    item: any
  ) => Promise<{ success: boolean; error?: string; data?: T }>;
  update: (
    id: string,
    updates: any
  ) => Promise<{ success: boolean; error?: string }>;
  remove: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useEmployees(): UseDataResult<Employee> {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      const { data: employees, error: fetchError } = await supabase
        .from("employees")
        .select(
          `
          *,
          roles:role_id (
            id,
            name,
            description
          )
        `
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setData(employees || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (
    item: Database["public"]["Tables"]["employees"]["Insert"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { data: newEmployee, error: createError } = await supabase
        .from("employees")
        .insert([item])
        .select()
        .single();

      if (createError) throw createError;

      await fetchData();
      return { success: true, data: newEmployee };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (
    id: string,
    updates: Database["public"]["Tables"]["employees"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}

export function useRoles(): UseDataResult<Role> {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      const { data: roles, error: fetchError } = await supabase
        .from("roles")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(roles || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (
    item: Database["public"]["Tables"]["roles"]["Insert"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { data: newRole, error: createError } = await supabase
        .from("roles")
        .insert([item])
        .select()
        .single();

      if (createError) throw createError;

      await fetchData();
      return { success: true, data: newRole };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (
    id: string,
    updates: Database["public"]["Tables"]["roles"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("roles")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("roles")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}

export function useContainerTypes(): UseDataResult<ContainerType> {
  const [data, setData] = useState<ContainerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      const { data: containers, error: fetchError } = await supabase
        .from("container_types")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(containers || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (
    item: Database["public"]["Tables"]["container_types"]["Insert"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { data: newContainer, error: createError } = await supabase
        .from("container_types")
        .insert([item])
        .select()
        .single();

      if (createError) throw createError;

      await fetchData();
      return { success: true, data: newContainer };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (
    id: string,
    updates: Database["public"]["Tables"]["container_types"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("container_types")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("container_types")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}

export function useSampleNames(): UseDataResult<SampleName> {
  const [data, setData] = useState<SampleName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      const { data: samples, error: fetchError } = await supabase
        .from("sample_names")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(samples || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (
    item: Database["public"]["Tables"]["sample_names"]["Insert"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { data: newSample, error: createError } = await supabase
        .from("sample_names")
        .insert([item])
        .select()
        .single();

      if (createError) throw createError;

      await fetchData();
      return { success: true, data: newSample };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (
    id: string,
    updates: Database["public"]["Tables"]["sample_names"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("sample_names")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("sample_names")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}

export function useStorageLocations(): UseDataResult<StorageLocation> {
  const [data, setData] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      const { data: locations, error: fetchError } = await supabase
        .from("storage_locations")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(locations || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (
    item: Database["public"]["Tables"]["storage_locations"]["Insert"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { data: newLocation, error: createError } = await supabase
        .from("storage_locations")
        .insert([item])
        .select()
        .single();

      if (createError) throw createError;

      await fetchData();
      return { success: true, data: newLocation };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (
    id: string,
    updates: Database["public"]["Tables"]["storage_locations"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("storage_locations")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("storage_locations")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}

export function useSenderShops(): UseDataResult<
  Database["public"]["Tables"]["sender_shops"]["Row"]
> {
  const [data, setData] = useState<
    Database["public"]["Tables"]["sender_shops"]["Row"][]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      const { data: senderShops, error: fetchError } = await supabase
        .from("sender_shops")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(senderShops || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (
    item: Database["public"]["Tables"]["sender_shops"]["Insert"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { data: newSenderShop, error: createError } = await supabase
        .from("sender_shops")
        .insert([item])
        .select()
        .single();

      if (createError) throw createError;

      await fetchData();
      return { success: true, data: newSenderShop };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const update = async (
    id: string,
    updates: Database["public"]["Tables"]["sender_shops"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("sender_shops")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("sender_shops")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}
