"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Badge } from "rizzui";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
  Calendar,
  User,
  Package,
  Mail,
  Phone,
  FileDown,
} from "lucide-react";
import {
  ReportData,
  Sample,
  ContainerEntry,
  SENDER_SHOPS,
  COLOR_OPTIONS,
} from "@/types/report";
import {
  useEmployees,
  useContainerTypes,
  useSampleNames,
} from "@/hooks/useSupabaseData";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase/client";
import { ReportPreview } from "@/components/report/ReportPreview";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { reportSchema } from "@/lib/validations/report.schema";
import { generateReportPDFBlob } from "@/lib/export/report-pdf";
import { generateReportWordBlob } from "@/lib/export/report-word";
import {
  uploadGeneratedPDF,
  uploadGeneratedWord,
} from "@/lib/supabase/storage";
import { useRouter } from "next/navigation";

const generateId = () => Math.random().toString(36).substr(2, 9);

const getDefaultSample = (index: number, defaultColor?: string): Sample => ({
  id: generateId(),
  sampleNumber: `S${index + 1}`,
  sampleName: "",
  internalContainerCount: 1,
  internalContainerType: "",
  netWeight: 0,
  weightUnit: "gram",
  pureOrTotal: "pure",
  weightUsed: 0,
  colorCode: defaultColor || "#ef4444",
  storageLocation: "",
});

const getDefaultContainer = (): ContainerEntry => ({
  id: generateId(),
  quantity: 1,
  type: "",
});

