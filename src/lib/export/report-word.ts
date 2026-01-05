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
} from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "@/types/report";

/**
 * Generate Word report with full details including barcode and system numbers
 * Returns a Blob for uploading to Supabase
 * Word includes: barcode number, system case number, more detailed info
 */
export const generateReportWordBlob = async (
  data: ReportData
): Promise<Blob> => {
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
            },
          },
        },
        children: [
          // Header with ref and date
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Ref. n: ${data.refNumber || "SSSSS"}`,
                size: 20,
              }),
              new TextRun({
                text: `\t\t\t\t\t\t\t${data.employee?.name || "employee name"}`,
                size: 20,
              }),
              new TextRun({
                text: `\t\t\t\tdate: ${formatDate(data.date)}`,
                size: 20,
              }),
            ],
          }),

          // Report number (system)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Report number: ${data.reportNumber || "in system"}`,
                bold: true,
                size: 22,
              }),
            ],
          }),

          // Introduction
          new Paragraph({
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: "Introduction:",
                bold: true,
                size: 21,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 70 },
            children: [
              new TextRun({
                text: `Produced on date: ${formatDate(data.producedDate)}`,
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 70 },
            children: [
              new TextRun({
                text: `Expired on: ${formatDate(data.expiredDate)}`,
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: "We received everything it was in a good conditions.",
                size: 20,
              }),
            ],
          }),

          // External containers
          new Paragraph({
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: "How it looks out side:",
                bold: true,
                size: 21,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 70 },
            children: [
              new TextRun({
                text: "We received ",
                size: 20,
              }),
              new TextRun({
                text: (data.externalContainers || [])
                  .filter((c) => c.type && c.quantity)
                  .map((c) => `(${c.quantity}) ${c.type}`)
                  .join(" "),
                size: 20,
              }),
              new TextRun({
                text: data.senderShop
                  ? ` like the one used for ${(
                      data.senderShop || ""
                    ).toLowerCase()}, it has (${
                      data.barcodeNumber || "barcode number"
                    }).`
                  : ` it has (${data.barcodeNumber || "barcode number"}).`,
                size: 20,
              }),
            ],
          }),

          // Barcode information (Word only - not in PDF)
          ...(data.barcodeNumber
            ? [
                new Paragraph({
                  spacing: { after: 70 },
                  children: [
                    new TextRun({
                      text: "it has (",
                      size: 20,
                    }),
                    new TextRun({
                      text: "barcode number",
                      bold: true,
                      size: 20,
                    }),
                    new TextRun({
                      text: ").",
                      size: 20,
                    }),
                  ],
                }),
              ]
            : []),

          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: `Received by ${
                  data.employee?.name || "employee name"
                }, on date ${formatDate(data.date)}.`,
                size: 20,
              }),
            ],
          }),

          // Storage
          new Paragraph({
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: "Insure its in good storage:",
                bold: true,
                size: 21,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: "We put the samples in store or ",
                size: 20,
              }),
              new TextRun({
                text: [
                  ...new Set(
                    (data.samples || []).map(
                      (s) => s.storageLocation || "storage"
                    )
                  ),
                ].join(" or "),
                size: 20,
              }),
              new TextRun({
                text: ".",
                size: 20,
              }),
            ],
          }),

          // Internal containers
          new Paragraph({
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: "What was inside:",
                bold: true,
                size: 21,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "We open samples it contain food and drinks.",
                size: 20,
              }),
            ],
          }),

          // List internal containers if available
          ...((data.internalContainers || [])
            .filter((c) => c.type && c.quantity)
            .map((container) => 
              new Paragraph({
                spacing: { after: 50 },
                children: [
                  new TextRun({
                    text: `- ${container.quantity}x ${container.type}`,
                    size: 20,
                  }),
                ],
              })
            )),

          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: "", size: 10 })],
          }),

          // Samples Table
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
              // Header Row
              new TableRow({
                tableHeader: true,
                height: { value: 550, rule: "atLeast" },
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Outer container",
                            bold: true,
                            size: 18,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "D1D5DB" },
                    verticalAlign: "center",
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Sample number",
                            bold: true,
                            size: 18,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "D1D5DB" },
                    verticalAlign: "center",
                    width: { size: 12, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "How sample looks like",
                            bold: true,
                            size: 18,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "D1D5DB" },
                    verticalAlign: "center",
                    width: { size: 28, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "How it weight",
                            bold: true,
                            size: 18,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "D1D5DB" },
                    verticalAlign: "center",
                    width: { size: 23, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "used",
                            bold: true,
                            size: 19,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E5E7EB" },
                    verticalAlign: "center",
                    width: { size: 12, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "", size: 19 })],
                      }),
                    ],
                    shading: { fill: "E5E7EB" },
                    verticalAlign: "center",
                    width: { size: 13, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Data Rows
              ...(data.samples || []).map((sample, idx) => {
                // Format internal containers - show counts clearly
                const containerCounts = (sample.internalContainers || [])
                  .filter((c) => c.type && c.quantity)
                  .map((c) => `(${c.quantity})`)
                  .join(" + ") || "(1)";
                
                const containerDetails = (sample.internalContainers || [])
                  .filter((c) => c.type && c.quantity)
                  .map((c) => `${c.quantity}x ${c.type}`)
                  .join(" + ") || "container";

                return new TableRow({
                  height: { value: 450, rule: "atLeast" },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: containerCounts,
                              size: 18,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: sample.sampleNumber || "",
                              size: 18,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: `${sample.sampleName || "Food"} in ${containerDetails}`,
                              size: 18,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: `${sample.netWeight || 0} ${
                                sample.weightUnit === "kg" ? "gram" : "gram"
                              } (${
                                (sample.pureOrTotal || "pure") === "pure"
                                  ? "Net weight"
                                  : "total weight"
                              })`,
                              size: 18,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: `${sample.weightUsed || 0} gram`,
                              size: 18,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: "center",
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: "", size: 18 })],
                        }),
                      ],
                      verticalAlign: "center",
                    }),
                  ],
                });
              }),
            ],
          }),

          // Spacing before signature
          new Paragraph({ text: "", spacing: { after: 350 } }),

          // Signature section
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "Signature:",
                bold: true,
                size: 21,
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 40 } }),

          // Signature line (placeholder if no signature)
          ...(data.employee?.signature ? [] : [
            new Paragraph({
              spacing: { after: 150 },
              children: [
                new TextRun({
                  text: "_____________________",
                  size: 18,
                }),
              ],
            }),
          ]),

          // Employee name
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: `Name: ${data.employee?.name || "N/A"}`,
                size: 20,
              }),
            ],
          }),

          // Employee position
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: `Position: ${data.employee?.roles?.name || "analyst"}`,
                size: 20,
              }),
            ],
          }),

          // Date
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: `Date: ${formatDate(data.date)}`,
                size: 20,
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 80 } }),
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
  const fileName = `Report_${data.refNumber}_${formatDate(data.date).replace(
    /\//g,
    "-"
  )}.docx`;
  saveAs(blob, fileName);
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
