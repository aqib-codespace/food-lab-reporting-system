import { supabase } from "./client";

const EMPLOYEE_BUCKET = "employee-files";

export async function uploadEmployeePhoto(
  file: File,
  employeeId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${employeeId}-photo.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from(EMPLOYEE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Photo upload error:", error);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(EMPLOYEE_BUCKET).getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function uploadEmployeeSignature(
  file: File,
  employeeId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${employeeId}-signature.${fileExt}`;
    const filePath = `signatures/${fileName}`;

    const { data, error } = await supabase.storage
      .from(EMPLOYEE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Signature upload error:", error);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(EMPLOYEE_BUCKET).getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function deleteEmployeePhoto(
  employeeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from(EMPLOYEE_BUCKET)
      .list("photos", {
        search: `${employeeId}-photo`,
      });

    if (listError) throw listError;

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `photos/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from(EMPLOYEE_BUCKET)
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }

    return { success: true };
  } catch (err) {
    console.error("Delete photo error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function deleteEmployeeSignature(
  employeeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from(EMPLOYEE_BUCKET)
      .list("signatures", {
        search: `${employeeId}-signature`,
      });

    if (listError) throw listError;

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `signatures/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from(EMPLOYEE_BUCKET)
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }

    return { success: true };
  } catch (err) {
    console.error("Delete signature error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

// Sample image helpers - reuse employee bucket per request
export async function uploadSampleImage(
  file: File,
  sampleIdOrName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const safeName = sampleIdOrName.replace(/[^a-z0-9-_]/gi, "_").toLowerCase();
    const fileName = `${safeName}-image.${fileExt}`;
    const filePath = `samples/${fileName}`;

    const { data, error } = await supabase.storage
      .from(EMPLOYEE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Sample upload error:", error);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(EMPLOYEE_BUCKET).getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Unexpected sample upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function deleteSampleImage(
  sampleIdOrName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const safeName = sampleIdOrName.replace(/[^a-z0-9-_]/gi, "_").toLowerCase();
    const { data: files, error: listError } = await supabase.storage
      .from(EMPLOYEE_BUCKET)
      .list("samples", {
        search: `${safeName}-image`,
      });

    if (listError) throw listError;

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `samples/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from(EMPLOYEE_BUCKET)
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }

    return { success: true };
  } catch (err) {
    console.error("Delete sample image error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
