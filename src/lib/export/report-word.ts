import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  ImageRun,
  HeightRule,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "@/types/report";

export const generateReportWordBlob = async (
  data: ReportData
): Promise<Blob> => {
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "غير محدد";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Prepare signature image if available
  let signatureImageBytes: ArrayBuffer | null = null;
  if (data.employee?.signature) {
    try {
      const response = await fetch(data.employee.signature);
      signatureImageBytes = await response.arrayBuffer();
    } catch (error) {
      console.error("Error loading signature image:", error);
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(1.0),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(1.0),
            },
          },
        },
        children: [
          // Header - RTL layout (Date | Employee Name | Ref Number)
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${formatDate(data.date)} :التاريخ          ${
                  data.employee?.name || "اسم الموظف"
                }          ${data.refNumber || "-----"} :المرجع رقم`,
                size: 22,
                bold: true,
                rightToLeft: true,
              }),
            ],
          }),

          // Report number (system)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `رقم التقرير في النظام: ${
                  data.reportNumber || "في النظام"
                }`,
                bold: true,
                size: 26,
                rightToLeft: true,
              }),
            ],
          }),

          // Introduction
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: ":المقدمة",
                bold: true,
                size: 24,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${formatDate(data.producedDate)} :تاريخ الإنتاج`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${formatDate(data.producedDate)} :تاريخ الإنتاج`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${formatDate(data.expiredDate)} :تاريخ انتهاء الصلاحية`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: ".تم استلام كل شيء وكان في حالة جيدة",
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          // External appearance
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: ":المظهر الخارجي",
                bold: true,
                size: 24,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `تم استلام ${(data.externalContainers || [])
                  .filter((c) => c.type && c.quantity)
                  .map((c) => `(${c.quantity}) ${c.type}`)
                  .join(" + ")}${
                  data.senderShop
                    ? ` مثل تلك المستخدمة في ${data.senderShop}`
                    : ""
                }${
                  data.barcodeNumber
                    ? `، رقم الباركود (${data.barcodeNumber})`
                    : ""
                }.`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `.تم الاستلام بواسطة ${
                  data.employee?.name || "اسم الموظف"
                }، بتاريخ ${formatDate(data.date)}`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          // Storage
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: ":التأكد من التخزين الجيد",
                bold: true,
                size: 24,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `.تم وضع العينات في ${[
                  ...new Set(
                    (data.samples || []).map(
                      (s) => s.storageLocation || "المخزن"
                    )
                  ),
                ].join(" أو ")}`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          // Internal containers
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: ":ما كان بالداخل",
                bold: true,
                size: 24,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: ".تم فتح العينات وتحتوي على أطعمة ومشروبات",
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          // List internal containers if available
          ...(data.internalContainers || [])
            .filter((c) => c.type && c.quantity)
            .map(
              (container) =>
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  spacing: { after: 60 },
                  children: [
                    new TextRun({
                      text: `${container.type} ${container.quantity}x •`,
                      size: 22,
                      rightToLeft: true,
                    }),
                  ],
                })
            ),

          new Paragraph({
            spacing: { after: 150 },
            children: [new TextRun({ text: "", size: 10, rightToLeft: true })],
          }),

          // Samples Table - Arabic RTL
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 3, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 3, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 3, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 3, color: "000000" },
              insideHorizontal: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
              },
              insideVertical: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
              },
            },
            rows: [
              // Header Row - RTL
              new TableRow({
                tableHeader: true,
                height: { value: 600, rule: HeightRule.ATLEAST },
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "المستخدم",
                            bold: true,
                            size: 22,
                            rightToLeft: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "34495E" },
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "الوزن",
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            rightToLeft: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "34495E" },
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "شكل العينة",
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            rightToLeft: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "34495E" },
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "رقم العينة",
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            rightToLeft: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "34495E" },
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "الحاوية الخارجية",
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            rightToLeft: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "34495E" },
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Data Rows
              ...(data.samples || []).map((sample, idx) => {
                const containerCounts =
                  (sample.internalContainers || [])
                    .filter((c) => c.type && c.quantity)
                    .map((c) => `(${c.quantity})`)
                    .join(" + ") || "(1)";

                const containerDetails =
                  (sample.internalContainers || [])
                    .filter((c) => c.type && c.quantity)
                    .map((c) => `${c.type} ${c.quantity}x`)
                    .join(" + ") || "حاوية";

                const sampleDetails = [
                  sample.sampleName || "طعام",
                  `في ${containerDetails}`,
                  sample.systemCaseNumber || "",
                ]
                  .filter(Boolean)
                  .join("\n");

                return new TableRow({
                  height: { value: 500, rule: HeightRule.ATLEAST },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `${sample.weightUsed || 0} جرام`,
                              size: 20,
                              rightToLeft: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F8F9FA" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `${sample.netWeight || 0} ${
                                sample.weightUnit === "kg" ? "كجم" : "جرام"
                              }\n(${
                                (sample.pureOrTotal || "pure") === "pure"
                                  ? "الوزن الصافي"
                                  : "الوزن الإجمالي"
                              })`,
                              size: 20,
                              rightToLeft: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F8F9FA" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: sampleDetails,
                              size: 20,
                              rightToLeft: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F8F9FA" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: sample.sampleNumber || "",
                              size: 20,
                              rightToLeft: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F8F9FA" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: containerCounts,
                              size: 20,
                              rightToLeft: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F8F9FA" },
                    }),
                  ],
                });
              }),
            ],
          }),

          // Spacing before signature
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Signature image if available
          ...(signatureImageBytes
            ? [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 150 },
                  children: [
                    new ImageRun({
                      data: new Uint8Array(signatureImageBytes),
                      transformation: {
                        width: 200,
                        height: 80,
                      },
                      type: "png",
                    }),
                  ],
                }),
              ]
            : [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 150 },
                  children: [
                    new TextRun({
                      text: "_____________________",
                      size: 22,
                      rightToLeft: true,
                    }),
                  ],
                }),
              ]),

          // Employee details
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 70 },
            children: [
              new TextRun({
                text: `${data.employee?.name || "غير محدد"} :الاسم`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 70 },
            children: [
              new TextRun({
                text: `${data.employee?.roles?.name || "محلل"} :المنصب`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${formatDate(data.date)} :التاريخ`,
                size: 22,
                rightToLeft: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Return blob
  return await Packer.toBlob(doc);
};
/**
 * Download Word report directly (for preview/download button)
 */
export const generateReportWord = async (data: ReportData): Promise<void> => {
  const blob = await generateReportWordBlob(data);
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "غير_محدد";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("ar-EG", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };
  const fileName = `تقرير_${data.refNumber}_${formatDate(data.date)}.docx`;
  saveAs(blob, fileName);
};