export default function NewReport() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const { data: employees, loading: employeesLoading } = useEmployees();
  const { data: containerTypes, loading: containerTypesLoading } =
    useContainerTypes();
  const { data: sampleNames, loading: sampleNamesLoading } = useSampleNames();
  const { data: allColors, loading: colorsLoading } = useColors();

  const activeColors = allColors.filter(
    (color: any) => color.status === "active"
  );

  const STORAGE_LOCATION_OPTIONS = [
    { label: "Shop", value: "shop" },
    { label: "Fridge", value: "fridge" },
    { label: "Both", value: "both" },
  ];

  const externalContainerTypes = containerTypes.filter(
    (ct) => ct.category === "external"
  );
  const internalContainerTypes = containerTypes.filter(
    (ct) => ct.category === "internal"
  );

  const defaultColorCode =
    activeColors.length > 0 ? activeColors[0].hex_code : "#ef4444";

  const [reportData, setReportData] = useState<ReportData>({
    refNumber: "",
    employee: null,
    date: new Date().toISOString().split("T")[0],
    externalContainers: [getDefaultContainer()],
    senderShop: "",
    internalContainers: [getDefaultContainer()],
    samples: [getDefaultSample(0, defaultColorCode)],
    barcodeNumber: "",
    producedDate: "",
    expiredDate: "",
    reportNumber: "In System",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get("edit");

    if (editId && !isLoadingReport && !editingReportId) {
      setIsLoadingReport(true);
      setEditingReportId(editId);

      const loadReport = async () => {
        try {
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
                signature,
                initials
              )
            `
            )
            .eq("id", editId)
            .single()) as any;

          if (reportError) throw reportError;

          // Fetch samples
          const { data: samples, error: samplesError } = await supabase
            .from("report_samples")
            .select("*")
            .eq("report_id", editId);

          if (samplesError) throw samplesError;

          // Fetch external containers
          const { data: externalContainers, error: externalError } =
            await supabase
              .from("report_external_containers")
              .select("*")
              .eq("report_id", editId);

          if (externalError) throw externalError;

          // Fetch internal containers
          const { data: internalContainers, error: internalError } =
            await supabase
              .from("report_internal_containers")
              .select("*")
              .eq("report_id", editId);

          if (internalError) throw internalError;

          const report = {
            ...reportData,
            employee: reportData.employees,
            samples: samples || [],
            external_containers: externalContainers || [],
            internal_containers: internalContainers || [],
          };

          if (report) {
            setReportData({
              id: report.id,
              refNumber: report.ref_number,
              employee: report.employee,
              date: report.report_date,
              externalContainers: report.external_containers?.map((c: any) => ({
                id: c.id || generateId(),
                quantity: c.quantity,
                type: c.container_type_id,
              })) || [getDefaultContainer()],
              senderShop: report.sender_shop || "",
              internalContainers: report.internal_containers?.map((c: any) => ({
                id: c.id || generateId(),
                quantity: c.quantity,
                type: c.container_type_id,
              })) || [getDefaultContainer()],
              samples: report.samples?.map((s: any, idx: number) => ({
                id: s.id || generateId(),
                sampleNumber: s.sample_number || `S${idx + 1}`,
                sampleName: s.sample_name || "",
                internalContainerCount: s.internal_container_count || 1,
                internalContainerType: s.internal_container_type || "",
                netWeight: s.net_weight || 0,
                weightUnit: s.weight_unit || "gram",
                pureOrTotal: s.pure_or_total || "pure",
                weightUsed: s.weight_used || 0,
                colorCode: s.color_code || defaultColorCode,
                storageLocation: s.storage_location || "",
              })) || [getDefaultSample(0, defaultColorCode)],
              barcodeNumber: report.barcode_number || "",
              producedDate: report.produced_date || "",
              expiredDate: report.expired_date || "",
              reportNumber: report.report_number || "In System",
              status: report.status,
            });
          }
        } catch (error) {
          console.error("Error loading report:", error);
          toast({
            title: "Error",
            description: "Failed to load report for editing.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingReport(false);
        }
      };

      loadReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultColorCode]);

  const updateField = <K extends keyof ReportData>(
    field: K,
    value: ReportData[K]
  ) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  const addExternalContainer = () => {
    setReportData((prev) => ({
      ...prev,
      externalContainers: [...prev.externalContainers, getDefaultContainer()],
    }));
  };

  const removeExternalContainer = (id: string) => {
    setReportData((prev) => ({
      ...prev,
      externalContainers: prev.externalContainers.filter((c) => c.id !== id),
    }));
  };

  const updateExternalContainer = (
    id: string,
    updates: Partial<ContainerEntry>
  ) => {
    setReportData((prev) => ({
      ...prev,
      externalContainers: prev.externalContainers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const addInternalContainer = () => {
    setReportData((prev) => ({
      ...prev,
      internalContainers: [...prev.internalContainers, getDefaultContainer()],
    }));
  };

  const removeInternalContainer = (id: string) => {
    setReportData((prev) => ({
      ...prev,
      internalContainers: prev.internalContainers.filter((c) => c.id !== id),
    }));
  };

  const updateInternalContainer = (
    id: string,
    updates: Partial<ContainerEntry>
  ) => {
    setReportData((prev) => ({
      ...prev,
      internalContainers: prev.internalContainers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const addSample = () => {
    const defaultColor =
      activeColors.length > 0 ? activeColors[0].hex_code : "#ef4444";
    setReportData((prev) => ({
      ...prev,
      samples: [
        ...prev.samples,
        getDefaultSample(prev.samples.length, defaultColor),
      ],
    }));
  };

  const removeSample = (id: string) => {
    setReportData((prev) => {
      const filtered = prev.samples.filter((s) => s.id !== id);
      return {
        ...prev,
        samples: filtered.map((s, i) => ({ ...s, sampleNumber: `S${i + 1}` })),
      };
    });
  };

  const updateSample = (id: string, updates: Partial<Sample>) => {
    setReportData((prev) => ({
      ...prev,
      samples: prev.samples.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  };

  const validateForm = (): boolean => {
    // No validation required for first stage - all fields are optional
    setFieldErrors({});
    return true;
  };

  const handleGenerateReport = async () => {
    // No validation required for first stage - all fields are optional
    setFieldErrors({});
    setIsGenerating(true);

    try {
      // Check if editing existing report
      if (editingReportId && reportData.id) {
        // Update existing report directly
        const { error: updateError } = await (supabase as any)
          .from("reports")
          .update({
            ref_number: reportData.refNumber || null,
            employee_id: reportData.employee?.id || null,
            report_date: reportData.date,
            sender_shop: reportData.senderShop || null,
            barcode_number: reportData.barcodeNumber || null,
            produced_date: reportData.producedDate || null,
            expired_date: reportData.expiredDate || null,
            report_number: reportData.reportNumber || "In System",
          })
          .eq("id", reportData.id);

        if (updateError) throw updateError;

        toast({
          title: "Report Updated",
          description: "Your changes have been saved successfully.",
        });

        router.push(`/routes/reports/${reportData.id}`);
        return;
      }

      // Create new report - only send fields with values
      // Insert main report
      const { data: newReport, error: reportError } = await (supabase as any)
        .from("reports")
        .insert([
          {
            ref_number: reportData.refNumber || null,
            employee_id: reportData.employee?.id || null,
            report_date:
              reportData.date || new Date().toISOString().split("T")[0],
            sender_shop: reportData.senderShop || null,
            barcode_number: reportData.barcodeNumber || null,
            produced_date: reportData.producedDate || null,
            expired_date: reportData.expiredDate || null,
            report_number: reportData.reportNumber || "In System",
            status: "pending" as const,
          },
        ])
        .select()
        .single();

      if (reportError) throw reportError;

      const reportId = newReport.id;

      // Insert samples
      if (reportData.samples && reportData.samples.length > 0) {
        const samplesWithReportId = reportData.samples.map((sample) => ({
          report_id: reportId,
          sample_number: sample.sampleNumber || null,
          sample_name: sample.sampleName || null,
          internal_container_count: sample.internalContainerCount || null,
          internal_container_type: sample.internalContainerType || null,
          net_weight: sample.netWeight || null,
          weight_unit: sample.weightUnit || "gram",
          pure_or_total: sample.pureOrTotal || "pure",
          weight_used: sample.weightUsed || null,
          color_code: sample.colorCode || null,
          storage_location: sample.storageLocation || null,
        }));

        const { error: samplesError } = await (supabase as any)
          .from("report_samples")
          .insert(samplesWithReportId);

        if (samplesError) throw samplesError;
      }

      // Insert external containers
      if (
        reportData.externalContainers &&
        reportData.externalContainers.length > 0
      ) {
        const containersWithReportId = reportData.externalContainers.map(
          (container) => ({
            report_id: reportId,
            quantity: container.quantity || null,
            container_type_id: container.type || null,
          })
        );

        const { error: externalError } = await (supabase as any)
          .from("report_external_containers")
          .insert(containersWithReportId);

        if (externalError) throw externalError;
      }

      // Insert internal containers
      if (
        reportData.internalContainers &&
        reportData.internalContainers.length > 0
      ) {
        const containersWithReportId = reportData.internalContainers.map(
          (container) => ({
            report_id: reportId,
            quantity: container.quantity || null,
            container_type_id: container.type || null,
          })
        );

        const { error: internalError } = await (supabase as any)
          .from("report_internal_containers")
          .insert(containersWithReportId);

        if (internalError) throw internalError;
      }

      // Generate PDF and Word files
      toast({
        title: "Generating Files",
        description: "Creating PDF and Word documents...",
      });

      const pdfBlob = await generateReportPDFBlob(reportData);
      const wordBlob = await generateReportWordBlob(reportData);

      // Upload files to Supabase
      const pdfUploadResult = await uploadGeneratedPDF(
        reportId,
        reportData.refNumber,
        pdfBlob
      );

      if (!pdfUploadResult.success) {
        console.error("PDF upload failed:", pdfUploadResult.error);
      }

      const wordUploadResult = await uploadGeneratedWord(
        reportId,
        reportData.refNumber,
        wordBlob
      );

      if (!wordUploadResult.success) {
        console.error("Word upload failed:", wordUploadResult.error);
      }

      toast({
        title: "Report Created",
        description:
          "Your report has been saved with 'Pending' status. You can now preview it.",
      });

      // Show preview instead of redirecting
      setShowPreview(true);
    } catch (error) {
      console.error("Error creating report:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error ? error.message : "Failed to save report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (showPreview) {
    return (
      <DashboardLayout>
        <div className="mb-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className="gap-2 border rounded-lg text-sm"
          >
            ← Back to Form
          </Button>
          <Button
            onClick={() => router.push("/routes/reports")}
            className="gap-2 bg-gray-800 text-white rounded-lg"
          >
            View All Reports
          </Button>
        </div>
        <ReportPreview data={reportData} />
      </DashboardLayout>
    );
  }

  if (isLoadingReport) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading report...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {editingReportId ? "Edit Report" : "Create New Report"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {editingReportId
            ? "Update the report details below"
            : "Fill in the details below to create a new laboratory report"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-24">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2" data-error={!!fieldErrors.refNumber}>
                  <Label htmlFor="refNumber">Reference Number</Label>
                  <Input
                    id="refNumber"
                    placeholder="Enter 6-digit reference number"
                    maxLength={6}
                    value={reportData.refNumber}
                    onChange={(e) =>
                      updateField(
                        "refNumber",
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className={cn(
                      "input-focus",
                      fieldErrors.refNumber &&
                        "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {fieldErrors.refNumber && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {fieldErrors.refNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2" data-error={!!fieldErrors.date}>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={reportData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className={cn(
                      "input-focus",
                      fieldErrors.date && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {fieldErrors.date && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {fieldErrors.date}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2" data-error={!!fieldErrors.employee}>
                <Label>Select Employee</Label>
                {employeesLoading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No employees found. Please add employees first.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => updateField("employee", emp)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                          reportData.employee?.id === emp.id
                            ? "border-accent bg-accent/5"
                            : fieldErrors.employee
                            ? "border-red-500 hover:border-red-600"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {emp.photo ? (
                          <img
                            src={emp.photo}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-accent/10 text-accent">
                            {emp.initials}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground truncate w-full text-center">
                          {emp.name.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {fieldErrors.employee && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {fieldErrors.employee}
                  </p>
                )}
              </div>

              {reportData.employee && (
                <Card className="mt-3">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        Selected Employee
                      </CardTitle>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => updateField("employee", null)}
                          aria-label="Clear employee selection"
                          className="p-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex items-center gap-4 py-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {reportData.employee.photo ? (
                        <img
                          src={reportData.employee.photo}
                          alt={reportData.employee.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-accent/10 text-accent">
                          {reportData.employee.initials}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {reportData.employee.name}
                        </div>
                        {reportData.employee.role && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {reportData.employee.role}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">
                              {reportData.employee.email ?? "Not Provided"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 truncate mt-1 sm:mt-0">
                            <Phone className="w-4 h-4" />
                            <span className="truncate">
                              {reportData.employee.phone ?? "Not Provided"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <p>Signature</p>
                      {reportData.employee.signature ? (
                        <img
                          src={reportData.employee.signature}
                          alt={`${reportData.employee.name} signature`}
                          className="h-16 w-40 rounded-md"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          No signature available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="senderShop">Sender Shop</Label>
                <Select
                  value={reportData.senderShop}
                  onChange={(value) =>
                    updateField("senderShop", value as string)
                  }
                  options={SENDER_SHOPS.map((shop) => ({
                    label: shop,
                    value: shop,
                  }))}
                  placeholder="Select a shop"
                  className="input-focus"
                />
              </div>
            </CardContent>
          </Card>

          {/* External Containers */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" />
                  External Containers
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addExternalContainer}
                  className="gap-1 border rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              {reportData.externalContainers.map((container, index) => (
                <div
                  key={container.id}
                  className="flex gap-2 sm:gap-3 items-end animate-fade-in"
                >
                  <div className="w-16 sm:w-20">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={container.quantity || ""}
                      onChange={(e) =>
                        updateExternalContainer(container.id, {
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="input-focus"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Container Type</Label>
                    <Select
                      value={container.type}
                      onChange={(value) =>
                        updateExternalContainer(container.id, {
                          type: value as string,
                        })
                      }
                      options={externalContainerTypes.map((type) => ({
                        label: type.name,
                        value: type.id,
                      }))}
                      placeholder="Select type"
                      className="input-focus"
                    />
                  </div>
                  {reportData.externalContainers.length > 1 && (
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => removeExternalContainer(container.id)}
                      className="text-destructive text-red-500 border border-red-500 py-5 px-2  rounded-lg  hover:text-destructive/80 hover:bg-red-50 "
                    >
                      <Trash2 className="w-5 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Samples */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  Sample Information
                  <Badge
                    variant="flat"
                    color="secondary"
                    className="ml-2 border border-gray-300 h-4 w-4 rounded-full text-xs"
                  >
                    {reportData.samples.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSample}
                  className="gap-1 border rounded-lg px-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Add Sample</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              {reportData.samples.map((sample, index) => (
                <div
                  key={sample.id}
                  className="p-3 sm:p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all space-y-3 sm:space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="font-bold text-sm px-3 py-1.5 shadow-sm"
                      style={{
                        backgroundColor: `${sample.colorCode}20`,
                        borderColor: sample.colorCode,
                        color: sample.colorCode,
                      }}
                    >
                      {sample.sampleNumber}
                    </Badge>
                    {reportData.samples.length > 1 && (
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => removeSample(sample.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        Sample Name
                      </Label>
                      <Select
                        value={sample.sampleName}
                        onChange={(value) =>
                          updateSample(sample.id, {
                            sampleName: value as string,
                          })
                        }
                        options={sampleNames.map((sample) => ({
                          label: sample.name,
                          value: sample.id,
                        }))}
                        placeholder="Select sample name"
                        className="input-focus h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Internal Container Type
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={sample.internalContainerCount || ""}
                          onChange={(e) =>
                            updateSample(sample.id, {
                              internalContainerCount:
                                parseInt(e.target.value) || 0,
                            })
                          }
                          className="input-focus h-10 w-16"
                          placeholder="Qty"
                        />
                        <Select
                          value={sample.internalContainerType}
                          onChange={(value) =>
                            updateSample(sample.id, {
                              internalContainerType: value as string,
                            })
                          }
                          options={internalContainerTypes.map((type) => ({
                            label: type.name,
                            value: type.id,
                          }))}
                          placeholder="Select type"
                          className="input-focus h-10 flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        Net Weight
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={sample.netWeight || ""}
                          onChange={(e) =>
                            updateSample(sample.id, {
                              netWeight: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="input-focus h-10 flex-1"
                          placeholder="0.00"
                        />
                        <Select
                          value={sample.weightUnit}
                          onChange={(value) =>
                            updateSample(sample.id, {
                              weightUnit: value as "gram" | "kg",
                            })
                          }
                          options={[
                            { label: "G", value: "gram" },
                            { label: "Kg", value: "kg" },
                          ]}
                          className="input-focus h-10 w-20"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        Storage Location
                      </Label>
                      <Select
                        value={sample.storageLocation}
                        onChange={(value) =>
                          updateSample(sample.id, {
                            storageLocation: String(value),
                          })
                        }
                        options={STORAGE_LOCATION_OPTIONS}
                        className="input-focus h-10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        Pure or Total
                      </Label>
                      <Select
                        value={sample.pureOrTotal}
                        onChange={(value) =>
                          updateSample(sample.id, {
                            pureOrTotal: value as "pure" | "total",
                          })
                        }
                        options={[
                          { label: "Pure", value: "pure" },
                          { label: "Total", value: "total" },
                        ]}
                        className="input-focus h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        Weight Used (g)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={sample.weightUsed || ""}
                        onChange={(e) =>
                          updateSample(sample.id, {
                            weightUsed: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="input-focus h-10"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Color Code
                      </Label>
                      {colorsLoading ? (
                        <p className="text-xs text-gray-500">
                          Loading colors...
                        </p>
                      ) : activeColors.length > 0 ? (
                        <div className="relative">
                          <select
                            value={sample.colorCode}
                            onChange={(e) =>
                              updateSample(sample.id, {
                                colorCode: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="">Select a color</option>
                            {activeColors.map((color: any) => (
                              <option key={color.id} value={color.hex_code}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                          {sample.colorCode && (
                            <div
                              className="absolute right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 pointer-events-none"
                              style={{ backgroundColor: sample.colorCode }}
                              title="Selected Color"
                            />
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          No colors available. Please add colors in Master Data.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Additional Info */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="producedDate">Produced Date</Label>
                <Input
                  id="producedDate"
                  type="date"
                  value={reportData.producedDate}
                  onChange={(e) => updateField("producedDate", e.target.value)}
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiredDate">Expired Date</Label>
                <Input
                  id="expiredDate"
                  type="date"
                  value={reportData.expiredDate}
                  onChange={(e) => updateField("expiredDate", e.target.value)}
                  className="input-focus"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcodeNumber">Barcode Number</Label>
              <Input
                id="barcodeNumber"
                placeholder="Enter barcode number"
                value={reportData.barcodeNumber}
                onChange={(e) => updateField("barcodeNumber", e.target.value)}
                className="input-focus"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              size="lg"
              className="min-w-28 sm:min-w-35 border rounded-lg text-sm sm:text-base px-3 sm:px-4"
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              size="lg"
              className="min-w-32 sm:min-w-45 bg-gray-800 text-white rounded-lg text-sm sm:text-base px-3 sm:px-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
                  {editingReportId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {editingReportId ? "Update Report" : "Create Report"}
                  </span>
                  <span className="sm:hidden">
                    {editingReportId ? "Update" : "Create"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
