"use client";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "rizzui";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { ReportPreview } from "@/components/report/ReportPreview";

export default function ReportDetailPage() {
  const t = useTranslations("reportDetail");
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const report = useAppSelector((state) =>
    state.reports.reports.find((r) => r.id === reportId)
  );

  if (!params || !reportId || !report) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("notFound")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("notFoundMessage")}
            </p>
            <Button
              onClick={() => router.push("/reports")}
              className="bg-gray-800 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToReports")}
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
            onClick={() => router.push("/reports")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t("title")} #{report.refNumber}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("viewingDetails")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            {t("print")}
          </Button>
        </div>
      </div>

      <ReportPreview data={report} />
    </DashboardLayout>
  );
}
