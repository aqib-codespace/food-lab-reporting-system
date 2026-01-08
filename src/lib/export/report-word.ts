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
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "@/types/report";

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const createBorder = () => ({
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
});

export const generateReportWordBlob = async (
  data: ReportData
): Promise<Blob> => {
  // Load examiner signature
  let examinerSignature: ArrayBuffer | null = null;
  if (data.employee?.signature) {
    try {
      const response = await fetch(data.employee.signature);
      examinerSignature = await response.arrayBuffer();
    } catch (error) {
      console.error("Error loading examiner signature:", error);
    }
  }

  const children: any[] = [];

  // ===== HEADER: Date (right) | Report Number (center) | Reference (left) =====
  children.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `التاريخ: ${formatDate(data.date)}`,
          size: 22,
          rightToLeft: true,
        }),
        new TextRun({ text: "\t\t" }),
        new TextRun({
          text: `In System`,
          size: 24,
          bold: true,
        }),
        new TextRun({ text: "\t\t" }),
        new TextRun({
          text: `${data.refNumber || ""} :الشرح رقم`,
          size: 22,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Horizontal line separator
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
      },
      spacing: { after: 150 },
    })
  );

  // Reference numbers line (bag, dispatch, barcode)
  let refLine = "";
  if (data.bagNumber) refLine += `رقم الحقيبة :${data.bagNumber}  `;
  if (data.dispatchNumber) refLine += ` رقم الإرسال: ${data.dispatchNumber}  `;
  if (data.barcodeNumber) refLine += ` رقم الباركود: ${data.barcodeNumber}`;

  if (refLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: refLine.trim(),
            size: 20,
            rightToLeft: true,
          }),
        ],
      })
    );
  }

  // ===== SUBJECT =====
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "بالموضوع:",
          bold: true,
          size: 24,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Introduction paragraph with dates
  let introText = `بتاريخ ${formatDate(
    data.dateReceivedByDepartment || data.date
  )} وردت إلينا عدد (${
    data.externalContainers?.filter((c) => c.type).length || 1
  }) طرد`;
  if (data.systemRegistrationDate) {
    introText += ` تم تسجيله في النظام بتاريخ ${formatDate(
      data.systemRegistrationDate
    )}`;
  }
  if (data.consumerNotes) {
    introText += `. ملاحظات: ${data.consumerNotes}`;
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: introText,
          size: 20,
          rightToLeft: true,
        }),
      ],
    })
  );

  // ===== DESCRIPTION AND EXAMINATION =====
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, after: 80 },
      children: [
        new TextRun({
          text: "وصف وفحص الطرودين:",
          bold: true,
          underline: {},
          size: 22,
          rightToLeft: true,
        }),
      ],
    })
  );

  // External containers description
  const externalList =
    (data.externalContainers || [])
      .filter((c) => c.type && c.quantity)
      .map((c, idx) => `(${idx + 1}) ${c.type} عدد ${c.quantity}`)
      .join(" ") || "حاوية عدد 1";

  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `عبارة عن ${externalList}${
            data.senderShop ? ` (من ${data.senderShop})` : ""
          }`,
          size: 20,
          rightToLeft: true,
        }),
      ],
    })
  );

  // ===== DETAILED EXAMINATION =====
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, after: 80 },
      children: [
        new TextRun({
          text: "التفصيل الفحص:",
          bold: true,
          underline: {},
          size: 22,
          rightToLeft: true,
        }),
      ],
    })
  );

  // First: External examination
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "أولا: الفحص الظاهري:",
          bold: true,
          size: 20,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Internal containers
  const internalList =
    (data.internalContainers || [])
      .filter((c) => c.type && c.quantity)
      .map((c) => `${c.type} ${c.quantity > 1 ? "عدد " + c.quantity : ""}`)
      .join(" و ") || "أكياس";

  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `تم وضع العينات ${internalList}`,
          size: 20,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Storage location info
  const storageList = [
    ...new Set(
      (data.samples || []).map((s) => s.storageLocation).filter(Boolean)
    ),
  ];
  const storageText =
    storageList.length > 0 ? storageList.join(" و ") : "الثلاجة";

  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: `تم وضع العينات في ${storageText}`,
          size: 20,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Second: Detailed examination result
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: "نتيجة الفحص التفصيلي:",
          bold: true,
          size: 20,
          rightToLeft: true,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `تم فحص العينات بواسطة ${
            data.employee?.name || "الفاحص"
          } وفيما يلي نموذج محضر الفحص:`,
          size: 18,
          rightToLeft: true,
        }),
      ],
    })
  );

  // ===== RESULTS TABLE =====
  const tableRows: TableRow[] = [];

  // Table header
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "رقم العينة",
                  bold: true,
                  size: 16,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "نوع العينة",
                  bold: true,
                  size: 16,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "الطبيعة",
                  bold: true,
                  size: 16,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "شكل المستخدم",
                  bold: true,
                  size: 16,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "الوزن",
                  bold: true,
                  size: 16,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "ملاحظات",
                  bold: true,
                  size: 16,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  );

  // Sample rows
  (data.samples || []).forEach((sample, index) => {
    const sampleNum = sample.sampleNumber || `S${index + 1}`;
    const sampleType = sample.sampleName || "-";

    const weightDisplay = sample.isSwabOnly
      ? "مسحة فقط"
      : `${sample.netWeight || 0} ${
          sample.weightUnit === "kg" ? "كجم" : "جرام"
        }`;

    const nature = sample.isSwabOnly
      ? "-"
      : sample.pureOrTotal === "pure"
      ? "صافي"
      : "إجمالي";

    const containers =
      (sample.internalContainers || [])
        .map((c) => `${c.type}${c.quantity > 1 ? " " + c.quantity : ""}`)
        .join(" و ") || "حاوية";

    const weightUsed = sample.isSwabOnly
      ? "-"
      : `${sample.weightUsed || 0} جرام`;
    const notes = sample.weightNotes || "-";

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `(${index + 1})`,
                    size: 14,
                    rightToLeft: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: sampleNum, size: 14, rightToLeft: true }),
                ],
              }),
            ],
            borders: createBorder(),
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: sampleType,
                    size: 14,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            borders: createBorder(),
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${weightDisplay}\n${nature}`,
                    size: 14,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            borders: createBorder(),
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: containers,
                    size: 14,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            borders: createBorder(),
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: weightUsed,
                    size: 14,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            borders: createBorder(),
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: notes, size: 14, rightToLeft: true }),
                ],
              }),
            ],
            borders: createBorder(),
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      })
    );
  });

  children.push(
    new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    })
  );

  // Table note
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, after: 150 },
      children: [
        new TextRun({
          text: "ملاحظة: ما تم وزنه وفحصه بعد التحليل في هذا الجدول قد يختلف اختلافاً طفيفاً عما تم استلامه.",
          size: 14,
          italics: true,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Conclusion
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 150 },
      children: [
        new TextRun({
          text: "هذا ما توصلنا إليه حسب ما يمكن علمياً من خلال الفحص والتحليل.",
          size: 18,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Unexamined items
  if (data.unexaminedItems) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 150, after: 80 },
        children: [
          new TextRun({
            text: "العناصر غير المفحوصة:",
            bold: true,
            size: 20,
            rightToLeft: true,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: data.unexaminedItems,
            size: 18,
            rightToLeft: true,
          }),
        ],
      })
    );
  }

  // ===== PAGE 2: SIGNATURES =====
  children.push(
    new Paragraph({
      pageBreakBefore: true,
    })
  );

  // ===== SIGNATURE TABLE =====
  const signatureRows: TableRow[] = [];

  // Header row
  signatureRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({
                  text: "التقدم بالفحص",
                  bold: true,
                  size: 24,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({
                  text: "التقدم بالعرض",
                  bold: true,
                  size: 24,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  );

  // Names and titles
  const examinerRole = data.employee?.roles?.name || "خبير";
  const examinerName = data.employee?.name || "";

  signatureRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${examinerRole}: - استشار و فاحص المختبر الموقع المعتمد`,
                  size: 18,
                  rightToLeft: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${examinerName}`,
                  size: 18,
                  bold: true,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `خبير مساعد الفاحص الموقع المعتمد`,
                  size: 18,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
        }),
      ],
    })
  );

  // Signature images row
  const signatureContent: any[] = [];
  if (examinerSignature) {
    signatureContent.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 120 },
        children: [
          new ImageRun({
            data: examinerSignature!,
            transformation: {
              width: 180,
              height: 70,
            },
            type: "png",
          }),
        ],
      })
    );
  } else {
    signatureContent.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "________________________",
            size: 20,
          }),
        ],
      })
    );
  }

  signatureRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: signatureContent,
          borders: createBorder(),
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 120 },
              children: [
                new TextRun({
                  text: "________________________",
                  size: 20,
                }),
              ],
            }),
          ],
          borders: createBorder(),
        }),
      ],
    })
  );

  // Reference and date row
  signatureRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `رقم الفحص: ${
                    data.refNumber || data.reportNumber || ""
                  }`,
                  size: 18,
                  rightToLeft: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `التاريخ: ${formatDate(data.date)}`,
                  size: 18,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `التاريخ: ${formatDate(data.date)}`,
                  size: 18,
                  rightToLeft: true,
                }),
              ],
            }),
          ],
          borders: createBorder(),
        }),
      ],
    })
  );

  children.push(
    new Table({
      rows: signatureRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    })
  );

  // Footer contact information
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
      children: [
        new TextRun({
          text: "مركز الفحص المركزي للأغذية",
          size: 16,
          rightToLeft: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `صفحة 2 من 2`,
          size: 14,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Create document
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
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const generateReportWord = async (data: ReportData): Promise<void> => {
  const blob = await generateReportWordBlob(data);
  const fileName = `تقرير_${data.refNumber || "report"}_${formatDate(
    data.date
  ).replace(/\//g, "-")}.docx`;
  saveAs(blob, fileName);
};
