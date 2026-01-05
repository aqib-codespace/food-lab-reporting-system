"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, Badge } from "rizzui";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  AlertTriangle,
  MoreVertical,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const router = useRouter();
  const { reports: allReports, loading, deleteReport } = useReports();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredReports = allReports.filter((report) =>
    report.ref_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewReport = (id: string) => {
    router.push(`/routes/examination-team/${id}`);
  };

  const handleDeleteReport = (id: string) => {
    setReportToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (reportToDelete) {
      try {
        await deleteReport(reportToDelete);
        toast({
          title: "Report Deleted",
          description: "The report has been successfully deleted.",
        });
        setDeleteDialogOpen(false);
        setReportToDelete(null);
      } catch (error) {
        console.error("Delete error:", error);
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: "Failed to delete the report. Please try again.",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            All Cases
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            View and manage all laboratory cases
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <Button className="gap-2 whitespace-nowrap bg-gray-800 rounded-lg  text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>

      <Card className="border-0 overflow-hidden flex flex-col min-h-[calc(100vh-280px)]">
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[100px] sm:w-auto">
                    Ref Number
                  </th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[110px] sm:w-auto">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[130px] sm:w-auto">
                    Opener Name
                  </th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[130px] sm:w-auto">
                    Examiner Name
                  </th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[80px] sm:w-auto">
                    Samples
                  </th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[100px] sm:w-auto">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 sm:py-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-xs sm:text-sm w-[100px] sm:w-auto">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {allReports.length === 0
                            ? "No reports yet. Create your first report to get started."
                            : "No reports match your search."}
                        </p>
                        {allReports.length === 0 && (
                          <Button
                            onClick={() => router.push("/routes/new-report")}
                            className="bg-gray-800 rounded-lg  text-white"
                          >
                            Create New Case
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className={cn(
                        "border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200",
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50/30 dark:bg-gray-900/50"
                      )}
                    >
                      <td className="py-3 px-4 sm:py-4 sm:px-6">
                        <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                          {report.ref_number}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 dark:text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                        {format(new Date(report.created_at), "MMM dd, yyyy")}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-900 dark:text-white font-medium text-xs sm:text-sm">
                        {report.opener?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-900 dark:text-white font-medium text-xs sm:text-sm">
                        {report.examiner?.name || (
                          <span className="text-gray-400 dark:text-gray-600 italic">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6">
                        <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                          {report.samples?.length || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6">
                        <Badge
                          variant="flat"
                          className={cn(
                            "font-medium text-xs px-2 sm:px-3",
                            report.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                              : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          )}
                        >
                          {report.status === "pending"
                            ? "Pending"
                            : "Completed"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6">
                        <div className="flex items-center justify-end relative">
                          <Button
                            variant="text"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === report.id ? null : report.id
                              );
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {openDropdown === report.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdown(null)}
                              />
                              <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewReport(report.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Case
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/routes/opening-team?edit=${report.id}`
                                    );
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Case
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteReport(report.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Case
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 mt-auto">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              Showing {filteredReports.length} of {allReports.length}
            </p>
            {filteredReports.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-gray-800 p-2 rounded-lg text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  1
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteDialogOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Case
                </h3>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 ml-15">
              Are you sure you want to delete this case? This action cannot be
              undone.
            </p>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                variant="outline"
                className="flex-1 border-gray-300 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 rounded-lg hover:bg-red-700 text-white border-0"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
