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
  HeadingLevel,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "@/types/report";

export const generateReportWord = async (data: ReportData): Promise<void> => {
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
          // Company Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "FOOD LABORATORY ANALYSIS CENTER",
                bold: true,
                size: 28,
                allCaps: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "Quality Assurance & Sample Testing Division",
                size: 20,
                italics: true,
              }),
            ],
          }),

          // Horizontal separator
          new Paragraph({
            border: {
              bottom: {
                color: "000000",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 8,
              },
            },
            spacing: { after: 250 },
          }),

          // Header with Ref and Date
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `Ref. n: ${data.refNumber || "------"}`,
                size: 22,
              }),
              new TextRun({
                text: `\t\t\t\t\t\t\tdate: ${formatDate(data.date)}`,
                size: 22,
              }),
            ],
          }),

          // Report Number - Centered and Bold
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 350 },
            children: [
              new TextRun({
                text: `Report number: ${data.reportNumber}`,
                bold: true,
                size: 24,
              }),
            ],
          }),

          // Introduction Section
          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: "Introduction:",
                bold: true,
                size: 22,
                underline: {},
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "Produced on date: ",
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: formatDate(data.producedDate),
                size: 21,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "Expired on: ",
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: formatDate(data.expiredDate),
                size: 21,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 300 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "We received everything, it was in a good condition.",
                size: 21,
              }),
            ],
          }),

          // How it looks outside
          new Paragraph({
            spacing: { before: 150, after: 150 },
            children: [
              new TextRun({
                text: "How it looks out side:",
                bold: true,
                size: 22,
                underline: {},
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "We received ",
                size: 21,
              }),
              new TextRun({
                text: data.externalContainers
                  .filter((c) => c.type && c.quantity)
                  .map((c) => `(${c.quantity}) ${c.type}`)
                  .join(" + "),
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: data.barcodeNumber ? `, it has (` : ".",
                size: 21,
              }),
              ...(data.barcodeNumber
                ? [
                    new TextRun({
                      text: "barcode ",
                      bold: true,
                      size: 21,
                    }),
                    new TextRun({
                      text: `number: ${data.barcodeNumber}).`,
                      size: 21,
                    }),
                  ]
                : []),
            ],
          }),

          ...(data.senderShop
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  indent: { left: 400 },
                  children: [
                    new TextRun({
                      text: "From: ",
                      bold: true,
                      size: 21,
                    }),
                    new TextRun({
                      text: data.senderShop,
                      size: 21,
                    }),
                  ],
                }),
              ]
            : []),

          new Paragraph({
            spacing: { after: 300 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "Received by ",
                size: 21,
              }),
              new TextRun({
                text: data.employee?.name || "employee name",
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: `, on ${formatDate(data.date)}.`,
                size: 21,
              }),
            ],
          }),

          // Storage Information
          new Paragraph({
            spacing: { before: 150, after: 150 },
            children: [
              new TextRun({
                text: "Insure its in good storage:",
                bold: true,
                size: 22,
                underline: {},
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 300 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "We put the samples in ",
                size: 21,
              }),
              new TextRun({
                text: [
                  ...new Set(data.samples.map((s) => s.storageLocation)),
                ].join(" or "),
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: ".",
                size: 21,
              }),
            ],
          }),

          // What was inside
          new Paragraph({
            spacing: { before: 150, after: 150 },
            children: [
              new TextRun({
                text: "What was inside:",
                bold: true,
                size: 22,
                underline: {},
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 250 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: "We open samples it contain ",
                size: 21,
              }),
              new TextRun({
                text: data.internalContainers
                  .filter((c) => c.type)
                  .map((c) => `${c.type}`)
                  .join(" and "),
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: ".",
                size: 21,
              }),
            ],
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
                height: { value: 600, rule: "atLeast" },
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Outer container",
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E0F2FE" },
                    verticalAlign: "center",
                    width: { size: 12, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Sample number",
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E0F2FE" },
                    verticalAlign: "center",
                    width: { size: 13, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "How sample looks like",
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E0F2FE" },
                    verticalAlign: "center",
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "How it weight",
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E0F2FE" },
                    verticalAlign: "center",
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "used",
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E0F2FE" },
                    verticalAlign: "center",
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Storage",
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: "E0F2FE" },
                    verticalAlign: "center",
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Data Rows
              ...data.samples.map((sample) => {
                // Group samples by outer container logic
                const outerContainer = `(${sample.internalContainerCount})`;

                return new TableRow({
                  height: { value: 500, rule: "atLeast" },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: outerContainer,
                              size: 19,
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
                              text: sample.sampleNumber,
                              size: 19,
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
                              text: `${sample.sampleName} in ${sample.internalContainerType}`,
                              size: 19,
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
                              text: `${sample.netWeight} ${
                                sample.weightUnit === "kg" ? "kg" : "gram"
                              } (${
                                sample.pureOrTotal === "pure"
                                  ? "Net weight"
                                  : "total weight"
                              })`,
                              size: 19,
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
                              text: `${sample.weightUsed} gram`,
                              size: 19,
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
                              text: sample.storageLocation,
                              size: 19,
                            }),
                          ],
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
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Horizontal separator
          new Paragraph({
            border: {
              top: {
                color: "CCCCCC",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 4,
              },
            },
            spacing: { after: 300 },
          }),

          // Signature Section
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: "Signature:",
                bold: true,
                size: 22,
                underline: {},
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 150 } }),
          new Paragraph({ text: "", spacing: { after: 150 } }),

          new Paragraph({
            text: "________________________________",
            spacing: { after: 80 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Name: ",
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: data.employee?.name || "Employee Name",
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Position: ",
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: data.employee?.role || "Position",
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Date: ",
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: formatDate(data.date),
                size: 20,
              }),
            ],
            spacing: { after: 300 },
          }),

          // Footer separator
          new Paragraph({
            border: {
              top: {
                color: "CCCCCC",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 4,
              },
            },
            spacing: { after: 150 },
          }),

          // Footer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Document generated: ${new Date().toLocaleDateString(
                  "en-GB"
                )} at ${new Date().toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} | Food Lab Quality Assurance System`,
                size: 17,
                color: "666666",
                italics: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50 },
            children: [
              new TextRun({
                text: "This is an official laboratory document - Handle with care",
                size: 16,
                color: "999999",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Generate and save the document
  const blob = await Packer.toBlob(doc);
  const fileName = `Report_${data.refNumber}_${formatDate(data.date).replace(
    /\//g,
    "-"
  )}.docx`;
  saveAs(blob, fileName);
};
