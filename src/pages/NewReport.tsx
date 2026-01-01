'use client';
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  X
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
  COLOR_OPTIONS
} from "@/types/report";
import { ReportPreview } from "@/components/report/ReportPreview";
import { toast } from "@/hooks/use-toast";

const generateId = () => Math.random().toString(36).substr(2, 9);

const getDefaultSample = (index: number): Sample => ({
  id: generateId(),
  sampleNumber: `S${index + 1}`,
  sampleName: '',
  internalContainerCount: 1,
  internalContainerType: '',
  netWeight: 0,
  weightUnit: 'gram',
  pureOrTotal: 'pure',
  weightUsed: 0,
  colorCode: COLOR_OPTIONS[0].value,
  storageLocation: 'store',
});

const getDefaultContainer = (): ContainerEntry => ({
  id: generateId(),
  quantity: 1,
  type: '',
});

export default function NewReport() {
  const [showPreview, setShowPreview] = useState(false);
  const [reportData, setReportData] = useState<ReportData>({
    refNumber: '',
    employee: null,
    date: new Date().toISOString().split('T')[0],
    externalContainers: [getDefaultContainer()],
    senderShop: '',
    internalContainers: [getDefaultContainer()],
    samples: [getDefaultSample(0)],
    barcodeNumber: '',
    producedDate: '',
    expiredDate: '',
    reportNumber: 'In System',
  });

  const updateField = <K extends keyof ReportData>(field: K, value: ReportData[K]) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const addExternalContainer = () => {
    setReportData(prev => ({
      ...prev,
      externalContainers: [...prev.externalContainers, getDefaultContainer()]
    }));
  };

  const removeExternalContainer = (id: string) => {
    setReportData(prev => ({
      ...prev,
      externalContainers: prev.externalContainers.filter(c => c.id !== id)
    }));
  };

  const updateExternalContainer = (id: string, updates: Partial<ContainerEntry>) => {
    setReportData(prev => ({
      ...prev,
      externalContainers: prev.externalContainers.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  };

  const addInternalContainer = () => {
    setReportData(prev => ({
      ...prev,
      internalContainers: [...prev.internalContainers, getDefaultContainer()]
    }));
  };

  const removeInternalContainer = (id: string) => {
    setReportData(prev => ({
      ...prev,
      internalContainers: prev.internalContainers.filter(c => c.id !== id)
    }));
  };

  const updateInternalContainer = (id: string, updates: Partial<ContainerEntry>) => {
    setReportData(prev => ({
      ...prev,
      internalContainers: prev.internalContainers.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  };

  const addSample = () => {
    setReportData(prev => ({
      ...prev,
      samples: [...prev.samples, getDefaultSample(prev.samples.length)]
    }));
  };

  const removeSample = (id: string) => {
    setReportData(prev => {
      const filtered = prev.samples.filter(s => s.id !== id);
      return {
        ...prev,
        samples: filtered.map((s, i) => ({ ...s, sampleNumber: `S${i + 1}` }))
      };
    });
  };

  const updateSample = (id: string, updates: Partial<Sample>) => {
    setReportData(prev => ({
      ...prev,
      samples: prev.samples.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
  };

  const handleGenerateReport = () => {
    if (!reportData.refNumber || !reportData.employee) {
      toast({
        title: "Missing Information",
        description: "Please fill in the reference number and select an employee.",
        variant: "destructive"
      });
      return;
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
            className="gap-2"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Report</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to generate a sample tracking report.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button 
            onClick={handleGenerateReport}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <FileDown className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1  gap-6">
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
                    onChange={(e) => updateField('refNumber', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={reportData.date}
                    onChange={(e) => updateField('date', e.target.value)}
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
                      onClick={() => updateField('employee', emp)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        reportData.employee?.id === emp.id
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground"
                        style={{ backgroundColor: emp.color }}
                      >
                        {emp.initials}
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full text-center">
                        {emp.name.split(' ')[0]}
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
                          <Badge className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">Active</Badge>
                        ) : (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted-foreground">Inactive</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateField('employee', null)}
                          aria-label="Clear employee selection"
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
                        <div className="font-medium text-sm truncate">{reportData.employee.name}</div>
                        {reportData.employee.role && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">{reportData.employee.role}</div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{reportData.employee.email ?? 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate mt-1 sm:mt-0">
                            <Phone className="w-4 h-4" />
                            <span className="truncate">{reportData.employee.phone ?? 'Not provided'}</span>
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
                        <div className="text-xs text-muted-foreground italic">No signature</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="senderShop">Sender Shop</Label>
                <Select
                  value={reportData.senderShop}
                  onValueChange={(value) => updateField('senderShop', value)}
                >
                  <SelectTrigger className="input-focus">
                    <SelectValue placeholder="Select sender shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {SENDER_SHOPS.map((shop) => (
                      <SelectItem key={shop} value={shop}>{shop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.externalContainers.map((container, index) => (
                <div key={container.id} className="flex gap-3 items-end animate-fade-in">
                  <div className="w-20">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={container.quantity || ''}
                      onChange={(e) => updateExternalContainer(container.id, { 
                        quantity: parseInt(e.target.value) || 0 
                      })}
                      className="input-focus"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Container Type</Label>
                    <Select
                      value={container.type}
                      onValueChange={(value) => updateExternalContainer(container.id, { type: value })}
                    >
                      <SelectTrigger className="input-focus">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXTERNAL_CONTAINER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {reportData.externalContainers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExternalContainer(container.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
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
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportData.internalContainers.map((container) => (
                <div key={container.id} className="flex gap-3 items-end animate-fade-in">
                  <div className="w-20">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={container.quantity || ''}
                      onChange={(e) => updateInternalContainer(container.id, { 
                        quantity: parseInt(e.target.value) || 0 
                      })}
                      className="input-focus"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Container Type</Label>
                    <Select
                      value={container.type}
                      onValueChange={(value) => updateInternalContainer(container.id, { type: value })}
                    >
                      <SelectTrigger className="input-focus">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTERNAL_CONTAINER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {reportData.internalContainers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInternalContainer(container.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
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
              <CardTitle className="text-base font-semibold">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="producedDate">Production Date</Label>
                  <Input
                    id="producedDate"
                    type="date"
                    value={reportData.producedDate}
                    onChange={(e) => updateField('producedDate', e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiredDate">Expiry Date</Label>
                  <Input
                    id="expiredDate"
                    type="date"
                    value={reportData.expiredDate}
                    onChange={(e) => updateField('expiredDate', e.target.value)}
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
                  onChange={(e) => updateField('barcodeNumber', e.target.value)}
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
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  Samples
                  <Badge variant="secondary" className="ml-2">
                    {reportData.samples.length}
                  </Badge>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addSample}
                  className="gap-1"
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
                  className="p-4 rounded-lg border border-border bg-muted/30 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className="font-semibold"
                      style={{ 
                        backgroundColor: `${sample.colorCode}20`,
                        borderColor: sample.colorCode,
                        color: sample.colorCode 
                      }}
                    >
                      {sample.sampleNumber}
                    </Badge>
                    {reportData.samples.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSample(sample.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sample Name</Label>
                      <Select
                        value={sample.sampleName}
                        onValueChange={(value) => updateSample(sample.id, { sampleName: value })}
                      >
                        <SelectTrigger className="input-focus h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {SAMPLE_NAMES.map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Internal Container</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={sample.internalContainerCount || ''}
                          onChange={(e) => updateSample(sample.id, { 
                            internalContainerCount: parseInt(e.target.value) || 0 
                          })}
                          className="input-focus h-9 w-16"
                          placeholder="Qty"
                        />
                        <Select
                          value={sample.internalContainerType}
                          onValueChange={(value) => updateSample(sample.id, { internalContainerType: value })}
                        >
                          <SelectTrigger className="input-focus h-9 flex-1">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {INTERNAL_CONTAINER_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Net Weight</Label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          step="0.01"
                          value={sample.netWeight || ''}
                          onChange={(e) => updateSample(sample.id, { 
                            netWeight: parseFloat(e.target.value) || 0 
                          })}
                          className="input-focus h-9"
                          placeholder="0.00"
                        />
                        <Select
                          value={sample.weightUnit}
                          onValueChange={(value: 'gram' | 'kg') => updateSample(sample.id, { weightUnit: value })}
                        >
                          <SelectTrigger className="input-focus h-9 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gram">g</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Pure/Total</Label>
                      <Select
                        value={sample.pureOrTotal}
                        onValueChange={(value: 'pure' | 'total') => updateSample(sample.id, { pureOrTotal: value })}
                      >
                        <SelectTrigger className="input-focus h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pure">Pure</SelectItem>
                          <SelectItem value="total">Total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Weight Used</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={sample.weightUsed || ''}
                        onChange={(e) => updateSample(sample.id, { 
                          weightUsed: parseFloat(e.target.value) || 0 
                        })}
                        className="input-focus h-9"
                        placeholder="0.00 g"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Color Code</Label>
                      <div className="flex gap-1.5 flex-wrap">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => updateSample(sample.id, { colorCode: color.value })}
                            className={`w-7 h-7 rounded-md border-2 transition-all ${
                              sample.colorCode === color.value 
                                ? 'border-foreground scale-110' 
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Storage Location</Label>
                      <Select
                        value={sample.storageLocation}
                        onValueChange={(value: 'store' | 'fridge' | 'both') => updateSample(sample.id, { storageLocation: value })}
                      >
                        <SelectTrigger className="input-focus h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="store">Store</SelectItem>
                          <SelectItem value="fridge">Fridge</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
