import { Card, CardContent } from "@/components/ui/card";
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
    return date.toLocaleDateString("ar-EG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getExternalContainersSummary = () => {
    if (!data.externalContainers) return "";
    return data.externalContainers
      .filter((c) => c.type && c.quantity)
      .map((c) => `(${c.quantity}) ${c.type}`)
      .join(" + ");
  };

  const getInternalContainersSummary = () => {
    if (!data.internalContainers) return "";
    return data.internalContainers
      .filter((c) => c.type && c.quantity)
      .map((c) => `${c.type}${c.quantity > 1 ? ` ${c.quantity}` : ""}`)
      .join(" و ");
  };

  const handleDownloadPDF = () => {
    try {
      generateReportPDF(data);
      toast({
        title: "نجح",
        description: "تم إنشاء تقرير PDF بنجاح!",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء تقرير PDF.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = async () => {
    try {
      await generateReportWord(data);
      toast({
        title: "نجح",
        description: "تم تنزيل تقرير Word بنجاح!",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء تقرير Word.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex gap-3 justify-end no-print">
        <Button
          onClick={handleDownloadPDF}
          className="bg-red-600 text-white hover:bg-red-700 gap-2"
        >
          <FileDown className="w-4 h-4" />
          Download PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadWord}
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <FileText className="w-4 h-4" />
          Download Word
        </Button>
      </div>

      <Card className="shadow-lg print:shadow-none">
        <CardContent className="p-8" dir="rtl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 text-sm">
            <div>
              <span className="font-bold">المرجع رقم: </span>
              <span className="font-semibold">{data.refNumber || "-----"}</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg">رقم التقرير في النظام</span>
            </div>
            <div>
              <span className="font-bold">التاريخ: </span>
              <span>{formatDate(data.date)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Additional Information Section */}
          {(data.bagNumber ||
            data.dispatchNumber ||
            data.barcodeNumber ||
            data.dateReceivedByDepartment ||
            data.systemRegistrationDate) && (
            <section className="mb-6">
              <h3 className="font-bold text-lg mb-3">معلومات إضافية:</h3>
              <div className="space-y-2 text-sm pr-4">
                {data.bagNumber && (
                  <p>
                    <span className="font-semibold">رقم الحقيبة: </span>
                    {data.bagNumber}
                  </p>
                )}
                {data.dispatchNumber && (
                  <p>
                    <span className="font-semibold">رقم الإرسال: </span>
                    {data.dispatchNumber}
                  </p>
                )}
                {data.barcodeNumber && (
                  <p>
                    <span className="font-semibold">رقم الباركود: </span>
                    {data.barcodeNumber}
                  </p>
                )}
                {data.dateReceivedByDepartment && (
                  <p>
                    <span className="font-semibold">
                      تاريخ الاستلام بالقسم:{" "}
                    </span>
                    {formatDate(data.dateReceivedByDepartment)}
                  </p>
                )}
                {data.systemRegistrationDate && (
                  <p>
                    <span className="font-semibold">
                      تاريخ التسجيل في النظام:{" "}
                    </span>
                    {formatDate(data.systemRegistrationDate)}
                  </p>
                )}
                {data.consumerNotes && (
                  <p>
                    <span className="font-semibold">ملاحظات المستهلك: </span>
                    {data.consumerNotes}
                  </p>
                )}
              </div>
            </section>
          )}

          <Separator className="my-4" />

          {/* External Appearance Section */}
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3">المظهر الخارجي:</h3>
            <div className="space-y-2 text-sm pr-4">
              <p>
                تم استلام{" "}
                {data.externalContainers &&
                data.externalContainers.length > 0 ? (
                  <span className="font-semibold">
                    {data.externalContainers
                      .filter((c) => c.type && c.quantity)
                      .map((c) => `(${c.quantity}) ${c.type}`)
                      .join(" + ")}
                  </span>
                ) : (
                  "حاويات"
                )}{" "}
                {data.senderShop && (
                  <>
                    مثل تلك المستخدمة في{" "}
                    <span className="font-semibold">{data.senderShop}</span>
                  </>
                )}
                {data.barcodeNumber && (
                  <>، رقم الباركود ({data.barcodeNumber})</>
                )}
                {data.bagNumber && <>، رقم الحقيبة ({data.bagNumber})</>}
                {data.dispatchNumber && (
                  <>، رقم الإرسال ({data.dispatchNumber})</>
                )}
                .
              </p>
              <p>
                تم الاستلام بواسطة{" "}
                <span className="font-semibold">
                  {data.employee?.name || "اسم الموظف"}
                </span>
                ، بتاريخ{" "}
                <span className="font-semibold">{formatDate(data.date)}</span>.
              </p>
            </div>
          </section>

          <Separator className="my-4" />

          {/* Storage Section */}
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3">التأكد من التخزين الجيد:</h3>
            <p className="text-sm pr-4">
              تم وضع العينات في{" "}
              <span className="font-semibold">
                {data.samples && data.samples.length > 0
                  ? [
                      ...new Set(
                        data.samples.map((s) => s.storageLocation || "المخزن")
                      ),
                    ].join(" أو ")
                  : "المخزن أو الثلاجة"}
              </span>
              .
            </p>
          </section>

          <Separator className="my-4" />

          {/* Contents Section */}
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3">ما كان بالداخل:</h3>
            <p className="text-sm pr-4 mb-4">
              تم فتح العينات وتحتوي على أطعمة ومشروبات.
            </p>

            {/* Internal Containers */}
            {data.internalContainers &&
              data.internalContainers.filter((c) => c.type).length > 0 && (
                <div className="mb-4 pr-4">
                  <p className="text-sm font-semibold mb-2">
                    الحاويات الداخلية:
                  </p>
                  <div className="space-y-1">
                    {data.internalContainers
                      .filter((c) => c.type)
                      .map((container, idx) => (
                        <p key={idx} className="text-sm pr-4">
                          • {container.type}
                          {container.quantity > 1 &&
                            ` (الكمية: ${container.quantity})`}
                        </p>
                      ))}
                  </div>
                </div>
              )}

            {/* Samples Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-sm" dir="rtl">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold">
                      الحاوية الخارجية
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold">
                      رقم العينة
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold">
                      شكل العينة
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold">
                      الوزن
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold">
                      المستخدم
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold">
                      ملاحظات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.samples &&
                    data.samples.map((sample, index) => (
                      <tr
                        key={sample.id}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800/50"
                        }
                      >
                        <td className="border border-gray-300 dark:border-gray-700 px-3 py-3">
                          {sample.internalContainers &&
                          sample.internalContainers.length > 0 ? (
                            <div className="space-y-1">
                              {sample.internalContainers.map(
                                (container, idx) => (
                                  <div key={idx} className="text-xs">
                                    ({container.quantity}) {container.type}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-xs">(1) حاوية</span>
                          )}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-3 py-3">
                          <span className="inline-block px-2 py-1 rounded bg-blue-600 text-white font-medium text-xs">
                            {sample.sampleNumber}
                          </span>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-3 py-3">
                          <div className="space-y-1">
                            <div>
                              <span className="inline-block px-2 py-1 rounded bg-green-600 text-white text-xs">
                                {sample.sampleName || "طعام"}
                              </span>
                            </div>
                            {sample.systemCaseNumber && (
                              <div>
                                <span className="inline-block px-2 py-1 rounded bg-gray-600 text-white text-xs">
                                  {sample.systemCaseNumber}
                                </span>
                              </div>
                            )}
                            {sample.internalContainers &&
                              sample.internalContainers.length > 0 && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  في{" "}
                                  {sample.internalContainers
                                    .map((c) => c.type)
                                    .join(" و ")}
                                </div>
                              )}
                          </div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-3 py-3">
                          <div className="space-y-1">
                            <div>
                              {sample.isSwabOnly ? (
                                <span className="inline-block px-2 py-1 rounded bg-green-600 text-white text-xs">
                                  مسحة فقط
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 rounded bg-purple-600 text-white text-xs">
                                  {sample.netWeight || 0}{" "}
                                  {sample.weightUnit === "kg" ? "كجم" : "جرام"}
                                </span>
                              )}
                            </div>
                            {!sample.isSwabOnly && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                (
                                {sample.pureOrTotal === "pure"
                                  ? "الوزن الصافي"
                                  : "الوزن الإجمالي"}
                                )
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-3 py-3">
                          {sample.isSwabOnly ? (
                            <span className="text-xs text-gray-500">-</span>
                          ) : (
                            <span className="inline-block px-2 py-1 rounded bg-orange-600 text-white text-xs">
                              {sample.weightUsed || 0} جرام
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-3 py-3">
                          <span className="text-xs whitespace-pre-wrap">
                            {sample.weightNotes || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <Separator className="my-6" />

          {/* Unexamined Items Section - if exists */}
          {data.unexaminedItems && (
            <>
              <section className="mb-6">
                <h3 className="font-bold text-lg mb-3">
                  العناصر غير المفحوصة:
                </h3>
                <p className="text-sm pr-4 whitespace-pre-wrap">
                  {data.unexaminedItems}
                </p>
              </section>
              <Separator className="my-6" />
            </>
          )}

          {/* Signature Section */}
          <section className="mt-8">
            <h3 className="font-bold text-lg mb-4">التوقيع:</h3>
            {data.employee?.signature ? (
              <div className="space-y-3 pr-4">
                <img
                  src={data.employee.signature}
                  alt="توقيع الموظف"
                  className="h-24 w-auto max-w-xs border border-gray-300 rounded p-2 bg-white object-contain"
                />
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-semibold">الاسم: </span>
                    {data.employee.name || "غير محدد"}
                  </p>
                  <p>
                    <span className="font-semibold">المنصب: </span>
                    {data.employee.roles?.name || "محلل"}
                  </p>
                  <p>
                    <span className="font-semibold">التاريخ: </span>
                    {formatDate(data.date)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="pr-4">
                <div className="mt-2 h-16 border-b-2 border-dashed border-gray-400 w-64"></div>
                <p className="text-sm text-gray-500 italic mt-2">
                  [التوقيع غير متوفر]
                </p>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
