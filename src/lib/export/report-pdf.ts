import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportData } from "@/types/report";

/**
 * Generate PDF report as black and white only (no colors)
 * Returns a Blob for uploading to Supabase
 * PDF should NOT include: barcode number, system case number (Word only)
 */
export const generateReportPDFBlob = async (
  data: ReportData
): Promise<Blob> => {
  const doc = new jsPDF();

  const blackColor: [number, number, number] = [0, 0, 0];
  const grayColor: [number, number, number] = [128, 128, 128]; // Gray for contrast

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

  // Header - Black and white only
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LABORATORY REPORT", 105, 12, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Number: ${data.reportNumber || "In System"}`, 105, 18, {
    align: "center",
  });

  // Reference header info
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 30, 190, 10, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Ref. n: ${data.refNumber || "------"}`, 15, 36);
  doc.text(`Employee: ${data.employee?.name || "N/A"}`, 75, 36);
  doc.text(`Date: ${formatDate(data.date)}`, 155, 36);

  let yPos = 50;

  // Introduction Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Introduction:", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Produced on date: ${formatDate(data.producedDate)}`, 15, yPos);
  yPos += 5;
  doc.text(`Expired on: ${formatDate(data.expiredDate)}`, 15, yPos);
  yPos += 5;
  doc.text("We received everything it was in a good conditions.", 15, yPos);
  yPos += 10;

  // External containers section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("How it looks out side:", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const externalSummary = (data.externalContainers || [])
    .filter((c) => c.type && c.quantity)
    .map((c) => `(${c.quantity}) ${c.type}`)
    .join(" + ");

  doc.text(`We received ${externalSummary || "containers"}`, 15, yPos);
  yPos += 5;

  if (data.senderShop) {
    doc.text(
      `like the one used for ${(data.senderShop || "").toLowerCase()}.`,
      15,
      yPos
    );
    yPos += 5;
  }

  doc.text(
    `Received by ${
      data.employee?.name || "employee name"
    }, on date ${formatDate(data.date)}.`,
    15,
    yPos
  );
  yPos += 10;

  // Storage section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Insure its in good storage:", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const storageText = [
    ...new Set((data.samples || []).map((s) => s.storageLocation || "storage")),
  ].join(" or ");
  doc.text(`We put the samples in store or ${storageText}.`, 15, yPos);
  yPos += 10;

  // Internal containers section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("What was inside:", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("We open samples it contain food and drinks.", 15, yPos);
  yPos += 10;

  // Samples table - Black and white theme
  const tableData = (data.samples || []).map((sample) => [
    sample.sampleNumber || "",
    sample.sampleNumber || "",
    `${sample.sampleName || "Food"} in ${
      sample.internalContainerType || "container"
    }`,
    `${sample.netWeight || 0} ${
      sample.weightUnit === "kg" ? "gram" : "gram"
    } (${
      (sample.pureOrTotal || "pure") === "pure" ? "Net weight" : "total weight"
    })`,
    `${sample.weightUsed || 0} gram`,
    "",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [
      [
        "Outer container",
        "Sample number",
        "How sample looks like",
        "How it weight",
        "used",
        "",
      ],
    ],
    body: tableData,
    theme: "plain",
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
      halign: "center",
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    margin: { left: 15, right: 15 },
    styles: {
      cellPadding: 3,
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // Signature section
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Signature:", 15, finalY);

  if (data.employee?.signature) {
    try {
      doc.addImage(
        data.employee.signature,
        "PNG",
        15,
        finalY + 3,
        40,
        15,
        undefined,
        "NONE"
      );
    } catch (error) {
      console.error("Error adding signature:", error);
      doc.line(15, finalY + 20, 65, finalY + 20);
    }
  } else {
    doc.line(15, finalY + 20, 65, finalY + 20);
  }

  // Return blob for upload
  return doc.output("blob");
};

/**
 * Download PDF report directly (for preview/download button)
 */
export const generateReportPDF = async (data: ReportData): Promise<void> => {
  const blob = await generateReportPDFBlob(data);
  const fileName = `Report_${data.refNumber}_${formatDate(data.date).replace(
    /\//g,
    "-"
  )}.pdf`;

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
}
