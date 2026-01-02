"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Badge } from "rizzui";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  FileDown,
  Eye,
  User,
  Package,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
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
import { ReportPreview } from "@/components/report/ReportPreview";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { reportSchema } from "@/lib/validations/report.schema";
import { useAppDispatch } from "@/store/hooks";
import { addReport } from "@/store/slices/reportsSlice";

const generateId = () => Math.random().toString(36).substr(2, 9);

const getDefaultSample = (index: number): Sample => ({
  id: generateId(),
  sampleNumber: `S${index + 1}`,
  sampleName: "",
  internalContainerCount: 1,
  internalContainerType: "",
  netWeight: 0,
  weightUnit: "gram",
  pureOrTotal: "pure",
  weightUsed: 0,
  colorCode: COLOR_OPTIONS[0].value,
  storageLocation: "",
});

const getDefaultContainer = (): ContainerEntry => ({
  id: generateId(),
  quantity: 1,
  type: "",
});

export default function NewReport() {
  const t = useTranslations("newReport");
  const tCommon = useTranslations("common");
  const [showPreview, setShowPreview] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();

  const { data: employees, loading: employeesLoading } = useEmployees();
  const { data: containerTypes, loading: containerTypesLoading } =
    useContainerTypes();
  const { data: sampleNames, loading: sampleNamesLoading } = useSampleNames();

  // Hardcoded storage location options (temporary): shop, fridge, both
  const STORAGE_LOCATION_OPTIONS = [
    { label: t("shop"), value: "shop" },
    { label: t("fridge"), value: "fridge" },
    { label: t("both"), value: "both" },
  ];

  const externalContainerTypes = containerTypes.filter(
    (ct) => ct.category === "external"
  );
  const internalContainerTypes = containerTypes.filter(
    (ct) => ct.category === "internal"
  );
  const [reportData, setReportData] = useState<ReportData>({
    refNumber: "",
    employee: null,
    date: new Date().toISOString().split("T")[0],
    externalContainers: [getDefaultContainer()],
    senderShop: "",
    internalContainers: [getDefaultContainer()],
    samples: [getDefaultSample(0)],
    barcodeNumber: "",
    producedDate: "",
    expiredDate: "",
    reportNumber: "In System",
  });

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
    setReportData((prev) => ({
      ...prev,
      samples: [...prev.samples, getDefaultSample(prev.samples.length)],
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
    const result = reportSchema.safeParse(reportData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      setFieldErrors(errors);

      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleGenerateReport = () => {
    const result = reportSchema.safeParse(reportData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      setFieldErrors(errors);

      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      toast({
        title: t("validationError"),
        description: t("pleaseFillAllFields"),
        variant: "destructive",
      });
      return;
    }

    setFieldErrors({});

    const reportToSave = {
      ...reportData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    dispatch(addReport(reportToSave));

    toast({
      title: t("reportSaved"),
      description: t("reportSavedSuccessfully"),
    });

    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <DashboardLayout>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className="gap-2 border rounded-lg text-sm"
          >
            ← Back to Form
          </Button>
        </div>
        <ReportPreview data={reportData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {t("createNewReport")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("fillInDetails")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-24">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                {t("reportDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2" data-error={!!fieldErrors.refNumber}>
                  <Label htmlFor="refNumber">{t("referenceNumber")} *</Label>
                  <Input
                    id="refNumber"
                    placeholder={t("refNumberPlaceholder")}
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
                  <Label htmlFor="date">{t("date")}</Label>
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
                <Label>{t("selectEmployee")} *</Label>
                {employeesLoading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    {t("noEmployeesFound")}
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
                              {reportData.employee.email ?? t("notProvided")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 truncate mt-1 sm:mt-0">
                            <Phone className="w-4 h-4" />
                            <span className="truncate">
                              {reportData.employee.phone ?? t("notProvided")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <p>{t("signature")}</p>
                      {reportData.employee.signature ? (
                        <img
                          src={reportData.employee.signature}
                          alt={`${reportData.employee.name} signature`}
                          className="h-16 w-40 rounded-md"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          {t("noSignature")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="senderShop">{t("senderShop")}</Label>
                <Select
                  value={reportData.senderShop}
                  onChange={(value) =>
                    updateField("senderShop", value as string)
                  }
                  options={SENDER_SHOPS.map((shop) => ({
                    label: shop,
                    value: shop,
                  }))}
                  placeholder={t("selectShop")}
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
                  {t("externalContainers")}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addExternalContainer}
                  className="gap-1 border rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">{t("add")}</span>
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
                    <Label className="text-xs">{t("qty")}</Label>
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
                    <Label className="text-xs">{t("containerType")}</Label>
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
                      placeholder={t("selectType")}
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
                  {t("sampleInformation")}
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
                  <span className="hidden sm:inline">{t("addSample")}</span>
                  <span className="sm:hidden">{t("add")}</span>
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
                        {t("delete")}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        {t("sampleName")}
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
                        placeholder={t("selectSampleName")}
                        className="input-focus h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        {t("internalContainerType")}
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
                          placeholder={t("selectType")}
                          className="input-focus h-10 flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        {t("netWeight")}
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
                        {t("storageLocation")}
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
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        {t("pureOrTotal")}
                      </Label>
                      <Select
                        value={sample.pureOrTotal}
                        onChange={(value) =>
                          updateSample(sample.id, {
                            pureOrTotal: value as "pure" | "total",
                          })
                        }
                        options={[
                          { label: t("pure"), value: "pure" },
                          { label: t("total"), value: "total" },
                        ]}
                        className="input-focus h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium mb-1.5 block">
                        {t("weightUsed")} (g)
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        {t("colorCode")}
                      </Label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() =>
                              updateSample(sample.id, {
                                colorCode: color.value,
                              })
                            }
                            className={cn(
                              "w-7 h-7 rounded-md border-2 transition-all hover:scale-105",
                              sample.colorCode === color.value
                                ? "ring-2 ring-blue-500 ring-offset-1"
                                : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
                        <input
                          type="color"
                          value={sample.colorCode}
                          onChange={(e) =>
                            updateSample(sample.id, {
                              colorCode: e.target.value,
                            })
                          }
                          className="w-12 h-7 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-400 transition-colors"
                          title="Custom Color"
                        />
                        <div
                          className="w-7 h-7 rounded border-2 border-gray-400 dark:border-gray-500"
                          style={{ backgroundColor: sample.colorCode }}
                          title="Current Selection"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Additional Info */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold">
              {t("additionalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="producedDate">{t("producedDate")}</Label>
                <Input
                  id="producedDate"
                  type="date"
                  value={reportData.producedDate}
                  onChange={(e) => updateField("producedDate", e.target.value)}
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiredDate">{t("expiredDate")}</Label>
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
              <Label htmlFor="barcodeNumber">{t("barcodeNumber")}</Label>
              <Input
                id="barcodeNumber"
                placeholder={t("barcodePlaceholder")}
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
              onClick={() => {
                if (validateForm()) {
                  setShowPreview(true);
                } else {
                  toast({
                    title: t("validationError"),
                    description: t("pleaseFillAllFields"),
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              size="lg"
              className="min-w-28 sm:min-w-35 border rounded-lg text-sm sm:text-base px-3 sm:px-4"
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              {t("preview")}
            </Button>
            <Button
              onClick={handleGenerateReport}
              size="lg"
              className="min-w-32 sm:min-w-45 bg-gray-800 text-white rounded-lg text-sm sm:text-base px-3 sm:px-4"
            >
              <FileDown className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t("generateReport")}</span>
              <span className="sm:hidden">{t("createReport")}</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

