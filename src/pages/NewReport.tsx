"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Badge } from "rizzui";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import {
  ReportData,
  Sample,
  ContainerEntry,
  EMPLOYEES,
  EXTERNAL_CONTAINER_TYPES,
  INTERNAL_CONTAINER_TYPES,
  SENDER_SHOPS,
  SAMPLE_NAMES,
  COLOR_OPTIONS,
} from "@/types/report";
import { ReportPreview } from "@/components/report/ReportPreview";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { reportSchema } from "@/lib/validations/report.schema";
import { z } from "zod";

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
  storageLocation: "store",
});

const getDefaultContainer = (): ContainerEntry => ({
  id: generateId(),
  quantity: 1,
  type: "",
});

export default function NewReport() {
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
      const errors = result.error.issues.map((issue) => {
        const field = issue.path.join(" → ");
        return `${field}: ${issue.message}`;
      });
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors([]);
    return true;
  };

  const handleGenerateReport = () => {
    // Validate using Zod
    const result = reportSchema.safeParse(reportData);

    if (!result.success) {
      // Extract all error messages
      const errors = result.error.issues.map((issue) => {
        const field = issue.path.join(" → ");
        return `${field}: ${issue.message}`;
      });

      setValidationErrors(errors);

      toast({
        title: "Validation Error",
        description: "Please fix the errors before generating the report.",
        variant: "destructive",
      });
      return;
    }

    // Clear validation errors
    setValidationErrors([]);

    // Save report data to localStorage
    try {
      const savedReports = JSON.parse(localStorage.getItem("reports") || "[]");
      const reportToSave = {
        ...reportData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      savedReports.push(reportToSave);
      localStorage.setItem("reports", JSON.stringify(savedReports));

      toast({
        title: "Report Saved",
        description:
          "Report has been saved successfully and is ready for preview.",
      });
    } catch (error) {
      console.error("Failed to save report:", error);
      toast({
        title: "Save Warning",
        description: "Report preview will continue, but saving failed.",
        variant: "destructive",
      });
    }

    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <DashboardLayout>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className="gap-2 border rounded-lg"
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
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Create New Report
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate a sample tracking report.
        </p>
      </div>

      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Please Fix the Following Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validationErrors.map((error, index) => (
                <li
                  key={index}
                  className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2"
                >
                  <span className="mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 pb-24">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refNumber">Reference Number</Label>
                  <Input
                    id="refNumber"
                    placeholder="Enter 6 digits"
                    maxLength={6}
                    value={reportData.refNumber}
                    onChange={(e) =>
                      updateField(
                        "refNumber",
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={reportData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Employee</Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {EMPLOYEES.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => updateField("employee", emp)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        reportData.employee?.id === emp.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground"
                        style={{ backgroundColor: emp.color }}
                      >
                        {emp.initials}
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full text-center">
                        {emp.name.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
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
                        {reportData.employee.active ? (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
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
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold"
                        style={{ backgroundColor: reportData.employee.color }}
                      >
                        {reportData.employee.initials}
                      </div>

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
                              {reportData.employee.email ?? "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 truncate mt-1 sm:mt-0">
                            <Phone className="w-4 h-4" />
                            <span className="truncate">
                              {reportData.employee.phone ?? "Not provided"}
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
                          className="h-10 object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          No signature
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
                  placeholder="Select sender shop"
                  className="input-focus"
                />
              </div>
            </CardContent>
          </Card>

          {/* External Containers */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" />
                  External Containers
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addExternalContainer}
                  className="gap-1 border rounded-lg px-4 py-2"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.externalContainers.map((container, index) => (
                <div
                  key={container.id}
                  className="flex gap-3 items-end animate-fade-in"
                >
                  <div className="w-20">
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
                      options={EXTERNAL_CONTAINER_TYPES.map((type) => ({
                        label: type,
                        value: type,
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

          {/* Internal Containers */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Internal Containers
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addInternalContainer}
                  className="gap-1 border rounded-lg px-4 py-2"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.internalContainers.map((container) => (
                <div
                  key={container.id}
                  className="flex gap-3 items-end animate-fade-in"
                >
                  <div className="w-20">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={container.quantity || ""}
                      onChange={(e) =>
                        updateInternalContainer(container.id, {
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
                        updateInternalContainer(container.id, {
                          type: value as string,
                        })
                      }
                      options={INTERNAL_CONTAINER_TYPES.map((type) => ({
                        label: type,
                        value: type,
                      }))}
                      placeholder="Select type"
                      className="input-focus"
                    />
                  </div>
                  {reportData.internalContainers.length > 1 && (
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => removeInternalContainer(container.id)}
                      className="text-destructive border text-red-500 border-red-500 py-5 px-2 rounded-lg hover:text-destructive/80 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="producedDate">Production Date</Label>
                  <Input
                    id="producedDate"
                    type="date"
                    value={reportData.producedDate}
                    onChange={(e) =>
                      updateField("producedDate", e.target.value)
                    }
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiredDate">Expiry Date</Label>
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

        {/* Right Column - Samples */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base  font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  Samples
                  <Badge
                    variant="flat"
                    color="secondary"
                    className="ml-2 border border-gray-300 h-4 w-4 rounded-full"
                  >
                    {reportData.samples.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSample}
                  className="gap-1 border rounded-lg px-2"
                >
                  <Plus className="w-3 h-3" />
                  Add Sample
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportData.samples.map((sample, index) => (
                <div
                  key={sample.id}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all space-y-4 animate-fade-in"
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
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Sample Name
                      </Label>
                      <Select
                        value={sample.sampleName}
                        onChange={(value) =>
                          updateSample(sample.id, {
                            sampleName: value as string,
                          })
                        }
                        options={SAMPLE_NAMES.map((name) => ({
                          label: name,
                          value: name,
                        }))}
                        placeholder="Select"
                        className="input-focus h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Internal Container
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
                          className="input-focus h-9 w-16"
                          placeholder="Qty"
                        />
                        <Select
                          value={sample.internalContainerType}
                          onChange={(value) =>
                            updateSample(sample.id, {
                              internalContainerType: value as string,
                            })
                          }
                          options={INTERNAL_CONTAINER_TYPES.map((type) => ({
                            label: type,
                            value: type,
                          }))}
                          placeholder="Type"
                          className="input-focus h-9 flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs font-medium mb-1.5 block">
                        Net Weight
                      </Label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          step="0.01"
                          value={sample.netWeight || ""}
                          onChange={(e) =>
                            updateSample(sample.id, {
                              netWeight: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="input-focus h-9"
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
                            { label: "Gram", value: "gram" },
                            { label: "Kilogram", value: "kg" },
                          ]}
                          className="input-focus h-9 "
                        />
                      </div>
                    
                    </div>
                      <div>
                        <Label className="text-xs font-medium mb-1.5 block">
                          Pure/Total
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
                          className="input-focus h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium mb-1.5 block">
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
                          className="input-focus h-9"
                          placeholder="0.00 g"
                        />
                      </div>
                  </div>

                  <div className="space-y-3 gap-6  grid sm:grid-cols-2">
                     <div>
                      <Label className="text-xs font-medium mb-2 block">
                        Storage Location
                      </Label>
                      <Select
                        value={sample.storageLocation}
                        onChange={(value) =>
                          updateSample(sample.id, {
                            storageLocation: value as
                              | "store"
                              | "fridge"
                              | "both",
                          })
                        }
                        options={[
                          { label: "Store", value: "store" },
                          { label: "Fridge", value: "fridge" },
                          { label: "Both", value: "both" },
                        ]}
                        className="input-focus h-9"
                      />
                    </div>
                    <div className="mt-2">
                      <Label className="text-xs font-medium mb-1.5 block">
                        Color Code
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
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {validationErrors.length > 0 && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {validationErrors.length} error(s) found
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  if (validateForm()) {
                    setShowPreview(true);
                  } else {
                    toast({
                      title: "Validation Failed",
                      description: "Please fix all errors before previewing.",
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                size="lg"
                className="min-w-35 border  rounded-lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleGenerateReport}
                size="lg"
                className="min-w-45 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-lg"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
