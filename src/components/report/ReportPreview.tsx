import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDown, FileText, Printer } from "lucide-react";
import { ReportData } from "@/types/report";

interface ReportPreviewProps {
  data: ReportData;
}

export function ReportPreview({ data }: ReportPreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).replace(/\//g, '-');
  };

  const getExternalContainersSummary = () => {
    return data.externalContainers
      .filter(c => c.type && c.quantity)
      .map(c => `(${c.quantity}) ${c.type.toLowerCase()}`)
      .join(' + ');
  };

  const getInternalContainersSummary = () => {
    return data.internalContainers
      .filter(c => c.type && c.quantity)
      .map(c => `${c.type}${c.quantity > 1 ? ` ${c.quantity}` : ''}`)
      .join(', ');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end no-print">
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
          <FileDown className="w-4 h-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Download Word
        </Button>
      </div>

      {/* Report Preview Card */}
      <Card className="shadow-lg print:shadow-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="text-sm">
              <span className="font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                Ref. n:
              </span>
              <span className="ml-2 font-medium">{data.refNumber || '-----'}</span>
            </div>
            <div className="text-center">
              <span className="font-semibold">{data.employee?.name || 'Employee Name'}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold bg-warning text-warning-foreground px-2 py-0.5 rounded">
                date a
              </span>
              <span className="ml-2">{formatDate(data.date)}</span>
            </div>
          </div>

          {/* Report Number */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold underline">
              Report number: {data.reportNumber}
            </h2>
          </div>

          <Separator className="my-6" />

          {/* Introduction */}
          <section className="mb-6">
            <h3 className="font-bold mb-2">Introduction:</h3>
            <p className="text-sm text-muted-foreground">
              Produced on date: {formatDate(data.producedDate) || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              Expired on: {formatDate(data.expiredDate) || 'N/A'}
            </p>
            <p className="text-sm mt-2">
              We received everything it was in a good conditions.
            </p>
          </section>

          {/* How it looks outside */}
          <section className="mb-6">
            <h3 className="font-bold mb-2">How it looks out side:</h3>
            <p className="text-sm">
              We received{' '}
              <span className="bg-accent/20 px-1 rounded">
                {getExternalContainersSummary() || 'containers'}
              </span>
              , like the one used for{' '}
              <span className="bg-warning/20 px-1 rounded">
                {data.senderShop?.toLowerCase() || 'shop'}
              </span>
              , it has{' '}
              <span className="text-muted-foreground">
                ({data.barcodeNumber || 'barcode number'})
              </span>
              .
            </p>
            <p className="text-sm mt-1">
              Received by{' '}
              <span className="bg-accent/20 px-1 rounded">
                {data.employee?.name || 'employee name'}
              </span>
              , on date{' '}
              <span className="bg-warning/20 px-1 rounded">
                {formatDate(data.date)}
              </span>
              .
            </p>
          </section>

          {/* Storage */}
          <section className="mb-6">
            <h3 className="font-bold mb-2">Insure its in good storage:</h3>
            <p className="text-sm">
              We put the samples in{' '}
              <span className="bg-success/20 px-1 rounded">
                {data.samples.length > 0 
                  ? [...new Set(data.samples.map(s => s.storageLocation))].join(' or ') 
                  : 'store or fridge'}
              </span>
              .
            </p>
          </section>

          {/* What was inside */}
          <section className="mb-6">
            <h3 className="font-bold mb-3">What was inside:</h3>
            <p className="text-sm mb-4">
              We open samples it contain food and drinks.
            </p>

            {/* Containers Summary */}
            {data.internalContainers.filter(c => c.type).length > 0 && (
              <div className="mb-4">
                {data.internalContainers
                  .filter(c => c.type)
                  .map((container, idx) => (
                    <p key={idx} className="text-sm">
                      - {container.type} {container.quantity > 1 ? `${container.quantity}:` : ':'}
                    </p>
                  ))}
              </div>
            )}

            {/* Samples Table */}
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
                  {data.samples.map((sample, index) => (
                    <tr key={sample.id} className="hover:bg-muted/30">
                      <td className="border border-border px-3 py-2">
                        <span className="text-xs text-muted-foreground">
                          ({sample.internalContainerCount || 1})
                        </span>
                      </td>
                      <td className="border border-border px-3 py-2">
                        <span 
                          className="px-2 py-0.5 rounded text-primary-foreground font-medium text-xs"
                          style={{ backgroundColor: sample.colorCode }}
                        >
                          {sample.sampleNumber}
                        </span>
                      </td>
                      <td className="border border-border px-3 py-2">
                        <span 
                          className="px-2 py-0.5 rounded text-primary-foreground text-xs"
                          style={{ backgroundColor: '#22c55e' }}
                        >
                          {sample.sampleName || 'Food'}
                        </span>
                        {' '}
                        <span 
                          className="px-2 py-0.5 rounded text-primary-foreground text-xs"
                          style={{ backgroundColor: '#06b6d4' }}
                        >
                          in {sample.internalContainerCount || 1} {sample.internalContainerType || 'container'}
                        </span>
                      </td>
                      <td className="border border-border px-3 py-2">
                        <span 
                          className="px-2 py-0.5 rounded text-primary-foreground text-xs"
                          style={{ backgroundColor: '#ec4899' }}
                        >
                          {sample.netWeight || 0} {sample.weightUnit === 'kg' ? 'kg' : 'gram'}
                          {sample.pureOrTotal === 'pure' ? ' (Net weight)' : ' (total weight)'}
                        </span>
                        {' '}
                        <span 
                          className="px-2 py-0.5 rounded text-primary-foreground text-xs"
                          style={{ backgroundColor: '#f97316' }}
                        >
                          {sample.pureOrTotal}
                        </span>
                      </td>
                      <td className="border border-border px-3 py-2">
                        <span 
                          className="px-2 py-0.5 rounded text-primary-foreground text-xs"
                          style={{ backgroundColor: '#6366f1' }}
                        >
                          {sample.weightUsed || 0} gram
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Signature */}
          <section className="mt-8">
            <h3 className="font-bold">Signature:</h3>
            <div className="mt-4 h-16 border-b-2 border-dashed border-border w-64"></div>
          </section>
        </CardContent>
      </Card>

      {/* Alternative Compact View */}
      <Card className="shadow-lg print:shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Compact Report View</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          {/* Compact Header */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <span>
              <span className="font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                Ref. n:
              </span>
              {data.refNumber || '55555'}
            </span>
            <span className="font-semibold">{data.employee?.name || 'employee name'}</span>
            <span>
              <span className="font-semibold bg-warning text-warning-foreground px-2 py-0.5 rounded">
                date a
              </span>
            </span>
          </div>

          <p className="text-sm mb-2">
            {getExternalContainersSummary() || '(2) white plastic bags + (2) box'} from {data.senderShop?.toLowerCase() || 'fish shop'}
          </p>

          {/* Compact Container List */}
          {data.internalContainers.filter(c => c.type).length > 0 && (
            <p className="text-sm mb-2">
              - {getInternalContainersSummary()}:
            </p>
          )}

          {/* Compact Samples */}
          {data.samples.map((sample) => (
            <p key={sample.id} className="text-sm mb-1">
              <span 
                className="px-1.5 py-0.5 rounded text-primary-foreground font-semibold text-xs"
                style={{ backgroundColor: sample.colorCode }}
              >
                {sample.sampleNumber}
              </span>
              :{' '}
              <span 
                className="px-1 py-0.5 rounded text-primary-foreground text-xs"
                style={{ backgroundColor: '#22c55e' }}
              >
                {sample.sampleName || 'Food'}
              </span>
              {' '}
              <span 
                className="px-1 py-0.5 rounded text-primary-foreground text-xs"
                style={{ backgroundColor: '#06b6d4' }}
              >
                in {sample.internalContainerCount} of container
              </span>
              {' '}Net weight:{' '}
              <span 
                className="px-1 py-0.5 rounded text-primary-foreground text-xs"
                style={{ backgroundColor: '#ec4899' }}
              >
                {sample.netWeight} {sample.weightUnit === 'gram' ? 'g' : 'kg'}
              </span>
              {' '}
              <span 
                className="px-1 py-0.5 rounded text-primary-foreground text-xs"
                style={{ backgroundColor: '#f97316' }}
              >
                {sample.pureOrTotal}
              </span>
              {' '}Used:{' '}
              <span 
                className="px-1 py-0.5 rounded text-primary-foreground text-xs"
                style={{ backgroundColor: '#6366f1' }}
              >
                {sample.weightUsed} g
              </span>
            </p>
          ))}

          {/* Signature */}
          <div className="mt-6">
            <h3 className="font-bold text-sm">Signature:</h3>
            <div className="mt-2 h-12 border-b-2 border-dashed border-border w-48"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
