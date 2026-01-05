import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDown, FileText } from "lucide-react";
import { ReportData } from "@/types/report";
import { generateReportPDF } from "@/lib/export/report-pdf";
import { generateReportWord } from "@/lib/export/report-word";
import { toast } from "@/hooks/use-toast";

interface ReportPreviewProps {
  data: ReportData;
}

export function ReportPreview({ data }: ReportPreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const getExternalContainersSummary = () => {
    if (!data.externalContainers) return "";
    return data.externalContainers
      .filter((c) => c.type && c.quantity)
      .map((c) => `(${c.quantity}) ${c.type.toLowerCase()}`)
      .join(" + ");
  };

  const getInternalContainersSummary = () => {
    if (!data.internalContainers) return "";
    return data.internalContainers
      .filter((c) => c.type && c.quantity)
      .map((c) => `${c.type}${c.quantity > 1 ? ` ${c.quantity}` : ""}`)
      .join(", ");
  };

  const handleDownloadPDF = () => {
    try {
      generateReportPDF(data);
      toast({
        title: "Success",
        description: "PDF report generated successfully!",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = async () => {
    try {
      await generateReportWord(data);
      toast({
        title: "Success",
        description: "Word report downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate Word report.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex gap-3 justify-end no-print">
        <Button
          onClick={handleDownloadPDF}
          className="bg-gray-800 text-white hover:opacity-90 gap-2"
        >
          <FileDown className="w-4 h-4" />
          Download PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadWord}
          className="gap-2 bg-gray-800 text-white"
        >
          <FileText className="w-4 h-4" />
          Download Word
        </Button>
      </div>

      <Card className="shadow-lg print:shadow-none">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="text-sm">
              <span className="font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                Ref. n:
              </span>
              <span className="ml-2 font-medium">
                {data.refNumber || "-----"}
              </span>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {data.employee?.name || "Employee Name"}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold bg-warning text-warning-foreground px-2 py-0.5 rounded">
                date a
              </span>
              <span className="ml-2">{formatDate(data.date)}</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold underline">
              Report number: {data.reportNumber}
            </h2>
          </div>

          <Separator className="my-6" />

          <section className="mb-6">
            <h3 className="font-bold mb-2">Introduction:</h3>
            <p className="text-sm text-muted-foreground">
              Produced on date: {formatDate(data.producedDate) || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              Expired on: {formatDate(data.expiredDate) || "N/A"}
            </p>
            <p className="text-sm mt-2">
              We received everything it was in a good conditions.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-bold mb-2">How it looks out side:</h3>
            <p className="text-sm">
              We received{" "}
              <span className="bg-accent/20 px-1 rounded">
                {getExternalContainersSummary() || "containers"}
              </span>{" "}
              like the one used for{" "}
              <span className="bg-warning/20 px-1 rounded">
                {data.senderShop?.toLowerCase() || "shop"}
              </span>
              , it has{" "}
              <span className="text-muted-foreground">
                ({data.barcodeNumber || "barcode number"})
              </span>
              .
            </p>
            <p className="text-sm mt-1">
              Received by{" "}
              <span className="bg-accent/20 px-1 rounded">
                {data.employee?.name || "employee name"}
              </span>
              , on date{" "}
              <span className="bg-warning/20 px-1 rounded">
                {formatDate(data.date)}
              </span>
              .
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-bold mb-2">Insure its in good storage:</h3>
            <p className="text-sm">
              We put the samples in{" "}
              <span className="bg-success/20 px-1 rounded">
                {data.samples && data.samples.length > 0
                  ? [
                      ...new Set(data.samples.map((s) => s.storageLocation)),
                    ].join(" or ")
                  : "store or fridge"}
              </span>
              .
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-bold mb-3">What was inside:</h3>
            <p className="text-sm mb-4">
              We open samples it contain food and drinks.
            </p>

            {data.internalContainers &&
              data.internalContainers.filter((c) => c.type).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Internal Containers:</p>
                  {data.internalContainers
                    .filter((c) => c.type)
                    .map((container, idx) => (
                      <p key={idx} className="text-sm">
                        - {container.type}{" "}
                        {container.quantity > 1
                          ? `(Quantity: ${container.quantity})`
                          : ""}
                      </p>
                    ))}
                </div>
              )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-accent/10">
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Outer container
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Sample number
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      How sample looks like
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      How it weight
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      used
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.samples &&
                    data.samples.map((sample, index) => (
                      <tr key={sample.id} className="hover:bg-muted/30">
                        <td className="border border-border px-3 py-2">
                          {sample.internalContainers && sample.internalContainers.length > 0 ? (
                            <div className="space-y-1">
                              {sample.internalContainers.map((container, idx) => (
                                <div key={idx} className="text-xs text-muted-foreground">
                                  ({container.quantity}) {container.type}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              (1) container
                            </span>
                          )}
                        </td>
                        <td className="border border-border px-3 py-2">
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-white font-medium text-xs">
                            {sample.sampleNumber}
                          </span>
                        </td>
                        <td className="border border-border px-3 py-2">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-gray-700 text-white text-xs">
                              {sample.sampleName || "Food"}
                            </span>
                            {sample.systemCaseNumber && (
                              <span className="px-2 py-0.5 rounded bg-gray-500 text-white text-xs block mt-1">
                                {sample.systemCaseNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border border-border px-3 py-2">
                          <span className="px-2 py-0.5 rounded bg-gray-700 text-white text-xs">
                            {sample.netWeight || 0}{" "}
                            {sample.weightUnit === "kg" ? "kg" : "gram"}
                            {sample.pureOrTotal === "pure"
                              ? " (Net weight)"
                              : " (total weight)"}
                          </span>{" "}
                          <span className="px-2 py-0.5 rounded bg-gray-600 text-white text-xs">
                            {sample.pureOrTotal}
                          </span>
                        </td>
                        <td className="border border-border px-3 py-2">
                          <span className="px-2 py-0.5 rounded bg-gray-700 text-white text-xs">
                            {sample.weightUsed || 0} gram
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8">
            {data.employee?.signature ? (
              <div className="space-y-2">
                <img
                  src={data.employee.signature}
                  alt="Employee Signature"
                  className="h-20 w-auto max-w-50 border border-border rounded p-2 bg-white object-contain"
                />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Name: {data.employee.name || "N/A"}</p>
                  <p>Position: {data.employee.roles?.name || "analyst"}</p>
                  <p>Date: {formatDate(data.date)}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mt-2 h-16 border-b-2 border-dashed border-border w-64"></div>
                <p className="text-sm text-muted-foreground italic mt-2">
                  [Signature not provided]
                </p>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
