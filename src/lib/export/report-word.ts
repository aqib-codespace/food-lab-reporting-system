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
  // Helper function to format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            text: "FOOD LAB REPORT",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "FOOD LAB REPORT",
                bold: true,
                size: 32,
                color: "3B82F6",
              }),
            ],
          }),

          // Report Number
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Report Number: ${data.reportNumber}`,
                size: 24,
              }),
            ],
          }),

          // Reference Information Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Reference: ",
                            bold: true,
                          }),
                          new TextRun(data.refNumber || "------"),
                        ],
                      }),
                    ],
                    shading: { fill: "F3F4F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Employee: ",
                            bold: true,
                          }),
                          new TextRun(data.employee?.name || "N/A"),
                        ],
                      }),
                    ],
                    shading: { fill: "F3F4F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Date: ",
                            bold: true,
                          }),
                          new TextRun(formatDate(data.date)),
                        ],
                      }),
                    ],
                    shading: { fill: "F3F4F6" },
                  }),
                ],
              }),
            ],
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),

          // Spacing
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Section 1: Introduction
          new Paragraph({
            text: "1. INTRODUCTION",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "1. INTRODUCTION",
                bold: true,
                size: 24,
                color: "3B82F6",
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Production Date: ", bold: true }),
              new TextRun(formatDate(data.producedDate)),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Expiry Date: ", bold: true }),
              new TextRun(formatDate(data.expiredDate)),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Barcode: ", bold: true }),
              new TextRun(data.barcodeNumber || "N/A"),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "All samples were received in good condition and properly stored according to laboratory standards.",
            spacing: { after: 400 },
          }),

          // Section 2: External Container Details
          new Paragraph({
            text: "2. EXTERNAL CONTAINER DETAILS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "2. EXTERNAL CONTAINER DETAILS",
                bold: true,
                size: 24,
                color: "3B82F6",
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Received: ", bold: true }),
              new TextRun(
                data.externalContainers
                  .filter((c) => c.type && c.quantity)
                  .map((c) => `(${c.quantity}) ${c.type}`)
                  .join(", ") || "N/A"
              ),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "From: ", bold: true }),
              new TextRun(data.senderShop || "N/A"),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Received by: ", bold: true }),
              new TextRun(
                `${data.employee?.name || "N/A"} on ${formatDate(data.date)}`
              ),
            ],
            spacing: { after: 400 },
          }),

          // Section 3: Internal Container Details
          new Paragraph({
            text: "3. INTERNAL CONTAINER DETAILS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "3. INTERNAL CONTAINER DETAILS",
                bold: true,
                size: 24,
                color: "3B82F6",
              }),
            ],
          }),

          ...data.internalContainers
            .filter((c) => c.type)
            .map(
              (container) =>
                new Paragraph({
                  text: `• ${container.quantity} × ${container.type}`,
                  spacing: { after: 100 },
                  bullet: { level: 0 },
                })
            ),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Section 4: Storage Information
          new Paragraph({
            text: "4. STORAGE INFORMATION",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "4. STORAGE INFORMATION",
                bold: true,
                size: 24,
                color: "3B82F6",
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Storage Location: ", bold: true }),
              new TextRun(
                [...new Set(data.samples.map((s) => s.storageLocation))]
                  .join(" and ")
                  .toUpperCase()
              ),
            ],
            spacing: { after: 400 },
          }),

          // Section 5: Sample Analysis
          new Paragraph({
            text: "5. SAMPLE ANALYSIS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "5. SAMPLE ANALYSIS",
                bold: true,
                size: 24,
                color: "3B82F6",
              }),
            ],
          }),

          // Samples Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Sample #",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Type",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Container",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Net Weight",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "P/T",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Used",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: "Storage",
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: "3B82F6" },
                  }),
                ],
              }),
              // Data Rows
              ...data.samples.map(
                (sample, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: sample.sampleNumber,
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: sample.sampleName,
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: `${sample.internalContainerCount} × ${sample.internalContainerType}`,
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: `${sample.netWeight} ${
                              sample.weightUnit === "kg" ? "kg" : "g"
                            }`,
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: sample.pureOrTotal.toUpperCase(),
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: `${sample.weightUsed} g`,
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: sample.storageLocation.toUpperCase(),
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: {
                          fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
                        },
                      }),
                    ],
                  })
              ),
            ],
            margins: {
              top: 50,
              bottom: 50,
              left: 50,
              right: 50,
            },
          }),

          // Spacing
          new Paragraph({ text: "", spacing: { after: 600 } }),

          // Signature Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Authorized Signature:",
                bold: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: "_________________________________",
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.employee?.name || "Employee Name",
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: data.employee?.role || "Position",
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: `Date: ${formatDate(data.date)}`,
          }),

          // Footer
          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            text: `Generated: ${new Date().toLocaleString()}`,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Generated: ${new Date().toLocaleString()}`,
                size: 18,
                color: "6B7280",
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
