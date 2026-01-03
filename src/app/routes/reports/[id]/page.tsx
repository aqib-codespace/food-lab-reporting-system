"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button, Badge } from "rizzui";
import { ArrowLeft, Edit, CheckCircle, Download, FileText } from "lucide-react";
import { ReportPreview } from "@/components/report/ReportPreview";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateReportPDFBlob } from "@/lib/export/report-pdf";
import { generateReportWordBlob } from "@/lib/export/report-word";
import {
  uploadGeneratedPDF,
  uploadGeneratedWord,
} from "@/lib/supabase/storage";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Load report from Supabase
    const loadReport = async () => {
      if (!reportId) return;

      try {
        setLoading(true);

        // Fetch report
        const { data: reportData, error: reportError } = (await supabase
          .from("reports")
          .select(
            `
            *,
            employees:employee_id (
              id,
              name,
              email,
              role,
              photo,
              signature
            )
          `
          )
          .eq("id", reportId)
          .single()) as any;

        if (reportError) throw reportError;

        // Fetch samples
        const { data: samples, error: samplesError } = await supabase
          .from("report_samples")
          .select("*")
          .eq("report_id", reportId);

        if (samplesError) throw samplesError;

        // Fetch external containers
        const { data: externalContainers, error: externalError } =
          await supabase
            .from("report_external_containers")
            .select("*")
            .eq("report_id", reportId);

        if (externalError) throw externalError;

        // Fetch internal containers
        const { data: internalContainers, error: internalError } =
          await supabase
            .from("report_internal_containers")
            .select("*")
            .eq("report_id", reportId);

        if (internalError) throw internalError;

        // Combine data
        const fullReport = {
          ...reportData,
          employee: reportData.employees,
          samples: samples || [],
          external_containers: externalContainers || [],
          internal_containers: internalContainers || [],
        };

        setReport(fullReport);
      } catch (error) {
        console.error("Error loading report:", error);
        toast({
          title: "Error",
          description: "Failed to load report. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  const handleCompleteReport = async () => {
    if (!report) return;

    setIsCompleting(true);
    try {
      toast({
        title: "Completing Report",
        description: "Marking report as completed and regenerating files...",
      });

      // Prepare report data for file generation
      const reportData = {
        id: report.id,
        refNumber: report.ref_number,
        reportNumber: report.report_number,
        date: report.report_date,
        employee: report.employee,
        senderShop: report.sender_shop,
        barcodeNumber: report.barcode_number,
        producedDate: report.produced_date,
        expiredDate: report.expired_date,
        externalContainers: report.external_containers || [],
        internalContainers: report.internal_containers || [],
        samples: report.samples || [],
        status: "completed" as const,
      };

      // Regenerate PDF and Word files
      const pdfBlob = await generateReportPDFBlob(reportData);
      const wordBlob = await generateReportWordBlob(reportData);

      // Upload to Supabase
      await uploadGeneratedPDF(report.id, report.ref_number, pdfBlob);
      await uploadGeneratedWord(report.id, report.ref_number, wordBlob);

      // Update report status directly
      const { error: updateError } = await (supabase as any)
        .from("reports")
        .update({ status: "completed" })
        .eq("id", report.id);

      if (updateError) throw updateError;

      toast({
        title: "Report Completed",
        description:
          "Report has been marked as completed and files regenerated.",
      });

      // Reload report data
      setReport({ ...report, status: "completed" });
    } catch (error) {
      console.error("Error completing report:", error);
      toast({
        title: "Error",
        description: "Failed to complete report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEditReport = () => {
    // Navigate to edit page with report ID
    router.push(`/routes/new-report?edit=${reportId}`);
  };

  if (!params || !reportId || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading report...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Report Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The report you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/routes/reports")}
              className="bg-gray-800 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/routes/reports")}
            className="gap-2 rounded-lg border"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Report #{report.ref_number}
              </h1>
              <Badge
                variant="flat"
                className={
                  report.status === "pending"
                    ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                    : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                }
              >
                {report.status === "pending" ? "Pending" : "Completed"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {report.status === "pending"
                ? "Initial data collection complete. Awaiting final analysis."
                : "Analysis complete and finalized."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {report.status === "pending" && (
            <>
              <Button
                variant="outline"
                onClick={handleEditReport}
                className="gap-2 rounded-lg border"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={handleCompleteReport}
                disabled={isCompleting}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                {isCompleting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </>
                )}
              </Button>
            </>
          )}
          {report.status === "completed" && (
            <div className="flex gap-2">
              {report.pdf_url && (
                <Button
                  onClick={() => window.open(report.pdf_url, "_blank")}
                  variant="outline"
                  className="gap-2 rounded-lg border"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              )}
              {report.word_url && (
                <Button
                  onClick={() => window.open(report.word_url, "_blank")}
                  variant="outline"
                  className="gap-2 rounded-lg border"
                >
                  <FileText className="w-4 h-4" />
                  Word
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <ReportPreview data={report} />
    </DashboardLayout>
  );
}
