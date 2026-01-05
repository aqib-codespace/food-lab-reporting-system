// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  handleSupabaseError,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Report = Database["public"]["Tables"]["reports"]["Row"];
type ReportSample = Database["public"]["Tables"]["report_samples"]["Row"];
type ReportExternalContainer =
  Database["public"]["Tables"]["report_external_containers"]["Row"];
type ReportInternalContainer =
  Database["public"]["Tables"]["report_internal_containers"]["Row"];

export interface ReportWithDetails extends Report {
  employee?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  opener?: {
    id: string;
    name: string;
  };
  examiner?: {
    id: string;
    name: string;
  };
  samples?: ReportSample[];
  external_containers?: ReportExternalContainer[];
  internal_containers?: ReportInternalContainer[];
}

export interface CreateReportData {
  report: Database["public"]["Tables"]["reports"]["Insert"];
  samples?: Database["public"]["Tables"]["report_samples"]["Insert"][];
  externalContainers?: Database["public"]["Tables"]["report_external_containers"]["Insert"][];
  internalContainers?: Database["public"]["Tables"]["report_internal_containers"]["Insert"][];
}

export function useReports() {
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
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

      const { data: reportsData, error: fetchError } = await supabase
        .from("reports")
        .select(
          `
          *,
          employees:employee_id (
            id,
            name,
            email,
            role
          ),
          opener:opener_id (
            id,
            name
          ),
          examiner:examiner_id (
            id,
            name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const transformedReports: ReportWithDetails[] =
        reportsData?.map((report: any) => ({
          ...report,
          employee: report.employees,
        })) || [];

      setReports(transformedReports);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getReportById = async (
    id: string
  ): Promise<ReportWithDetails | null> => {
    try {
      const { data: report, error: reportError } = await supabase
        .from("reports")
        .select(
          `
          *,
          employees:employee_id (
            id,
            name,
            email,
            role
          )
        `
        )
        .eq("id", id)
        .single();

      if (reportError) throw reportError;

      const { data: samples, error: samplesError } = await supabase
        .from("report_samples")
        .select("*")
        .eq("report_id", id);

      if (samplesError) throw samplesError;

      const { data: externalContainers, error: externalError } = await supabase
        .from("report_external_containers")
        .select("*")
        .eq("report_id", id);

      if (externalError) throw externalError;

      const { data: internalContainers, error: internalError } = await supabase
        .from("report_internal_containers")
        .select("*")
        .eq("report_id", id);

      if (internalError) throw internalError;

      // @ts-ignore - Supabase type inference issue
      return {
        ...report,
        employee: (report as any).employees,
        samples: samples || [],
        external_containers: externalContainers || [],
        internal_containers: internalContainers || [],
      };
    } catch (err) {
      console.error("Error fetching report:", err);
      return null;
    }
  };

  const createReport = async (reportData: CreateReportData) => {
    try {
      // Insert main report
      // @ts-ignore - Supabase type inference issue
      const { data: newReport, error: reportError } = await supabase
        .from("reports")
        .insert([reportData.report])
        .select()
        .single();

      if (reportError) throw reportError;

      const reportId = newReport.id;

      if (reportData.samples && reportData.samples.length > 0) {
        const samplesWithReportId = reportData.samples.map((sample) => ({
          ...sample,
          report_id: reportId,
        }));

        const { error: samplesError } = await supabase
          .from("report_samples")
          .insert(samplesWithReportId as any);

        if (samplesError) throw samplesError;
      }

      if (
        reportData.externalContainers &&
        reportData.externalContainers.length > 0
      ) {
        const containersWithReportId = reportData.externalContainers.map(
          (container) => ({
            ...container,
            report_id: reportId,
          })
        );

        const { error: externalError } = await supabase
          .from("report_external_containers")
          .insert(containersWithReportId as any);

        if (externalError) throw externalError;
      }

      if (
        reportData.internalContainers &&
        reportData.internalContainers.length > 0
      ) {
        const containersWithReportId = reportData.internalContainers.map(
          (container) => ({
            ...container,
            report_id: reportId,
          })
        );

        const { error: internalError } = await supabase
          .from("report_internal_containers")
          .insert(containersWithReportId as any);

        if (internalError) throw internalError;
      }

      await fetchReports();
      return { success: true, data: newReport };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const updateReport = async (
    id: string,
    updates: Database["public"]["Tables"]["reports"]["Update"]
  ) => {
    try {
      // @ts-ignore - Supabase type inference issue
      const { error: updateError } = await supabase
        .from("reports")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchReports();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchReports();
      return { success: true };
    } catch (err) {
      return { success: false, error: handleSupabaseError(err) };
    }
  };

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
  };
}
