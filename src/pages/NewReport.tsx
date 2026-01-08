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
  FileDown,
  Info,
  Search,
  Calculator,
} from "lucide-react";
import {
  ReportData,
  Sample,
  ContainerEntry,
  COLOR_OPTIONS,
} from "@/types/report";
import {
  useEmployees,
  useContainerTypes,
  useSampleNames,
  useRoles,
  useSenderShops,
} from "@/hooks/useSupabaseData";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase/client";
import { ReportPreview } from "@/components/report/ReportPreview";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
  internalContainers: [{ id: generateId(), quantity: 1, type: "" }],
  netWeight: 0,
  weightUnit: "gram",
  pureOrTotal: "pure",
  weightUsed: 0,
  colorCode: defaultColor || "#ef4444",
  storageLocation: "",
  weightNotes: "",
  isSwabOnly: false,
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
  const [reportCreatedSuccessfully, setReportCreatedSuccessfully] =
    useState(false);
  const [showAdvancedCalc, setShowAdvancedCalc] = useState(false);
  const [currentCalcSampleId, setCurrentCalcSampleId] = useState<string | null>(
    null
  );
  const [calcType, setCalcType] = useState<"net-weight" | "piece-count">(
    "net-weight"
  );

  // Advanced calculation states
  const [grossWeight, setGrossWeight] = useState<number>(0);
  const [emptyContainerWeight, setEmptyContainerWeight] = useState<number>(0);
  const [containerCount, setContainerCount] = useState<number>(1);
  const [piecesPerBox, setPiecesPerBox] = useState<number>(0);
  const [boxCount, setBoxCount] = useState<number>(0);
  const [singlePieceWeight, setSinglePieceWeight] = useState<number>(0);

  // New flexible piece calculation states
  const [stripsPerBox, setStripsPerBox] = useState<number>(0);
  const [piecesPerStrip, setPiecesPerStrip] = useState<number>(0);

  // Search states
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [senderShopSearch, setSenderShopSearch] = useState("");
  const [sampleSearches, setSampleSearches] = useState<Record<string, string>>(
    {}
  );
  const [externalContainerSearch, setExternalContainerSearch] = useState("");
  const [internalContainerSearch, setInternalContainerSearch] = useState("");

  const { data: employees, loading: employeesLoading } = useEmployees();
  const { data: roles, loading: rolesLoading } = useRoles();
  const { data: senderShops, loading: senderShopsLoading } = useSenderShops();
  const { data: containerTypes, loading: containerTypesLoading } =
    useContainerTypes();
  const { data: sampleNames, loading: sampleNamesLoading } = useSampleNames();
  const { data: allColors, loading: colorsLoading } = useColors();

  const activeColors = allColors.filter(
    (color: any) => color.status === "active"
  );

  // Filter data based on search
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const filteredSenderShops = senderShops.filter((shop) =>
    shop.name.toLowerCase().includes(senderShopSearch.toLowerCase())
  );

  const getFilteredSampleNames = (sampleId: string) => {
    const search = sampleSearches[sampleId] || "";
    return sampleNames.filter((sn) =>
      sn.name.toLowerCase().includes(search.toLowerCase())
    );
  };

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

  // Filter containers based on search
  const filteredExternalContainerTypes = externalContainerTypes.filter((ct) =>
    ct.name.toLowerCase().includes(externalContainerSearch.toLowerCase())
  );
  const filteredInternalContainerTypes = internalContainerTypes.filter((ct) =>
    ct.name.toLowerCase().includes(internalContainerSearch.toLowerCase())
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
    bagNumber: "",
    dispatchNumber: "",
    dateReceivedByDepartment: "",
    systemRegistrationDate: "",
    consumerNotes: "",
    unexaminedItems: "",
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
                role_id,
                photo,
                signature,
                initials,
                roles:role_id (
                  id,
                  name,
                  description
                )
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
                internalContainers: s.internal_containers || [
                  { id: generateId(), quantity: 1, type: "" },
                ],
                netWeight: s.net_weight || 0,
                weightUnit: s.weight_unit || "gram",
                pureOrTotal: s.pure_or_total || "pure",
                weightUsed: s.weight_used || 0,
                colorCode: s.color_code || defaultColorCode,
                storageLocation: s.storage_location || "",
                weightNotes: s.weight_notes || "",
                isSwabOnly: s.is_swab_only || false,
              })) || [getDefaultSample(0, defaultColorCode)],
              barcodeNumber: report.barcode_number || "",
              bagNumber: report.bag_number || "",
              dispatchNumber: report.dispatch_number || "",
              dateReceivedByDepartment:
                report.date_received_by_department || "",
              systemRegistrationDate: report.system_registration_date || "",
              consumerNotes: report.consumer_notes || "",
              unexaminedItems: report.unexamined_items || "",
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

  // Reset form to initial state
  const resetForm = () => {
    const defaultColor =
      activeColors.length > 0 ? activeColors[0].hex_code : "#ef4444";
    setReportData({
      refNumber: "",
      employee: null,
      date: new Date().toISOString().split("T")[0],
      externalContainers: [getDefaultContainer()],
      senderShop: "",
      internalContainers: [getDefaultContainer()],
      samples: [getDefaultSample(0, defaultColor)],
      barcodeNumber: "",
      bagNumber: "",
      dispatchNumber: "",
      dateReceivedByDepartment: "",
      systemRegistrationDate: "",
      consumerNotes: "",
      unexaminedItems: "",
      reportNumber: "In System",
    });
    setFieldErrors({});
    setEditingReportId(null);
    setReportCreatedSuccessfully(false);
  };

  // Convert IDs to names for display
  const getDisplayData = (): ReportData => {
    return {
      ...reportData,
      externalContainers: reportData.externalContainers.map((container) => ({
        ...container,
        type:
          containerTypes.find((ct) => ct.id === container.type)?.name ||
          container.type,
      })),
      internalContainers: reportData.internalContainers.map((container) => ({
        ...container,
        type:
          containerTypes.find((ct) => ct.id === container.type)?.name ||
          container.type,
      })),
      samples: reportData.samples.map((sample) => ({
        ...sample,
        sampleName:
          sampleNames.find((sn) => sn.id === sample.sampleName)?.name ||
          sample.sampleName,
        internalContainers:
          sample.internalContainers?.map((container) => ({
            ...container,
            type:
              containerTypes.find((ct) => ct.id === container.type)?.name ||
              container.type,
          })) || [],
      })),
    };
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
        samples: filtered.map((s, i) => ({
          ...s,
          sampleNumber: `S${i + 1}`,
          internalContainers: s.internalContainers || [
            { id: generateId(), quantity: 1, type: "" },
          ],
        })),
      };
    });
  };

  const updateSample = (id: string, updates: Partial<Sample>) => {
    setReportData((prev) => ({
      ...prev,
      samples: prev.samples.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updates,
              internalContainers: updates.internalContainers ||
                s.internalContainers || [
                  { id: generateId(), quantity: 1, type: "" },
                ],
            }
          : s
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
            bag_number: reportData.bagNumber || null,
            dispatch_number: reportData.dispatchNumber || null,
            date_received_by_department:
              reportData.dateReceivedByDepartment || null,
            system_registration_date: reportData.systemRegistrationDate || null,
            consumer_notes: reportData.consumerNotes || null,
            unexamined_items: reportData.unexaminedItems || null,
            report_number: reportData.reportNumber || "In System",
          })
          .eq("id", reportData.id);

        if (updateError) throw updateError;

        toast({
          title: "Report Updated",
          description: "Your changes have been saved successfully.",
        });

        router.push(`/routes/examination-team/${reportData.id}`);
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
            opener_id: reportData.employee?.id || null, // Person who created the case
            report_date:
              reportData.date || new Date().toISOString().split("T")[0],
            sender_shop: reportData.senderShop || null,
            barcode_number: reportData.barcodeNumber || null,
            bag_number: reportData.bagNumber || null,
            dispatch_number: reportData.dispatchNumber || null,
            date_received_by_department:
              reportData.dateReceivedByDepartment || null,
            system_registration_date: reportData.systemRegistrationDate || null,
            consumer_notes: reportData.consumerNotes || null,
            unexamined_items: reportData.unexaminedItems || null,
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
          internal_containers: sample.internalContainers || [],
          net_weight: sample.netWeight || null,
          weight_unit: sample.weightUnit || "gram",
          pure_or_total: sample.pureOrTotal || "pure",
          weight_used: sample.weightUsed || null,
          color_code: sample.colorCode || null,
          storage_location: sample.storageLocation || null,
          weight_notes: sample.weightNotes || null,
          is_swab_only: sample.isSwabOnly || false,
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

      // Mark that a new report was created (not an edit)
      setReportCreatedSuccessfully(true);

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
    const displayData = {
      ...reportData,
      externalContainers: reportData.externalContainers.map((container) => ({
        ...container,
        type:
          containerTypes.find((ct) => ct.id === container.type)?.name ||
          container.type,
      })),
      internalContainers: reportData.internalContainers.map((container) => ({
        ...container,
        type:
          containerTypes.find((ct) => ct.id === container.type)?.name ||
          container.type,
      })),
      samples: reportData.samples.map((sample) => ({
        ...sample,
        sampleName:
          sampleNames.find((sn) => sn.id === sample.sampleName)?.name ||
          sample.sampleName,
        internalContainers:
          sample.internalContainers?.map((container) => ({
            ...container,
            type:
              containerTypes.find((ct) => ct.id === container.type)?.name ||
              container.type,
          })) || [],
      })),
    };

    return (
      <DashboardLayout>
        <div className="mb-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowPreview(false);
              // Reset form if a new report was created
              if (reportCreatedSuccessfully) {
                resetForm();
              }
            }}
            className="gap-2 border rounded-lg text-sm"
          >
            ← Back to Form
          </Button>
          <Button
            onClick={() => router.push("/routes/examination-team")}
            className="gap-2 bg-gray-800 text-white rounded-lg"
          >
            View All Cases
          </Button>
        </div>
        <ReportPreview data={displayData} />
      </DashboardLayout>
    );
  }

  if (isLoadingReport) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading case...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl dark:text-white font-bold text-foreground">
          {editingReportId ? "Edit Case" : "Create New Case"}
        </h1>
        <p className="text-sm dark:text-gray-200 sm:text-base text-muted-foreground">
          {editingReportId
            ? "Update the case details below"
            : "Fill in the details below to create a new laboratory case"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-24">
        {/* Additional Info */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateReceivedByDepartment">
                  Date Received by Department
                </Label>
                <Input
                  id="dateReceivedByDepartment"
                  type="date"
                  value={reportData.dateReceivedByDepartment || ""}
                  onChange={(e) =>
                    updateField("dateReceivedByDepartment", e.target.value)
                  }
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemRegistrationDate">
                  System Registration Date
                </Label>
                <Input
                  id="systemRegistrationDate"
                  type="date"
                  value={reportData.systemRegistrationDate || ""}
                  onChange={(e) =>
                    updateField("systemRegistrationDate", e.target.value)
                  }
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
            <div className="space-y-2">
              <Label htmlFor="consumerNotes">Consumer Notes</Label>
              <textarea
                id="consumerNotes"
                placeholder="Enter consumer information or notes"
                value={reportData.consumerNotes || ""}
                onChange={(e) => updateField("consumerNotes", e.target.value)}
                className="w-full dark:text-gray-100 dark:placeholder:text-gray-400 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unexaminedItems">Unexamined Items</Label>
              <textarea
                id="unexaminedItems"
                placeholder="List any items that were not examined"
                value={reportData.unexaminedItems || ""}
                onChange={(e) => updateField("unexaminedItems", e.target.value)}
                className="w-full dark:text-gray-100 dark:placeholder:text-gray-400 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Case Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2" data-error={!!fieldErrors.refNumber}>
                  <Label className="dark:text-gray-100" htmlFor="refNumber">
                    Reference Number
                  </Label>
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
                  <Label className="dark:text-gray-100" htmlFor="date">
                    Date
                  </Label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-100" htmlFor="bagNumber">
                    Bag Number
                  </Label>
                  <Input
                    id="bagNumber"
                    placeholder="Enter bag number"
                    value={reportData.bagNumber || ""}
                    onChange={(e) => updateField("bagNumber", e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="dark:text-gray-100"
                    htmlFor="dispatchNumber"
                  >
                    Dispatch Number
                  </Label>
                  <Input
                    id="dispatchNumber"
                    placeholder="Enter dispatch number"
                    value={reportData.dispatchNumber || ""}
                    onChange={(e) =>
                      updateField("dispatchNumber", e.target.value)
                    }
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2" data-error={!!fieldErrors.employee}>
                <div className="flex items-center justify-between gap-3">
                  <Label>Select Employee</Label>
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      placeholder="Search employees..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>
                {employeesLoading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No employees found. Please add employees first.
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No employees match your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto pb-2 scrollbar-thin-light">
                    <div className="flex gap-2">
                      {filteredEmployees.map((emp) => {
                        const isSelected = reportData.employee?.id === emp.id;
                        const roleName = emp.role_id
                          ? roles.find((r) => r.id === emp.role_id)?.name ||
                            null
                          : null;
                        return (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => updateField("employee", emp)}
                            className={`shrink-0 w-32 flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all relative ${
                              isSelected
                                ? "border-accent dark:border-green-600 bg-accent/5"
                                : fieldErrors.employee
                                ? "border-red-500 hover:border-red-600"
                                : "border-border hover:border-accent/50"
                            }`}
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center">
                              {emp.photo ? (
                                <img
                                  src={emp.photo}
                                  alt={emp.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-semibold text-accent">
                                  {emp.initials}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-center w-full">
                              <span className="text-[10px] dark:text-white text-muted-foreground truncate w-full text-center font-medium">
                                {emp.name.split(" ")[0]}
                              </span>
                              {roleName && (
                                <span className="text-[9px] text-blue-600 dark:text-blue-400 truncate w-full text-center mt-0.5">
                                  {roleName}
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-blue-500 dark:text-green-500 absolute top-1.5 right-1.5 bg-white dark:bg-gray-900 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
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
                          className="p-2 dark:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex items-center gap-4 py-3">
                    <div className="flex items-center gap-3">
                      {reportData.employee.photo ? (
                        <img
                          src={reportData.employee.photo}
                          alt={reportData.employee.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-accent/10 text-accent">
                          {reportData.employee.initials}
                        </div>
                      )}

                      <div>
                        <div className="font-medium dark:text-gray-100 text-sm">
                          {reportData.employee.name}
                        </div>
                        {reportData.employee.role_id &&
                          (() => {
                            const roleName = roles.find(
                              (r) => r.id === reportData.employee?.role_id
                            )?.name;
                            return roleName ? (
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                                {roleName}
                              </div>
                            ) : null;
                          })()}
                      </div>
                    </div>

                    {reportData.employee.signature && (
                      <div className="ml-auto">
                        <img
                          src={reportData.employee.signature}
                          alt={`${reportData.employee.name} signature`}
                          className="h-16 w-40 dark:border dark:border-gray-400 rounded-md"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label className="dark:text-white">Sender Shop</Label>
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      placeholder="Search sender shops..."
                      value={senderShopSearch}
                      onChange={(e) => setSenderShopSearch(e.target.value)}
                      className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>
                {senderShopsLoading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : senderShops.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No sender shops found. Please add shops first.
                  </div>
                ) : filteredSenderShops.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No sender shops match your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto pb-2 scrollbar-thin-light">
                    <div className="flex gap-2">
                      {filteredSenderShops.map((shop) => {
                        const isSelected = reportData.senderShop === shop.name;
                        return (
                          <button
                            key={shop.id}
                            type="button"
                            onClick={() => updateField("senderShop", shop.name)}
                            className={`shrink-0 w-32 flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all relative ${
                              isSelected
                                ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                : "border-border hover:border-blue-300 dark:hover:border-blue-700"
                            }`}
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {shop.image ? (
                                <img
                                  src={shop.image}
                                  alt={shop.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <span className="text-[10px] dark:text-white text-gray-700 truncate w-full text-center font-medium">
                              {shop.name}
                            </span>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 absolute top-1.5 right-1.5 bg-white dark:bg-gray-900 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  className="gap-1 border dark:text-white rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
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
                  className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Container Type
                    </Label>
                    {reportData.externalContainers.length > 1 && (
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => removeExternalContainer(container.id)}
                        className="text-red-500 border border-red-500 h-8 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex justify-between items-end gap-3">
                    <div className="shrink-0 w-24">
                      <Label className="text-xs font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={container.quantity || ""}
                        onChange={(e) =>
                          updateExternalContainer(container.id, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="input-focus h-10"
                      />
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="relative">
                        <Input
                          placeholder="Search container types..."
                          value={externalContainerSearch}
                          onChange={(e) =>
                            setExternalContainerSearch(e.target.value)
                          }
                          className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    {filteredExternalContainerTypes.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin-light">
                        {filteredExternalContainerTypes.map((type) => {
                          const isSelected = container.type === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() =>
                                updateExternalContainer(container.id, {
                                  type: type.id,
                                })
                              }
                              className={cn(
                                "shrink-0 relative rounded-lg border-2 transition-all duration-200 p-2 w-32",
                                isSelected
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md"
                              )}
                            >
                              <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                {type.image ? (
                                  <img
                                    src={type.image}
                                    alt={type.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="mt-1.5 text-center">
                                <p className="text-[10px] font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                  {type.name}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-blue-500 absolute top-1.5 right-1.5 bg-white dark:bg-blue-900 rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                  className="gap-1 dark:text-white border rounded-lg px-2 text-xs sm:text-sm whitespace-nowrap"
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
                  className="p-3 sm:p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all space-y-3 sm:space-y-4 animate-fade-in"
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
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <Label className="text-xs sm:text-sm font-medium">
                          Sample Name
                        </Label>
                        <div className="relative flex-1 max-w-xs">
                          <Input
                            placeholder="Search samples..."
                            value={sampleSearches[sample.id] || ""}
                            onChange={(e) =>
                              setSampleSearches((prev) => ({
                                ...prev,
                                [sample.id]: e.target.value,
                              }))
                            }
                            className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                          />
                        </div>
                      </div>

                      {sampleNamesLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          <span className="text-sm text-gray-500">
                            Loading sample names...
                          </span>
                        </div>
                      ) : getFilteredSampleNames(sample.id).length === 0 ? (
                        <div className="text-center p-4 text-sm text-muted-foreground">
                          No samples match your search.
                        </div>
                      ) : (
                        <div className="flex gap-2 overflow-x-auto py-2 -mx-2 px-2 scrollbar-thin-light">
                          {getFilteredSampleNames(sample.id).map((sn) => {
                            const isSelected = sample.sampleName === sn.id;
                            return (
                              <button
                                key={sn.id}
                                type="button"
                                onClick={() =>
                                  updateSample(sample.id, {
                                    sampleName: isSelected ? "" : sn.id,
                                  })
                                }
                                className={cn(
                                  "relative shrink-0 w-32 flex flex-col items-center p-2 rounded-lg border-2 transition-all bg-white dark:bg-gray-900",
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md"
                                )}
                                aria-pressed={isSelected}
                                aria-label={`Select ${sn.name}`}
                              >
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                  {sn.image ? (
                                    <img
                                      src={sn.image}
                                      alt={sn.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>

                                <div className="mt-1.5 w-full text-center">
                                  <p className="text-[10px] font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {sn.name}
                                  </p>
                                </div>

                                {isSelected && (
                                  <CheckCircle className="w-4 h-4 text-blue-500 absolute top-1.5 right-1.5 bg-white dark:bg-blue-900 rounded-full" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium">
                          Internal Containers
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newContainer = {
                              id: generateId(),
                              quantity: 1,
                              type: "",
                            };
                            updateSample(sample.id, {
                              internalContainers: [
                                ...(sample.internalContainers || []),
                                newContainer,
                              ],
                            });
                          }}
                          className="gap-1 border dark:text-white rounded-lg px-2 py-1 text-xs h-7"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {(sample.internalContainers || []).map(
                          (container, containerIdx) => (
                            <div
                              key={container.id}
                              className="space-y-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  Container {containerIdx + 1}
                                </Label>
                                {(sample.internalContainers || []).length >
                                  1 && (
                                  <Button
                                    variant="text"
                                    size="sm"
                                    onClick={() => {
                                      const updated = (
                                        sample.internalContainers || []
                                      ).filter(
                                        (_, idx) => idx !== containerIdx
                                      );
                                      updateSample(sample.id, {
                                        internalContainers: updated,
                                      });
                                    }}
                                    className="text-red-500 border border-red-500 h-7 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>

                              <div className="flex justify-between items-end gap-3">
                                <div className="shrink-0 w-20">
                                  <Label className="text-xs font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
                                    Quantity
                                  </Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={container.quantity || ""}
                                    onChange={(e) => {
                                      const updated = [
                                        ...(sample.internalContainers || []),
                                      ];
                                      updated[containerIdx] = {
                                        ...container,
                                        quantity: parseInt(e.target.value) || 0,
                                      };
                                      updateSample(sample.id, {
                                        internalContainers: updated,
                                      });
                                    }}
                                    className="input-focus h-9"
                                    placeholder="Qty"
                                  />
                                </div>
                                <div className="flex-1 max-w-xs">
                                  <div className="relative">
                                    <Input
                                      placeholder="Search container types..."
                                      value={internalContainerSearch}
                                      onChange={(e) =>
                                        setInternalContainerSearch(
                                          e.target.value
                                        )
                                      }
                                      className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                {filteredInternalContainerTypes.length > 0 ? (
                                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin-light">
                                    {filteredInternalContainerTypes.map(
                                      (type) => {
                                        const isSelected =
                                          container.type === type.id;
                                        return (
                                          <button
                                            key={type.id}
                                            onClick={() => {
                                              const updated = [
                                                ...(sample.internalContainers ||
                                                  []),
                                              ];
                                              updated[containerIdx] = {
                                                ...container,
                                                type: type.id,
                                              };
                                              updateSample(sample.id, {
                                                internalContainers: updated,
                                              });
                                            }}
                                            className={cn(
                                              "shrink-0 relative rounded-lg border-2 transition-all duration-200 p-2 w-32",
                                              isSelected
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                                                : "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md"
                                            )}
                                          >
                                            <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                              {type.image ? (
                                                <img
                                                  src={type.image}
                                                  alt={type.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                              )}
                                            </div>
                                            <div className="mt-1.5 text-center">
                                              <p className="text-[10px] font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                                {type.name}
                                              </p>
                                            </div>
                                            {isSelected && (
                                              <CheckCircle className="w-4 h-4 text-blue-500 absolute top-1.5 right-1.5 bg-white dark:bg-blue-900 rounded-full" />
                                            )}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-xs text-gray-500">
                                    {internalContainerSearch
                                      ? "No container types match your search."
                                      : "No internal container types available."}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Swab-Only Sample Checkbox */}
                  <div className="mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sample.isSwabOnly || false}
                        onChange={(e) =>
                          updateSample(sample.id, {
                            isSwabOnly: e.target.checked,
                            // Reset weight fields when switching to swab-only
                            ...(e.target.checked && {
                              netWeight: 0,
                              weightUsed: 0,
                            }),
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Swab-Only Sample (No Weight)
                      </span>
                    </label>
                  </div>

                  {!sample.isSwabOnly && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                            Net Weight
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              value={sample.netWeight || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty, numbers, and decimal point
                                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                  updateSample(sample.id, {
                                    netWeight:
                                      value === "" ? 0 : parseFloat(value) || 0,
                                  });
                                }
                              }}
                              className="input-focus h-10 flex-1"
                              placeholder="0.01, 0.005, etc."
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                setCurrentCalcSampleId(sample.id);
                                setShowAdvancedCalc(true);
                                // Reset calculation states
                                setGrossWeight(0);
                                setEmptyContainerWeight(0);
                                setContainerCount(1);
                                setPiecesPerBox(0);
                                setBoxCount(0);
                                setSinglePieceWeight(0);
                                setStripsPerBox(0);
                                setPiecesPerStrip(0);
                                setCalcType("net-weight");
                              }}
                              className="h-10 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
                              title="Advanced Calculation"
                            >
                              <Calculator className="w-4 h-4" />
                            </Button>
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
                    </>
                  )}

                  {!sample.isSwabOnly && (
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
                          type="text"
                          value={sample.weightUsed || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow empty, numbers, and decimal point
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              updateSample(sample.id, {
                                weightUsed:
                                  value === "" ? 0 : parseFloat(value) || 0,
                              });
                            }
                          }}
                          className="input-focus h-10"
                          placeholder="0.01, 0.005, etc."
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
                              className="w-full dark:text-gray-100 dark:placeholder:text-gray-200 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                            No colors available. Please add colors in Master
                            Data.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Weight Notes */}
                  <div className="mt-3">
                    <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                      Weight Notes{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional - e.g., "3 pieces", "swabs only")
                      </span>
                    </Label>
                    <textarea
                      value={sample.weightNotes || ""}
                      onChange={(e) =>
                        updateSample(sample.id, {
                          weightNotes: e.target.value,
                        })
                      }
                      className="w-full dark:text-gray-100 dark:placeholder:text-gray-400 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                      rows={2}
                      placeholder="Enter any notes about weight, quantity by count, or special information..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              size="lg"
              className="min-w-28 dark:text-white sm:min-w-35 border rounded-lg text-sm sm:text-base px-3 sm:px-4"
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              size="lg"
              className="min-w-32 dark:bg-blue-700 sm:min-w-45 bg-gray-800 text-white rounded-lg text-sm sm:text-base px-3 sm:px-4"
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
                    {editingReportId ? "Update Case" : "Create Case"}
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

      {showAdvancedCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAdvancedCalc(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
              <button
                onClick={() => setShowAdvancedCalc(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Advanced Weight Calculator
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Calculate net weight from complex scenarios
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Calculation Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCalcType("net-weight")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      calcType === "net-weight"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      Net Weight Calculation
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Calculate from gross weight minus empty containers
                    </div>
                  </button>
                  <button
                    onClick={() => setCalcType("piece-count")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      calcType === "piece-count"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      Piece Count Calculation
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Calculate from number of pieces × piece weight
                    </div>
                  </button>
                </div>
              </div>

              {calcType === "net-weight" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Gross Weight (g)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={grossWeight || ""}
                        onChange={(e) =>
                          setGrossWeight(parseFloat(e.target.value) || 0)
                        }
                        className="h-10"
                        placeholder="Total weight with containers"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Empty Container Weight (g)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={emptyContainerWeight || ""}
                        onChange={(e) =>
                          setEmptyContainerWeight(
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-10"
                        placeholder="Weight of one empty container"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Number of Containers
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={containerCount || ""}
                      onChange={(e) =>
                        setContainerCount(parseInt(e.target.value) || 1)
                      }
                      className="h-10"
                      placeholder="Total container count"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Gross Weight:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {grossWeight.toFixed(2)} g
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Container Weight:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {(emptyContainerWeight * containerCount).toFixed(2)} g
                      </span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">
                          Net Weight:
                        </span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          {(
                            grossWeight -
                            emptyContainerWeight * containerCount
                          ).toFixed(2)}{" "}
                          g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {calcType === "piece-count" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Number of Boxes (Optional)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={boxCount || ""}
                        onChange={(e) =>
                          setBoxCount(parseInt(e.target.value) || 0)
                        }
                        className="h-10"
                        placeholder="0 if no boxes"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Leave empty or 0 for loose samples
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Strips per Box
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={stripsPerBox || ""}
                        onChange={(e) =>
                          setStripsPerBox(parseInt(e.target.value) || 0)
                        }
                        className="h-10"
                        placeholder="Number of strips"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Pieces per Strip
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={piecesPerStrip || ""}
                        onChange={(e) =>
                          setPiecesPerStrip(parseInt(e.target.value) || 0)
                        }
                        className="h-10"
                        placeholder="Count per strip"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Single Piece Weight (g)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={singlePieceWeight || ""}
                        onChange={(e) =>
                          setSinglePieceWeight(parseFloat(e.target.value) || 0)
                        }
                        className="h-10"
                        placeholder="Weight of one piece"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Calculation Mode:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {boxCount > 0 ? "With Boxes" : "Loose/Strips Only"}
                      </span>
                    </div>
                    {boxCount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Number of Boxes:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {boxCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Strips per Box:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {stripsPerBox}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total Strips:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {boxCount * stripsPerBox}
                          </span>
                        </div>
                      </>
                    )}
                    {boxCount === 0 && stripsPerBox > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Number of Strips:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {stripsPerBox}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pieces per Strip:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {piecesPerStrip}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Pieces:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {boxCount > 0
                          ? boxCount * stripsPerBox * piecesPerStrip
                          : stripsPerBox * piecesPerStrip}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Weight per Piece:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {singlePieceWeight.toFixed(2)} g
                      </span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">
                          Total Net Weight:
                        </span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          {(boxCount > 0
                            ? boxCount *
                              stripsPerBox *
                              piecesPerStrip *
                              singlePieceWeight
                            : stripsPerBox * piecesPerStrip * singlePieceWeight
                          ).toFixed(2)}{" "}
                          g
                        </span>
                      </div>
                    </div>
                    {boxCount === 0 && stripsPerBox > 0 && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        ℹ️ Calculating without boxes - using strips directly
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => setShowAdvancedCalc(false)}
                  variant="outline"
                  className="flex-1 dark:text-white border-gray-300 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (currentCalcSampleId) {
                      const calculatedWeight =
                        calcType === "net-weight"
                          ? grossWeight - emptyContainerWeight * containerCount
                          : boxCount > 0
                          ? boxCount *
                            stripsPerBox *
                            piecesPerStrip *
                            singlePieceWeight
                          : stripsPerBox * piecesPerStrip * singlePieceWeight;

                      updateSample(currentCalcSampleId, {
                        netWeight: parseFloat(calculatedWeight.toFixed(2)),
                      });

                      toast({
                        title: "Weight Calculated",
                        description: `Net weight set to ${calculatedWeight.toFixed(
                          2
                        )}g`,
                      });

                      setShowAdvancedCalc(false);
                    }
                  }}
                  className="flex-1 bg-blue-600 rounded-lg hover:bg-blue-700 text-white border-0"
                >
                  Apply Calculation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
