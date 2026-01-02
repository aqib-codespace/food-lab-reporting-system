// @ts-nocheck - Supabase type inference issues
import { supabase } from "./client";

const REPORT_BUCKET = "report-files";

export async function uploadReportFile(
  file: File,
  reportRefNumber: string,
  fileType: "pdf" | "word"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExtension = fileType === "pdf" ? "pdf" : "docx";
    const fileName = `${reportRefNumber}.${fileExtension}`;
    const filePath = `reports/${reportRefNumber}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(REPORT_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error("File upload error:", error);
      return { success: false, error: error.message };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from(REPORT_BUCKET).getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function uploadGeneratedPDF(
  reportId: string,
  reportRefNumber: string,
  pdfBlob: Blob
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileName = `${reportRefNumber}.pdf`;
    const filePath = `reports/${reportRefNumber}/${fileName}`;
    const { data, error } = await supabase.storage
      .from(REPORT_BUCKET)
      .upload(filePath, pdfBlob, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("PDF upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(REPORT_BUCKET).getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("reports")
      .update({ pdf_url: publicUrl } as any)
      .eq("id", reportId);

    if (updateError) {
      console.error("Failed to update report with PDF URL:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Unexpected PDF upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function uploadGeneratedWord(
  reportId: string,
  reportRefNumber: string,
  wordBlob: Blob
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileName = `${reportRefNumber}.docx`;
    const filePath = `reports/${reportRefNumber}/${fileName}`;

    // Upload Word document to storage
    const { data, error } = await supabase.storage
      .from(REPORT_BUCKET)
      .upload(filePath, wordBlob, {
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Word upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(REPORT_BUCKET).getPublicUrl(filePath);

    // Update report with Word URL
    // @ts-ignore - Supabase type inference issue
    const { error: updateError } = await supabase
      .from("reports")
      .update({ pdf_url: publicUrl })
      .eq("id", reportId);

    if (updateError) {
      console.error("Failed to update report with Word URL:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Unexpected Word upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function deleteReportFile(
  reportRefNumber: string,
  fileType: "pdf" | "word"
): Promise<{ success: boolean; error?: string }> {
  try {
    const fileExtension = fileType === "pdf" ? "pdf" : "docx";
    const fileName = `${reportRefNumber}.${fileExtension}`;
    const filePath = `reports/${reportRefNumber}/${fileName}`;

    const { error } = await supabase.storage
      .from(REPORT_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("File deletion error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected deletion error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function downloadReportFile(
  reportRefNumber: string,
  fileType: "pdf" | "word"
): Promise<{ success: boolean; blob?: Blob; error?: string }> {
  try {
    const fileExtension = fileType === "pdf" ? "pdf" : "docx";
    const fileName = `${reportRefNumber}.${fileExtension}`;
    const filePath = `reports/${reportRefNumber}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(REPORT_BUCKET)
      .download(filePath);

    if (error) {
      console.error("File download error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, blob: data };
  } catch (err) {
    console.error("Unexpected download error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function reportFileExists(
  reportRefNumber: string,
  fileType: "pdf" | "word"
): Promise<boolean> {
  try {
    const fileExtension = fileType === "pdf" ? "pdf" : "docx";
    const fileName = `${reportRefNumber}.${fileExtension}`;
    const filePath = `reports/${reportRefNumber}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(REPORT_BUCKET)
      .list(`reports/${reportRefNumber}`, {
        search: fileName,
      });

    if (error) {
      console.error("File check error:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.error("Unexpected file check error:", err);
    return false;
  }
}

export function getReportFileUrl(
  reportRefNumber: string,
  fileType: "pdf" | "word"
): string {
  const fileExtension = fileType === "pdf" ? "pdf" : "docx";
  const fileName = `${reportRefNumber}.${fileExtension}`;
  const filePath = `reports/${reportRefNumber}/${fileName}`;

  const {
    data: { publicUrl },
  } = supabase.storage.from(REPORT_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

export async function updateReportFileUrls(
  reportId: string,
  pdfUrl?: string,
  wordUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const updates: { pdf_url?: string; word_url?: string } = {};

    if (pdfUrl) updates.pdf_url = pdfUrl;
    if (wordUrl) updates.word_url = wordUrl;

    if (Object.keys(updates).length === 0) {
      return { success: false, error: "No URLs provided to update" };
    }

    // @ts-ignore - Supabase type inference issue
    const { error } = await supabase
      .from("reports")
      .update(updates)
      .eq("id", reportId);

    if (error) {
      console.error("Failed to update report file URLs:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected update error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
